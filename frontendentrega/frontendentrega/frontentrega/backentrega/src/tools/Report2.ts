import { Response } from "express";
import { WEB_CLIENT_URL } from "../config/app-config";
import puppeteer from "puppeteer";
import ejs from "ejs";
import QRCode from "qrcode";
import moment from "moment";

export class Report2 {
    static async creaPDF(data: any, template: string, res: Response): Promise<any> {
        try {
            // Generar el código QR
            const qrCodeDataUrl = await QRCode.toDataURL(data.info?.codigo || "QR", { margin: 0.5 });

            const templateData = {
                ...data,
                qrCodeDataUrl,
                assetsURL: `${WEB_CLIENT_URL}/static/images`,
            };

            const options = {};

            const obj: any = await new Promise((resolve) =>
                ejs.renderFile(`build/templates/${template}Template.ejs`, templateData, options, (err, str) =>
                    resolve({ err, html: str }),
                ),
            );
            const { err, html } = obj;
            if (err) throw err;
            const now = Date.now();
            const filenamePDF = `${now}.pdf`;

            const printDate = moment().format("DD/MM/YYYY HH:mm:ss");

            const headerTemplate = `<div></div>`;
            const footerTemplate = `<table width="100%" cellspacing="0" cellpadding="0" style="padding: 0 20px 0 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; color:#8a8a8a;"><tbody>
			<tr>
				<td width="33.33%" style="padding:4px;font-size:6px;border-top:solid 0px lightgrey;text-align:left;font-weight: 100;">Gobierno Autonomo Departamental de Oruro </br><span>Generado por:&nbsp;&nbsp;${data.info?.email}</span></td>
				<td width="33.33%" style="padding:4px;font-size:6px;border-top:solid 0px lightgrey;text-align:center;"><span class="pageNumber"></span> / <span class="totalPages"></span></td>
				<td width="33.33%" style="padding:4px;font-size:6px;border-top:solid 0px lightgrey;text-align:right;">Impreso el: ${printDate}</td>
			</tr>
			</tbody></table>`;

            //para run en produccion
            const browser = await puppeteer.launch({
                executablePath: "/usr/bin/chromium-browser",
                headless: "new",
                args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
            });
            //Para run en desarrollo y deshabilitar puppeteerrc
					/* const browser = await puppeteer.launch({
				headless: 'new',
				args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
			}); */
            const page = await browser.newPage();
            await page.setViewport({ width: 1920, height: 1080 });
            await page.setContent(html, { waitUntil: "networkidle0", timeout: 0 });

            const pdfBuffer = await page.pdf({
                format: "letter",
                printBackground: true,
                landscape: false,
                margin: { top: "0.5cm", right: "1.5cm", bottom: "0.5cm", left: "1.5cm" },
                scale: 1,
                displayHeaderFooter: true,
                headerTemplate,
                footerTemplate,
            });

            await page.close();
            await browser.close();
            if (browser && browser.process() != null) browser.process()?.kill("SIGINT");

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=${filenamePDF}`);
            return res.send(pdfBuffer);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ err: err.toString() });
        }
    }
}
