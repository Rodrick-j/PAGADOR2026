import fileUpload from "express-fileupload";
import { Storage as GCSStorage, type Bucket, type File } from "@google-cloud/storage";
import { Client as FtpClient } from "basic-ftp";
import { Readable } from "stream";
import path from "path";
import { STORAGE } from "../config/app-config";

export const STORAGE_PUBLIC_URL: string = STORAGE.publicUrl;

type StorageDriver = "gcs" | "ftp";

interface IStorageProvider {
  uploadFromPath(filepath: string): Promise<void>;
  uploadFromBuffer(filename: string, buffer: Buffer): Promise<void>;
  uploadFromStream(filename: string, stream: NodeJS.ReadableStream): Promise<void>;
  delete(filename: string): Promise<boolean>;
  exists(filename: string): Promise<boolean>;
  downloadToStream(filename: string, writable: NodeJS.WritableStream): Promise<void>;
  publicUrlOf(filename: string): string;

  // opcionales (solo GCS)
  listBuckets?(): Promise<void>;
  listFiles?(): Promise<void>;
}

const sanitizeName = (name: string): string => {
  const clean: string = `${name}`.trim().replace(/\\/g, "/");
  const base: string = path.posix.basename(clean);
  if (!base || base === "." || base === "..") throw new Error("Nombre de archivo inválido");
  return base;
};

/* =========================
   FTP Provider
========================= */
class FtpStorageProvider implements IStorageProvider {
  private assertCfg(): void {
    if (!STORAGE.ftp?.host || !STORAGE.ftp?.user || !STORAGE.ftp?.password) {
      throw new Error("FTP config incompleta. Revisa FTP_HOST/FTP_USER/FTP_PASS.");
    }
  }

  private remotePath(filename: string): string {
    const base: string = sanitizeName(filename);
    const dir: string = `${STORAGE.ftp?.baseDir || "/"}`.replace(/\\/g, "/");
    return path.posix.join(dir, base);
  }

  /* private async withClient<T>(fn: (client: FtpClient) => Promise<T>): Promise<T> {
    this.assertCfg();
    const client: FtpClient = new FtpClient();
    client.ftp.verbose = false;

    try {
      await client.access({
        host: STORAGE.ftp.host,
        port: Number(STORAGE.ftp.port || 21),
        user: STORAGE.ftp.user,
        password: STORAGE.ftp.password,
        secure: false,
      });

      if (STORAGE.ftp.baseDir && STORAGE.ftp.baseDir !== "/") {
        await client.ensureDir(STORAGE.ftp.baseDir);
      }

      return await fn(client);
    } finally {
      client.close();
    }
  } */
 private async withClient<T>(fn: (client: FtpClient) => Promise<T>): Promise<T> {
  this.assertCfg();

  const client: FtpClient = new FtpClient();
  client.ftp.verbose = false;

  try {
    // conexión control
    await client.access({
      host: STORAGE.ftp.host,
      port: Number(STORAGE.ftp.port || 21),
      user: STORAGE.ftp.user,
      password: STORAGE.ftp.password,
      secure: false,
    });

    // ===== ajustes críticos para NAT / firewall =====
    client.ftp.ipFamily = 4;    // fuerza IPv4

    // ===== timeouts a nivel de socket (NO readonly) =====
    const SOCKET_TIMEOUT_MS = 120_000;

    if (client.ftp.socket) {
      client.ftp.socket.setTimeout(SOCKET_TIMEOUT_MS);
    }

    // data socket no siempre existe al inicio
    const anyFtp: any = client.ftp as any;
    if (anyFtp.dataSocket) {
      anyFtp.dataSocket.setTimeout(SOCKET_TIMEOUT_MS);
    }

    // ===== directorio base =====
    if (STORAGE.ftp.baseDir && STORAGE.ftp.baseDir !== "/") {
      await client.ensureDir(STORAGE.ftp.baseDir);
    }

    // ejecutar operación FTP
    return await fn(client);
  } finally {
    client.close();
  }
}


  public publicUrlOf(filename: string): string {
    const clean: string = sanitizeName(filename);
    return `${STORAGE_PUBLIC_URL}/${encodeURIComponent(clean)}`;
  }

  public async uploadFromPath(filepath: string): Promise<void> {
    const filename: string = sanitizeName(path.posix.basename(filepath));
    const remote: string = this.remotePath(filename);
    await this.withClient(async (client) => {
      await client.uploadFrom(filepath, remote);
    });
  }

  public async uploadFromBuffer(filename: string, buffer: Buffer): Promise<void> {
    const clean: string = sanitizeName(filename);
    const remote: string = this.remotePath(clean);
    await this.withClient(async (client) => {
      await client.uploadFrom(Readable.from([buffer]), remote); // ✅ Buffer -> Readable
    });
  }

  public async uploadFromStream(filename: string, stream: NodeJS.ReadableStream): Promise<void> {
    const clean: string = sanitizeName(filename);
    const remote: string = this.remotePath(clean);
    await this.withClient(async (client) => {
      // busboy/express streams son NodeJS.ReadableStream => OK
      await client.uploadFrom(stream as any, remote);
    });
  }

  public async delete(filename: string): Promise<boolean> {
    const clean: string = sanitizeName(filename);
    const remote: string = this.remotePath(clean);

    return await this.withClient(async (client) => {
      try {
        await client.remove(remote);
        return true;
      } catch (err: any) {
        const msg: string = `${err?.message || ""}`.toLowerCase();
        if (msg.includes("550") || msg.includes("not found") || msg.includes("no such file")) return false;
        throw err;
      }
    });
  }

  public async exists(filename: string): Promise<boolean> {
    const clean: string = sanitizeName(filename);
    const remote: string = this.remotePath(clean);

    return await this.withClient(async (client) => {
      try {
        const size: number = await client.size(remote);
        return size >= 0;
      } catch (err: any) {
        const msg: string = `${err?.message || ""}`.toLowerCase();
        if (msg.includes("550") || msg.includes("not found") || msg.includes("no such file")) return false;
        throw err;
      }
    });
  }

  public async downloadToStream(filename: string, writable: NodeJS.WritableStream): Promise<void> {
    const clean: string = sanitizeName(filename);
    const remote: string = this.remotePath(clean);

    await this.withClient(async (client) => {
      await client.downloadTo(writable as any, remote);
    });
  }
}

/* =========================
   GCS Provider
========================= */
class GcsStorageProvider implements IStorageProvider {
  private readonly gcs: GCSStorage;

  public constructor() {
    this.gcs = new GCSStorage({ projectId: STORAGE.projectId, keyFilename: STORAGE.keyFilename });
  }

  private bucket(): Bucket {
    if (!STORAGE.bucketName) throw new Error("STORAGE.bucketName no definido.");
    return this.gcs.bucket(STORAGE.bucketName);
  }

  private file(filename: string): File {
    const clean: string = sanitizeName(filename);
    return this.bucket().file(clean);
  }

  public publicUrlOf(filename: string): string {
    const clean: string = sanitizeName(filename);
    return `https://storage.googleapis.com/${STORAGE.bucketName}/${encodeURIComponent(clean)}`;
  }

  public async listBuckets(): Promise<void> {
    const [buckets] = await this.gcs.getBuckets();
    buckets.forEach((b) => console.log(b.name));
  }

  public async listFiles(): Promise<void> {
    const [files] = await this.bucket().getFiles();
    files.forEach((f) => console.log(f.name));
  }

  public async uploadFromPath(filepath: string): Promise<void> {
    await this.bucket().upload(filepath, {
      gzip: true,
      metadata: { cacheControl: "public, max-age=31536000" },
    });
  }

  public async uploadFromBuffer(filename: string, buffer: Buffer): Promise<void> {
    const f: File = this.file(filename);
    await f.save(buffer, { resumable: false, validation: false });
    await f.makePublic();
  }

  public async uploadFromStream(filename: string, stream: NodeJS.ReadableStream): Promise<void> {
    const f: File = this.file(filename);

    await new Promise<void>((resolve, reject) => {
      const ws = f.createWriteStream({ resumable: false });
      ws.on("error", reject);
      ws.on("finish", resolve);
      stream.pipe(ws);
    });

    await f.makePublic();
  }

  public async delete(filename: string): Promise<boolean> {
    const f: File = this.file(filename);
    const [exists] = await f.exists();
    if (!exists) return false;
    await f.delete();
    return true;
  }

  public async exists(filename: string): Promise<boolean> {
    const f: File = this.file(filename);
    const [exists] = await f.exists();
    return exists;
  }

  public async downloadToStream(filename: string, writable: NodeJS.WritableStream): Promise<void> {
    const f: File = this.file(filename);

    await new Promise<void>((resolve, reject) => {
      const rs = f.createReadStream();
      rs.on("error", reject);
      writable.on("error", reject);
      writable.on("finish", resolve);
      rs.pipe(writable);
    });
  }
}

/* =========================
   Provider selection
========================= */
const DRIVER: StorageDriver = (STORAGE.driver as StorageDriver) || "gcs";

const provider: IStorageProvider =
  DRIVER === "ftp" ? new FtpStorageProvider() : new GcsStorageProvider();

/* =========================
   Public API (mantiene nombres)
========================= */
export const listBuckets = async (): Promise<void> => {
  if (provider.listBuckets) return provider.listBuckets();
  console.log("[storage] listBuckets no aplica para FTP");
};

export const listFiles = async (): Promise<void> => {
  if (provider.listFiles) return provider.listFiles();
  console.log("[storage] listFiles no aplica para FTP");
};

export const uploadFile = async (filepath: string): Promise<void> => {
  await provider.uploadFromPath(filepath);
};

export const uploadFileFromBuffer = async (file: fileUpload.UploadedFile): Promise<boolean> => {
  const filename: string = sanitizeName(file.name);
  await provider.uploadFromBuffer(filename, file.data);
  return true;
};

export const uploadFileFromStream = async (
  stream: NodeJS.ReadableStream,
  filename: string,
  // se mantiene por compat aunque FTP no lo use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _mimetype: string,
): Promise<boolean> => {
  const clean: string = sanitizeName(filename);
  await provider.uploadFromStream(clean, stream);
  return true;
};

export const deleteFile = async (filename: string): Promise<boolean> => {
  const clean: string = sanitizeName(filename);
  return await provider.delete(clean);
};

export const existsFile = async (filename: string): Promise<boolean> => {
  const clean: string = sanitizeName(filename);
  return await provider.exists(clean);
};

export const downloadFileToStream = async (
  filename: string,
  writable: NodeJS.WritableStream,
): Promise<void> => {
  const clean: string = sanitizeName(filename);
  await provider.downloadToStream(clean, writable);
};

// usado en reportes (buffer + url)
export const uploadPublicBufferAndGetUrl = async (
  name: string,
  data: Buffer,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _contentType: string,
): Promise<string> => {
  const clean: string = sanitizeName(name);
  await provider.uploadFromBuffer(clean, data);
  return provider.publicUrlOf(clean);
};
