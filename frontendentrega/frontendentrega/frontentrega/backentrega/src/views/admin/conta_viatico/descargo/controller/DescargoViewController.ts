import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import ExcelJS from 'exceljs';
import { Result } from "../../../../../base/types/Result";
import DescargoView from "..";
import { DescargoFormDataResponse } from "../DescargoView";
import  DescargoService  from "../../../../../core/admin/conta_viatico/descargo";
import { DescargoProps } from "../../../../../core/admin/conta_viatico/descargo/DescargoEntity";
import { ViaticoGeneralReport } from "../../../../../tools/ViaticoGeneralReport";
import { ENUM_ANULADO, ENUM_GENERAL, ENUM_REPORTE_FF_OF, ENUM_REPORTE_PARA_RRHH, ENUM_REPORTE_POR_BENEFICIARIO, ENUM_REPORTE_POR_PLANILLA, ENUM_REPORTE_POR_PROYECTO, ENUM_REPORTE_POR_TIPO } from "../../../../../base/constants/enum";

export class DescargoViewController extends BaseHttpController {
    public async getDescargosTable(req: Request, res: Response): Promise<Response<any>> {       
       let descargo;
       if(req.query.tipo_reporte){
            const newQuery = { ...req.query };
            delete newQuery.tipo_reporte;
             descargo = await DescargoView.getDescargosTable(newQuery);            
        }else{        
             descargo = await DescargoView.getDescargosTable(req.query);
        }   

     //   const descargo = await DescargoView.getDescargosTable(req.query);	 
        if (descargo.isFailure) return this.fail(res, "Falló al obtener la tabla de Descargo");
        return this.ok<any>(res, descargo.getValue());
    }

    public async getDescargoFormData(req: Request, res: Response): Promise<any> {
        const formData = await DescargoView.getDescargoFormDataView(req.params.descargo_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<DescargoFormDataResponse>(res, formData.getValue());
    }    

    public async createOrUpdateDescargo(req: Request, res: Response): Promise<any> {
        const data = req.body;
            
        const ID_DESCARGO = data.id;
        const props: DescargoProps = {
                fechaDescargo         : data.fecha_descargo,
                estadoDescargo        : data.estado_descargo,
                viaticoPasajeReal     : data.viatico_pasaje_real,
                montoDespositado      : data.monto_despositado,
                montoDescargo         : data.monto_descargo,
                saldoDescargo         : data.saldo_descargo,
                presentaInforme       : data.presenta_informe,
                viaticoReal           : data.viatico_real,
                observacionEstado     : data.observacion_estado,
                observacionDescargo   : data.observacion_descargo,              
                prorroga              : data.prorroga,
                tiempoDescargo        : data.tiempo_descargo,
                notificacionDescargo  : data.notificacion_descargo,
                viaticoId             : data.viatico_id,   
        };
        let result = null;
        if (ID_DESCARGO) {
            result = await DescargoService.update(ID_DESCARGO, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }

        // Guardia de idempotencia: un viatico solo puede tener un descargo activo.
        if (data.viatico_id) {
            const posiblesDuplicados = await DescargoService.getAll({ fid_viatico: data.viatico_id });
            if (posiblesDuplicados.isSuccess) {
                const yaExisteActivo = posiblesDuplicados
                    .getValue()
                    .some((d) => d.props.estadoDescargo !== ENUM_ANULADO);
                if (yaExisteActivo) {
                    return this.fail(res, "Ya existe un descargo registrado para este viatico.");
                }
            }
        }

        result = await DescargoService.create(props);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async destroyDescargo(req: Request, res: Response): Promise<any> {
        const ID_DESCARGO_KEY = req.params.descargo_id;
        const descargoR = await DescargoService.getById(ID_DESCARGO_KEY);
        if (descargoR.isFailure) return this.fail(res, String(descargoR.error));

        const result = await DescargoService.delete(ID_DESCARGO_KEY);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }


    //cambio de estado a aprobado
public async changeApproveDescargo(req: Request, res: Response): Promise<any> {
    const ID_DESCARGO = req.params.id_descargo;	
    const estadoDescargo = req.body.aprobado;   
   
    if(estadoDescargo === "DESCARGADO") {            
    
    const result = await DescargoService.update(ID_DESCARGO, { estadoDescargo });
    if (result.isFailure) return this.fail(res, "Falló al cambiar estado en memorandum");
   
    return this.ok(res);
    }

  }

  public async changeApproveInforme(req: Request, res: Response): Promise<any> {
    const ID_DESCARGO = req.params.id_descargo;
    const presentaInforme = req.body.aprobado;      
    if(presentaInforme === "PRESENTA") {               
      const result = await DescargoService.update(ID_DESCARGO, { presentaInforme });
    if (result.isFailure) return this.fail(res, "Falló al cambiar estado en memorandum");
   
    return this.ok(res);
    }

  }

  public async getPDFReporte(req: Request, res: Response): Promise<any> {

    const queryString = req.body.qs;	
    const idDescargo = req.params.id; 
    const fechaInicio = req.body.data.fechaInicio; 
    const fechaFin = req.body.data.fechaFin; 
    let idsFiltrosReporte;
	if(req.body.data != undefined){
         idsFiltrosReporte = req.body.data.ids;  
    }   
	
    const formData = await DescargoView.getViaticoReport(req.authUser,queryString, idDescargo, idsFiltrosReporte, fechaInicio, fechaFin);

    if (formData.isFailure) return this.fail(res, String(formData.error));
    const result = formData.getValue();	
    return ViaticoGeneralReport.creaPDF(result,'viaticoGeneral', res);
}


public async getFechaFiltro(req: Request, res: Response): Promise<Response<any>> {
    const descargoFiltro = await DescargoView.getFechaFiltro(req.params.fechaInicio, req.params.fechaFin, req.query);
    if (descargoFiltro.isFailure) return this.fail(res, "Falló al obtener la tabla de Descargo filtro de fechas ");
    return this.ok<any>(res, descargoFiltro.getValue());
}

public async getNombreApellido(req: Request, res: Response): Promise<Response<any>> {      
    const descargoFiltro = await DescargoView.getNombreApellido(req.params.nombre, req.params.apellido, req.query);	
    if (descargoFiltro.isFailure) return this.fail(res, "Falló al obtener la tabla de Descargo filtro de fechas ");
    return this.ok<any>(res, descargoFiltro.getValue());
}

public async getDatosBeneficiario(req: Request, res: Response): Promise<Response<any>> {
    const descargoFiltro = await DescargoView.getDatosBeneficiario(req.params.fechaInicio, req.params.fechaFin,req.params.beneficiario, req.query);
    if (descargoFiltro.isFailure) return this.fail(res, "Falló al obtener la tabla de Descargo filtro de fechas ");
    return this.ok<any>(res, descargoFiltro.getValue());
}

public async getTipoUsuario(req: Request, res: Response): Promise<Response<any>> {      
    
    const descargoFiltro = await DescargoView.getTipoUsuario(req.params.fechaInicio, req.params.fechaFin,req.params.tipo, req.query);		
    if (descargoFiltro.isFailure) return this.fail(res, "Falló al obtener la tabla de Descargo filtro de tipo de funcionario ");
    return this.ok<any>(res, descargoFiltro.getValue());
}

public async getTipoEstado(req: Request, res: Response): Promise<Response<any>> {      
    
    const descargoFiltro = await DescargoView.getTipoEstado(req.params.fechaInicio, req.params.fechaFin,req.params.estado, req.query);		
    if (descargoFiltro.isFailure) return this.fail(res, "Falló al obtener la tabla de Descargo filtro de tipo de estado");
    return this.ok<any>(res, descargoFiltro.getValue());
}

public async getEstadoPago(req: Request, res: Response): Promise<Response<any>> {      
    
    const descargoFiltro = await DescargoView.getEstadoPago(req.params.fechaInicio, req.params.fechaFin,req.params.estado, req.query);		
    if (descargoFiltro.isFailure) return this.fail(res, "Falló al obtener la tabla de Descargo filtro de tipo de estado Pago");
    return this.ok<any>(res, descargoFiltro.getValue());
}

public async getTipoVencimiento(req: Request, res: Response): Promise<Response<any>> {      
    const descargoFiltro = await DescargoView.getTipoVencimiento(req.params.fechaInicio, req.params.fechaFin,Number(req.params.tipo), req.query);		
    if (descargoFiltro.isFailure) return this.fail(res, "Falló al obtener la tabla de Descargo filtro de tipo Anulado ");
    return this.ok<any>(res, descargoFiltro.getValue());
}
public async getTipoPostPagoCancelado(req: Request, res: Response): Promise<Response<any>> {    
    const descargoFiltro = await DescargoView.getTipoPostPagoCancelado(req.params.fechaInicio, req.params.fechaFin,req.params.tipo, req.query);		
    if (descargoFiltro.isFailure) return this.fail(res, "Falló al obtener la tabla de Descargo filtro de tipo Anulado ");
    return this.ok<any>(res, descargoFiltro.getValue());
}
public async getTipoAnulado(req: Request, res: Response): Promise<Response<any>> {      
    const descargoFiltro = await DescargoView.getTipoAnulado(req.params.fechaInicio, req.params.fechaFin,req.params.tipo, req.query);		
    if (descargoFiltro.isFailure) return this.fail(res, "Falló al obtener la tabla de Descargo filtro de tipo Anulado ");
    return this.ok<any>(res, descargoFiltro.getValue());
}

public async getReportJSON(req: Request, res: Response): Promise<any> {
  const idDescargo = req.params.id; 
  const queryString = req.body.qs;	
  const fechaInicio = req.body.data.fechaInicio; 
  const fechaFin = req.body.data.fechaFin; 	
  const params = new URLSearchParams(queryString);
  const tipoReporte = String(params.get("tipo_reporte")); //
  
    let idsFiltrosReporte;
	if(req.body.data != undefined){
         idsFiltrosReporte = req.body.data.ids;  
    }   
	
    const formData = await DescargoView.generarFilasExcel(req.authUser,queryString, idDescargo, idsFiltrosReporte, fechaInicio, fechaFin);
		
    if (formData.isFailure) return this.fail(res, String(formData.error));
    const result = formData.getValue();	
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte Viático');
      // Definir columnas con estilos base
    
    worksheet.columns = await DescargoView.generarHeadExcel(tipoReporte)!;
     
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
     const formatData = await DescargoView.getFormatData(result.data);   
   let contadorFilas =  1;
       
  switch(tipoReporte){
    case ENUM_GENERAL:   
     formatData!.sort((a, b) => a.fecha_pago_viatico! > b.fecha_pago_viatico! ?-1:1);   
      formatData!.forEach((item: any, index: number) => {
        worksheet.addRow({    
              fecha_pago_viatico_format : item.fecha_pago_viatico_format,     
              nume_recibo            : item.nume_recibo,                      
              apertura_programatica  : item.apertura_programatica,          
              ff_of                  : item.ff_of,
              usuario_ci             : item.usuario_ci,                     
              usuario_nombre         : item.usuario_nombre,
              sigla                  : item.sigla, 
              cod_depart_memo        : item.cod_depart_memo,          
              destino                : item.destino,
              fecha_inicio_viaje     : item.fecha_inicio_viaje,           
              fecha_fin_viaje        : item.fecha_fin_viaje,          
              estado_pago            : item.estado_pago,      
              total_pasajes          : item.total_pasajes,          
              total_viatico          : item.total_viatico,          
              liquido_pagable        : item.liquido_pagable,  
             
        });
      });
      break;  
    case ENUM_REPORTE_POR_PLANILLA:
      formatData!.forEach((item: any, index: number) => {
        worksheet.addRow({  
              fecha_pago_viatico_format : item.fecha_pago_viatico_format,      
              nume_recibo            : item.nume_recibo,    
              ff_of                  : item.ff_of,                  
              apertura_programatica  : item.apertura_programatica,          
              usuario_nombre         : item.usuario_nombre,
              usuario_ci             : item.usuario_ci,  
              cod_depart_memo        : item.cod_depart_memo,      
              destino                : item.destino,
              fecha_inicio_viaje     : item.fecha_inicio_viaje,           
              fecha_fin_viaje        : item.fecha_fin_viaje,          
              total_pasajes          : item.total_pasajes,          
              total_viatico          : item.total_viatico,          
              liquido_pagable        : item.liquido_pagable,  
              descargo               : item.descargo,
              deposito               : item.deposito,
              descuento              : item.descuento              
        });
      });
      break;  
    case ENUM_REPORTE_POR_PROYECTO:
      
       formData.getValue().data?.lista_areas.forEach(element => {
          const filaTitulo = worksheet.addRow([element.nombre]); // fila vacía
           filaTitulo.font = { bold: true };
        //  worksheet.mergeCells(`A${contadorFilas}:M${contadorFilas}`); // opcional: que ocupe todas las columnas
          worksheet.getRow(contadorFilas);				
          formatData!.forEach((item: any, index: number) => {                     
            if(item.area_id === element.id){
              contadorFilas++;
               worksheet.addRow({     
                fecha_pago_viatico_format : item.fecha_pago_viatico_format,   
                ff_of                  : item.ff_of,  
                apertura_programatica  : item.apertura_programatica,          
                nume_recibo            : item.nume_recibo,  
                usuario_ci             : item.usuario_ci,                     
                usuario_nombre         : item.usuario_nombre,
                sigla                  : item.sigla, 
                cod_depart_memo        : item.cod_depart_memo,      
                destino                : item.destino,
                fecha_inicio_viaje     : item.fecha_inicio_viaje,           
                fecha_fin_viaje        : item.fecha_fin_viaje,          
                total_pasajes          : item.total_pasajes,          
                total_viatico          : item.total_viatico,          
                liquido_pagable        : item.liquido_pagable,                           
            });           
          }          
         });
         contadorFilas++;
       });
     
      break;  
    case ENUM_REPORTE_FF_OF: 
    formData.getValue().data?.lista_ffof.forEach(element => {
       const filaTitulo = worksheet.addRow([element]);//worksheet.insertRow(contadorFilas, [element]); // fila vacía
     
       filaTitulo.font = { bold: true };
      //worksheet.mergeCells(`A1:M1`)					
      formatData!.forEach((item: any, index: number) => {            
        if(item.ff_of === element){
          worksheet.addRow({   
            fecha_pago_viatico_format : item.fecha_pago_viatico_format,     
            ff_of                  : item.ff_of,  
            apertura_programatica  : item.apertura_programatica,          
            nume_recibo            : item.nume_recibo,  
            usuario_ci             : item.usuario_ci,                     
            usuario_nombre         : item.usuario_nombre,
            sigla                  : item.sigla, 
            cod_depart_memo        : item.cod_depart_memo,      
            destino                : item.destino,
            fecha_inicio_viaje     : item.fecha_inicio_viaje,           
            fecha_fin_viaje        : item.fecha_fin_viaje,          
            total_pasajes          : item.total_pasajes,          
            total_viatico          : item.total_viatico,          
            liquido_pagable        : item.liquido_pagable,                           
        });
        contadorFilas++;
      }          
     });
   });
    break;  
    case ENUM_REPORTE_POR_BENEFICIARIO:
      if (formData.getValue().data?.idBeneficiario[0].usuario_ci === formatData![0].usuario_ci){
        worksheet.insertRow(contadorFilas, ["Nombre: ".concat(formatData![0].usuario_nombre).concat("  C.I.: ").concat(formatData![0].usuario_ci)]); // fila vacía
     //worksheet.mergeCells(`A1:M1`)					
        formatData!.forEach((item: any, index: number) => {
            worksheet.addRow({      
              fecha_pago_viatico_format : item.fecha_pago_viatico_format,  
              ff_of                  : item.ff_of,  
              apertura_programatica  : item.apertura_programatica,          
              nume_recibo            : item.nume_recibo,  
              usuario_ci             : item.usuario_ci,                     
              usuario_nombre         : item.usuario_nombre,
              sigla                  : item.sigla, 
              cod_depart_memo        : item.cod_depart_memo,      
              destino                : item.destino,
              fecha_inicio_viaje     : item.fecha_inicio_viaje,           
              fecha_fin_viaje        : item.fecha_fin_viaje,          
              total_pasajes          : item.total_pasajes,          
              total_viatico          : item.total_viatico,          
              liquido_pagable        : item.liquido_pagable,                           
          });
          contadorFilas++;          
       });
      }
     break;  
    case ENUM_REPORTE_POR_TIPO:       
   formatData!.forEach((item: any, index: number) => {
      worksheet.addRow({ 
           fecha_pago_viatico_format : item.fecha_pago_viatico_format,       
            nume_recibo            : item.nume_recibo,
            tipo_usuario           : item.tipo_usuario,
            ff_of                  : item.ff_of,                  
            apertura_programatica  : item.apertura_programatica,          
            usuario_nombre         : item.usuario_nombre,
            usuario_ci             : item.usuario_ci,  
            cod_depart_memo        : item.cod_depart_memo,      
            destino                : item.destino,
            fecha_inicio_viaje     : item.fecha_inicio_viaje,           
            fecha_fin_viaje        : item.fecha_fin_viaje, 
            estado_pago            : item.estado_pago,         
            total_pasajes          : item.total_pasajes,          
            total_viatico          : item.total_viatico,          
            liquido_pagable        : item.liquido_pagable,  
            descargo               : item.descargo,
            deposito               : item.deposito,
            descuento              : item.descuento              
      });
    });
    
      break;  
     /*  case ENUM_REPORTE_PARA_RRHH:     
   formatData!.sort((a, b) => a.fecha_inicio_viaje > b.fecha_inicio_viaje ?1:-1);    
   formatData!.forEach((item: any, index: number) => {
      worksheet.addRow({        
            nume_recibo            : item.nume_recibo,
            tipo_usuario           : item.tipo_usuario,
            //ff_of                  : item.ff_of,                  
            apertura_programatica  : item.apertura_programatica,          
            usuario_nombre         : item.usuario_nombre,
            usuario_ci             : item.usuario_ci,  
            cod_depart_memo        : item.cod_depart_memo,      
            destino                : item.destino,
            fecha_inicio_viaje     : item.fecha_inicio_viaje,           
            fecha_fin_viaje        : item.fecha_fin_viaje, 
            estado_pago            : item.estado_pago,         
            estado_modificacion    : item.estado_modificacion,
            
      });
    });
    
      break;  */
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
        `attachment; filename=reporte_viatico_${idDescargo}.xlsx`
      );
  
      await workbook.xlsx.write(res);
      res.end();
  
  
}

}
