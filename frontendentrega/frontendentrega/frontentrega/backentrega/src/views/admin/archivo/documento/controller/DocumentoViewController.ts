import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import ExcelJS from 'exceljs';
import DocumentoService from "../../../../../core/admin/archivo/documento";
import { DocumentoAdjunto, DocumentoProps } from "../../../../../core/admin/archivo/documento/DocumentoEntity";

import { DocumentoFormDataResponse, GetDocumentosTableResponse } from "../DocumentoView";
import DocumentoView from "..";

import { DocumentoActaReport } from "../../../../../tools/DocumentoActaReport";

type DocumentoAdjuntoPayload = {
    id?: string;
    fileName?: string;
    filePath?: string;
    fileType?: string;
};

function parseDocumentoAdjuntos(adjuntos: unknown): DocumentoAdjunto[] {
    if (!adjuntos) return [];

    try {
        const parsed: unknown =
            typeof adjuntos === 'string'
                ? JSON.parse(adjuntos)
                : adjuntos;

        if (!Array.isArray(parsed)) return [];

        return parsed.filter((item: unknown): item is DocumentoAdjunto => {
            if (typeof item === 'string') return item.trim().length > 0;

            if (typeof item === 'object' && item !== null && 'fileName' in item) {
                const value = item as DocumentoAdjuntoPayload;
                return typeof value.fileName === 'string' && value.fileName.trim().length > 0;
            }

            return false;
        });
    } catch (error: unknown) {
        console.log(error);
        return [];
    }
}

const DOCUMENTO_DUPLICADO_MSG = "No se puede guardar el documento porque ya existe otro registro con el mismo nro documento, tipo y gestion.";

async function validarDocumentoDuplicado(nro: number, gestion: string, tipo: string, idActual?: string): Promise<{ exists: boolean; error?: string }> {
    const documentos = await DocumentoService.getAll({
        _limit: 2,
        _page: 1,
        _attributes: ["id", "nro", "gestion", "tipo"],
        nro,
        gestion,
        tipo,
    });

    if (documentos.isFailure) return { exists: false, error: String(documentos.error) };

    return {
        exists: documentos.getValue().some((documento) => documento.id !== String(idActual || "")),
    };
}

function isDocumentoDuplicadoPersistenceError(error: unknown): boolean {
    const message = String(error || "").toLowerCase();
    return message.includes("documento_nro_tipo_gestion_unique") || message.includes("validation error");
}

export class DocumentoViewController extends BaseHttpController {
    public async getDocumentosTable(req: Request, res: Response): Promise<Response<any>> {
        const data = await DocumentoView.getDocumentosTable(req.query);
        if (data.isFailure) {
            return this.fail(res, data.error as string);
        }
        return this.ok<GetDocumentosTableResponse>(res, data.getValue());
    }

    public async getDocumentosTable2(req: Request, res: Response): Promise<Response<any>> {
        const data = await DocumentoView.getDocumentosTable2(req.query);
        if (data.isFailure) {
            return this.fail(res, data.error as string);
        }
        return this.ok<GetDocumentosTableResponse>(res, data.getValue());
    }

    public async getDocumentoFormData(req: Request, res: Response): Promise<any> {
        const formData = await DocumentoView.getDocumentoFormDataView(req.params.documento_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<DocumentoFormDataResponse>(res, formData.getValue());
    }

    public async getNroDocumentoData(req: Request, res: Response): Promise<any> {
        const nroRaw = req.params.nro;
        const gestion = String(req.params.gestion || "").trim();
        const tipo = String(req.params.tipo || "").trim();

        const nro = Number(nroRaw);
        if (!Number.isFinite(nro) || !gestion || !tipo) return this.badRequest(res, "Parámetros inválidos");
        const query = { _limit: 1, _page: 1, _attributes: ["id"], nro, gestion, tipo };
        const documentos = await DocumentoService.getAll(query);
        if (documentos.isFailure) return this.fail(res, "Error al verificar documento");

        const rows = documentos.getValue();
        return this.ok<any>(res, { nro: rows.length > 0 });
    }

    public async verificacionNroDocumentos(nrodoc: string, gestion: string, tipo: string): Promise<boolean> {
        const nros = String(nrodoc || "")
            .split(",")
            .map((nro) => Number(nro.trim()))
            .filter((nro) => Number.isFinite(nro));

        if (nros.length === 0) return false;

        const documentos = await DocumentoService.getAll({
            _limit: nros.length,
            _page: 1,
            _attributes: ["id", "nro", "tipo", "gestion"],
            nro: nros,
            tipo: String(tipo || "").trim(),
            gestion: String(gestion || "").trim(),
        });
        if (documentos.isFailure) return false;

        return documentos.getValue().length > 0;
    }

    public async getNroDocumentoData2(req: Request, res: Response): Promise<any> {
        const nrodoc = req.body.nro.trim();
        const gestion = req.body.gestion.trim();
        const tipo = req.body.tipo;
        const result = await this.verificacionNroDocumentos(nrodoc, gestion, tipo);
        return this.ok<any>(res, { nro: result });
    }

    public async createOrUpdateDocumento(req: Request, res: Response): Promise<any> {
        const data = req.body;

        const rawMonto: any = data.monto;
        const rawNro: any = data.nro;
        const tipo = String(data.tipo || "").trim();
        const gestion = String(data.gestion || "").trim();
        const nro = Number(rawNro);

        if (!Number.isFinite(nro) || !tipo || !gestion) {
            return this.badRequest(res, "Debe completar nro documento, tipo y gestion.");
        }

        if (rawMonto === null || rawMonto === undefined || rawMonto === "" || isNaN(Number(rawMonto))) {
            return this.fail(res, "El campo 'monto' debe ser un número válido.");
        }

        const montoParsed = Number(rawMonto);

        const ID_DOCUMENTO = data.id;
        const duplicado = await validarDocumentoDuplicado(nro, gestion, tipo, ID_DOCUMENTO);
        if (duplicado.error) return this.fail(res, "Error al verificar documento duplicado");
        if (duplicado.exists) return this.conflict(res, DOCUMENTO_DUPLICADO_MSG);

        const props: DocumentoProps = {
            nro,
            tipo,
            descripcion: data.descripcion,
            docAdjunto: data.doc_adjunto,
            gestion,
            fecha: data.fecha,
            hojasRuta: data.hojas_ruta,
            grupoGasto: data.grupo_gasto,
            ubicacion: data.ubicacion,
            nrofolio: data.nrofolio,
            monto: montoParsed,
            adjuntos: parseDocumentoAdjuntos(data.adjuntos),
            estado: data.estado === "-" ? "ACT_REC" : data.estado,
            permiso: "NORMAL",
        };

        if (props.monto !== null && props.monto !== undefined) {
            if (isNaN(Number(props.monto))) {
                return this.fail(res, "El campo 'monto' debe ser numérico.");
            }
        }

        let result = null;
        if (ID_DOCUMENTO) {
            result = await DocumentoService.update(ID_DOCUMENTO, props);
            if (result.isFailure && isDocumentoDuplicadoPersistenceError(result.error)) return this.conflict(res, DOCUMENTO_DUPLICADO_MSG);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }

        result = await DocumentoService.create(props);
        if (result.isFailure && isDocumentoDuplicadoPersistenceError(result.error)) return this.conflict(res, DOCUMENTO_DUPLICADO_MSG);
        if (result.isFailure) return this.fail(res, String(result.error));

        return this.ok<any>(res, result);
    }

    public async destroyDocumento(req: Request, res: Response): Promise<any> {
        const ID_documento = req.params.documento_id;
        const documentoR = await DocumentoService.getById(ID_documento);
        if (documentoR.isFailure) return this.fail(res, String(documentoR.error));

        const result = await DocumentoService.delete(ID_documento);
        if (result.isFailure) return this.fail(res, String(result.error));
        return this.ok<any>(res, result);
    }

    public async getAllDocumento(req: Request, res: Response): Promise<any> {
        const result = await DocumentoView.getAllDocumento(req.params.tipo, req.query);
        return this.ok<any>(res, result.getValue());
    }

    public async getAllDocumento2(req: Request, res: Response): Promise<any> {
        const result = await DocumentoView.getAllDocumento2(req.query);
        return this.ok<any>(res, result.getValue());
    }

    public async changeActive(req: Request, res: Response): Promise<any> {
        const ID_DOCUMENTO = req.params.documento_id;
        const estado = Boolean(req.body.estado);

        const result = await DocumentoService.update(ID_DOCUMENTO, { estado });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado");
        return this.ok(res);
    }

    public async changePermiso(req: Request, res: Response): Promise<any> {
        const ID_DOCUMENTO = req.params.documento_id;
        const permiso = req.body.permiso;
        const result = await DocumentoService.update(ID_DOCUMENTO, { permiso });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado");
        return this.ok(res);
    }

    public async getPDFDocumento(req: Request, res: Response): Promise<any> {
        const queryString = req.body.qs;
        const formData = await DocumentoView.getPDFDocument(req.authUser, queryString);
        if (formData.isFailure) return this.fail(res, String(formData.error));

        const result = formData.getValue();
        return DocumentoActaReport.creaPDF(result, "documento", res);
    }

    public async getReportJSON(req: Request, res: Response): Promise<any> {
        const id_documento = req.params.id;
        const queryString = req.body.qs;
        //const params = new URLSearchParams(queryString);
        const formData = await DocumentoView.generarFilasExcel(req.authUser, queryString, id_documento);

        if (formData.isFailure) return this.fail(res, String(formData.error));
        const result = formData.getValue();
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Reporte Viático");
        // Definir columnas con estilos base

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        worksheet.columns = await DocumentoView.generarHeadExcel()!;

        // Estilo de los encabezados
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "4472C4" }, // azul oscuro
            };
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });

        //Aqui falta aumentar fila
        const formatData = await DocumentoView.getFormatData(result.data);

        // let contadorFilas =  1;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unused-vars
        formatData!.forEach((item: any, index: number) => {
            worksheet.addRow({
                nro: item.nro,
                tipo: item.tipo,
                gestion: item.gestion,
                monto: item.monto,
                doc_adjunto: item.doc_adjunto,
            });
        });
        // Estilos para las filas de datos
        worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            if (rowNumber === 1) return; // saltar encabezado

            row.eachCell((cell) => {
                cell.alignment = { vertical: "middle", horizontal: "left" };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });
        });

        // Preparar descarga
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=reporte_viatico_${id_documento}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    }
}
