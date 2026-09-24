/**
 * Proyecto: Plataforma PAGADOR
 * Autor técnico del desarrollo e implementación: Ing. Giancarlo Delgadillo Coca
 * Sistema desarrollado para el Gobierno Autónomo Departamental de Oruro.
 *
 * Se deja constancia de la participación, autoría técnica e implementación
 * directa del Ing. Giancarlo Delgadillo Coca en el análisis, diseño, desarrollo, integración,
 * adecuación, mantenimiento y mejora continua del sistema PAGADOR.
 *
 * La presente mención reconoce la autoría técnica del desarrollador sobre
 * este código fuente, sin perjuicio de la titularidad institucional que
 * corresponda conforme a la normativa aplicable y a las condiciones de
 * contratación.
 */
import express, { NextFunction, Request, Response } from "express";
import useragent from "express-useragent";
import compression from 'compression';

import cors from "cors";
import morgan from "morgan";
import { InternalServerError } from "./base/infra/HttpErrors";
import { SERVER } from "./config/app-config";
import Api from "./Api";
import fs from "fs";
import path from "path";

const app = express();

// --- COMPRESIÓN GZIP ---
// Umbral 1 KB, evita comprimir binarios comunes
app.use(compression({
  threshold: 1024, // no comprimir respuestas < 1KB
  filter: (req, res) => {
    // Permite desactivar por header si hiciera falta
    if (req.headers['x-no-compression']) return false;

    const ct = (res.getHeader('Content-Type') || '').toString().toLowerCase();
    // Evitar comprimir binarios (PDF, imágenes, zip, octet)
    if (ct.includes('application/pdf')) return false;
    if (ct.includes('image/')) return false;
    if (ct.includes('application/zip')) return false;
    if (ct.includes('application/octet-stream')) return false;

    return compression.filter(req, res);
  },
}));

const getPackageVersion = (): string => {
  try {
    const filePath = path.resolve(process.cwd(), "package.json");
    const file = fs.readFileSync(filePath, "utf-8");
    const pkg = JSON.parse(file);
    return pkg.version || "desconocida";
  } catch {
    return "desconocida";
  }
};

app.use(express.json());
// cors
app.use(
    cors(/* {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: true,
    allowedHeaders: 'Authorization,Content-Type,Content-Length',
    exposedHeaders: 'Content-Disposition', // Para descargar archivos (habilita el acceso al header que contiene el nombre del fichero)
  } */),
);

/* app.use(
  '/static',
  express.static(STORAGE_PATH, {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setHeaders: (res, filePath) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  })
); */

// requets logs
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev", { skip: (req) => req.method.toLowerCase() === "options" }));
}

// service ok
app.get("/", (req, res) => res.json({ msg: `!! Servicio activo en modo ${process.env.NODE_ENV}`, version: getPackageVersion() }));
app.get("/", (req, res) => res.send("ok"));

// browser info
app.use(useragent.express());

// main routers
app.use("/api", Api.routes);

// error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    return res.status(InternalServerError.CODE).json({ message: err.message || InternalServerError.MESSAGE });
});

// listen
if (!process.env.CREATE_DATABASE) {
    app.listen(SERVER.port, () => {
        console.log(
            `\n\n\x1b[96mServicio activo http://localhost:${SERVER.port} en modo ${process.env.NODE_ENV}\x1b[0m\n\n`,
        );
    });
}
