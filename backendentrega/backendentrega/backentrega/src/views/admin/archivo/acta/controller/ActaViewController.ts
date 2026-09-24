import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import ActaView from "..";
import { ActaFormDataResponse, ActaOptionsFormModel, GetActasTableResponse } from "../ActaView";
import ActaService from "../../../../../core/admin/archivo/acta";
import { ActaProps } from "../../../../../core/admin/archivo/acta/ActaEntity";
import DocumentoService from "../../../../../core/admin/archivo/documento";
import { Report2 } from "../../../../../tools/Report2";
import { DocumentoActaReport } from "../../../../../tools/DocumentoActaReport";

export class ActaViewController extends BaseHttpController {
    public async getActasTable(req: Request, res: Response): Promise<Response<any>> {
        const data = await ActaView.getActasTable(req.query);
        if (data.isFailure) {
            return this.fail(res, data.error as string);
        }
        return this.ok<GetActasTableResponse>(res, data.getValue());
    }       
    
    public async getActasReporteTable(req: Request, res: Response): Promise<Response<any>> {
        const data = await ActaView.getActasReporteTable(req.query);
        if (data.isFailure) {
            return this.fail(res, data.error as string);
        }
        return this.ok<GetActasTableResponse>(res, data.getValue());
    }       

    public async getActaFormData(req: Request, res: Response): Promise<any> {
        const formData = await ActaView.getActaFormDataView(req.params.acta_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<ActaFormDataResponse>(res, formData.getValue());
    }

    public async createOrUpdateActa(req: Request, res: Response): Promise<any> {
        const data = req.body;
        
        const ID_ACTA = data.id;
        const TIPO_ACTA = data.tipo;
        const ID_DOCUMENTOS: string[] = data.documentos_id;
        
        const actas = await ActaService.getAll();
        if (actas.isFailure) return this.fail(res, "Actas no encontrado");
        const actasResult = actas.getValue();

        /* //-- proceso de asignacion de codigo de acta correlativo */
        const actasRecepcionCodigo = actasResult.map((vr) => parseInt(vr.props.codActa.match(/\d+/)?.[0] || "0", 10))
                .slice().sort((a, b) => b - a);        
        const nro_acta = actasRecepcionCodigo.length > 0 ? actasRecepcionCodigo[0] + 1: 1;
        const codigo = nro_acta.toString().padStart(5, '0')+TIPO_ACTA;
        /* --// proceso de asignacion de codigo de acta correlativo */
                
        const props: ActaProps = {
            codActa           : codigo,
            tipo              : data.tipo,
            dias              : data.dias,
            descripcion       : data.descripcion,
            documentosId      : ID_DOCUMENTOS,
            areaId            : data.area_id,
            fechaDevolucion   : data.fecha_devolucion,
            fechaRegistro     : new Date(),
            externo           : data.externo,
            descripcionExterno: data.descripcion_externo,
            adjuntos          : data.adjuntos && JSON.parse(data.adjuntos),
            personalId        : data.personal_id,
            estado            : true,
        };        
        
        let result = null;
        if (ID_ACTA) result = await ActaService.update(ID_ACTA, props);
        else result = await ActaService.create(props);        

        if (result.isFailure) return this.fail(res, String(result.error));

        //Actualizamos los documentos al nuevo tipo de acta
        for (const item of ID_DOCUMENTOS) {
            const estado = data.tipo; //el estado de documento se convierte en el tipo de acta que se crea
            const resultDocumentos = await DocumentoService.update(item, { estado });
            if (resultDocumentos.isFailure) {
                return this.fail(res, String(resultDocumentos.error));
            }
        } 
        return this.ok(res, result);
    }

    public async devolverActa(req: Request, res: Response): Promise<any> {
        const ID_ACTA = req.params.acta_id;

        const actaPrestamo = await ActaService.getById(ID_ACTA);
        if (actaPrestamo.isFailure) return this.fail(res, String(actaPrestamo.error));

        const propsPrestamo = actaPrestamo.getValue().props;
        if (propsPrestamo.tipo !== "ACT_PRE") {
            return this.fail(res, "400 Solo se puede registrar devolucion desde un acta de prestamo");
        }

        const ID_DOCUMENTOS = propsPrestamo.documentosId || [];
        if (ID_DOCUMENTOS.length === 0) {
            return this.fail(res, "400 El acta de prestamo no tiene documentos para devolver");
        }

        const documentos = await DocumentoService.getAll({ id: ID_DOCUMENTOS, _limit: ID_DOCUMENTOS.length });
        if (documentos.isFailure) return this.fail(res, String(documentos.error));

        const documentosPrestados = documentos.getValue().filter((documento) => documento.props.estado === "ACT_PRE");
        if (documentosPrestados.length !== ID_DOCUMENTOS.length) {
            return this.fail(res, "400 Uno o mas documentos ya no estan en estado prestado");
        }

        const result = await ActaService.update(ID_ACTA, {
            tipo           : "ACT_DEV",
            fechaDevolucion: new Date(),
        });
        if (result.isFailure) return this.fail(res, String(result.error));

        for (const item of ID_DOCUMENTOS) {
            const resultDocumentos = await DocumentoService.update(item, { estado: "ACT_DEV" });
            if (resultDocumentos.isFailure) {
                return this.fail(res, String(resultDocumentos.error));
            }
        }

        return this.ok(res, { msg: "Acta registrada como devolucion exitosamente", id: ID_ACTA });
    }

    public async getAllActaDocumento(req: Request, res: Response): Promise<any> {        
        const result = await ActaView.getAllActaDocumento(req.params.nro);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<ActaOptionsFormModel>(res, result.getValue());
    }

    public async getPDFActa(req: Request, res: Response): Promise<any> {
        const id: string = req.body.id;        
        const tipo: string = req.body.tipo;        
        const formData = await ActaView.getPDFActa(req.authUser, id, tipo);
        if (formData.isFailure) return this.fail(res, String(formData.error));
    
        const result = formData.getValue();
        return Report2.creaPDF(result, 'acta', res);
    }

    public async getPDFActa2(req: Request, res: Response): Promise<any> {
        const queryString = req.body.qs;        
        const formData = await ActaView.getPDFActa2(req.authUser, queryString);
        if (formData.isFailure) return this.fail(res, String(formData.error));
    
        const result = formData.getValue();
        return DocumentoActaReport.creaPDF(result, 'acta2', res);
    }

    public async destroyActa(req: Request, res: Response): Promise<any> {
        const ID_ACTA = req.params.acta_id;
        const actaR = await ActaService.getById(ID_ACTA);
        if (actaR.isFailure) return this.fail(res, String(actaR.error));

        const result = await ActaService.delete(ID_ACTA);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async changeState(req: Request, res: Response): Promise<any> {
        const actaId = req.params.acta_id;
        const estado = Boolean(req.body.estado);

        const result = await ActaService.update(actaId, { estado });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado");
        return this.ok(res);
    }
}
