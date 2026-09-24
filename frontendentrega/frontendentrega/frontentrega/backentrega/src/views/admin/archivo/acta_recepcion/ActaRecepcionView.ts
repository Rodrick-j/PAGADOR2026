import { Result } from "../../../../base/types/Result";

import { buildEntityMap, findAndCountResult, uniqueValues } from "../../../../tools/util";

import ActaRecepcionService from "../../../../core/admin/archivo/acta_recepcion";
import ActaRecepcionDetalleService from "../../../../core/admin/archivo/acta_recepcion_detalle";
import DocumentoService from "../../../../core/admin/archivo/documento";
import UsuarioService from "../../../../core/system/autenticacion/usuario";

import PersonalService from "../../../../core/rrhh/personal";
import AreaService from "../../../../core/rrhh/area";
import moment from "moment";
import { AuthUser } from "../../../../base/types/AuthUser";

type ActaRecepcionTableModel = {
    id             : string;
    cod_acta       : string;
    fecha_registro : string;
    fecha_registro_: Date;
    documentos     : string[];
    area           : string;
    nombre         : string;
    sellado        : boolean;
};

export type GetActaRecepcionsTableResponse = {
    rows: ActaRecepcionTableModel[];
    count: number;
};

type ActaRecepcionDetalleTableModel = {
    id            : string;
    nrodoc        : string;
    tipo          : string;
    nrofolio      : string;
    gestion       : string;
    descripcion   : string;
};

export type GetActaRecepcionDetalleTableResponse = {
    rows: ActaRecepcionDetalleTableModel[];
    count: number;
};

export type ActaRecepcionFormDataResponse = {
    id             : string;
    fecha_registro : Date;
    cod_acta       : string;
    estado         : boolean;
    observacion    : string;
    documentos?    : string[];
    documentos_id ?: string[] | null;
    area_id?       : string | null;
    personal_id?   : string | null;
};

export type ActaRecepcionDetalleFormDataResponse = {
    id                : string;
    nrodoc            : string;
    tipo              : string;
    nrofolio          : string;
    gestion           : string;
    descripcion       : string;
    acta_recepcion_id?: string | null;
};

export const ENUM_TIPO_DOCUMENTO = [
    { value: 'C31_CON', label: 'C31 Con imputacion' },
    { value: 'C31_SIN', label: 'C31 Sin imputacion' },
    { value: 'C21_CON', label: 'C21 Con imputacion' },
    { value: 'C21_SIN', label: 'C21 Sin imputacion' },
    { value: 'ASC_MAN', label: 'Asientos Manuales' },
    { value: 'OTROS', label: 'Otros' },
];
export class ActaRecepcionView {
    public async getActaRecepcionsTable(query: any): Promise<Result<GetActaRecepcionsTableResponse>> {
        let docRId = "";

        const existe = "documentos" in query;
        if (existe) {
            const value = query.documentos;

            delete query.documentos;

            const documentos = await DocumentoService.getAll({
                nro: value.trim(),
                _limit: 1,
            });

            if (documentos.isFailure) return Result.fail("Falló al obtener la documento");

            docRId = documentos.getValue()[0]?.id || "";
        }

        const acta_recepcion = await ActaRecepcionService.getAll();
        if (acta_recepcion.isFailure) return Result.fail("Falló al obtener la acta_recepcion");

        const actaRecepcionResult = acta_recepcion.getValue();

        let actaR = actaRecepcionResult;
        if (docRId !== "") {
            actaR = actaRecepcionResult.filter((ar) => ar.props.documentosId.includes(docRId));
        }

        const personalIds = uniqueValues(actaR.map((item) => item.props.personalId));
        const areaIds = uniqueValues(actaR.map((item) => item.props.areaId));
        const documentoIds = uniqueValues(
            actaR.reduce<string[]>((ids, item) => ids.concat(item.props.documentosId || []), [])
        );

        const personal = await (
            personalIds.length > 0
                ? PersonalService.getAll({ id: personalIds, _limit: personalIds.length })
                : Promise.resolve(Result.ok([]))
        );
        if (personal.isFailure) return Result.fail("Falló al obtener la personal");

        const areas = await (
            areaIds.length > 0
                ? AreaService.getAll({ id: areaIds, _limit: areaIds.length })
                : Promise.resolve(Result.ok([]))
        );
        if (areas.isFailure) return Result.fail("Falló al obtener la areas");

        const documentos = await (
            documentoIds.length > 0
                ? DocumentoService.getAll({ id: documentoIds, _limit: documentoIds.length })
                : Promise.resolve(Result.ok([]))
        );
        if (documentos.isFailure) return Result.fail("Falló al obtener la documento");

        const personalMap = buildEntityMap(personal.getValue().filter((a) => a.props.activo));
        const areasMap = buildEntityMap(areas.getValue().filter((a) => a.props.activo));
        const documentosMap = buildEntityMap(documentos.getValue());

        const result: ActaRecepcionTableModel[] = actaR.map((item) => {
            const nombre = personalMap.get(item.props.personalId)?.getNombreCompletoCI() || "";
            const area = areasMap.get(item.props.areaId)?.props.nombre || "";

            const documentosObject = item.props.documentosId || [];
            const documentos: any[] = [];

            documentosObject.forEach((e: any) => {
                const documento = documentosMap.get(e);
                if (documento) {
                    documentos.push({
                        id: documento.id,
                        nro: documento.props.nro + "-" + documento.props.gestion,
                    });
                }
            });

            return {
                id: String(item.id),
                cod_acta: item.props.codActa,
                documentos,
                fecha_registro_: item.props.fechaRegistro,
                fecha_registro: moment(item.props.fechaRegistro).format("DD/MM/YYYY").toString(),
                area,
                nombre,
                sellado: item.props.sellado,
            };
        }).sort((a, b) =>
            moment(a.fecha_registro_).toDate() < moment(b.fecha_registro_).toDate() ? 1 : -1
        );

        const response = findAndCountResult(result, query);
        return Result.ok(response);
    }

    public async getActaRecepcionDetalleTable(query: any): Promise<Result<GetActaRecepcionDetalleTableResponse>> {
        const param = query?.acta_recepcion_id || null;
        if ('acta_recepcion_id' in query) delete query.acta_recepcion_id;

        const acta_recepcion = await ActaRecepcionDetalleService.getAll();
        if (acta_recepcion.isFailure) return Result.fail("Falló al obtener la acta_recepcion_detalle");
        const actaRecepcionDetalleResult = acta_recepcion.getValue().filter((a) => a.props.actaRecepcionId === param);

        const result: ActaRecepcionDetalleTableModel[] = actaRecepcionDetalleResult.map((item) => {
            return {
                id         : String(item.id),
                nrodoc     : item.props.nrodoc,
                tipo       : item.props.tipo,
                nrofolio   : item.props.nrofolio,
                gestion    : item.props.gestion,
                descripcion: item.props.descripcion
            };
        });
        
        const response = findAndCountResult(result, query);
        
        return Result.ok(response);
    }    

    public async getActaRecepcionFormDataView(id_acta: string): Promise<Result<ActaRecepcionFormDataResponse>> {
        const acta_recepcion = await ActaRecepcionService.getById(id_acta);
        if (acta_recepcion.isFailure) {
            return Result.fail<ActaRecepcionFormDataResponse>("ActaRecepcion no encontrado");
        }

        const documentosR = await DocumentoService.getAll();
        if (documentosR.isFailure) return Result.fail("Falló al obtener la personal");
        const documentosResult = documentosR.getValue();

        const props = acta_recepcion.getValue().props;

        const documentosObject = props.documentosId || [];
        const documentos: any[] = [];            
        documentosObject.forEach((e: any) => {
            const documento = documentosResult.find((r) => r.id === e);
            if (documento) {
                const TIPO = ENUM_TIPO_DOCUMENTO.find((t) => t.value===documento.props.tipo)?.label || "-";
                const propsDocumento = {
                    id      : documento.id,
                    nro     : documento.props.nro+'-'+TIPO+'-'+documento.props.nrofolio+'-'+documento.props.gestion,
                };
                documentos.push(propsDocumento);
            }
        });

        const result: ActaRecepcionFormDataResponse = {
            id            : acta_recepcion.getValue().id,
            fecha_registro: props.fechaRegistro,
            estado        : props.estado,
            cod_acta      : props.codActa,
            observacion   : props.observacion,
            documentos_id : props.documentosId,
            documentos    : documentos, 
            personal_id   : props.personalId,
            area_id       : props.areaId,
        };

        return Result.ok(result);
    }  

    public async getActaRecepcionDetalleFormDataView(id_acta: string): Promise<Result<ActaRecepcionDetalleFormDataResponse>> {
        const acta_recepcion = await ActaRecepcionDetalleService.getById(id_acta);
        if (acta_recepcion.isFailure) {
            return Result.fail<ActaRecepcionDetalleFormDataResponse>("Acta Recepcion no encontrado");
        }

        const props = acta_recepcion.getValue().props;
        const result: ActaRecepcionDetalleFormDataResponse = {
            id            : acta_recepcion.getValue().id,
            nrodoc            : props.nrodoc,
            tipo              : props.tipo,
            nrofolio          : props.nrofolio,
            gestion           : props.gestion,
            descripcion       : props.descripcion,
            acta_recepcion_id : props.actaRecepcionId,
        };

        return Result.ok(result);
    }   

    public async getPDFActa(authUser: AuthUser, params: string): Promise<Result<any>> {    
        const ID_USUARIO = authUser.uid;
        const ID_ACTA = params;
        const usuario = await UsuarioService.getById(ID_USUARIO);
        if (usuario.isFailure) throw new Error(String(usuario.error));
        const NOMBRE_USUARIO = usuario.getValue().getNombreCompleto();
        const EMAIL_USUARIO = usuario.getValue().props.email;

        const acta_recepcion = await ActaRecepcionService.getById(ID_ACTA);
        if (acta_recepcion.isFailure) {
            return Result.fail<ActaRecepcionFormDataResponse>("ActaRecepcion no encontrado");
        }
        const props = acta_recepcion.getValue().props;
        
        const personal = await PersonalService.getAll();
        if (personal.isFailure) return Result.fail("Falló al obtener la personal");
        const personalResult = personal.getValue().filter((a) => a.props.activo).find((p) => p.id === props.personalId);

        const areas = await AreaService.getAll();
        if (areas.isFailure) return Result.fail("Falló al obtener la areas");
        const areasResult = areas.getValue().filter((a) => a.props.activo).find((a) => a.id === props.areaId);
                
        const NOMBRE = personalResult?.getNombreCompleto();
        const AREA = areasResult?.props.nombre;
        const FECHA_REGISTRO = props.fechaRegistro?moment(props.fechaRegistro).locale('es').format('dddd D [de] MMMM [de] YYYY hh:mm:ss a').toString(): "";
        //const TIPO_DOC = ENUM_TIPO_DOCUMENTO.find((a) => a.value ===props.tipo)?.label || "";

        const actaR = await ActaRecepcionDetalleService.getAll();
        if (actaR.isFailure) return Result.fail(actaR.error);
        const actaRecepcionDetalleResult = actaR.getValue().filter((ad) => ad.props.actaRecepcionId===ID_ACTA);

        const documentArray: any[] = [];
        actaRecepcionDetalleResult.forEach((ar) => {
            const nrodoc      = ar.props.nrodoc;
            const nrodocArray = nrodoc.split(',');
            
            const tipo        = ar.props.tipo;
            const gestion     = ar.props.gestion;
            const nrofolio    = ar.props.nrofolio;
            const descripcion = ar.props.descripcion;

            if(nrodocArray.length>0){
                for(let i=0; i<nrodocArray.length; i++){
                    documentArray.push({ nro: nrodocArray[i], tipo: tipo, gestion: gestion, nrofolio: nrofolio, descripcion: descripcion });
                }
            }
            else {
                documentArray.push({ nro: nrodoc, tipo: tipo, gestion: gestion, nrofolio: nrofolio, descripcion: descripcion });
            }
        });
         
        const result = {
            info: {
                codigo: `${props.codActa}-|-${documentArray.length} Documentos-|-${FECHA_REGISTRO}-|-${NOMBRE}-|-${AREA}`,
                nombre: NOMBRE_USUARIO,
                email : EMAIL_USUARIO
            },
            data: {
                area          : AREA,
                personal      : NOMBRE,
                cod_acta      : props.codActa,            
                observacion   : props.observacion,
                fecha_registro: FECHA_REGISTRO,
                rows:   documentArray.map((item)=> {
                    const TIPO = ENUM_TIPO_DOCUMENTO.find((t) => t.value===item.tipo)?.label || "-";
                    return {
                        nro        : item.nro,
                        tipo       : TIPO,
                        gestion    : item.gestion,
                        nrofolio   : item.nrofolio,
                        descripcion: item.descripcion                        
                    }
                }).sort((a, b) => a.nro > b.nro ? 1 : -1),                
            } 
        };
        return Result.ok(result);
    }
}
