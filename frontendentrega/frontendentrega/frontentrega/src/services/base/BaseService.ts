/**
 * Proyecto: Plataforma PAGADOR
 * Autor técnico: Ing. Giancarlo Delgadillo Coca
 * Desarrollado para el Gobierno Autónomo Departamental de Oruro.
 *
 * Se reconoce la autoría técnica al Ing. Giancarlo Delgadillo Coca en la implementación de este
 * código fuente, sin perjuicio de la titularidad institucional aplicable.
 */
import { QueryParams, BaseResponse, RequestHeaders, RequestFilters, RequestMethod, UploadResponseModel } from './Types';
import { RESPONSE_MESSAGES as MSG } from './ResponseMessages';
import { API_URL, LOG_URL, STORAGE_URL, TOKEN_KEY } from '../../../src/config/app-config';

const getHeaders = async (baseHeaders?: RequestHeaders) => {
    const DEFAULT_HEADERS = { Accept: 'application/json', 'Content-Type': 'application/json' };
    const HEADERS: RequestHeaders = baseHeaders ? baseHeaders : DEFAULT_HEADERS;

    const localToken = localStorage.getItem(TOKEN_KEY);
    if (localToken) {
        HEADERS['Authorization'] = `Bearer ${localToken}`;
        /* return HEADERS; */
    }

    return HEADERS;
};

const buildQueryFilters = (filters: RequestFilters): string[] => {
    return Object.keys(filters)
        .filter((key) => !['_limit', '_page', '_sort', '_order', 'q'].includes(key))
        .map((key) => {
            const filterValue = filters[key];
            return Array.isArray(filterValue) ? filterValue.map((val) => `${key}=${encodeURIComponent(val)}`).join('&') : `${key}=${encodeURIComponent(filterValue)}`;
        });
};

/**
 * Utilizado para construir una URL con filtros (diseñado para el componente DataTable).
 * @return queryParamsText
 * @example "?estado=1&_limit=10&_page=1&q=some%20value&_sort=id&_order=asc"
 */
function buildQueryParamsText(queryParams: QueryParams = {}): string {
    const params = queryParams.filters ? buildQueryFilters(queryParams.filters) : [];
    if (queryParams.rowsPerPage) params.push(`_limit=${queryParams.rowsPerPage}`);
    if (queryParams.page) params.push(`_page=${queryParams.page}`);
    if (queryParams.searchText) params.push(`q=${encodeURIComponent(queryParams.searchText)}`);
    if (queryParams.orderBy) params.push(`_sort=${queryParams.orderBy}`);
    if (queryParams.order) params.push(`_order=${queryParams.order}`);
    const queryParamsText = params.length > 0 ? `?${params.join('&')}` : '';
    return queryParamsText;
}

/** @deprecated use BaseService.findAll() */
async function getAll<Model>(resourcePath: string, queryParams: QueryParams = {}): Promise<BaseResponse<Model>> {
    const result: BaseResponse<Model> = { success: true, msg: MSG.DEFAULT_SUCCESS };
    try {
        const queryParamsText = buildQueryParamsText(queryParams);
        const url = `${API_URL}${resourcePath}${queryParamsText}`;
        const response = await fetch(url, { method: 'GET', headers: await getHeaders() });

        result.rows = await validateResponse(response);
        result.count = parseInt(response.headers.get('X-Total-Count') || '0');
    } catch (e: any) {
        result.success = false;
        result.msg = errMsg(e);
    }
    return result;
}

/**
 * Devuelve un listado de registros con paginador.
 * @return {Object} { success, msg, rows, count }
 */
async function findAll<Model>(resourcePath: string, queryParams: QueryParams = {}, delay?: number): Promise<BaseResponse<Model>> {
    const result: BaseResponse<Model> = { success: true, msg: MSG.DEFAULT_SUCCESS };
    try {
        if (delay) await timer(delay);
        const queryParamsText = buildQueryParamsText(queryParams);
        const url = `${API_URL}${resourcePath}${queryParamsText}`;
        const response = await fetch(url, { method: 'GET', headers: await getHeaders() });
        const responseJson = await validateResponse(response);
        result.rows = responseJson.rows;
        result.count = parseInt(responseJson.count);
        result.total = responseJson.total;
    } catch (e: any) {
        result.success = false;
        result.msg = errMsg(e);
    }
    return result;
}

/** @deprecated use BaseService.request() */
async function getById<Model>(resourcePath: string, id: number | string): Promise<BaseResponse<Model>> {
    const result: BaseResponse<Model> = { success: true, msg: MSG.DEFAULT_SUCCESS };
    try {
        const url = `${API_URL}${resourcePath}/${id}`;
        const response = await fetch(url, { method: 'GET', headers: await getHeaders() });

        result.data = await validateResponse(response);
    } catch (e: any) {
        result.success = false;
        result.msg = errMsg(e);
    }
    return result;
}

/** @deprecated use BaseService.request() */
async function create<Model>(resourcePath: string, data: Model): Promise<BaseResponse<Model>> {
    const result: BaseResponse<Model> = { success: true, msg: MSG.DEFAULT_SUCCESS };
    try {
        const url = `${API_URL}${resourcePath}`;
        const response = await fetch(url, { method: 'POST', headers: await getHeaders(), body: JSON.stringify(data) });

        result.data = await validateResponse(response);
    } catch (e: any) {
        result.success = false;
        result.msg = errMsg(e);
    }
    return result;
}

/** @deprecated use BaseService.request() */
async function update<Model>(resourcePath: string, id: number | string, data: Model): Promise<BaseResponse<Model>> {
    const result: BaseResponse<Model> = { success: true, msg: MSG.DEFAULT_SUCCESS };
    try {
        const url = `${API_URL}${resourcePath}/${id}`;
        const response = await fetch(url, { method: 'PUT', headers: await getHeaders(), body: JSON.stringify(data) });

        result.data = await validateResponse(response);
    } catch (e: any) {
        result.success = false;
        result.msg = errMsg(e);
    }
    return result;
}

/** @deprecated use BaseService.request() */
async function patch<Model>(resourcePath: string, id: number | string, data: unknown): Promise<BaseResponse<Model>> {
    const result: BaseResponse<Model> = { success: true, msg: MSG.DEFAULT_SUCCESS };
    try {
        const url = `${API_URL}${resourcePath}/${id}`;
        const response = await fetch(url, { method: 'PATCH', headers: await getHeaders(), body: JSON.stringify(data) });

        result.data = await validateResponse(response);
    } catch (e: any) {
        result.success = false;
        result.msg = errMsg(e);
    }
    return result;
}

/** @deprecated use BaseService.request() */
async function destroy<Model>(resourcePath: string, id: number | string): Promise<BaseResponse<Model>> {
    const result: BaseResponse<Model> = { success: true, msg: MSG.DEFAULT_SUCCESS };
    try {
        const url = `${API_URL}${resourcePath}/${id}`;
        const response = await fetch(url, { method: 'DELETE', headers: await getHeaders() });

        result.data = await validateResponse(response);
    } catch (e: any) {
        result.success = false;
        result.msg = errMsg(e);
    }
    return result;
}

/**
 * Utilizado para cualquier tipo de petición.
 * @return {Object} { success, msg, data }
 */
async function request<Model>(method: RequestMethod, routePath: string, data?: unknown | FormData, delay?: number): Promise<BaseResponse<Model>> {
    const result: BaseResponse<Model> = { success: true, msg: MSG.DEFAULT_SUCCESS };
    try {
        if (delay) await timer(delay);
        const url = `${API_URL}${routePath}`;
        const hasFormData = data instanceof FormData;
        const headers = await getHeaders(hasFormData ? {} : undefined);
        const response = await fetch(url, {
            method,
            headers,
            body: data ? (hasFormData ? (data as FormData) : JSON.stringify(data)) : undefined
        });
        result.data = await validateResponse(response);
        // INI - CASO ESPECIAL para peticiones que devuelven STATUS 200 con ERROR
        const hasError: any = result.data;
        if (hasError && hasError.error) {
            result.msg = hasError.error;
            result.success = false;
        }
        // FIN - CASO ESPECIAL
    } catch (e: any) {
        result.success = false;
        result.msg = errMsg(e);
    }
    return result;
}

type ProgressFn = (progress: number, uploaded: boolean) => void;

async function uploadFile(
  file: File,
  fileName: string,
  onProgress?: ProgressFn,
): Promise<BaseResponse<UploadResponseModel>> {
let tailTimer: number | null = null;
let tailValue: number = 95;

const stopTail = (): void => {
  if (tailTimer !== null) {
    window.clearInterval(tailTimer);
    tailTimer = null;
  }
};

  return new Promise(async (resolve) => {
    try {
      const url: string = `${API_URL}/storage/upload`;

      const formData: FormData = new FormData();
      // 👇 clave: enviamos el filename REAL que quieres guardar en FTP
      formData.append("file", file, fileName);

      const token: string | null = localStorage.getItem(TOKEN_KEY);

      const xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.open("POST", url, true);

      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.upload.onloadend = () => {
  // si ya llegó a 95 por progreso real, empezamos a "caminar" hasta 99
  stopTail();
  tailValue = 90;

  tailTimer = window.setInterval(() => {
    // sube lento y nunca llega a 100 aquí
    if (tailValue < 95) {
      tailValue += 1;
      if (onProgress) onProgress(tailValue, false);
      return;
    }
    // se queda en 99 esperando respuesta real del backend
    stopTail();
  }, 500);
};

      xhr.upload.onprogress = (event: ProgressEvent<EventTarget>) => {
        const loaded: number = typeof event.loaded === "number" ? event.loaded : 0;
        const totalFromEvent: number = typeof event.total === "number" && event.total > 0 ? event.total : 0;
        const total: number = totalFromEvent > 0 ? totalFromEvent : file.size;

        if (total <= 0) return;

        const raw: number = (loaded / total) * 100;

        // 🔥 clave: NO llegar a 100 aquí (100 = solo terminó de enviar al backend)
        const capped: number = Math.min(90, Math.max(0, raw));
        const progress: number = Math.round(capped);

        if (onProgress) onProgress(progress, false);
        };


      xhr.onerror = () => {
        stopTail();
        resolve(BaseService.sendError({ msg: "Error de red al subir el archivo." }));
        };

      xhr.onload = async () => {
        try {
            stopTail();
          if (xhr.status !== 200 && xhr.status !== 201) {
            resolve(BaseService.sendError({ msg: `Upload falló (${xhr.status}).` }));
            return;
          }

          // backend responde algo como: { msg, name, file }
          // luego registramos para que retorne { msg, file, name, path } (modelo esperado)
          const registerResult = await BaseService.request<UploadResponseModel>(
            "post",
            "/storage/register",
            { fileName },
          );

          if (onProgress) onProgress(100, true);

          if (!registerResult.success) {
            resolve(BaseService.sendError(registerResult));
            return;
          }

          resolve(BaseService.sendSuccess(registerResult));
        } catch (err: unknown) {
          resolve(BaseService.sendError({ msg: String(err) }));
        }
      };

      xhr.send(formData);
    } catch (err: unknown) {
      resolve(BaseService.sendError({ msg: String(err) }));
    }
  });
}


/** Utilizado para eliminar archivos de Google Cloud Storage */
function removeFile(fileName: string): Promise<BaseResponse<unknown>> {
    return BaseService.request('delete', `/storage/upload`, { fileName });
}

/** Devuelve la URL pública de un archivo de Google Cloud Storage */
function buildPublicURL(fileName: string): string {
    return fileName && fileName.startsWith('http') ? fileName : `${STORAGE_URL}/${fileName}`;
}

/**
 * Utilizado para descargar archivos directamente desde el navegador.
 * @return {Object} { success, msg }
 */
async function download(method: RequestMethod, routePath: string, data?: unknown, filename?: string): Promise<BaseResponse<unknown>> {
    try {
        const url = `${API_URL}${routePath}`;
        const response = await fetch(url, {
            method: method.toUpperCase(),
            headers: await getHeaders(),
            body: data ? JSON.stringify(data) : undefined
        });
        const resObj = {
            filename: filename || fnGetFileNameFromContentDispostionHeader(String(response.headers.get('content-disposition'))),
            blob: await response.blob()
        };
        const newBlob = new Blob([resObj.blob], {
            type: `${response.headers.get('content-type')}`
        });

        // MS Edge and IE don't allow using a blob object directly as link href, instead it is necessary to use msSaveOrOpenBlob
        /* if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return BaseService.sendSuccess();
        } */

        const nav = window.navigator as any;
        if (nav.msSaveOrOpenBlob) {
            nav.msSaveOrOpenBlob(newBlob);
            return BaseService.sendSuccess();
        }

        // For other browsers: create a link pointing to the ObjectURL containing the blob.
        const objUrl = window.URL.createObjectURL(newBlob);

        const link = document.createElement('a');
        link.href = objUrl;
        link.download = resObj.filename;
        link.click();

        // For Firefox it is necessary to delay revoking the ObjectURL.
        setTimeout(() => {
            window.URL.revokeObjectURL(objUrl);
        }, 250);

        return BaseService.sendSuccess();
    } catch (e: any) {
        return BaseService.sendError({ msg: e.message });
    }
}

function fnGetFileNameFromContentDispostionHeader(header: string) {
    const contentDispostion = header ? header.split(';') : [];
    const fileNameToken = `filename=`;
    let filename = 'doc.txt';
    for (const thisValue of contentDispostion) {
        if (thisValue.trim().indexOf(fileNameToken) === 0) {
            filename = decodeURIComponent(thisValue.trim().replace(fileNameToken, ''));
            break;
        }
    }
    return filename;
}

/**
 * Utilizado para construir respuestas exitosas.
 * @return {Object} { success, msg, data, rows, count }
 */
async function sendSuccess<Model>(result?: { success?: boolean; msg?: string; data?: Model; rows?: Model[]; count?: number }, delay?: number): Promise<BaseResponse<Model>> {
    if (delay) await timer(delay);
    if (result) result.success = true;
    return Promise.resolve((result || { success: true, msg: MSG.DEFAULT_SUCCESS }) as BaseResponse<Model>);
}

/**
 * Utilizado para construir respuestas fallidas.
 * @return {Object} { success, msg }
 */
async function sendError<Model>(result?: { success?: boolean; msg?: string }, delay?: number): Promise<BaseResponse<Model>> {
    if (delay) await timer(delay);
    if (result) result.success = false;
    return Promise.resolve((result || { success: false, msg: MSG.DEFAULT_ERROR }) as BaseResponse<Model>);
}

async function validateResponse(response: Response): Promise<any> {
    const json = await response.json();
    if (response.status === 200 || response.status === 201) return json;
    if (response.status === 404) throw new Error(json.error || json.message || MSG.ERROR_404);
    if (response.status === 401) throw new Error(json.error || json.message || MSG.ERROR_401);
    if (response.status === 403) throw new Error(json.error || json.message || MSG.ERROR_403);
    if (response.status === 400) throw new Error(json.error || json.message || MSG.ERROR_400);
    if (response.status === 409) throw new Error(json.error || json.message || MSG.ERROR_409);
    if (response.status === 412) throw new Error(json.error || json.message || MSG.ERROR_412);
    throw new Error(json.error || json.message || MSG.ERROR_500);
}

function errMsg(e: Error): string {
    return e.message && e.message === 'Failed to fetch' ? MSG.FETCH_ERROR : e.message || MSG.DEFAULT_ERROR;
}

function timer(timeout: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeout));
}

async function log(...args: any): Promise<void> {
    if (!LOG_URL) return;
    console.log(...args);
    const HEADERS = await getHeaders();
    const DATA = args.map((x: any) => (x instanceof Error ? x.stack : x));
    const BODY = JSON.stringify({ data: DATA, time: new Date().toISOString() });
    await fetch(`${LOG_URL}?format=json`, { headers: HEADERS, method: 'post', body: BODY }).catch(() => ({}));
}
//metodo para mostrar un documento por pantalla
async function viewPdf(method: RequestMethod, routePath: string, data?: unknown,filename?: string): Promise<BaseResponse<unknown>> {
    try {
        const url = `${API_URL}${routePath}`;
        const response = await fetch(url, {
            method: method.toUpperCase(),
            headers: await getHeaders(),
            body: data ? JSON.stringify(data) : undefined
        });

        // Asegúrate de que la respuesta sea de tipo PDF
        if (!response.ok || !response.headers.get('content-type')?.includes('application/pdf')) {
            throw new Error('No se recibió un archivo PDF.');
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        // Abre el PDF en una nueva pestaña
        window.open(objectUrl, '_blank');

        // Revoke URL después de un tiempo para liberar memoria
        setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);

        return BaseService.sendSuccess(); // Puedes enviar una respuesta de éxito si lo deseas
    } catch (e: any) {
        return BaseService.sendError({ msg: e.message });
    }
}


export const BaseService = {
    getAll,
    findAll,
    getById,
    create,
    update,
    patch,
    destroy,
    request,
    sendSuccess,
    sendError,
    buildQueryParamsText,
    uploadFile,
    removeFile,
    buildPublicURL,
    download,
    log,
    viewPdf
};
