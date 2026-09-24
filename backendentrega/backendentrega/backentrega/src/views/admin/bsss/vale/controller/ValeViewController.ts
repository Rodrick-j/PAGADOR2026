import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import ExcelJS from "exceljs";
import { AuthUser } from "../../../../../base/types/AuthUser";
import { numeroALetras } from "../../../../../tools/util";
import { PRECIO_UNITARIO_DIESEL, PRECIO_UNITARIO_GASOLINA, VALE_SALDO_MINIMO } from "../../../../../config/app-config";
import { Report2 } from "../../../../../tools/Report2";
import { Report } from "../../../../../tools/Report";

import ValeView from "..";
import { ValeProps } from "../../../../../core/admin/bsss/vale/ValeEntity";
import ValeService from "../../../../../core/admin/bsss/vale";
import VehiculoService from "../../../../../core/admin/bsss/vehiculo";
import AreaService from "../../../../../core/rrhh/area";
import AperturaGeneralService from "../../../../../core/admin/apertura/apertura_general";

import { ValeFormDataResponse, VehiculoAperturaResponse } from "../ValeView";
import { HistorialGastoProps } from "../../../../../core/admin/apertura/historial_gasto/HistorialGastoEntity";
import { HistorialAperturaProps } from "../../../../../core/admin/apertura/historial_apertura/HistorialAperturaEntity";
import AsignacionService from "../../../../../core/admin/bsss/asignacion";
import HistorialAperturaService from "../../../../../core/admin/apertura/historial_apertura";
import HistorialGastoService from "../../../../../core/admin/apertura/historial_gasto";
import moment from "moment";
import { ValeReport } from "../../../../../tools/ValeReport";
import {
    ENUM_EJECUTADO,
    ENUM_GENERAL,
    ENUM_REPORTE_FINAL,
    ENUM_REPORTE_POR_APERTURA,
    ENUM_REPORTE_POR_PROYECTO,
    ENUM_REPORTE_POR_TIPO,
    SIN_PRESUPUESTO,
} from "../../../../../base/constants/enum";

const PRECIO_UNITARIO_MAP: Record<string, number> = {
    GASOLINA: PRECIO_UNITARIO_GASOLINA,
    DIESEL: PRECIO_UNITARIO_DIESEL,
};

export class ValeViewController extends BaseHttpController {
    public async getTableVale(req: Request, res: Response): Promise<any> {
        const authUser: AuthUser = req.authUser;
        const vales = await ValeView.getTableVale(req.query, authUser);
        if (vales.isFailure) return this.fail(res, "Falló al obtener la tabla de vales");
        return this.ok<any>(res, vales.getValue());
    }

    public async getValeFormData(req: Request, res: Response): Promise<any> {
        const formData = await ValeView.getValeFormDataView(req.params.vale_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<ValeFormDataResponse>(res, formData.getValue());
    }

    public async getValeEstado(req: Request, res: Response): Promise<any> {
        const authUser: AuthUser = req.authUser;
        const ID_USUARIO = authUser.uid;
        let ESTADO = true;
        let ESTADO_PRESUPUESTO = true;

        const asignacion = await AsignacionService.getAll();
        if (asignacion.isFailure) return this.fail(res, String(asignacion.error));
        const asignacionResult = asignacion.getValue().filter((a) => a.props.estado).find((a) => a.props.usuarioId === ID_USUARIO);
        if (!asignacionResult) ESTADO = false;
        if (!asignacionResult?.props.estado) ESTADO = false;
        if (asignacionResult) {
            const ID_APERTURA = asignacionResult?.props.partidaGeneralId || "";
            const apertura = await AperturaGeneralService.getById(ID_APERTURA);
            if (apertura.isFailure) return this.fail(res, String(apertura.error));
            const aperturaResult = apertura.getValue();
            if (!aperturaResult?.props.estadoActivo || aperturaResult?.props.estado === SIN_PRESUPUESTO)
                ESTADO_PRESUPUESTO = false;
        }

        return this.ok<any>(res, { estado: ESTADO, estado_presupuesto: ESTADO_PRESUPUESTO });
    }

    public async createOrUpdateVale(req: Request, res: Response): Promise<any> {
        const authUser: AuthUser = req.authUser;
        const ID_USUARIO = authUser.uid;

        const data = req.body;
        const ID_ASIGNACION = data.asignacion_id;
		
        const asignacion = await AsignacionService.getById(ID_ASIGNACION);
        if (asignacion.isFailure) return this.fail(res, "Falló al abrir asignacion");
        const asignacionResult = asignacion.getValue();
		
        const ID_APERTURA = asignacion.getValue().props.partidaGeneralId || "";
		
        const apertura = await AperturaGeneralService.getById(ID_APERTURA);
        if (apertura.isFailure) return this.fail(res, "Falló al abrir aperturas");
        const aperturaGeneralResult = apertura.getValue();

        const vales = await ValeService.getAll();
        if (vales.isFailure) return this.fail(res, "Vales no encontrado");
        const valeResults = vales
            .getValue()
            .filter((v) => v.props.asignacionId === ID_ASIGNACION)
            .map((vr) => parseInt(vr.props.codVale.match(/\d+/)?.[0] || "0", 10))
            .slice()
            .sort((a, b) => b - a);
        const num = valeResults.length > 0 ? valeResults[0] + 1 : 1;

        //Calculos
        const areaPadre = aperturaGeneralResult?.props.areaId || null;
        const areaHijo = aperturaGeneralResult?.props.areaHijoId;
        let ID_AREA = areaPadre;
        if (areaHijo) {
            ID_AREA = areaHijo;
        }
        const area = await AreaService.getById(ID_AREA || "");
        if (area.isFailure) return this.fail(res, "Falló al abrir area");
        const areaResult = area.getValue();

        const COD_AREA = areaResult.props.sigla;
        const VEHICULO_ID = data.vehiculo_id;
        const ID_VALE = req.body.id;

        const vehiculo = await VehiculoService.getById(VEHICULO_ID);
        if (vehiculo.isFailure) return this.fail(res, "Falló al crear la vehiculo");
        const vehiculoResult = vehiculo.getValue();

        const carga: string = vehiculoResult.props.carga;
        const PRECIO_UNITARIO: number = PRECIO_UNITARIO_MAP[carga] ?? 0;

        const cantidad = Number(data.litros);
        const precio_total = PRECIO_UNITARIO * cantidad;
        const concepto = numeroALetras(cantidad);
        const saldoAsignacionAnterior = !ID_VALE?asignacionResult.props.saldo: data.pre_asignacion;		
		
        // const conceptoReal = numeroALetras(cantidad);

        const codigo = num.toString().padStart(5, "0") + COD_AREA;

        const props: ValeProps = {		
            codVale: ID_VALE ? data.codVale : codigo,
            fechaEmision: data.fecha_emision,
            fechaValidez: data.fecha_validez,
            litros: cantidad,
            concepto: concepto,
            distancia: data.distancia,
            precioUnitario: PRECIO_UNITARIO,
            precioTotal: precio_total,
            observaciones: data.observaciones,
            destino: data.destino,
            destinos: data.destinos,
            otroVehiculo: data.otro_vehiculo,
            usuarioId: ID_USUARIO,
            vehiculoId: VEHICULO_ID,
            gestion: new Date().getFullYear().toString(),
            asignacionId: ID_ASIGNACION,
            numeroRecibo: data.numero_recibo,
            litrosReales: data.litros_reales,
            precioReal: data.precio_real,
            numeroFactura: data.numero_factura,
            fechaFactura: data.fecha_factura,
            estadoEjecutado: data.estado_ejecutado,
            preAsignacion : !ID_VALE?saldoAsignacionAnterior:data.pre_asignacion,
        };
        
        const result = ID_VALE ? await ValeService.update(ID_VALE, props) : await ValeService.create(props, ID_VALE) ;
        if (result.isFailure) return this.fail(res, "Falló al " + (ID_VALE ? "modificar" : "crear") + " la vale");

        let saldo = 0;

        // siempre y cuando se modifiquen los litros
         const litrosBDD = vales.getValue().find((v)=>v.id === ID_VALE)?.props.litros || 0;
        if(data.litros != litrosBDD){
                /* Actualizacion de saldo Asignacion*/
            if(!ID_VALE){
                saldo = Number(saldoAsignacionAnterior) - Number(result.getValue().props.precioTotal);
               
            }else{
                const saldoValeGuardado = vales.getValue().find((v)=>v.id === ID_VALE)?.props.preAsignacion || 0;       
                saldo = Number(saldoValeGuardado) - Number(result.getValue().props.precioTotal);                
            }
        }else{
            saldo = saldoAsignacionAnterior;					
        }
          const asignacions = await AsignacionService.update(ID_ASIGNACION, { saldo });
          if (asignacions.isFailure) return this.fail(res, "Falló al cambiar asignacion");

        return this.ok<any>(res, result);
    }

    public async changeApprove(req: Request, res: Response): Promise<any> {
        const ID_VALE = req.params.vale_id;
        const estado = req.body.aprobado;
        if (estado === "ANULADO") {
            //
            const vale = await ValeService.getById(ID_VALE);
            if (vale.isFailure) return this.fail(res, String(vale.error));
            const valeResult = vale.getValue();

            const asignacion = await AsignacionService.getById(valeResult.props.asignacionId || "");
            if (asignacion.isFailure) return this.fail(res, String(asignacion.error));
            const asignacionResult = asignacion.getValue();

            let saldo = asignacionResult.props.saldo;

            const precio_total_old = Number(valeResult?.props.precioTotal) || 0;
            saldo = saldo + precio_total_old;

            const asignacionUpdate = await AsignacionService.update(asignacionResult.id, { saldo });
            if (asignacionUpdate.isFailure) return this.fail(res, "Falló al actualizar asignacion");
        }
        
        const result = await ValeService.update(ID_VALE, { estado });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado");
        return this.ok(res);
    }

    public async changeEjecutado(req: Request, res: Response): Promise<any> {
        const ID_VALE = req.params.vale_id;
        const estadoEjecutado = req.body.ejecutado;
       
        /* Historial de apertura*/
        if (estadoEjecutado === ENUM_EJECUTADO) {
            const vale = await ValeService.getById(ID_VALE);
            if (vale.isFailure) return this.fail(res, String(vale.error));
            const valeResult = vale.getValue();

            const asignacion = await AsignacionService.getById(valeResult.props.asignacionId || "");
            if (asignacion.isFailure) return this.fail(res, String(asignacion.error));
            const asignacionResult = asignacion.getValue();

            const ID_APERTURA = asignacionResult.props.partidaGeneralId || "";

            const historial_apertura_props: HistorialAperturaProps = {
                titulo: "Vale Combustible" + valeResult.props.codVale,
                descripcion:
                    valeResult.props.observaciones +
                    " - Distancia: " +
                    valeResult.props.distancia +
                    " - Litros Reales: " +
                    valeResult.props.litrosReales,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                gasto: valeResult.props.precioReal!,
                fecha: valeResult.props.fechaEmision,
                estado: "",
                debeHaber: "EGRESO",
                aperturaId: ID_APERTURA,
            };
            const historialApertura = await HistorialAperturaService.create(historial_apertura_props);
            if (historialApertura.isFailure) return this.fail(res, "Falló al crear historial apertura");

            const ID_HISTORIAL_APERTURA = historialApertura.getValue().id;

            const historial_gasto = await HistorialGastoService.getAll();
            if (historial_gasto.isFailure) return this.fail(res, String(historial_gasto.error));
            const historialResult = historial_gasto
                .getValue()
                .filter((hg) => hg.props.aperturaId === ID_APERTURA)
                .reduce((u, a) => {
                    return moment(a.props.fecha).toDate() > moment(u.props.fecha).toDate() ? a : u;
                });

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const SALDO = historialResult.props.saldo - valeResult.props.precioReal!;

            const historial_gasto_props: HistorialGastoProps = {
                fecha: new Date(),
                descripcion: "Vale Combustible " + valeResult.props.codVale,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                debe: valeResult.props.precioReal!,
                haber: 0,
                saldo: SALDO,
                estado: "",
                historialAperturaId: ID_HISTORIAL_APERTURA,
                aperturaId: ID_APERTURA,
            };
            const historialGasto = await HistorialGastoService.create(historial_gasto_props);
            if (historialGasto.isFailure) return this.fail(res, "Falló al crear historial apertura");

            /* Actualizacion de saldo Apertura General*/
            const presupuestoRestante = SALDO;
            const apertura_general = await AperturaGeneralService.update(ID_APERTURA, { presupuestoRestante });
            if (apertura_general.isFailure) return this.fail(res, "Falló al cambiar presupuesto restante");
        }
        /* // */
        const result = await ValeService.update(ID_VALE, { estadoEjecutado });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado");
        return this.ok(res);
    }

    public async destroyVale(req: Request, res: Response): Promise<any> {
        const ID_VALE = req.params.vale_id;
        const result = await ValeService.eliminaVale(ID_VALE);
        if (result.isFailure) return this.fail(res, "Error al eliminar el vale");
        return this.ok<any>(res);
    }

    public async getVehiculoApertura(req: Request, res: Response): Promise<any> {
        const AUTH_USER: AuthUser = req.authUser;
        const ID_VALE = req.params.vale_id;
        const result = await ValeView.getVehiculoApertura(AUTH_USER, ID_VALE);
        if (result.isFailure) return this.fail(res, String(result.error));
        return this.ok<VehiculoAperturaResponse>(res, result.getValue());
    }

    public async getPDFVale(req: Request, res: Response): Promise<any> {
        const id: string = req.body.id;
        const formData = await ValeView.getPDFVale(req.authUser, id);
        if (formData.isFailure) return this.fail(res, String(formData.error));

        const result = formData.getValue();
        return Report.creaPDF(result, "vale", res);
    }

    public async getPDFVale2(req: Request, res: Response): Promise<any> {
        const id: string = req.body.id;
        const formData = await ValeView.getPDFVale2(id);
        if (formData.isFailure) return this.fail(res, String(formData.error));

        const result = formData.getValue();
        return Report.creaPDF(result, "vale", res);
    }

    public async getPDFReporte(req: Request, res: Response): Promise<any> {
        const AUTH_USER: AuthUser = req.authUser;
        const queryString = req.body.qs;
        const formData = await ValeView.getReporteView(AUTH_USER, queryString);
        if (formData.isFailure) return this.fail(res, String(formData.error));

        const result = formData.getValue();
        return Report2.creaPDF(result, "reportBsss", res);
    }

    public async getSinPresupuestoData(req: Request, res: Response): Promise<any> {
        const litros = req.params.litros;
        const ID_ASIGNACION = req.params.asignacion_id;
        const VEHICULO_ID = req.params.vehiculo_id;

        const vehiculo = await VehiculoService.getById(VEHICULO_ID);
        if (vehiculo.isFailure) return this.fail(res, "Falló al crear la vehiculo");
        const vehiculoResult = vehiculo.getValue();

        const asignacions = await AsignacionService.getById(ID_ASIGNACION);
        if (asignacions.isFailure) return this.fail(res, "Asignacion no encontrada");
        const asignacionResult = asignacions.getValue();

        const carga: string = vehiculoResult.props.carga;
        const PRECIO_UNITARIO = PRECIO_UNITARIO_MAP[carga] ?? 0;

        const cantidad = Number(litros);
        const precio_total = PRECIO_UNITARIO * cantidad;

        const saldo_restante = asignacionResult.props.saldo;
        const saldo_calculado = saldo_restante - precio_total;
        return this.ok<any>(res, { saldo: saldo_calculado < VALE_SALDO_MINIMO });
    }
    //REPORTE
    public async getPDFValeReporte(req: Request, res: Response): Promise<any> {
        const queryString = req.body.qs;
        const idVale = req.params.id;
        const fechaInicio = req.body.data.fechaInicio;
        const fechaFin = req.body.data.fechaFin;
        const tipoFecha = req.body.data.tipoFecha;
        let idsFiltrosReporte;
        if (req.body.data != undefined) {
            idsFiltrosReporte = req.body.data.ids;
        }
        const formData = await ValeView.getPDFValeReport(
            req.authUser,
            queryString,
            idVale,
            idsFiltrosReporte,
            fechaInicio,
            fechaFin,
            tipoFecha,
        );

        if (formData.isFailure) return this.fail(res, String(formData.error));
        const result = formData.getValue();
        return ValeReport.creaPDF(result, "valeReport", res);
    }

    public async getFechaFiltro(req: Request, res: Response): Promise<Response<any>> {
        const valeReporteFiltro = await ValeView.getFechaFiltro(req.params.fechaInicio, req.params.fechaFin, req.query);
        if (valeReporteFiltro.isFailure) return this.fail(res, "Falló al obtener la tabla de Vale filtro de fechas ");
        return this.ok<any>(res, valeReporteFiltro.getValue());
    }
    public async getDatosApertura(req: Request, res: Response): Promise<Response<any>> {
        const aperturaFiltro = await ValeView.getDatosApertura(
            req.params.fechaInicio,
            req.params.fechaFin,
            req.params.apertura,
            req.query,
        );
        if (aperturaFiltro.isFailure) return this.fail(res, "Falló al obtener la tabla de Apertura filtro de fechas ");
        return this.ok<any>(res, aperturaFiltro.getValue());
    }

    public async getDatosContrato(req: Request, res: Response): Promise<Response<any>> {
        const contratoFiltro = await ValeView.getDatosContrato(
            req.params.fechaInicio,
            req.params.fechaFin,
            req.params.contrato,
            req.query,
        );
        if (contratoFiltro.isFailure) return this.fail(res, "Falló al obtener la tabla de contrato filtro de fechas ");
        return this.ok<any>(res, contratoFiltro.getValue());
    }
    public async getTipoCombustible(req: Request, res: Response): Promise<Response<any>> {
        const combustibleFiltro = await ValeView.getTipoCombustible(
            req.params.fechaInicio,
            req.params.fechaFin,
            req.params.combustible,
            req.query,
        );
        if (combustibleFiltro.isFailure)
            return this.fail(res, "Falló al obtener la tabla de tipo de combustible filtro de fechas ");
        return this.ok<any>(res, combustibleFiltro.getValue());
    }
    public async getDatosVehiculo(req: Request, res: Response): Promise<Response<any>> {
        const placaFiltro = await ValeView.getDatosVehiculo(
            req.params.fechaInicio,
            req.params.fechaFin,
            req.params.placa,
            req.query,
        );
        if (placaFiltro.isFailure) return this.fail(res, "Falló al obtener la tabla de vehiculo filtro de fechas ");
        return this.ok<any>(res, placaFiltro.getValue());
    }

    public async getFechaFiltroReporteFinal(req: Request, res: Response): Promise<Response<any>> {
        const authUser: AuthUser = req.authUser;
        const valeReporteFiltro = await ValeView.getFechaFiltroReporteFinal(
            req.params.fechaInicio,
            req.params.fechaFin,
            req.query,
            authUser,
        );
        if (valeReporteFiltro.isFailure)
            return this.fail(res, "Falló al obtener la tabla de Vale filtro de fechas reporte final ");
        return this.ok<any>(res, valeReporteFiltro.getValue());
    }

    public async getReportJSON(req: Request, res: Response): Promise<any> {
        const idVale = req.params.id;
        const queryString = req.body.qs;
        const params = new URLSearchParams(queryString);
        const tipoReporte = String(params.get("tipo_reporte")); //
        const fechaInicio = req.body.data.fechaInicio;
        const fechaFin = req.body.data.fechaFin;

        let idsFiltrosReporte;
        if (req.body.data != undefined) {
            idsFiltrosReporte = req.body.data.ids;
        }

        const formData = await ValeView.generarFilasExcel(
            req.authUser,
            queryString,
            idVale,
            idsFiltrosReporte,
            fechaInicio,
            fechaFin,
        );

        if (formData.isFailure) return this.fail(res, String(formData.error));
        const result = formData.getValue();
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Reporte Vale");
        // Definir columnas con estilos base

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        worksheet.columns = await ValeView.generarHeadExcel(tipoReporte)!;
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
        const formatData = await ValeView.getFormatData(result.data, tipoReporte);

        let contadorFilas = 2;

        switch (tipoReporte) {
            case ENUM_GENERAL:
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unused-vars
                formatData!.forEach((item: any, index: number) => {
                    worksheet.addRow({
                        numero: item.numero,
                        fecha_emision: item.fecha_emision,
                        fecha_factura: item.fecha_factura,
                        nombre_chofer: item.nombre_chofer,
                        placa: item.placa,
                        num_apertura: item.num_apertura,
                        area: item.area,
                        distancia: item.distancia,
                        litros: item.litros,
                        precio_unitario:item.precio_unitario,
                        precio_total:item.precio_total,
                        numero_factura: item.numero_factura,
                        cod_vale: item.cod_vale,
                        numero_recibo: item.numero_recibo,
                        destino: item.destino,
                        litros_reales: item.litros_reales,
                        precio_real: item.precio_real,
                        estado: item.estado,
                        estado_ejecutado: item.estado_ejecutado,
                        //  area_id               : item.sigla,  // verificar
                    });
                });

                break;
            case ENUM_REPORTE_POR_PROYECTO:
                formData.getValue().data?.lista_areas.forEach((element) => {
                    /// worksheet.insertRow(contadorFilas, [element.nombre]); // fila vacía
                    worksheet.addRow([element.nombre]); // añade debajo del último
                    worksheet.mergeCells(`A${contadorFilas}:M${contadorFilas}`); // opcional: que ocupe todas las columnas
                    worksheet.getRow(contadorFilas).font = { bold: true };

                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unused-vars
                    formatData!.forEach((item: any, index: number) => {
                        if (item.area_id === element.id) {
                            contadorFilas++;
                            worksheet.addRow({
                                numero: item.numero,
                                fecha_emision: item.fecha_emision,
                                fecha_factura: item.fecha_factura,
                                nombre_chofer: item.nombre_chofer,
                                placa: item.placa,
                                num_apertura: item.num_apertura,
                                area: item.area,
                                distancia: item.distancia,
                                litros: item.litros,
                                 precio_unitario:item.precio_unitario,
                                precio_total:item.precio_total,
                                numero_factura: item.numero_factura,
                                cod_vale: item.cod_vale,
                                numero_recibo: item.numero_recibo,
                                destino: item.destino,
                                litros_reales: item.litros_reales,
                                precio_real: item.precio_real,
                                estado: item.estado,
                                estado_ejecutado: item.estado_ejecutado,
                                // area_id               : item.area_solicitante,  // verificar
                            });
                        }
                    });
                    contadorFilas++;
                });

                break;

            case ENUM_REPORTE_POR_APERTURA:
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                worksheet.addRow(["Apertura: ".concat(formatData![0].num_apertura!)]); // fila vacía
                worksheet.getRow(contadorFilas).font = { bold: true };
                //worksheet.mergeCells(`A1:M1`)
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unused-vars
                formatData!.forEach((item: any, index: number) => {
                    worksheet.addRow({
                        numero: item.numero,
                        fecha_emision: item.fecha_emision,
                        fecha_factura: item.fecha_factura,
                        nombre_chofer: item.nombre_chofer,
                        placa: item.placa,
                        num_apertura: item.num_apertura,
                        area: item.area,
                        distancia: item.distancia,
                        litros: item.litros,
                         precio_unitario:item.precio_unitario,
                        precio_total:item.precio_total,
                        numero_factura: item.numero_factura,
                        cod_vale: item.cod_vale,
                        numero_recibo: item.numero_recibo,
                        destino: item.destino,
                        litros_reales: item.litros_reales,
                        precio_real: item.precio_real,
                        estado: item.estado,
                        estado_ejecutado: item.estado_ejecutado,
                        //  area_id               : item.area_solicitante,  // verificar
                    });
                });

                break;
            case ENUM_REPORTE_POR_TIPO:
                // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-non-null-assertion
                formatData!.forEach((item: any, index: number) => {
                    worksheet.addRow({
                        numero: item.numero,
                        fecha_emision: item.fecha_emision,
                        fecha_factura: item.fecha_factura,
                        nombre_chofer: item.nombre_chofer,
                        placa: item.placa,
                        num_apertura: item.num_apertura,
                        area: item.area,
                        distancia: item.distancia,                      
                        numero_factura: item.numero_factura,
                        cod_vale: item.cod_vale,
                        numero_recibo: item.numero_recibo,
                        destino: item.destino,
                        litros : item.litros,
                         precio_unitario:item.precio_unitario,
                        precio_total: item.precio_total,
                        litros_reales: item.litros_reales,
                        precio_real: item.precio_real,
                        estado: item.estado,
                        estado_ejecutado: item.estado_ejecutado,
                        //   area_id               : item.area_solicitante,  // verificar
                    });
                });

                break;

            case ENUM_REPORTE_FINAL:
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unused-vars
                formatData!.forEach((item: any, index: number) => {
                    worksheet.addRow({
                        numero: item.numero,
                        num_apertura: item.num_apertura,
                        total_litros_reales: item.total_litros_reales,
                        total_precio_real: item.total_precio_real,
                        //   area_id               : item.area_solicitante,  // verificar
                    });
                });

                break;
        }

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
        res.setHeader("Content-Disposition", `attachment; filename=reporte_viatico_${idVale}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    }
}
