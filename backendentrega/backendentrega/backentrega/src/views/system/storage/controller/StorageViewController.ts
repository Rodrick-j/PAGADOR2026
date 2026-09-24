import { BaseHttpController } from "../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import Busboy, { FileInfo } from "busboy";
import mime from "mime-types";

import {
  deleteFile,
  downloadFileToStream,
  existsFile,
  STORAGE_PUBLIC_URL,
  uploadFileFromStream,
} from "../../../../tools/storage";

export class StorageViewController extends BaseHttpController {
  public async uploadFile(req: any, res: Response): Promise<any> {
    const busboy = Busboy({ headers: req.headers });
    const fileWrites: Promise<unknown>[] = [];
    let uploadedName = "";

    busboy.on(
      "file",
      (
        fieldname: string,
        file: NodeJS.ReadableStream,
        info: FileInfo,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        encoding: string,
        mimetype: string,
      ) => {
        const name: string = `${info?.filename || fieldname || ""}`.trim();
        uploadedName = name;
        const promise: Promise<boolean> = uploadFileFromStream(file, name, mimetype);
        fileWrites.push(promise);
      },
    );

    busboy.on("finish", async () => {
      try {
        await Promise.all(fileWrites);
        return res.status(200).json({
          msg: "file uploaded successfully",
          name: uploadedName,
          file: uploadedName ? `${STORAGE_PUBLIC_URL}/${encodeURIComponent(uploadedName)}` : undefined,
        });
      } catch (err: any) {
        console.log("[storage.uploadFile] ERROR:", err);
        return res.status(500).json({ err: "Upload failed", details: err?.message || err });
      }
    });

    req.pipe(busboy);
  }

  public async registerFile(req: Request, res: Response): Promise<any> {
    const fileName: string = `${req.body.fileName || ""}`.trim();
    const urlFromClient: string | undefined = req.body.url;
    const pathOnBucket: string | undefined = req.body.path;

    if (!fileName) {
      return res.status(400).json({ err: "fileName es requerido" });
    }

    try {
      const exists: boolean = await existsFile(fileName);
      if (!exists) {
        return res.status(404).json({ err: "File not found", name: fileName });
      }

      const fileUrl = `${STORAGE_PUBLIC_URL}/${encodeURIComponent(fileName)}`;

      return res.status(200).json({
        msg: "file registered successfully!!!",
        file: urlFromClient || fileUrl,
        name: fileName,
        path: pathOnBucket ?? fileName,
      });
    } catch (err: any) {
      console.log("[storage.registerFile] ERROR:", err);
      return res.status(500).json({ err: err?.message || err });
    }
  }

  public async deleteFile(req: Request, res: Response): Promise<any> {
    const fileName: string = `${req.body.fileName || ""}`.trim();

    if (!fileName) {
      return res.status(400).json({ err: "fileName es requerido" });
    }

    const filePath = `${STORAGE_PUBLIC_URL}/${encodeURIComponent(fileName)}`;

    try {
      const wasDeleted: boolean = await deleteFile(fileName);

      if (!wasDeleted) {
        return res.status(404).json({
          msg: "El archivo no existe o ya fue eliminado.",
          file: filePath,
          name: fileName,
        });
      }

      return res.status(200).json({
        msg: "Archivo eliminado correctamente.",
        file: filePath,
        name: fileName,
      });
    } catch (err: any) {
      console.error("[storage.deleteFile] ERROR:", err);
      return res.status(500).json({
        err: "Error interno al eliminar el archivo",
        details: err?.message || err,
      });
    }
  }

  public async getFile(req: Request, res: Response): Promise<any> {
    const filename: string = `${req.params.filename || ""}`.trim();
    if (!filename) {
      return res.status(400).send("filename is required");
    }

    try {
      const exists: boolean = await existsFile(filename);
      if (!exists) {
        return res.status(404).send("File not found");
      }

      const contentType: string = (mime.lookup(filename) || "application/octet-stream").toString();
      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

      await downloadFileToStream(filename, res);
      return;
    } catch (err: any) {
      console.error("[storage.getFile] ERROR:", err);
      if (!res.headersSent) {
        return res.status(500).send("Download failed");
      }
    }
  }
}
