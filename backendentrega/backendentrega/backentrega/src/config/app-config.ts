/* eslint-disable @typescript-eslint/no-unused-vars */
import path from "path";
import { buildDBConfig } from "../base/constants/database";

// Tipo de entorno
process.env.NODE_ENV = process.env.NODE_ENV || "development";

// Zona horaria
process.env.TZ = "America/La_Paz";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || "https://api-ejemplo.local";

export const BUCKET_NAME = '-';

const STORAGE_DRIVER = process.env.STORAGE_DRIVER || "ftp";

export const STORAGE = {
  // driver: 'gcs' | 'ftp'
  driver: STORAGE_DRIVER,

  // GCS (se deja por compat, pero ya no se usa si driver=ftp)
  projectId: 'TU_PROYECTO_ID',
  keyFilename: path.resolve(__dirname, "serviceAccountKey.json"), //estamos usando ftp por tanto no es necesario
  bucketName: BUCKET_NAME,

  // Para FTP, lo público se sirve por este mismo API: /storage/file/:filename
  publicUrl:
    STORAGE_DRIVER === "gcs"
      ? `https://storage.googleapis.com/${BUCKET_NAME}`
      : `${BACKEND_BASE_URL}/storage/file`,

  ftp: {
    host: process.env.FTP_HOST || "FTP_HOST_EJEMPLO",
    port: Number(process.env.FTP_PORT || 21),
    user: process.env.FTP_USER || "FTP_USER_EJEMPLO",
    password: process.env.FTP_PASS || "FTP_PASSWORD_EJEMPLO",
    baseDir: process.env.FTP_BASE_DIR || "/ruta/ejemplo",
  },
};
// Para el envío de e-mails.
// Si se tiene habilitada la autenticación en 2 pasos (recomendado) se tendrá que generar una contraseña de aplicación:
// Cuenta de Google > Seguridad > Contraseñas de aplicaciones > Generar (https://myaccount.google.com/apppasswords)
export const CORREO: any = {
    service: "CORREO",
    auth: {
        user: "USUARIO",
        pass: "PASSWORD",
    },
};

// Para el envío de notificaciones push.
// Datos de la aplicación cliente (Front-end)
export const WEB_CLIENT_URL = process.env.WEB_CLIENT_URL || 'https://DIRECCION';
export const WEB_SERVER_URL = process.env.WEB_SERVER_URL || 'https://API_DE_CONEXION';
export const WEB_CLIENT_ICON = "LINK DE IMAGEN";
export const WEB_CLIENT_ICON_ANDROID = "LINK DE IMAGEN";

export const DATABASE = buildDBConfig({
  
   // CONEXION LOCALHOST BDD
    username: "DB_USER_EJEMPLO",
    password: "DB_PASSWORD_EJEMPLO",
    publicIpAddress: "localhost",
    database: "BASE_DATOS_EJEMPLO",
    port: 3306
});

// Para el servidor
export const SERVER = {
    port: process.env.PORT || 8080,
};

export const PRECIO_UNITARIO_GASOLINA = Number(process.env.GASOLINA || 3.74);  //TABLA ACTUALIZADA A 10-01-2025, MODIFICACION 18/12/2025
export const PRECIO_UNITARIO_DIESEL = Number(process.env.DIESEL || 3.72); //TABLA ACTUALIZADA A 10-01-2025, MODIFICACION 18/12/2025
export const VALE_SALDO_MINIMO = Number(process.env.SALDO || 10); //Valor asignado minimo para el vale de gasolina y diesel , MODIFICACION 18/12/2025

export const URL_FERIADOS = `API_FERIADOS`;
//export const URL_SIGAPO = `http://sig.oruro.gob.bo/v1/sigapo/?primerfun_destino=`;
export const URL_SIGAPO = `URL_SIGAPO`;
export const URL_SIGAPO2 = `URL_SIGAPO2`;

export const ageticConfig = {
     token_url: 'https://auth-ejemplo.local/token',
    me_url: 'https://auth-ejemplo.local/me',
    redirect_uri: 'http://localhost:3000/callback',
    client_id: 'CLIENT_ID_EJEMPLO',
    client_secret: 'CLIENT_SECRET_EJEMPLO',
}