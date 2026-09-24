import { Result } from "../../../../base/types/Result";
import moment from "moment";
import { Column } from "exceljs";
import { Op } from "sequelize";
import { findAndCountResult, formatearNumero, queryStringToArray } from "../../../../tools/util";
import { Database } from "../../../../Database";
import DocumentoService from "../../../../core/admin/archivo/documento";
import { AuthUser } from "../../../../base/types/AuthUser";
import UsuarioService from "../../../../core/system/autenticacion/usuario";
import { ENUM_TIPO_DOCUMENTO } from "../../../../base/constants/enum";
import { DocumentoAdjunto } from "../../../../core/admin/archivo/documento/DocumentoEntity";

export type ReportFilters = {
    tipo        ?: string;
    nombre      ?: string;
    telefono    ?: string;
    direccion   ?: string;

    _limit?: string;
    _page?: string;
    q?: string;
};

type DocumentoTableModel = {
    id: string;
    nro        : number;
    tipo       : string;
    gestion    : string;
    fecha      : string;
    fecha_?    : Date;
    estado     : string;
    descripcion: string;
    doc_adjunto: string;
    hojas_ruta : string;
    grupo_gasto: string;
    ubicacion  : string;
    monto      : string;
    nrofolio   : string;
    adjuntos   : string;
};

export type GetDocumentosTableResponse = {
    rows: DocumentoTableModel[];
    count: number;
};

export type DocumentoFormDataResponse = {
    id: string;
    nro        : number;
    tipo       : string;
    gestion    : string;
    nrofolio   : string;
    fecha      : Date;
    estado     : string;
    permiso    : string;
    hojas_ruta : string | null;
    grupo_gasto: string | null;
    descripcion: string | null;
    doc_adjunto: string | null;
    ubicacion  : string | null;
    monto      : number | string;
    adjuntos   : string;
};

export type DocumentoOptionsFormModel = {
    id      : string;
    nombre  : string;
    concepto: string;
};

export type DocumentoItem = {
    id     : string;
    nro        : number;
    tipo       : string;
    tipo_      : string;
    descripcion: string;
    doc_adjunto: string;
    gestion    : string;
    fecha      : string;
    hojas_ruta : string;
    grupo_gasto: string;
    estado     : string;
    ubicacion  : string;
    nrofolio   : string;
    adjuntos   : string;
    monto?     : string;
    archivo_adjunto?: string;
};

export type InfoDocumentoModel = {
    nombre: string;
    email : string;
    fecha : string;
    codigo: string;
};

export type DocumentoData = {
    rows: DocumentoItem[];
    count: number;
};

export type DocumentoDataResponse = {
    info?: InfoDocumentoModel;
    documentos?: DocumentoData;
};

export type DocumentoDataResponseJson = {
    info?: InfoDocumentoModel;
    data?: DocumentoData;
};

export type ReportGeneral = {
    id: string;
    nro        : number;
    tipo       : string;
    gestion    : string;
    fecha      : string;
    fecha_?    : Date;
    estado     : string;
    descripcion: string;
    doc_adjunto: string;
    hojas_ruta : string;
    grupo_gasto: string;
    ubicacion  : string;
    monto      : string;
    nrofolio   : string;
    adjuntos   : string;
    archivo_adjunto? : string;

}

function getAdjuntoFileName(item: DocumentoAdjunto): string {
    if (typeof item === 'string') return item;
    return item.fileName;
}

function getAdjuntoDisplayName(item: DocumentoAdjunto): string {
    const fileName: string = getAdjuntoFileName(item);
    return fileName.replace(/^[0-9a-fA-F-]{36}-/, '');
}

function getEstadosDocumentoParaActa(tipo: string): string[] {
    if (tipo === 'ACT_DEV') return ['ACT_PRE'];
    if (tipo === 'ACT_PRE') return ['ACT_DEV', 'ACT_REC'];
    if (tipo === 'ACT_REC') return ['-'];
    return [];
}

function normalizeQueryArray(value: unknown): string[] {
    if (Array.isArray(value)) return value.map((item) => String(item)).filter(Boolean);
    if (typeof value === 'string' && value.trim()) return value.split(',').map((item) => item.trim()).filter(Boolean);
    return [];
}

function buildDocumentoOption(item: any): DocumentoOptionsFormModel & { nro_: number } {
    const TIPO = ENUM_TIPO_DOCUMENTO.find((e) => e.value === item.tipo)?.label || "-";

    return {
        id      : item.id.toString(),
        nro_    : Number(item.nro),
        nombre  : `${item.nro}`,
        concepto: `${TIPO} - ${item.gestion} - ${item.hojas_ruta || ''}`,
    };
}

export class DocumentoView {
    public async getDocumentosTable(query: any): Promise<Result<GetDocumentosTableResponse>> {
        const documento = await DocumentoService.getAll(query);
        if (documento.isFailure) return Result.fail("Falló al obtener la documento");
        const documentoResult = documento.getValue();
        
        const result: DocumentoTableModel[] = documentoResult.map((item) => {                
            return {
                id: String(item.id),
                nro        : item.props.nro,
                tipo       : item.props.tipo,
                fecha      : item.props.fecha?moment(item.props.fecha).format("DD/MM/YYYY").toString():'-',
                fecha_     : item.props.fecha,
                gestion    : item.props.gestion,
                nrofolio   : item.props.nrofolio,
                estado     : item.props.estado,
                permiso    : item.props.permiso,
                descripcion: item.props.descripcion || '',
                doc_adjunto: item.props.docAdjunto || '',
                hojas_ruta : item.props.hojasRuta || '',
                grupo_gasto: item.props.grupoGasto || '',
                ubicacion  : item.props.ubicacion || '',
                monto      : formatearNumero(Number(item.props.monto),'en-US'),
                adjuntos   : `${JSON.stringify(item.props.adjuntos)}`,
            };
        });
        const count = await DocumentoService.countAllExact(query);
        
        return Result.ok<GetDocumentosTableResponse>({
            rows: result,
            count
        });
    }

    public async getDocumentosTable2(query: any): Promise<Result<GetDocumentosTableResponse>> {
        const documento = await DocumentoService.getAll(query);
        if (documento.isFailure) return Result.fail("Falló al obtener la documento");
        const documentoResult = documento.getValue().filter((d) => d.props.estado!=='-');

        const result: DocumentoTableModel[] = documentoResult.map((item) => {
            return {
                id: String(item.id),
                nro        : item.props.nro,
                tipo       : item.props.tipo,
                fecha      : moment(item.props.fecha).format("DD/MM/YYYY").toString(),
                fecha_     : item.props.fecha,
                gestion    : item.props.gestion,
                nrofolio   : item.props.nrofolio,
                estado     : item.props.estado,
                permiso    : item.props.permiso,
                descripcion: item.props.descripcion || '',
                doc_adjunto: item.props.docAdjunto || '',
                hojas_ruta : item.props.hojasRuta || '',
                grupo_gasto: item.props.grupoGasto || '',
                ubicacion  : item.props.ubicacion || '',
                monto      : formatearNumero(Number(item.props.monto),'en-US'),
                adjuntos   : `${JSON.stringify(item.props.adjuntos)}`,
            };
        }).sort((a, b) => a.nro > b.nro ? 1 : -1)
        const count = await DocumentoService.countAllExact(query);
        
        return Result.ok<GetDocumentosTableResponse>({
            rows: result,
            count
        });
    }

    public async getDocumentoFormDataView(id_documento: string): Promise<Result<DocumentoFormDataResponse>> {
        const documento = await DocumentoService.getById(id_documento);
        if (documento.isFailure) {
            return Result.fail<DocumentoFormDataResponse>("Documento no encontrado");
        }

        const props = documento.getValue().props;
        const result: DocumentoFormDataResponse = {
            id         : documento.getValue().id,
            nro        : props.nro,
            tipo       : props.tipo,
            gestion    : props.gestion,
            fecha      : props.fecha,
            estado     : props.estado,
            permiso    : props.permiso,
            nrofolio   : props.nrofolio,
            descripcion: props.descripcion || '',
            doc_adjunto: props.docAdjunto || '',
            hojas_ruta : props.hojasRuta || '',
            grupo_gasto: props.grupoGasto || '',
            ubicacion  : props.ubicacion || '',
            monto      : props.monto || '',
            adjuntos   : `${JSON.stringify(props.adjuntos)}`,
        };

        return Result.ok(result);
    }

    public async getAllDocumento(tipo: string, query: any = {}): Promise<Result<{ rows: DocumentoOptionsFormModel[]; count: number }>> {
        const estados = getEstadosDocumentoParaActa(tipo);
        if (estados.length === 0) return Result.ok({ rows: [], count: 0 });

        const limit = Math.min(Number(query._limit || 25), 50);
        const page = Math.max(Number(query._page || 1), 1);
        const q = String(query.q || '').trim();

        const where: any = { estado: { [Op.in]: estados } };

        if (q) {
            const search: any[] = [
                { gestion: { [Op.like]: `%${q}%` } },
                { tipo: { [Op.like]: `%${q}%` } },
                { hojas_ruta: { [Op.like]: `%${q}%` } },
            ];

            const nro = Number(q);
            if (Number.isFinite(nro)) search.push({ nro });

            where[Op.or] = search;
        }

        const db = Database.getInstance();
        const result = await db.models.documento.findAndCountAll({
            raw       : true,
            attributes: ['id', 'nro', 'tipo', 'gestion', 'hojas_ruta'],
            where,
            order     : [['nro', 'ASC']],
            limit,
            offset    : (page - 1) * limit,
        });

        const rows = result.rows.map(buildDocumentoOption);

        return Result.ok({ rows, count: result.count });
    }

    public async getAllDocumento2(query: any = {}): Promise<Result<{ rows: DocumentoOptionsFormModel[]; count: number }>> {
        const ids = normalizeQueryArray(query.ids);
        const db = Database.getInstance();

        const where = ids.length > 0 ? { id: { [Op.in]: ids } } : {};
        const limit = ids.length > 0 ? ids.length : Math.min(Number(query._limit || 25), 50);
        const page = Math.max(Number(query._page || 1), 1);

        const result = await db.models.documento.findAndCountAll({
            raw       : true,
            attributes: ['id', 'nro', 'tipo', 'gestion', 'hojas_ruta'],
            where,
            order     : [['nro', 'ASC']],
            limit,
            offset    : ids.length > 0 ? 0 : (page - 1) * limit,
        });

        const rows = result.rows.map(buildDocumentoOption);

        return Result.ok({ rows, count: result.count });
    }

    public async getPDFDocument(authUser: AuthUser, queryString: string): Promise<Result<DocumentoDataResponse>> {    
        
        const query = queryStringToArray(queryString);

        const result = {
            info: await this.getInfoDocumento(authUser, query),
            data: await this.getDocumentoData(query),
        };
        return Result.ok(result);
    }
    

    private async getInfoDocumento(authUser: AuthUser, queryString: ReportFilters): Promise<InfoDocumentoModel | undefined> {
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

    private async getDocumentoData(query?: string): Promise<DocumentoData | undefined> {

        const documento = await DocumentoService.getAll();
        if (documento.isFailure) return undefined;

        const documentoResult = documento.getValue().filter((d) => d.props.estado!=='-');
                
        const result: DocumentoItem[] = documentoResult.map((item) => {            
            const tipo: string = ENUM_TIPO_DOCUMENTO.find((t) => t.value===item.props.tipo)?.label || "-";
            let adj = '';
            item.props.adjuntos && item.props.adjuntos.forEach((adjunto: DocumentoAdjunto) => {
                                                                    adj += `${getAdjuntoDisplayName(adjunto)}, `;
                                                                });
            return {
                id         : String(item.id),
                nro        : Number(item.props.nro),
                tipo_      : tipo,
                tipo       : item.props.tipo,
                gestion    : item.props.gestion,
                estado     : item.props.estado,
                nrofolio   : item.props.nrofolio,                
                descripcion: item.props.descripcion || '',
                doc_adjunto: item.props.docAdjunto || '',
                hojas_ruta : item.props.hojasRuta || '',
                grupo_gasto: item.props.grupoGasto || '',
                ubicacion  : item.props.ubicacion || '',
                fecha      : moment(item.props.fecha).format("DD/MM/YYYY").toString(),
                monto      : formatearNumero(Number(item.props.monto),'en-US'),
                adjuntos   : item.props.adjuntos && item.props.adjuntos.length > 0?'SI':'NO',
                archivo_adjunto   : adj,
            };
        }).sort((a, b) => a.nro > b.nro ? 1 : -1);
        
        const response = findAndCountResult(result, query);
        const result1: DocumentoData = {
            rows: response.rows,
            count: response.count
        }
        return result1;
    }


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async generarFilasExcel(authUser: AuthUser, queryString: any, id?: string): Promise<Result<DocumentoDataResponseJson>> {
        const resultObject = queryStringToArray(queryString);
        
        const info = await this.getInfoDocumentoData(authUser, resultObject); // Datos generales    
        const data = await this.getDocumentoData(resultObject); 
		
        //  Asegúrate que este `data` sea un ARRAY de objetos planos
        // con los campos que deseas mostrar en el Excel.
        return Result.ok({
            info,
            data
        });
    }

    private async getInfoDocumentoData(authUser: AuthUser, queryString: ReportFilters): Promise<InfoDocumentoModel | undefined> {

    const ID_USUARIO = authUser.uid;
        const usuario = await UsuarioService.getById(ID_USUARIO);		
        if (usuario.isFailure) throw new Error(String(usuario.error));
        const NOMBRE_USUARIO = usuario.getValue().getNombreCompleto();	
        const EMAIL_USUARIO = usuario.getValue().props.email;
        
        const inputObj: any = queryString;
		
		const hoy = new Date();
        const gestion = hoy.getFullYear().toString();
        const tipo = inputObj.tipo_reporte || null;		

        const FECHA_REGISTRO = moment(hoy).locale('es').format('dddd D [de] MMMM [de] YYYY hh:mm:ss a').toString();	
        const codigo = `${gestion}-|-${tipo}-|-${FECHA_REGISTRO}`;
	
        return {
            codigo    : codigo,
            nombre    : NOMBRE_USUARIO,
            fecha     : FECHA_REGISTRO,
            email     : EMAIL_USUARIO
        }
}

public generarHeadExcel() {   
    
    const headList : Partial<Column>[] =  [];

    headList.push( { header: 'Nro Doc', key: 'nro', width: 25 },
        { header: 'Tipo', key: 'tipo', width: 50 },
        { header: 'Gestion', key: 'gestion', width: 25 },       
        { header: 'Monto', key: 'monto', width: 50 },     
        { header: 'Archivos Adjuntos', key: 'doc_adjunto', width: 75 },      
        )
     
        return headList;   
		
	
   
 }

 public getFormatData(data: DocumentoData | undefined)  {
     
     const listaData : ReportGeneral[] = [];
     if(data != null && data != undefined && data.rows.length >0){
         for (let i = 0; i < data.rows.length; i++) {
             const item : ReportGeneral = {
                 nro            : Number(data.rows[i].nro),
                 tipo           : String(data.rows[i].tipo_),
                 gestion        : String(data.rows[i].gestion),
                 fecha          : String(data.rows[i].fecha),         
                 estado         : String(data.rows[i].estado),           
                 descripcion    : String(data.rows[i].descripcion),
                 doc_adjunto    : String(data.rows[i].archivo_adjunto),          
                 hojas_ruta     : String(data.rows[i].hojas_ruta),
                 grupo_gasto    : String(data.rows[i].grupo_gasto),           
                 ubicacion      : String(data.rows[i].ubicacion),   
                 monto          : String(data.rows[i].monto),      
                 nrofolio       : String(data.rows[i].nrofolio),        
                 adjuntos       : String(data.rows[i].adjuntos),
                  id            : String(data.rows[i].id),
             }
             listaData.push(item)           
           
            }
         
            return listaData;    
     }
   
   }

}
