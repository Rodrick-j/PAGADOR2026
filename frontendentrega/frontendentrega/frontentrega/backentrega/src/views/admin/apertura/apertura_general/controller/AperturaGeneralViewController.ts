import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import AperturaGeneralView from "..";
import { AperturaGeneralFormDataResponse, AperturaGeneralPropsResponse } from "../AperturaGeneralView";
import { AperturaGeneralProps } from "../../../../../core/admin/apertura/apertura_general/AperturaGeneralEntity";
import AperturaGeneralService  from "../../../../../core/admin/apertura/apertura_general";
import ObjetoGastoService from "../../../../../core/admin/apertura/objeto_gasto";
import { ObjetoGastoFormDataResponse } from "../../objeto_gasto/ObjetoGastoView";
import { HistorialAperturaProps } from "../../../../../core/admin/apertura/historial_apertura/HistorialAperturaEntity";
import  HistorialAperturaService  from "../../../../../core/admin/apertura/historial_apertura";
import { HistorialGastoProps } from "../../../../../core/admin/apertura/historial_gasto/HistorialGastoEntity";
import  HistorialGastoService  from "../../../../../core/admin/apertura/historial_gasto";
import AperturaViaticoService from "../../../../../core/admin/conta_viatico/apertura_viatico";
import { AperturaViaticoProps } from "../../../../../core/admin/conta_viatico/apertura_viatico/AperturaViaticoEntity";
import { EMUM_CODIGO_OBJETOS } from "../../../../../base/constants/enum";
import { AuthUser } from "../../../../../base/types/AuthUser";

export class AperturaGeneralViewController extends BaseHttpController {
    public async getAperturaGeneralsTable(req: Request, res: Response): Promise<Response<any>> {
         const AUTH_USER: AuthUser = req.authUser;
        const aperturaGeneral = await AperturaGeneralView.getAperturaGeneralsTable(AUTH_USER,req.query);
        if (aperturaGeneral.isFailure) return this.fail(res, "Falló al obtener la tabla de AperturaGeneral");
        return this.ok<any>(res, aperturaGeneral.getValue());
    }

    //Apertura General - API
    public async getAperturaGeneralApi(req: Request, res: Response): Promise<Response<AperturaGeneralPropsResponse[]>> {
        const data = await AperturaGeneralView.getAperturaGeneralApi();
        if (data.isFailure) return this.fail(res, "Falló al obtener la tabla de AperturaGeneral");
        return this.ok(res, data);
    }

    public async getAperturaGeneralFormData(req: Request, res: Response): Promise<any> {
        const formData = await AperturaGeneralView.getAperturaGeneralFormDataView(req.params.apertura_general_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<AperturaGeneralFormDataResponse>(res, formData.getValue());
    }    

    public async createOrUpdateAperturaGeneral(req: Request, res: Response): Promise<any> {
        const data = req.body;	
        
        const ID_APERTURA_GENERAL = data.id;
        const ID_OBJETO_GASTO = data.objeto_id;
        const objeto = await ObjetoGastoService.getById(ID_OBJETO_GASTO);
        if (objeto.isFailure) return Result.fail<ObjetoGastoFormDataResponse>("Objeto Gasto no encontrado");        
      
        const props: AperturaGeneralProps = {
           
            aperturaProgramatica          : data.apertura_programatica,
            ue                            : data.ue,
            codFte                        : data.cod_fte,
            codOrg                        : data.cod_org,                          
            presupuestoInicial            : data.presupuesto_inicial,
            presupuestoRestante           : data.presupuesto_restante,
            modAprobada                   : data.mod_aprobada,
            presupuestoVigente            : data.presupuesto_vigente,
            pagado                        : data.pagado,
            saldoEjecutar                 : data.saldo_ejecutar,
            estado                        : data.estado,
            estadoActivo                  : true,
            sisin                         : data.sisin,
            gestion                       : new Date(),
            objetoId                      : data.objeto_id, 
            tipoArea                      : data.tipo_area,
            areaHijoId                    : data.area_hijo_id,
            areaId                        : data.area_id,           
            
        };
        let result = null;
        //  para Apertura Viatico
        const objetoGasto = await ObjetoGastoService.getAll();
         if (objetoGasto.isFailure) return Result.fail("Falló al obtener el objeto");
        const objetoGastoResult = objetoGasto.getValue();

        const codigoObjeto = objetoGastoResult.find((c)=> c.id === data.objeto_id)?.props.objeto ||"";
        const descripcionObjeto = objetoGastoResult.find((c)=> c.id === data.objeto_id)?.props.descripcionObjetoGasto ||"";
	
        //  para Apertura Viatico
        if (ID_APERTURA_GENERAL) {
            result = await AperturaGeneralService.update(ID_APERTURA_GENERAL, props);
            if (result.isFailure) return this.fail(res, String(result.error));

            //INICIO - ACTUALIZACION APERTURA VIATICO
            const aperturaViatico = await AperturaViaticoService.getAll();
            if (aperturaViatico.isFailure) return Result.fail("Falló al obtener el Apertura Viatico");
            const aperturaViaticoResult = aperturaViatico.getValue();
            const aperturaViaticoId = aperturaViaticoResult.find((c) => c.props.aperturaGeneralId === ID_APERTURA_GENERAL)?.id || null;
            if(aperturaViaticoId) {
                const propsAperturaViatico: AperturaViaticoProps = {
                    aperturaProgramatica: data.apertura_programatica,
                    codFte: data.cod_fte,
                    codOrg: data.cod_org,
                    objeto: codigoObjeto,
                    descripcionObjetoGasto: descripcionObjeto,
                    presupuestoInicial: data.presupuesto_inicial,
                    presupuestoRestante: data.presupuesto_restante,
                    estado: data.estado,
                    sisin: data.sisin,
                    gestion: new Date(),
                    areaId: data.area_id,
                    aperturaGeneralId: data.apertura_general_id,
                    estadoActivo : data.estado_activo,
                };

                const resultAperturaViatico = await AperturaViaticoService.update(aperturaViaticoId, propsAperturaViatico);
                if (resultAperturaViatico.isFailure) return this.fail(res, String(resultAperturaViatico.error));
            }

            //CREANDO ACTIVIDAD EN HISTORIAL DETALLE
           const dataApertura = result.getValue();
            const ID_APERTURA_2 = dataApertura.id;
           /* const historialDetalleProps: HistorialAperturaProps = {
                titulo                        : 'INGRESO INICIAL',
                descripcion                   : 'INGRESO INICIAL',
                gasto                         : 0,
                debeHaber                     : 'INGRESO',
                estado                        : '',
                fecha                         : new Date(),
                aperturaId                    : ID_APERTURA_2, 
                
            };*/
            const historialGasto = await HistorialGastoService.getAll();
            if (historialGasto.isFailure) return Result.fail("Falló al obtener el apertura Gasto");
            const historialGastoResult = historialGasto.getValue();
            const historialGastoId = historialGastoResult.find((c) => c.props.aperturaId === ID_APERTURA_GENERAL)?.id || null;
                        
            if (historialGastoId) {
               // const ID_HISTORIAL_GASTO = HistorialGastoService.getById.id;
            
                const propsHistorialGasto: HistorialGastoProps = {
                    fecha      : new Date(),
                    descripcion: 'INGRESO INICIAL',
                    debe       : 0,
                    haber      : Number(dataApertura.props.presupuestoInicial),
                    saldo      : Number(dataApertura.props.presupuestoInicial), 
                    estado     : "",
                    historialAperturaId   : historialGastoId,
                    aperturaId           : ID_APERTURA_2,           
                
                };

                const resultHistorial = await HistorialGastoService.update(historialGastoId,propsHistorialGasto);
                if (resultHistorial.isFailure) return this.fail(res, String(result.error));
            }
            //FIN ACTUALIZACION APERTURA VIATICO
            return this.ok(res, result);
        }

        result = await AperturaGeneralService.create(props);
        if (result.isFailure) return Result.fail(result.error);
        
        if (result.isSuccess) {
            // CREANDO LOS DATOS EN APERTURA VIATICOS
            const aperturaGeneral = result.getValue();
            const ID_APERTURA_GRAL = aperturaGeneral.id;
            if(EMUM_CODIGO_OBJETOS.includes(codigoObjeto)){
                const propsAperturaViatico: AperturaViaticoProps = {
            
                    aperturaProgramatica          : data.apertura_programatica,
                    codFte                        : data.cod_fte,
                    codOrg                        : data.cod_org,
                    objeto                        : codigoObjeto,
                    descripcionObjetoGasto        : descripcionObjeto,           
                    presupuestoInicial            : data.presupuesto_inicial,
                    presupuestoRestante           : data.presupuesto_restante,
                    estado                        : data.estado,
                    sisin                         : data.sisin,
                    gestion                       : new Date(),
                    areaId                        : data.area_id, 
                    estadoActivo                  : data.estado_activo,
                    aperturaGeneralId             : ID_APERTURA_GRAL,
                };

                const resultAV = await AperturaViaticoService.create(propsAperturaViatico);
                if (resultAV.isFailure) return Result.fail(resultAV.error);
            }
            // FIN DE LOS DATOS EN APERTURA VIATICOS 

            //CREANDO ACTIVIDAD EN HISTORIAL DETALLE
            const dataApertura = result.getValue();
            const ID_APERTURA_2 = dataApertura.id;
            const historialDetalleProps: HistorialAperturaProps = {
                titulo                        : 'INGRESO INICIAL',
                descripcion                   : 'INGRESO INICIAL',
                gasto                         : 0,
                debeHaber                     : 'INGRESO',
                estado                        : '',
                fecha                         : new Date(),
                aperturaId                    : ID_APERTURA_2, 
                
            };

            const resultHistorialApertura = await HistorialAperturaService.create(historialDetalleProps);
            if (resultHistorialApertura.isFailure) return this.fail(res, String(result.error));
            const dataHistorialApertura = resultHistorialApertura.getValue();
            
            if (resultHistorialApertura.isSuccess) {
                const ID_HISTORIAL_GASTO = dataHistorialApertura.id;
            
                const propsHistorialGasto: HistorialGastoProps = {
                    fecha      : new Date(),
                    descripcion: 'INGRESO INICIAL',
                    debe       : 0,
                    haber      : Number(dataApertura.props.presupuestoInicial),
                    saldo      : Number(dataApertura.props.presupuestoInicial), 
                    estado     : "",
                    historialAperturaId   : ID_HISTORIAL_GASTO,
                    aperturaId           : ID_APERTURA_2,           
                
                };

                const resultHistorial = await HistorialGastoService.create(propsHistorialGasto);
                if (resultHistorial.isFailure) return this.fail(res, String(result.error));
            }
        } 
        return this.ok<any>(res, result);
    }

    public async destroyAperturaGeneral(req: Request, res: Response): Promise<any> {
        const ID_APERTURA = req.params.apertura_general_id;
		
        const aperturaGeneralR = await AperturaGeneralService.getById(ID_APERTURA);
        if (aperturaGeneralR.isFailure) return this.fail(res, String(aperturaGeneralR.error));
        // Se deben eliminar ambos historiales 
    //Eliminando Historial Gasto
        const historialGasto = await HistorialGastoService.getAll();
        if (historialGasto.isFailure) return Result.fail("Falló al obtener la historial Gasto");
        const historialGastoResult = historialGasto.getValue().filter((h) => h.props.aperturaId === ID_APERTURA);	
       

        for(let i = 0; i < historialGastoResult.length;i++){
            const result = await HistorialGastoService.delete(historialGastoResult[i].id);
            if (result.isFailure) return Result.fail(result.error);
        }

        //Eliminando Historial apertura 
        const historialDetalle = await HistorialAperturaService.getAll();
        if (historialDetalle.isFailure) return Result.fail("Falló al obtener la historial detalle");
        const historialDetalleResult = historialDetalle.getValue().filter((h) => h.props.aperturaId === ID_APERTURA);
      
        for(let i = 0; i < historialDetalleResult.length;i++){
            const result = await HistorialAperturaService.delete(historialDetalleResult[i].id);
            if (result.isFailure) return Result.fail(result.error);
        }

        //Eliminando Apertura Viatico
        const aperturaViatico = await AperturaViaticoService.getAll();
        if (aperturaViatico.isFailure) return Result.fail("Falló al obtener la Apertura Viatico");
        const aperturaViaticoResult = aperturaViatico.getValue();	
        const aperturaViaticoId = aperturaViaticoResult.find((c)=> c.props.aperturaGeneralId === ID_APERTURA)?.id||"";

        const resultAperturaViatico = await AperturaViaticoService.delete(aperturaViaticoId);
        if (resultAperturaViatico.isFailure) return Result.fail(resultAperturaViatico.error);

        // Se deben eliminar ambos historiales 
            const result = await AperturaGeneralService.delete(ID_APERTURA);
            if (result.isFailure) return Result.fail(result.error);
            return this.ok<any>(res, result);
    }

    //aumentando nuevo metodos all a Aperturas
    public async getAllAperturaGeneral(req: Request, res: Response): Promise<any> {
        const result = await AperturaGeneralView.getAllAperturaGeneral();
        if (result.isFailure) return this.fail(res, String(result.error));
        return this.ok<any>(res, result.getValue());
    }

    public async getAllAperturaGeneral2(req: Request, res: Response): Promise<any> {
        const result = await AperturaGeneralView.getAllAperturaGeneral2();
        if (result.isFailure) return this.fail(res, String(result.error));
        return this.ok<any>(res, result.getValue());
    }
    
    public async getAllAperturaGeneralVale(req: Request, res: Response): Promise<any> {
        const result = await AperturaGeneralView.getAllAperturaGeneralVale();
        if (result.isFailure) return this.fail(res, String(result.error));
        return this.ok<any>(res, result.getValue());
    }

    public async changeState(req: Request, res: Response): Promise<any> {
        const aperturaId = req.params.apertura_general_id;	
        const estadoActivo = Boolean(req.body.estado_activo);
		
        const result = await AperturaGeneralService.update(aperturaId, { estadoActivo });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado de la Apertura general");
        
        const aperturaViatico = await AperturaViaticoService.getAll();
       if(aperturaViatico.isFailure) return Result.fail("Fallo al obtener el aperturaViatico");
       const aperturaViaticoResult = aperturaViatico.getValue();

        const idAperturaViatico = aperturaViaticoResult.find((c)=> c.props.aperturaGeneralId ===aperturaId)?.id|| "-";
		const resultViatico = await AperturaViaticoService.update(idAperturaViatico, { estadoActivo });		
        if (resultViatico.isFailure) return this.fail(res, "Falló al cambiar estado de la Apertura Viatico");
        
        return this.ok(res);
    }

    //Se agrega para sumar pasajes
    public async getPresupuesto(req: Request, res: Response): Promise<any> {    
        const aperturaPresupuesto = await AperturaGeneralView.getPresupuesto( req.params.apertura_id);	
        if (aperturaPresupuesto.isFailure) return this.fail(res, 'Falló al obtener El monto del presupuesto');
        return this.ok<any>(res, aperturaPresupuesto.getValue());
    }

    public async getVerificaPresupuesto(req: Request, res: Response): Promise<any> {
        const gasto     = req.params.gasto;	
        const APERTURA_ID = req.params.apertura_id;
        const debeHaber     = req.params.debe_haber;	   
        
        const apertura = await AperturaGeneralService.getById(APERTURA_ID);
        if (apertura.isFailure) return this.fail(res, "Apertura no encontrado");
        const restante = apertura.getValue().props.presupuestoRestante;	
        if(debeHaber === 'EGRESO'){
            if (Number(gasto)>restante){		
                return this.ok<any>(res, {gasto: false});
            }else{
                return this.ok<any>(res, {gasto: true});
            }
        }else{
            return this.ok<any>(res, {gasto: true});
        }
    }


    public async getAperturaData(req: Request, res: Response): Promise<any> {
            
        const apertura     = req.params.apertura;
        const codFte = Number(req.params.cod_fte);
        const codOrg    = Number(req.params.cod_org);
        const objeto     = req.params.objeto;
        const area = req.params.area;
        const areaHijo    = req.params.area_hijo;

        const aperturas = await AperturaGeneralService.getAll();
        if (aperturas.isFailure) return this.fail(res, "Apertura General no encontrada");
        
        let aperturasResult ;	

        if (areaHijo ==='-'){		
            aperturasResult = aperturas.getValue()
            .filter((d) => 
                            d.props.aperturaProgramatica===apertura && 
                            d.props.codFte===codFte && 
                            d.props.codOrg===codOrg &&
                            d.props.objetoId===objeto && 
                            d.props.areaId===area //&& 
                        // d.props.areaHijoId===areaHijo
                    )
            .map((dd) => dd.props.aperturaProgramatica);     
        }else{
        
            aperturasResult = aperturas.getValue()		
            .filter((d) => 
                            d.props.aperturaProgramatica===apertura && 
                            d.props.codFte===codFte && 
                            d.props.codOrg===codOrg &&
                            d.props.objetoId===objeto && 
                            d.props.areaId===area && 
                            d.props.areaHijoId===areaHijo
                    )
            .map((dd) => dd.props.aperturaProgramatica);    
        }

        return this.ok<any>(res, {apertura_programatica: aperturasResult.length > 0});
    }  
}
