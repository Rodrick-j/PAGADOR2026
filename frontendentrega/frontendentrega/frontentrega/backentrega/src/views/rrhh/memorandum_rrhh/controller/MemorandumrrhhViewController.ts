import { BaseHttpController } from "../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../base/types/Result";
import ExcelJS from 'exceljs';
import moment from "moment";
import MemorandumrrhhView from "..";
import { MemorandumrrhhFormDataResponse, MemorandumTipoPCPOptionsFormModel, ModificacionDetalleDestino, ModificacionMemorandum } from "../MemorandumrrhhView";
import  MemorandumrrhhService  from "../../../../core/rrhh/memorandum_rrhh";
import { MemorandumrrhhProps } from "../../../../core/rrhh/memorandum_rrhh/MemorandumrrhhEntity";
import { AuthUser } from "../../../../base/types/AuthUser";
import  DetalleDestinorrhhService from "../../../../core/rrhh/detalle_destino_rrhh";
import { DetalleDestinorrhhOptionsFormModel, DetalleDestinorrhhOptionsFormModel2 } from "../../../../views/rrhh/detalle_destino_rrhh/DetalleDestinorrhhView";
import { ENUM_APROBADO_CONTABILIDAD, ENUM_APROBADO_JEFE, ENUM_GENERAL, ENUM_REPORTE_POR_BENEFICIARIO, ENUM_REPORTE_POR_PROYECTO, ENUM_REPORTE_POR_TIPO } from "../../../../base/constants/enum";
import { MemorandumReport } from "../../../../tools/MemorandumReport";
import { MemorandumrrhhReport } from "../../../../tools/MemorandumrrhhReport";

export class MemorandumrrhhViewController extends BaseHttpController {
    public async getMemorandumsTable(req: Request, res: Response): Promise<Response<any>> {
        const AUTH_USER: AuthUser = req.authUser;
		const memorandum = await MemorandumrrhhView.getMemorandumsTable(AUTH_USER, req.query);
        if (memorandum.isFailure) return this.fail(res, "Falló al obtener la tabla de Memorandum");
        return this.ok<any>(res, memorandum.getValue());
    }
    public async getMemorandumsUserTable(req: Request, res: Response): Promise<Response<any>> {
        const AUTH_USER: AuthUser = req.authUser;
        const memorandum = await MemorandumrrhhView.getMemorandumsUserTable(AUTH_USER, req.query);
        if (memorandum.isFailure) return this.fail(res, "Falló al obtener la tabla de Memorandum");
        return this.ok<any>(res, memorandum.getValue());
    }
    public async getMemorandumsSolicitadaUserTable(req: Request, res: Response): Promise<Response<any>> {
        const AUTH_USER: AuthUser = req.authUser;
        const memorandum = await MemorandumrrhhView.getMemorandumsSolicitadaUserTable(AUTH_USER, req.query);
        if (memorandum.isFailure) return this.fail(res, "Falló al obtener la tabla de Memorandum");
        return this.ok<any>(res, memorandum.getValue());
    }

    public async getMemorandumFormData(req: Request, res: Response): Promise<any> {      
		const AUTH_USER: AuthUser = req.authUser;
        const formData = await MemorandumrrhhView.getMemorandumFormDataView(AUTH_USER,req.params.memorandum_rrhh_id);		
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<MemorandumrrhhFormDataResponse>(res, formData.getValue());
    }

    public async createOrUpdateMemorandum(req: Request, res: Response): Promise<any> {
        const data = req.body;
        const isHabiles = data.dias_habiles;
        let cantidadDiasMemo = 0;
        if (isHabiles === "HABILES") {
            cantidadDiasMemo = await MemorandumrrhhService.contarDiasHabilesRango(
                data.fecha_inicio_viaje,
                data.fecha_fin_viaje,
            );
        } else {
            cantidadDiasMemo = await MemorandumrrhhService.contarDiasHabilesRangoInhabiles(
                data.fecha_inicio_viaje,
                data.fecha_fin_viaje,
            );
        }

        //verificar el avnce de los dias a viajar

        const ID_MEMORANDUM = data.id;
        const props: MemorandumrrhhProps = {
            codDepartMemo: data.cod_depart_memo,
            tipoMemorandum: data.tipo_memorandum,
            autorizadoPor: data.autorizado_por,
            // cargoJefeUnidad      : data.cargo_jefe_unidad,
            fechaMemoRegistro: data.fecha_memo_registro,
            tipoComisionIDP: data.tipo_comision_idp,
            fechaInicioViaje: data.fecha_inicio_viaje,
            fechaFinViaje: data.fecha_fin_viaje,
            cantidadDias: cantidadDiasMemo,
            tipoMemoRepo: data.tipo_memo_repo,
            tipoTransporte: data.tipo_transporte,
            observacion: data.observacion,
            estadoMemorandum: data.estado_memorandum,
            notificacionMemo: data.notificacion_memo,
            diasHabiles: data.dias_habiles,            
            usuarioId: data.usuario_id,
            modificacion         : data.modificacion,
            obsModificacion      : data.obs_modificacion,
            fechaCambio          : data.fecha_cambio,
            estadoModificacion   : data.estado_modificacion,
        };
        let result = null;
        if (ID_MEMORANDUM) {
            result = await MemorandumrrhhService.update(ID_MEMORANDUM, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }
        result = await MemorandumrrhhService.create(props);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async destroyMemorandumDetalle(req: Request, res: Response): Promise<any> {
        const ID_DETALLE_DESTINO = req.params.detalle_id;
		
        const detalle_destino = await DetalleDestinorrhhService.getById(ID_DETALLE_DESTINO);
        if (detalle_destino.isFailure) return this.fail(res, String(detalle_destino.error));

        const result = await DetalleDestinorrhhService.delete(ID_DETALLE_DESTINO);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }    

    public async destroyMemorandum(req: Request, res: Response): Promise<any> {
        const ID_MEMO = req.params.memorandum_rrhh_id;
        const memorandumR = await MemorandumrrhhService.getById(ID_MEMO);
        if (memorandumR.isFailure) return this.fail(res, String(memorandumR.error));

        /*Listado de Detalle Destino */
        const detalleDestino = await DetalleDestinorrhhService.getAll();
        if (detalleDestino.isFailure) return Result.fail("Falló al obtener la DetalleDestino");

        //Lista de destinos
        const listaDestinos: DetalleDestinorrhhOptionsFormModel [] = detalleDestino.getValue().map((item) => {
            return {
                id: item.id.toString(),
                nombre: item.props.memorandumrrhhId,
                caption: item.props.destinoReg,
            };
        });

        // Se filta por los destinos
        const filtroDestinos: DetalleDestinorrhhOptionsFormModel[] = listaDestinos.filter((item) =>
            this.filtrarId(item.nombre, ID_MEMO),
        );

        if (filtroDestinos.length > 0) {
            filtroDestinos.forEach(async (item) => {
                const detalleDestinoR = DetalleDestinorrhhService.getById(item.id);
                if ((await detalleDestinoR).isFailure) return this.fail(res, String((await detalleDestinoR).error));
                const resultDestino = await DetalleDestinorrhhService.delete(item.id);
                if (resultDestino.isFailure) return Result.fail(result.error);
            });
        }
        //seleccionamos del listado de area el nombre del departamento y su sigla
        const result = await MemorandumrrhhService.delete(ID_MEMO);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }
    
    //filtramos por el tipo de id
    public filtrarId(item: string, id: string) {
        return item === id;
    }

    //Se agrega para memorandum detalle
    public async getTableMemorandumDetalle(req: Request, res: Response): Promise<any> {
        const AUTH_USER: AuthUser = req.authUser;
       
        const memorandums = await MemorandumrrhhView.getTableMemorandumDetalle(		
            AUTH_USER,
            req.query,
            req.params.memorandum_rrhh_id,			
        );
        if (memorandums.isFailure) return this.fail(res, "Falló al obtener la tabla de proceso");
        return this.ok<any>(res, memorandums.getValue());
    }

    public async changeModificacion(req: Request, res: Response): Promise<any> {
        const memorandumId = req.params.memorandum_rrhh_id;		
        const modificacion = Boolean(req.body.modificacion);	
        const obsModificacion = req.body.observacion;		
        const fechaCambio = req.body.fecha;	
        const estadoModificacion = req.body.estadoModif;	

        /* [dia, mes, anio] = fechaCambio.split('/').map(Number);
        const fechaFormat = new Date(anio, mes - 1, dia); // mes es 0-indexado*/

        // Guardando valores en los destinos 
         /*Listado detalle destino*/    
        const detalleDestino = await DetalleDestinorrhhService.getAll();
        if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Detalle Destino");
                  
        const listaDestinos: DetalleDestinorrhhOptionsFormModel2[] = detalleDestino
              .getValue()
              .map((value) => {                
                return {                
                 id: value.id.toString(),
                 nombre: value.props.memorandumrrhhId,
                 caption : value.props.fechaDia,                                             
                    };            
                }) ;     

     // Se filta por los id de memo
      const filtroDestinos : DetalleDestinorrhhOptionsFormModel2 [] = listaDestinos       
     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
     .filter((value) => this.filtrarId(value.nombre,memorandumId)).sort((a, b) => a.caption! > b.caption! ? 1 : -1); 

     let observacionesString = "";    
     let fechaStringConcat = "";
     let modificacionMemo = false;
     let estadoModifMemo = "";
        
      for(let i = 0; i < filtroDestinos.length ; i++){
            const destinoFecha = filtroDestinos[i];
            const fechaString = destinoFecha.caption?moment(destinoFecha.caption).format("DD/MM/YYYY").toString(): '';
            const fechaCambioAux = fechaCambio[i];
			if(fechaString === fechaCambioAux.nombre){
				
                const props : ModificacionDetalleDestino= {						
					
                    // id : memorandumId,
                     modificacion: modificacion,
                     observacion: obsModificacion[i].b,                    
                     estadoObservacion: estadoModificacion[i].b,
                 }
                 // Datos para los campos del memorandum
                
                 if(estadoModificacion[i].b === "OBSERVADO"){
                    observacionesString = observacionesString.concat(obsModificacion[i].b).concat(" - ");                  
                    fechaStringConcat = fechaStringConcat.concat(fechaCambioAux.nombre).concat(" - ");                  
                    modificacionMemo = true;					
                    estadoModifMemo = "OBSERVADO"					
                 }
                
                 //Fin datos para el campo del memo
                const resultDestino = await DetalleDestinorrhhService.update(filtroDestinos[i].id, props);	
                if (resultDestino.isFailure) return this.fail(res, "Falló al actualizar las observaciones del destino en detalle destino");
            }
      }
        //fin de guardado
        //Actualizacion en el memorandum       
        const propsMemo : ModificacionMemorandum = {			
			
            modificacion : modificacionMemo,
            obsModificacion : observacionesString,
            fechaCambio : fechaStringConcat,
            estadoModificacion: estadoModifMemo,
            estadoMemorandum:"PENDIENTE"
        }   
      
       const result = await MemorandumrrhhService.update(memorandumId, propsMemo);
   
        if (result.isFailure) return this.fail(res, "Falló al actualizar las observaciones de modificaciones al Memorandum");
        return this.ok(res);

         //fin actualizacion en el memorandum
    }

    //cambio de estado a aprobado
    public async changeApprove(req: Request, res: Response): Promise<any> {
        const ID_MEMORANDUM = req.params.memorandum_rrhh_id;
        const estadoMemorandum = req.body.aprobado;

        if (estadoMemorandum === ENUM_APROBADO_JEFE) {
            //
        }
        if (estadoMemorandum === ENUM_APROBADO_CONTABILIDAD) {
            //cuando el memorandum se encuentra aprobado se crea la fila en viaticos para editar los valores
            const memorandumAprove = await MemorandumrrhhService.getById(ID_MEMORANDUM);
            if (memorandumAprove.isFailure) return this.fail(res, String(memorandumAprove.error));
            //detalle destino
            const detalleDestino = await DetalleDestinorrhhService.getAll();
            if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Detalle Destino");
            
        }

        const result = await MemorandumrrhhService.update(ID_MEMORANDUM, { estadoMemorandum });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado en memorandum");

        return this.ok(res);
    }
    public filtrarEstado(item: string, estado: string) {
        return item != estado;
    }

    public async getPDFMemorandum(req: Request, res: Response): Promise<any> {
	
        const id: string = req.body.id;
        const memorandumResult = await MemorandumrrhhView.getPDFMemorandum(req.authUser, id);		
        if (memorandumResult.isFailure) return this.fail(res, String(memorandumResult.error));
        const result = memorandumResult.getValue();
        return MemorandumReport.creaPDF(result, "memorandum", res);
    }

    public async getPDFMemorandumReporte(req: Request, res: Response): Promise<any> {
   
    const queryString = req.body.qs;		
    const idMemorandumrrhh = req.params.id; 
    const fechaInicio = req.body.data.fechaInicio; 	
    const fechaFin = req.body.data.fechaFin; 		
	
    const tipoFecha = req.body.data.tipoFecha; 	
    let idsFiltrosReporte;
	if(req.body.data != undefined){
         idsFiltrosReporte = req.body.data.ids;  
    }   
	
    const formData = await MemorandumrrhhView.getMemorandumrrhhReport(req.authUser,queryString, idMemorandumrrhh, idsFiltrosReporte, fechaInicio, fechaFin, tipoFecha);

    if (formData.isFailure) return this.fail(res, String(formData.error));
    const result = formData.getValue();	
    return MemorandumrrhhReport.creaPDF(result,'memorandumrrhhReport', res);
   }    

    //Se agrega para memorandum detalle
    public async getTipoPCP(req: Request, res: Response): Promise<any> {
        const memorandums = await MemorandumrrhhView.getTipoPCP(req.params.memorandum_rrhh_id);
        if (memorandums.isFailure) return this.fail(res, "Falló al obtener El tipo de comisión");
        return this.ok<MemorandumTipoPCPOptionsFormModel>(res, memorandums.getValue());
    }

    //Se agrega para memorandum detalle
    public async getControlCountDias(req: Request, res: Response): Promise<any> {
        const memorandums = await MemorandumrrhhView.getControlCountDias(req.params.memorandum_rrhh_id);
        if (memorandums.isFailure) return this.fail(res, "Falló al obtener El control interno de conteo de dias");
        return this.ok<any>(res, memorandums.getValue());
    }

    //Se agrega para detalle memorandum
    public async getDatosMemorandum(req: Request, res: Response): Promise<any> {
        const detalleDestino = await MemorandumrrhhView.getDatosMemorandum(req.params.memorandum_rrhh_id);
        if (detalleDestino.isFailure) return this.fail(res, "Falló al obtener los detalles del memorandum");
        return this.ok<any>(res, detalleDestino.getValue());
    }

    public async getCodMemoData(req: Request, res: Response): Promise<any> {
        const nro = String(req.params.nro);
        //  const recibo = req.params.recibo;
        const codMemo = await MemorandumrrhhService.getAll();
        if (codMemo.isFailure) return this.fail(res, "Memorandum no encontrado");
        const codMemoResult = codMemo
            .getValue()
            .filter((d) => d.props.codDepartMemo === nro)
            .map((dd) => dd.props.codDepartMemo);
        return this.ok<any>(res, { nro: codMemoResult.length > 0 });
    }
    public async getDiaHabil(req: Request, res: Response): Promise<any> {
        const memorandums = await MemorandumrrhhView.getDiaHabil(req.params.memorandum_rrhh_id);
        if (memorandums.isFailure) return this.fail(res, "Falló al obtener el dia Habil");
        return this.ok<MemorandumTipoPCPOptionsFormModel>(res, memorandums.getValue());
    }

    public async changeState(req: Request, res: Response): Promise<any> {
        const ID_MEMORANDUM = req.params.memorandum_rrhh_id;
        const estadoMemorandum = req.body.estado;

        const result = await MemorandumrrhhService.update(ID_MEMORANDUM, { estadoMemorandum });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado");

        return this.ok(res);
    }

    public async getAllCites(req: Request, res: Response): Promise<any> { 
        const cite = await MemorandumrrhhView.getAllCites();	
        if (cite.isFailure) return this.fail(res, 'Falló al obtener el CITE ');
        return this.ok<any>(res, cite.getValue());
      }

    public async getFechaFiltro(req: Request, res: Response): Promise<Response<any>> {
    const memorandumrrhhFiltro = await MemorandumrrhhView.getFechaFiltro(req.params.fechaInicio, req.params.fechaFin, req.query);
    if (memorandumrrhhFiltro.isFailure) return this.fail(res, "Falló al obtener la tabla de Memorandumrrhh filtro de fechas ");
    return this.ok<any>(res, memorandumrrhhFiltro.getValue());
    }

public async getNombreApellido(req: Request, res: Response): Promise<Response<any>> {      
    const memorandumrrhhFiltro = await MemorandumrrhhView.getNombreApellido(req.params.nombre, req.params.apellido, req.query);	
    if (memorandumrrhhFiltro.isFailure) return this.fail(res, "Falló al obtener la tabla de Memorandumrrhh filtro de fechas ");
    return this.ok<any>(res, memorandumrrhhFiltro.getValue());
}

public async getDatosBeneficiario(req: Request, res: Response): Promise<Response<any>> {
    const memorandumrrhhFiltro = await MemorandumrrhhView.getDatosBeneficiario(req.params.fechaInicio, req.params.fechaFin,req.params.beneficiario, req.query);
    if (memorandumrrhhFiltro.isFailure) return this.fail(res, "Falló al obtener la tabla de Memorandumrrhh filtro de fechas ");
    return this.ok<any>(res, memorandumrrhhFiltro.getValue());
}

public async getTipoUsuario(req: Request, res: Response): Promise<Response<any>> {      
    
    const memorandumrrhhFiltro = await MemorandumrrhhView.getTipoUsuario(req.params.tipo, req.query);		
    if (memorandumrrhhFiltro.isFailure) return this.fail(res, "Falló al obtener la tabla de Memorandumrrhh filtro de tipo de funcionario ");
    return this.ok<any>(res, memorandumrrhhFiltro.getValue());
}

public async getTipoEstado(req: Request, res: Response): Promise<Response<any>> {      
    
    const memorandumrrhhFiltro = await MemorandumrrhhView.getTipoEstado(req.params.estado, req.query);		
    if (memorandumrrhhFiltro.isFailure) return this.fail(res, "Falló al obtener la tabla de Memorandumrrhh filtro de tipo de estado");
    return this.ok<any>(res, memorandumrrhhFiltro.getValue());
}

public async getReportJSON(req: Request, res: Response): Promise<any> {
  const idMemorandumrrhh = req.params.id; 
  const queryString = req.body.qs;	
  const params = new URLSearchParams(queryString);
  const tipoReporte = String(params.get("tipo_reporte")); //
  const fechaInicio = req.body.data.fechaInicio; 
  const fechaFin = req.body.data.fechaFin;
  
    let idsFiltrosReporte;
	if(req.body.data != undefined){
         idsFiltrosReporte = req.body.data.ids;  
    }   
	
    const formData = await MemorandumrrhhView.generarFilasExcel(req.authUser,queryString, idMemorandumrrhh, idsFiltrosReporte, fechaInicio, fechaFin);
	
    if (formData.isFailure) return this.fail(res, String(formData.error));
    const result = formData.getValue();	
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte Memorandum RR.HH.');
      // Definir columnas con estilos base
    
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    worksheet.columns = await MemorandumrrhhView.generarHeadExcel(tipoReporte)!;     
       // Estilo de los encabezados
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; 
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4472C4' }, // azul oscuro
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

     //Aqui falta aumentar fila 
     const formatData = await MemorandumrrhhView.getFormatData(result.data);
       
   let contadorFilas =  2;
       
  switch(tipoReporte){
    case ENUM_GENERAL:
         
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unused-vars
      formatData!.forEach((item: any, index: number) => {
       
        worksheet.addRow({        
                numero                : item.numero,
                tipo_memorandum       : item.tipo_memorandum,
                usuario_ci            : item.usuario_ci,
                usuario_nombre        : item.usuario_nombre,
                sigla                 : item.sigla,
                cod_depart_memo       : item.cod_depart_memo,
                destino               : item.destino,
                fecha_inicio_viaje    : item.fecha_inicio_viaje,
                fecha_fin_viaje       : item.fecha_fin_viaje,
                estado_memorandum     : item.estado_memorandum,
                cantidad_dias         : !Number.isNaN(item.cantidad_dias)?item.cantidad_dias: "-",
                tipo_usuario          : item.tipo_usuario,
              //  area_id               : item.sigla,  // verificar
        });
      });

      break;  
    case ENUM_REPORTE_POR_PROYECTO:
     
       formData.getValue().data?.lista_areas.forEach(element => {
          worksheet.addRow([element.nombre]); // fila vacía
          worksheet.mergeCells(`A${contadorFilas}:M${contadorFilas}`); // opcional: que ocupe todas las columnas
          worksheet.getRow(contadorFilas).font = { bold: true };
//worksheet.mergeCells(`A1:M1`)					
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unused-vars
          formatData!.forEach((item: any, index: number) => {            
            if(item.area_id === element.id){
              contadorFilas++;
              worksheet.addRow({        
                numero                : item.numero,
                tipo_memorandum       : item.tipo_memorandum,
                usuario_ci            : item.usuario_ci,
                usuario_nombre        : item.usuario_nombre,
                sigla                 : item.sigla,
                cod_depart_memo       : item.cod_depart_memo,
                destino               : item.destino,
                fecha_inicio_viaje    : item.fecha_inicio_viaje,
                fecha_fin_viaje       : item.fecha_fin_viaje,
                estado_memorandum     : item.estado_memorandum,
                cantidad_dias         : !Number.isNaN(item.cantidad_dias)?item.cantidad_dias: "-",
                tipo_usuario          : item.tipo_usuario,
               // area_id               : item.area_solicitante,  // verificar                          
            });       
          }          
         });
           contadorFilas++;
       });
     
      break;  
    
    case ENUM_REPORTE_POR_BENEFICIARIO:

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (formData.getValue().data?.idBeneficiario[0].ci === formatData![0].usuario_ci){
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        worksheet.insertRow(contadorFilas, ["Nombre: ".concat(formatData![0].usuario_nombre!).concat("  C.I.: ").concat(formatData![0].usuario_ci!)]); // fila vacía
     //worksheet.mergeCells(`A1:M1`)					
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unused-vars
        formatData!.forEach((item: any, index: number) => {
            worksheet.addRow({        
                numero                : item.numero,
                tipo_memorandum       : item.tipo_memorandum,
                usuario_ci            : item.usuario_ci,
                usuario_nombre        : item.usuario_nombre,
                sigla                 : item.sigla,
                cod_depart_memo       : item.cod_depart_memo,
                destino               : item.destino,
                fecha_inicio_viaje    : item.fecha_inicio_viaje,
                fecha_fin_viaje       : item.fecha_fin_viaje,
                estado_memorandum     : item.estado_memorandum,
                 cantidad_dias         : !Number.isNaN(item.cantidad_dias)?item.cantidad_dias: "-",
                tipo_usuario          : item.tipo_usuario,
              //  area_id               : item.area_solicitante,  // verificar                           
          });
          contadorFilas++;          
       });
      }
     break;  
    case ENUM_REPORTE_POR_TIPO:     
   
   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unused-vars
   formatData!.forEach((item: any, index: number) => {
      worksheet.addRow({        
                numero                : item.numero,
                tipo_memorandum       : item.tipo_memorandum,
                usuario_ci            : item.usuario_ci,
                usuario_nombre        : item.usuario_nombre,
                sigla                 : item.sigla,
                cod_depart_memo       : item.cod_depart_memo,
                destino               : item.destino,
                fecha_inicio_viaje    : item.fecha_inicio_viaje,
                fecha_fin_viaje       : item.fecha_fin_viaje,
               estado_memorandum     : item.estado_memorandum,
                cantidad_dias         : !Number.isNaN(item.cantidad_dias)?item.cantidad_dias: "-",
                tipo_usuario          : item.tipo_usuario,
             //   area_id               : item.area_solicitante,  // verificar       
      });
    });
    
      break;  
  }

      // Estilos para las filas de datos
    worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
        if (rowNumber === 1) return; // saltar encabezado
  
        row.eachCell((cell) => {
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      });
  
      // Preparar descarga
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=reporte_viatico_${idMemorandumrrhh}.xlsx`
      );
  
      await workbook.xlsx.write(res);
      res.end();
  
  
}



}
