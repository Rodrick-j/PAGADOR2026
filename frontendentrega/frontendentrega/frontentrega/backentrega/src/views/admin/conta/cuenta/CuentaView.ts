import { Result } from "../../../../base/types/Result";
import { AuthUser } from "../../../../base/types/AuthUser";
import moment from "moment";

import { findAndCountResult, formatArrayToString, formatearNumero, numeroALetras2, queryStringToArray } from "../../../../tools/util";

import CuentaService from "../../../../core/admin/conta/cuenta";
import DeudaService from "../../../../core/admin/conta/deuda";
import UsuarioService from "../../../../core/system/autenticacion/usuario";
import { ENUM_MOTIVO_DEUDA, ENUM_TIPO_CUENTA } from "../../../../base/constants/enum";
import SeguimientoService from "../../../../core/admin/conta/seguimiento";
import { SeguimientoProps } from "../../../../core/admin/conta/seguimiento/SeguimientoEntity";

type CuentaTableModel = {
    id: string;
    ci                      : string;
    tipo_cuenta             : string;
    nombre_deudor           : string;
    gestion_generacion_deuda: string;
    documentacion_respaldo  : string;
    direccion_domicilio     : string;
    telefono_celular        : string;
    confirmacion            : string;
    descripcion_confirmacion: string;
    incremento_deuda        : string;
    monto_incremento_deuda  : number;
    depositos_realizados    : string;
    observacion             : string;
    saldo                   : string;
    cantidad_activos?       : number;
    adjuntos                : string;
    estado                  : boolean;
    estado_envio            : { estado: boolean; dias: number } | null;
    descripcion_deuda       : string,
    estado_proceso          : string,
    motivo_deuda            : string;
    cantidad_anios          : string;
};

type SeguimientoTableModel = {
    fecha       : string;
    dias        : number;
    descripcion : string;
    observacion : string;
    estado      : boolean;
    enviado     : boolean;
    adjuntos?   : string;
};

export type GetCuentasTableResponse = {
    rows: CuentaTableModel[];
    count: number;
};

export type GetSeguimientoTableResponse = {
    rows: SeguimientoTableModel[];
    count: number;
};

export type CuentaFormDataResponse = {
    id: string;
    ci                      : string;
    tipo_cuenta             : string;
    nombre_deudor           : string;
    gestion_generacion_deuda: string;
    documentacion_respaldo  : string;
    direccion_domicilio     : string;
    telefono_celular        : string;
    confirmacion            : string;
    descripcion_confirmacion: string;
    incremento_deuda        : string;
    monto_incremento_deuda  : number;
    depositos_realizados    : string;
    observacion             : string;
    adjuntos                : string;
    saldo                   : number | string;
    estado                  : boolean;
    descripcion_deuda       : string;
    estado_proceso          : string;
    motivo_deuda            : string[];
    detalle_gestion_deuda   : string;
};

export type SeguimientoFormDataResponse = {
    id         : string;
    fecha      : Date;
    descripcion: string;
    observacion: string;
    dias       : number;
    estado     : boolean;
    enviado?   : boolean;
    adjuntos   : string;
    cuentaId   : string;
}

export type InfoCuentaModel = {
    codigo   : string;
    nombre   : string;
    email    : string;
    fecha    : string;
};

export type CuentaItem = {
    id                      : string;
    ci                      : string;
    tipo_cuenta             : string;
    nombre_deudor           : string;
    gestion_generacion_deuda: string;
    documentacion_respaldo  : string;    
    saldo                   : string;
    adjuntos                : string;
    descripcion_deuda       : string,
    motivo_deuda            : string;
};

export type CuentaData = {
    rows: CuentaItem[];
};

export type CuentaDataResponse = {
    info?: InfoCuentaModel;
    cuentas?: CuentaData;
};

export type SeguimientoHTMLData = {
    id             : string;
    cite           : string;
    fecha_impresion: string;
    nombre_completo: string;
    fecha_saldo    : string;
    saldo_numeral  : string;
    saldo_literal  : string;
    concepto       : string;
};
export class CuentaView {
    public async getCuentasTable(query: any): Promise<Result<GetCuentasTableResponse>> {
            const seguimiento = await SeguimientoService.getAll();
            if (seguimiento.isFailure) return Result.fail("Falló al obtener la cuenta");
            const seguimientoResult = seguimiento.getValue();

            const cuenta = await CuentaService.getAll();
            if (cuenta.isFailure) return Result.fail("Falló al obtener la cuenta");
            const cuentaResult = cuenta.getValue();

            const deuda = await DeudaService.getAll();
            if (deuda.isFailure) return Result.fail("Falló al obtener la deuda");
            const deudaResult = deuda.getValue();

            const result: CuentaTableModel[] = cuentaResult.map((item) => {                
                const gestioDeuda = Number(item.props.gestionGeneracionDeuda);
                const anioActual = new Date().getFullYear();
                const cantidadAnios = gestioDeuda?(anioActual - gestioDeuda):0;
                
                const cantidadActivos = deudaResult.filter((d) => d.props.cuentaId===item.id).length - 1;
                let motivoDeudaString = "";

                const raw = item.props.motivoDeuda;
                let arrayMotivoDeuda: string[] = [];

                try {
                    arrayMotivoDeuda = Array.isArray(raw)
                                                        ? raw
                                                        : typeof raw === "string"
                                                        ? JSON.parse(raw)
                                                        : [];
                } catch (e) {
                    arrayMotivoDeuda = [];
                }

                if (arrayMotivoDeuda.length > 0) {
                    motivoDeudaString = arrayMotivoDeuda
                    .map(elem => ENUM_MOTIVO_DEUDA.find(ed => ed.value === elem)?.label || "")
                    .join(" - ");
                }
                                
                const seguimientoItem = seguimientoResult.find((s) => (s.props.cuentaId === item.id)) || null;
                
                const ESTADO_ENVIO = seguimientoItem?this.calcularDiasEnvio(seguimientoItem.props):null;
                
                return {
                    id: String(item.id),
                    ci                      : item.props.ci,
                    nombre_deudor           : item.props.nombreDeudor,
                    tipo_cuenta             : item.props.tipoCuenta,
                    gestion_generacion_deuda: item.props.gestionGeneracionDeuda,
                    documentacion_respaldo  : item.props.documentacionRespaldo,
                    direccion_domicilio     : item.props.direccionDomicilio,
                    telefono_celular        : item.props.telefonoCelular,
                    confirmacion            : item.props.confirmacion,
                    descripcion_confirmacion: item.props.descripcionConfirmacion,
                    incremento_deuda        : item.props.incrementoDeuda,
                    monto_incremento_deuda  : item.props.montoIncrementoDeuda,
                    depositos_realizados    : item.props.depositosRealizados,
                    observacion             : item.props.observacion,
                    cantidad_activos        : cantidadActivos,
                    saldo                   : formatearNumero(Number(item.props.saldo),'en-US'),
                    adjuntos                : `${JSON.stringify(item.props.adjuntos)}`,
                    estado                  : item.props.estado,
                    estado_envio            : ESTADO_ENVIO,
                    descripcion_deuda       : item.props.descripcionDeuda,
                    estado_proceso          : item.props.estadoProceso,
                    motivo_deuda            : motivoDeudaString,
                    cantidad_anios          : cantidadAnios != 0?`${cantidadAnios} años`:'-',
                    detalle_gestion_deuda   : item.props.detalleGestionDeuda,
                };
            });
            const response = findAndCountResult(result, query);
            return Result.ok(response);
    }

    

    private  calcularDiasEnvio(items: SeguimientoProps): { estado: boolean; dias: number } {
        const calcularDiasRestantes = (fechaInicial: Date, dias: number): number => {
            if (!fechaInicial) return 0;
            const fecha = fechaInicial;
            fecha.setDate(fechaInicial.getDate() + dias);
            const fechaActual = new Date();
            const diferenciaTiempo = fecha.getTime() - fechaActual.getTime();
            const diasRestantes = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));
            return Math.max(diasRestantes, 0);
        };
        const fecha_op = items.fecha;
        const dias = items.dias;
        const diasRestantes = calcularDiasRestantes(fecha_op, dias);
        return { estado: diasRestantes>0, dias: diasRestantes };
    }

    public async getSeguimientolTable(query: any): Promise<Result<GetSeguimientoTableResponse>> {

        const ID_CUENTA = query.cuenta_id || "";
        if ('cuenta_id' in query) delete query.cuenta_id;
        const seguimiento = await SeguimientoService.getAll();
        if (seguimiento.isFailure) return Result.fail("Falló al obtener la cuenta");
        const seguimientoResult = seguimiento.getValue().filter((d) => d.props.cuentaId === ID_CUENTA);

        const result: SeguimientoTableModel[] = seguimientoResult.map((item) => {
            return {
                id         : String(item.id),
                fecha      : moment(item.props.fecha).format("DD/MM/YYYY HH:mm").toString(),
                descripcion: item.props.descripcion,
                observacion: item.props.observacion,
                dias       : item.props.dias,
                estado     : item.props.estado,
                enviado    : item.props.enviado || false,
                adjuntos   : item.props.adjuntos?`${JSON.stringify(item.props.adjuntos)}`:`[]`,           
            };
        });
        
        const response = findAndCountResult(result, query);
        return Result.ok(response);
    }

    public async getCuentaFormDataView(id_cuenta: string): Promise<Result<CuentaFormDataResponse>> {
        const cuenta = await CuentaService.getById(id_cuenta);
        if (cuenta.isFailure) {
            return Result.fail<CuentaFormDataResponse>("Cuenta no encontrado");
        }

        const props = cuenta.getValue().props;
        
        const result: CuentaFormDataResponse = {
            id: cuenta.getValue().id,
            ci                      : props.ci,
            nombre_deudor           : props.nombreDeudor,
            tipo_cuenta             : props.tipoCuenta,
            gestion_generacion_deuda: props.gestionGeneracionDeuda,
            documentacion_respaldo  : props.documentacionRespaldo,
            direccion_domicilio     : props.direccionDomicilio,
            telefono_celular        : props.telefonoCelular,
            confirmacion            : props.confirmacion,
            descripcion_confirmacion: props.descripcionConfirmacion,
            incremento_deuda        : props.incrementoDeuda,
            monto_incremento_deuda  : props.montoIncrementoDeuda,
            depositos_realizados    : props.depositosRealizados,
            observacion             : props.observacion,
            saldo                   : props.saldo,
            adjuntos                : props.adjuntos ? JSON.stringify(props.adjuntos) : '[]',
            estado                  : props.estado,
            descripcion_deuda       : props.descripcionDeuda,
            estado_proceso          : props.estadoProceso,
            motivo_deuda            : props.motivoDeuda,
            detalle_gestion_deuda   : props.detalleGestionDeuda,
        };

        return Result.ok(result);
    }

    public async getSeguimientoFormDataView(id_seguimiento: string): Promise<Result<SeguimientoFormDataResponse>> {
        const seguimiento = await SeguimientoService.getById(id_seguimiento);
        if (seguimiento.isFailure) return Result.fail<SeguimientoFormDataResponse>("seguimiento no encontrado");

        const props = seguimiento.getValue().props;
        
        const result: SeguimientoFormDataResponse = {
            id: seguimiento.getValue().id,
            fecha      : props.fecha,
            descripcion: props.descripcion,
            observacion: props.observacion,
            dias       : props.dias,
            estado     : props.estado,
            enviado    : props.enviado || false,
            adjuntos   : props.adjuntos ? JSON.stringify(props.adjuntos) : '[]',
            cuentaId   : props.cuentaId,
        };

        return Result.ok(result);
    }

    public async getPDFCuenta(authUser: AuthUser, queryString: string): Promise<Result<CuentaDataResponse>> {    
        
        const resultObject = queryStringToArray(queryString);
        
        const result = {
            info: await this.getInfoCuentaData(authUser, resultObject),
            data: await this.getCuentaData(resultObject)
        };
        
        return Result.ok(result);
    }
    

    private async getInfoCuentaData(authUser: AuthUser, queryString: any): Promise<InfoCuentaModel | undefined> {
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
            codigo    : codigo,
            nombre    : NOMBRE_USUARIO,
            fecha     : FECHA_REGISTRO,
            email     : EMAIL_USUARIO
        }
    }

    private async getCuentaData(queryString: any): Promise<CuentaData | undefined> {

        const cuenta = await CuentaService.getAll();
        if (cuenta.isFailure) return undefined;
        const cuentaResult = cuenta.getValue();
        
        const result: CuentaItem[]  = cuentaResult.map((item)=> {
                            let motivoDeudaString = "";

                            const raw = item.props.motivoDeuda;
                            let arrayMotivoDeuda: string[] = [];

                            try {
                                arrayMotivoDeuda = Array.isArray(raw)
                                                                    ? raw
                                                                    : typeof raw === "string"
                                                                    ? JSON.parse(raw)
                                                                    : [];
                            } catch (e) {
                                arrayMotivoDeuda = [];
                            }

                            if (arrayMotivoDeuda.length > 0) {
                                motivoDeudaString = arrayMotivoDeuda
                                .map(elem => ENUM_MOTIVO_DEUDA.find(ed => ed.value === elem)?.label || "")
                                .join(" - ");
                            }
                            const tipoCuenta = ENUM_TIPO_CUENTA.find((e) => e.value===item.props.tipoCuenta)?.label || "";                             
                            return {
                                id                      : String(item.id),
                                nombre_deudor           : item.props.nombreDeudor,
                                ci                      : item.props.ci,
                                tipo_cuenta             : item.props.tipoCuenta,
                                tipo_cuenta_            : tipoCuenta,
                                gestion_generacion_deuda: item.props.gestionGeneracionDeuda,
                                documentacion_respaldo  : item.props.documentacionRespaldo,
                                motivo_deuda            : motivoDeudaString,
                                saldo                   : formatearNumero(Number(item.props.saldo),'en-US'),
                                descripcion_deuda       : item.props.descripcionDeuda,
                                estado_proceso          : item.props.estadoProceso,
                                adjuntos                : item.props.adjuntos && item.props.adjuntos.length > 0?'SI':'NO',
                            }                        
                        });  
        
        const response = findAndCountResult(result, queryString);

        const result1: CuentaData = {
            rows: response.rows,
        };
        return result1;
    }
    
    public async getPDFSeguimientoEnvio(params: string): Promise<Result<any>> {
        const ID_CUENTA = params;
        console.log("🚀 ~ CuentaView ~ getPDFSeguimientoEnvio ~ ID_CUENTA:", ID_CUENTA)
        
        return Result.ok([]);        
    }

    public async getSeguimientoView(id: string, input: string): Promise<Result<SeguimientoHTMLData>> {  
        const ID_CUENTA = id;
        const fecha_actual = new Date();
        const cuenta = await CuentaService.getById(ID_CUENTA);
        if (cuenta.isFailure)  return Result.fail(String(cuenta.error));
        const props = cuenta.getValue().props;

        const seguimientos = await SeguimientoService.getAll();
        if (seguimientos.isFailure) return Result.fail("Seguimiento no encontrado");                
        const seguimientoResult = seguimientos.getValue().find((sg) => sg.props.cuentaId===ID_CUENTA);
        if (!seguimientoResult) {
            const SeguimientoProps: SeguimientoProps = {
                fecha      : fecha_actual,
                descripcion: 'PRIMERA IMPRESION CONFIRMACION SALDOS',
                observacion: props.documentacionRespaldo,
                dias       : 8,
                estado     : true,
                adjuntos   : [],
                cuentaId   : ID_CUENTA,
            };
            const seguimientoresult = await SeguimientoService.create(SeguimientoProps);
            if (seguimientoresult.isFailure) return Result.fail(seguimientoresult.error);  
        }
        const result: SeguimientoHTMLData = {            
                id: String(seguimientoResult?.id),
                cite           : input,
                fecha_impresion: moment(fecha_actual).locale('es').format('dddd D [de] MMMM [de] YYYY').toString(),
                nombre_completo: props.nombreDeudor,
                fecha_saldo    : moment(fecha_actual).format("DD/MM/YYYY").toString(),
                saldo_numeral  : formatearNumero(Number(props.saldo),'en-US'),
                saldo_literal  : numeroALetras2(String(props.saldo)),
                concepto       : formatArrayToString(props.motivoDeuda),
        };

        return Result.ok(result);
    }
}
