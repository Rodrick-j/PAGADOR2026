import { Response } from "express";
import { WEB_CLIENT_URL } from "../config/app-config";
import puppeteer from "puppeteer";
import ejs from "ejs";
import moment from "moment";
import QRCode from "qrcode";
import { minify } from "html-minifier-terser";

export class DocumentoActaReport {
    static async creaPDF(data: any, template: string, res: Response): Promise<any> {
        try {
            // Generar el código QR
            //const qrCodeDataUrl = await QRCode.toDataURL(data.info?.codigo || 'QR', { margin: 0.5 });
            const qrCodeSvg = await QRCode.toString(data.info?.codigo || "QR", {
                type: "svg",
                margin: 0,
                errorCorrectionLevel: "L",
                // version: 4, // opcional: fija versión si quieres tamaño pequeño
            });

            const templateData = {
                ...data,
                qrCodeSvg,
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
            //const htmlBuffer = Buffer.from(html);
            const htmlMin = await minify(html, {
                collapseWhitespace: true,
                removeComments: true,
                minifyCSS: true,
                minifyJS: true,
                removeAttributeQuotes: false, // seguro para HTML con EJS
            });
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
				executablePath: '/usr/bin/chromium-browser',
				headless: 'new',
				args: ['--no-sandbox', '--disable-setuid-sandbox','--disable-dev-shm-usage'],
			});

            //Para run en desarrollo y deshabilitar puppeteerrc
           /*  const browser = await puppeteer.launch({
                headless: "new",
                args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-web-security"],
            }); */

            const timeoutMs = 120000;
            const page = await browser.newPage();

            // timeouts ANTES de navegar
            page.setDefaultNavigationTimeout(timeoutMs);
            page.setDefaultTimeout(timeoutMs);

            await page.setViewport({ width: 1920, height: 1080 });

            // usa networkidle2 y evita timeout: 0
            await page.setContent(htmlMin, { waitUntil: "networkidle2", timeout: timeoutMs });

            await page.waitForFunction(() => document.readyState === "complete", { timeout: timeoutMs });
            page.on("pageerror", (e) => console.error("[pageerror]", e));
            page.on("console", (msg) => console.log("[console]", msg.type(), msg.text()));

            const pdfBuffer = await page.pdf({
                format: "letter",
                timeout: timeoutMs,
                printBackground: true,
                landscape: false,
                margin: { top: "0cm", right: "0cm", bottom: "0cm", left: "0cm" },
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
