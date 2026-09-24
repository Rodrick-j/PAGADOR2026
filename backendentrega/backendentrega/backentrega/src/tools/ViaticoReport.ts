import { Response } from 'express';
import { WEB_CLIENT_URL } from '../config/app-config';
import puppeteer from 'puppeteer';
import ejs from 'ejs';
import QRCode from 'qrcode';
export class ViaticoReport {
  static async creaPDF(data: any, template: string, res: Response): Promise<any> {
    try {
        
      // Generar el código QR
      const qrCodeDataUrl = await QRCode.toDataURL(data.info?.codigoQR || 'QR');    
      const templateData = {
        ...data,
        qrCodeDataUrl,
        assetsURL: `${WEB_CLIENT_URL}/static/images`
      };

      const options = {};
      
      const obj: any = await new Promise((resolve) =>
        ejs.renderFile(`build/templates/${template}Template.ejs`, templateData, options, (err, str) => resolve({ err, html: str })),
      );
      const { err, html } = obj;
      if (err) throw err;
      const now = Date.now();
      const filenamePDF = `${now}.pdf`;
      
      const headerTemplate = `<div></div>`;
      
      //para run en produccion
    const browser = await puppeteer.launch({
         executablePath: '/usr/bin/chromium-browser',
         headless: 'new',
         args: ['--no-sandbox', '--disable-setuid-sandbox','--disable-dev-shm-usage'],
      });
      //Para run en desarrollo y deshabilitar puppeteerrc
     /*      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
      });   */
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setContent(html, { waitUntil: 'networkidle0', timeout: 0 });
      
      const pdfBuffer = await page.pdf({
        printBackground: true,
        landscape: true,
        margin: { top: '0.2cm', right: '0.2cm', bottom: '0.2cm', left: '0.2cm' },
        width: '10cm',
        height: '15cm',
        headerTemplate,
      });

      await page.close();
      await browser.close();
      if (browser && browser.process() != null) browser.process()?.kill('SIGINT');
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${filenamePDF}`);
  
      return res.send(pdfBuffer);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ err: err.toString() });
    }
      
  }
}
