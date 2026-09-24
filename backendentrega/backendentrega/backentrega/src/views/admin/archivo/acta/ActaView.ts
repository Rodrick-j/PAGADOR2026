import { Result } from "../../../../base/types/Result";
import moment from "moment";

import { buildEntityMap, calcularDias, findAndCountResult, queryStringToArray, uniqueValues } from "../../../../tools/util";

import ActaService from "../../../../core/admin/archivo/acta";
import DocumentoService from "../../../../core/admin/archivo/documento";
import ActaRecepcionService from "../../../../core/admin/archivo/acta_recepcion";

import PersonalService from "../../../../core/rrhh/personal";
import AreaService from "../../../../core/rrhh/area";
import { DocumentoOptionsFormModel } from "../documento/DocumentoView";
import UsuarioService from "../../../../core/system/autenticacion/usuario";
import { AuthUser } from "../../../../base/types/AuthUser";
import { ENUM_TIPO_ACTA, ENUM_TIPO_ACTA2, ENUM_TIPO_DOCUMENTO } from "../../../../base/constants/enum";

type ActaTableModel = {
    id              : string;
    cod_acta        : string;
    tipo            : string;
    dias            : string;
    fecha_registro  : string;
    fecha_devolucion: string;
    descripcion     : string;
    documentos      : string[];
    adjuntos?       : string;
    area            : string;
    nombre          : string;
};

type ActaReporteTableModel = {
    id              : string;
    cod_acta        : string;
    tipo            : string;
    dias            : string;
    fecha_registro  : string;
    fecha_devolucion: string;
    descripcion     : string;
    documentos      : string[];
    adjuntos?       : string;
    area            : string;
    nombre          : string;
};

export type ReportFilters = {
    tipo        ?: string;
    nombre      ?: string;
    telefono    ?: string;
    direccion   ?: string;

    _limit?: string;
    _page?: string;
    q?: string;
};

export type GetActasTableResponse = {
    rows: ActaTableModel[];
    count: number;
};

export type GetActasReporteTableResponse = {
    rows: ActaReporteTableModel[];
    count: number;
};

export type ActaFormDataResponse = {
    id                  : string;
    cod_acta            : string;
    fecha_devolucion    : Date | null;
    tipo                : string;
    dias                : number;
    descripcion         : string;
    estado              : boolean;
    externo             : boolean;
    descripcion_externo : string;
    adjuntos            : string;
    documentos_id      ?: string[] | null;
    area_id?            : string | null;
    personal_id?        : string | null;    
};

export type ActaOptionsFormModel = {
    documentos_id: DocumentoOptionsFormModel[];
    personal_id  : string;
    area_id      : string;
};

export type ActaItem = {
    id              : string;
    cod_acta        : string;
    tipo            : string;
    dias            : string;
    fecha_registro  : string;
    fecha_devolucion: string;
    descripcion     : string;
    documentos      : string[];
    adjuntos?       : string;
    area            : string;
    nombre          : string;
};

export type InfoDocumentoModel = {
    nombre: string;
    email : string;
    fecha : string;
    codigo: string;
};

export type ActaData = {
    rows: ActaItem[];
};

export type ActaDataResponse = {
    info?: InfoDocumentoModel;
    actas?: ActaData;
};

export class ActaView {
    public async getActasTable(query: any): Promise<Result<GetActasTableResponse>> {

        const acta = await ActaService.getAll(query);
        if (acta.isFailure) return Result.fail("Falló al obtener la acta");
        const actaResult = acta.getValue();

        const documentoIds = uniqueValues(
            actaResult.reduce<string[]>((ids, item) => ids.concat(item.props.documentosId || []), []),
        );

        const personal = await PersonalService.getAll();
        if (personal.isFailure) return Result.fail("Falló al obtener la personal");

        const areas = await AreaService.getAll();
        if (areas.isFailure) return Result.fail("Falló al obtener la areas");
        
        const documentos = await (
            documentoIds.length > 0 ? DocumentoService.getAll({ id: documentoIds, _limit: documentoIds.length }) : Promise.resolve(Result.ok([]))
        );
        if (documentos.isFailure) return Result.fail("Falló al obtener la personal");
        

        const personalResult = personal.getValue().filter((a) => a.props.activo);
        const areasResult = areas.getValue().filter((a) => a.props.activo);
        const documentosMap = buildEntityMap(documentos.getValue());
        const personalMap = buildEntityMap(personalResult);
        const areasMap = buildEntityMap(areasResult);

        const result: ActaTableModel[] = actaResult.map((item) => {
            const nombre = personalMap.get(item.props.personalId)?.getNombreCompletoCI() || "";
            const area = areasMap.get(item.props.areaId)?.props.nombre || "";
            const documentosObject = item.props.documentosId || [];
            const documentos: any[] = [];
            documentosObject.forEach((e: any) => {
                const documento = documentosMap.get(e);
                if (documento) {
                    const propsDocumento = {
                        id      : documento.id,
                        nro     : documento.props.nro+'-'+documento.props.gestion,
                    };
                    documentos.push(propsDocumento);
                }
            });
            return {
                id              : String(item.id),
                cod_acta        : item.props.codActa,
                tipo            : item.props.tipo,
                dias            : String(item.props.dias)+" dias.",
                descripcion     : item.props.descripcion,
                documentos      : documentos,
                adjuntos        : `${JSON.stringify(item.props.adjuntos)}`,
                fecha_registro  : moment(item.props.fechaRegistro).format("DD/MM/YYYY HH:mm").toString(),
                fecha_devolucion: item.props.fechaDevolucion && moment(item.props.fechaDevolucion).format("DD/MM/YYYY HH:mm").toString() || "",
                area            : area,
                nombre          : nombre,
            };
        });
        
        const count = await ActaService.countAllExact(query);
        
        return Result.ok<GetActasTableResponse>({
            rows: result,
            count
        });
    }

    public async getActasReporteTable(query: any): Promise<Result<GetActasReporteTableResponse>> {

        const acta = await ActaService.getAll();
        if (acta.isFailure) return Result.fail("Falló al obtener la acta");
        const actaResult = acta.getValue();

        const acta_recepcion = await ActaRecepcionService.getAll();
        if (acta_recepcion.isFailure) return Result.fail("Falló al obtener la acta_recepcion");
        const actaRecepcionResult = acta_recepcion.getValue();

        const documentos = await DocumentoService.getAll();
        if (documentos.isFailure) return Result.fail("Falló al obtener la personal");
        const documentosResult = documentos.getValue();
        
        const personal = await PersonalService.getAll();
        if (personal.isFailure) return Result.fail("Falló al obtener la personal");
        const personalResult = personal.getValue().filter((a) => a.props.activo);

        const areas = await AreaService.getAll();
        if (areas.isFailure) return Result.fail("Falló al obtener la areas");
        const areasResult = areas.getValue().filter((a) => a.props.activo);

        const combinedArray: any[] = [...actaResult, ...actaRecepcionResult];

        const result: ActaTableModel[] = combinedArray.map((item) => {
            const nombre = personalResult.find((p) => p.id === item.props.personalId)?.getNombreCompletoCI() || "";
            const area = areasResult.find((a) => a.id === item.props.areaId)?.props.nombre || "";
            const documentosObject = item.props.documentosId || [];
            const documentos: any[] = [];
            documentosObject.forEach((e: any) => {
                const documento = documentosResult.find((r) => r.id === e);
                if (documento) {
                    const propsDocumento = {
                        id      : documento.id,
                        nro     : documento.props.nro+'-'+documento.props.gestion,
                    };
                    documentos.push(propsDocumento);
                }
            });
            return {
                id              : String(item.id),
                cod_acta        : item.props.codActa,
                tipo            : item.props.codActa.indexOf('REC')>0?'ACT_REC':item.props.tipo,
                dias            : item.props.dias?String(item.props.dias)+" dias.":'-',
                descripcion     : item.props.descripcion,
                documentos      : documentos,
                adjuntos        : item.props.adjuntos?`${JSON.stringify(item.props.adjuntos)}`:`[]`,
                fecha_registro  : moment(item.props.fechaRegistro).format("DD/MM/YYYY").toString(),
                fecha_devolucion: item.props.fechaDevolucion && moment(item.props.fechaDevolucion).format("DD/MM/YYYY").toString() || "",
                area            : area,
                nombre          : nombre,
            };
        }).sort((a, b) => b.cod_acta < a.cod_acta ? 1 : -1);
        
        const response = findAndCountResult(result, query);
        return Result.ok(response);
    }    

    public async getActaFormDataView(id_acta: string): Promise<Result<ActaFormDataResponse>> {
        const acta = await ActaService.getById(id_acta);
        if (acta.isFailure) {
            return Result.fail<ActaFormDataResponse>("Acta no encontrado");
        }

        const props = acta.getValue().props;
        const result: ActaFormDataResponse = {
            id                 : acta.getValue().id,
            cod_acta           : props.codActa,
            fecha_devolucion   : props.fechaDevolucion || null,
            dias               : props.dias,
            tipo               : props.tipo,
            descripcion        : props.descripcion,
            estado             : props.estado,
            externo            : props.externo,
            descripcion_externo: props.descripcionExterno,
            documentos_id      : props.documentosId,
            adjuntos           : `${JSON.stringify(props.adjuntos)}`,
            personal_id        : props.personalId,
            area_id            : props.areaId,
        };

        return Result.ok(result);
    }

    public async getAllActaDocumento(nro: string): Promise<Result<ActaOptionsFormModel>> {
        const documento = await DocumentoService.getAll();
        const documentoList = documento.getValue();
        
        let filteredDocs = documentoList.filter(d => d.props.estado === 'ACT_PRE');
        let personal_id = "";
        let area_id = "";
        if (nro) {
            const actas = await ActaService.getAll();
            const actasResult = actas.getValue().filter(f => f.props.tipo==='ACT_PRE').find(a => a.props.codActa===nro.toUpperCase());
            if(actasResult) {
                filteredDocs = filteredDocs.filter(n => actasResult.props.documentosId.includes(n.id));
                personal_id  = actasResult.props.personalId;
                area_id      = actasResult.props.areaId;
            }
        }
    
        const resultDocumento = filteredDocs.map(item => ({
            id      : item.id.toString(),
            nombre  : `${item.props.nro} - ${item.props.gestion} - ${item.props.tipo}`,
            concepto: item.props.hojasRuta || ''
        })).sort((a, b) => (a.nombre > b.nombre ? 1 : -1));

        const result: ActaOptionsFormModel = {
            documentos_id: resultDocumento,
            personal_id,
            area_id
        }
    
        return Result.ok(result);
    }

    public async getPDFActa(authUser: AuthUser, params: string, tipo: any): Promise<Result<any>> {    
        const ID_USUARIO = authUser.uid;
        const id_acta = params;
        const NOMBRE_ACTA = ENUM_TIPO_ACTA.find((a) => a.value ===tipo)?.label || "";
                
        const usuario = await UsuarioService.getById(ID_USUARIO);
        if (usuario.isFailure) throw new Error(String(usuario.error));
        const NOMBRE_USUARIO = usuario.getValue().getNombreCompleto();
        const EMAIL_USUARIO = usuario.getValue().props.email;

        const acta = await ActaService.getById(id_acta);
        if (acta.isFailure) {
            return Result.fail<ActaFormDataResponse>("Acta no encontrado");
        }
        const props = acta.getValue().props;
                
        const DOCUMENTOS_IDS = props.documentosId;
        const documentos = await DocumentoService.getAll();
        if (documentos.isFailure) return Result.fail("Falló al obtener la personal");
        const documentosResult = documentos.getValue().filter((d) => DOCUMENTOS_IDS.includes(d.id));        
        
        let AREA = props.descripcionExterno;
        let NOMBRE = "Externo";
        if(!props.externo){
            const personal = await PersonalService.getAll();
            if (personal.isFailure) return Result.fail("Falló al obtener la personal");
            const personalResult = personal.getValue().filter((a) => a.props.activo).find((p) => p.id === props.personalId);

            const areas = await AreaService.getAll();
            if (areas.isFailure) return Result.fail("Falló al obtener la areas");
            const areasResult = areas.getValue().filter((a) => a.props.activo).find((a) => a.id === props.areaId);
            AREA = areasResult?.props.nombre || "";
            NOMBRE = personalResult?.getNombreCompleto() || "";
        }
                
        const TIPO_ACTA = ENUM_TIPO_DOCUMENTO.find((a) => a.value ===props.tipo)?.label || "";
        const FECHA_REGISTRO = props.fechaRegistro?moment(props.fechaRegistro).locale('es').format('dddd D [de] MMMM [de] YYYY hh:mm:ss a').toString(): "";
        const FECHA_DEVOLUCION = props.fechaDevolucion?moment(props.fechaDevolucion).format("DD/MM/YYYY HH:mm").toString(): "";
        let dias = 0;
        if(props.fechaDevolucion){
            dias = calcularDias(props.fechaRegistro, props.fechaDevolucion);
        }

        const result = {
            info: {
                codigo: `${NOMBRE}-|-${AREA}-|-${props.codActa}-|-${TIPO_ACTA}-|-${FECHA_REGISTRO}`,
                nombre: NOMBRE_USUARIO,                
                email: EMAIL_USUARIO, 
                acta: NOMBRE_ACTA
            },
            data: {
                area               : AREA,
                personal           : NOMBRE,
                cod_acta           : props.codActa,
                tipo               : TIPO_ACTA,
                adjunto            : props.adjuntos.length+" archivo(s) digital(es)",
                fecha_registro     : FECHA_REGISTRO,
                fecha_devolucion   : FECHA_DEVOLUCION,
                observacion        : props.descripcion,
                externo            : props.externo,
                descripcion_externo: props.descripcionExterno,
                dias               : dias,
                rows:   documentosResult.map((item)=> {
                    const TIPO_DOC = ENUM_TIPO_DOCUMENTO.find((a) => a.value ===item.props.tipo)?.label;
                    return {
                        nro        : item.props.nro,
                        tipo       : TIPO_DOC,
                        gestion    : item.props.gestion,
                        nrofolio   : item.props.nrofolio                        
                    }
                }).sort((a, b) => a.nro > b.nro ? 1 : -1),                
            }
        };
        return Result.ok(result);
    }

    public async getPDFActa2(authUser: AuthUser, queryString: string): Promise<Result<ActaDataResponse>> {    
        
        const resultObject = queryStringToArray(queryString);
        
        const result = {
            info: await this.getInfoActa(authUser, resultObject),
            data: await this.getActaData(resultObject)
        };
        
        return Result.ok(result);
    }

    private async getInfoActa(authUser: AuthUser, queryString: ReportFilters): Promise<InfoDocumentoModel | undefined> {
        const ID_USUARIO = authUser.uid;
        const usuario = await UsuarioService.getById(ID_USUARIO);
        if (usuario.isFailure) throw new Error(String(usuario.error));
        const NOMBRE_USUARIO = usuario.getValue().getNombreCompleto();
        const EMAIL_USUARIO = usuario.getValue().props.email;
        
        const inputObj: any = queryString;
        const hoy = new Date();
        const gestion = hoy.getFullYear().toString();
        const tipo = inputObj.tipo || null;
        const FECHA_REGISTRO = moment(hoy).locale('es').format('dddd D [de] MMMM [de] YYYY hh:mm:ss a').toString();
        const codigo = `${gestion}-|-${tipo}-|-${FECHA_REGISTRO}`;
        return {
            codigo: codigo,
            nombre: NOMBRE_USUARIO,                
            fecha: FECHA_REGISTRO,                
            email: EMAIL_USUARIO
        }
    }

    private async getActaData(queryString?: ReportFilters): Promise<ActaData | undefined> {
        
        const acta = await ActaService.getAll();
        if (acta.isFailure) return undefined;
        const actaResult = acta.getValue();

        const acta_recepcion = await ActaRecepcionService.getAll();
        if (acta_recepcion.isFailure) return undefined;
        const actaRecepcionResult = acta_recepcion.getValue();

        const combinedArray: any[] = [...actaResult, ...actaRecepcionResult];

        const personal = await PersonalService.getAll();
        if (personal.isFailure) return undefined;
        const personalResult = personal.getValue().filter((a) => a.props.activo);

        const areas = await AreaService.getAll();
        if (areas.isFailure) return undefined;
        const areasResult = areas.getValue().filter((a) => a.props.activo);

        const documentos = await DocumentoService.getAll();
        if (documentos.isFailure) return undefined;
        const documentosResult = documentos.getValue();

        const result: ActaTableModel[] = combinedArray.map((item) => {
            const nombre = personalResult.find((p) => p.id === item.props.personalId)?.getNombreCompletoCI() || "";
            const area = areasResult.find((a) => a.id === item.props.areaId)?.props.nombre || "";
            const documentosObject = item.props.documentosId || [];
            const documentos: any[] = [];
            documentosObject.forEach((e: any) => {
                const documento = documentosResult.find((r) => r.id === e);
                if (documento) {
                    const propsDocumento = {
                        id      : documento.id,
                        nro     : documento.props.nro+'-'+documento.props.gestion,
                    };
                    documentos.push(propsDocumento);
                }
            });
            const tipo = item.props.codActa.indexOf('REC')>0?'ACT_REC':item.props.tipo;
            
            return {
                id              : String(item.id),
                cod_acta        : item.props.codActa,
                tipo            : tipo,
                tipo_           : ENUM_TIPO_ACTA2.find((t) => t.value===tipo)?.label || "-",
                dias            : item.props.dias?String(item.props.dias)+" dias.":'-',
                descripcion     : item.props.descripcion,
                documentos      : documentos,
                fecha_          : item.props.fechaRegistro,
                fecha_registro  : moment(item.props.fechaRegistro).format("DD/MM/YYYY").toString(),
                fecha_devolucion: item.props.fechaDevolucion && moment(item.props.fechaDevolucion).format("DD/MM/YYYY").toString() || "",
                area            : area,
                nombre          : nombre,
            };
        }).sort((a, b) => b.cod_acta < a.cod_acta ? 1 : -1);
        
        const response = findAndCountResult(result, queryString);

        const result1: ActaData = {
            rows: response.rows,
        };
        return result1;
    }

}
