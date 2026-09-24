import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import CitesView from "..";
import { AuthUser } from "../../../../../base/types/AuthUser";
import { CitesFormDataResponse, CitesPropsResponse } from "../CitesView";
import { CitesProps } from "../../../../../core/admin/correspondencia/cites/CitesEntity";
import CitesService  from "../../../../../core/admin/correspondencia/cites";
import TipoCitesService  from "../../../../../core/admin/correspondencia/tipo_cites";
import { CitesReport } from "../../../../../tools/CitesReport";
import { CitesTablaReport } from "../../../../../tools/CitesTablaReport";

export class CitesViewController extends BaseHttpController {
    public async getCitesTable(req: Request, res: Response): Promise<Response<any>> {
		const AUTH_USER: AuthUser = req.authUser;	
        const Cites = await CitesView.getCitesTable(AUTH_USER, req.query);
        if (Cites.isFailure) return this.fail(res, "Falló al obtener la tabla de Cites");
        return this.ok<any>(res, Cites.getValue());
    }

    //Apertura General - API
    public async getCitesApi(req: Request, res: Response): Promise<Response<CitesPropsResponse[]>> {
        const data = await CitesView.getCitesApi();
        if (data.isFailure) return this.fail(res, "Falló al obtener la tabla de Cites");
        return this.ok(res, data);
    }

    public async getCitesFormData(req: Request, res: Response): Promise<any> {      	
        const formData = await CitesView.getCitesFormDataView(req.params.cites_id);	
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<CitesFormDataResponse>(res, formData.getValue());
    }    

    public async createOrUpdateCites(req: Request, res: Response): Promise<any> {
        const data = req.body;	
        const Cites = await TipoCitesService.getById(data.tipo_cite_id);
        if (Cites.isFailure) return Result.fail<CitesFormDataResponse>("tipo Cites no encontrado");
        const propsTipoCite = Cites.getValue().props;
		
        const ID_CITES = data.id;  	
		
        /**Verificacion de si documento ha sido llenado por otra persona (cite Repetido)*/
        let nuevoCodigo = "";
        if(!ID_CITES){
        
            const resultCites = await CitesView.getAllCitesRutas();
            if (resultCites.isFailure) return this.fail(res, String(resultCites.error));
            const allCites = resultCites.getValue().rows;          
            let auxMayor = 0; 	                    
            let pathAux;
            const documentoSigla = allCites.find((c) => c.nombre === data.cite_completo)?.nombre;		       
            const numeroDocumento = allCites.find((c) => c.nombre === data.cite_completo)?.concepto;
        
            if(documentoSigla){
               
                auxMayor = Number(numeroDocumento);     
                // expresion
                const regex = /([^\n]+?) Nº \d+\/\d{4}/g;
                const matches = documentoSigla.match(regex) || [];					
                const filtered = matches.filter(match => {				
                    const [path] = match.split(' Nº');																
                    pathAux = path;		                   
                });
                
                // generando el cite
                const fechaActual = new Date();                    
                const anioActual = fechaActual.getFullYear();                        
                const nuevoNumero = (auxMayor + 1).toString().padStart(3, '0'); // Formato con ceros a la izquierda                      
                nuevoCodigo = `${pathAux} Nº ${nuevoNumero}/${anioActual}`;                 				

           }

        }
       

        /**Fin de la verificacion del documento */
 
        
        const props: CitesProps = {
          
                fechaRegistro           : data.fecha_registro,
                nombreUsuario           : data.nombre_usuario,
                nombreAreaSolicitante   : data.nombre_area_solicitante,
                nombreAreaDestino       : data.nombre_area_destino,                   
                citeCompleto            : nuevoCodigo.length>0?nuevoCodigo:data.cite_completo,
                referencia              : data.referencia,
                tipoDocumento           : propsTipoCite.nombreDocumento,
                dias                    : data.dias,
                gestion                 : data.gestion,
                actividad               : data.actividad,
                nombreProceso           : data.nombre_proceso,
                cuce                    : data.cuce, //
                empresaAdjudicada       : data.empresa_adjudicada, 
                observacion             : data.observacion,  /*fecha de la gestión*/ 
                hojaRuta                : data.hoja_ruta,
                fechaCierre             : data.fecha_cierre,
                estado                  : data.estado,
                estadoActivo            : data.estado_activo,
                numeroPaginas           : data.numero_paginas,
                usuarioId               : data.usuario_id,     
                tipoCiteId              : data.tipo_cite_id,      
            
        };
        let result = null;
                   
        if (ID_CITES) {
            result = await CitesService.update(ID_CITES, props);
            if (result.isFailure) return this.fail(res, String(result.error));           
            return this.ok(res, result);
        }

        result = await CitesService.create(props);
        if (result.isFailure) return Result.fail(result.error);   
        return this.ok<any>(res, result);
    }

    public async destroyCites(req: Request, res: Response): Promise<any> {
        const CITE = req.params.cites_id;
		
        const CitesR = await CitesService.getById(CITE);
        if (CitesR.isFailure) return this.fail(res, String(CitesR.error));

       const result = await CitesService.delete(CITE);
       if (result.isFailure) return Result.fail(result.error);
       return this.ok<any>(res, result);
    }

    public async getAllDocumentos(req: Request, res: Response): Promise<any> {
        const result = await CitesView.getAllDocumentos();
        if (result.isFailure) return this.fail(res, String(result.error));
        return this.ok<any>(res, result.getValue());
    }

    public async getTipoCites(req: Request, res: Response): Promise<any> {
        const result = await CitesView.getTipoCites();
        if (result.isFailure) return this.fail(res, String(result.error));
        return this.ok<any>(res, result.getValue());
    }

    public async getAllCitesRutas(req: Request, res: Response): Promise<any> {
        const result = await CitesView.getAllCitesRutas();
        if (result.isFailure) return this.fail(res, String(result.error));
        return this.ok<any>(res, result.getValue());
    }

    //cambio de estado a aprobado
    public async setChangeEstado(req: Request, res: Response): Promise<any> {
        const ID_CITES = req.params.cites_id;				
        const estado = req.body.estado;	
        const fechaCierre = req.body.fecha_cierre;

        if(fechaCierre != null){
            const result = await CitesService.update(ID_CITES, { estado, fechaCierre });	
            if (result.isFailure) return this.fail(res, "Falló al cambiar estado y fecha de cierre");
            return this.ok(res);
        }else{
            const result = await CitesService.update(ID_CITES, { estado });
            if (result.isFailure) return this.fail(res, "Falló al cambiar estado");
            return this.ok(res);
        }	
        
    }

    public async getReporteCitesPDF(req: Request, res: Response): Promise<any> {
		
        const queryString = req.body.qs;     
		
		const formData = await CitesView.getReporteCitesPDF(req.authUser, queryString);//,idsFiltrosReporte,numeroResultados);
		if (formData.isFailure) return this.fail(res, String(formData.error));
    
        const result = formData.getValue();
        return CitesReport.creaPDF(result, 'cites', res);
    }
      
    public async getAllCitesPDF(req: Request, res: Response): Promise<any> {
	
        const id: string = req.body.id;
        const citesResult = await CitesView.getAllCitesPDF(req.authUser, id);		
        if (citesResult.isFailure) return this.fail(res, String(citesResult.error));
        const result = citesResult.getValue();
        return CitesTablaReport.creaPDF(result, "citesTablaAll", res);
    }

}
