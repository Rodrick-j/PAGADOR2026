import { BaseHttpController } from '../../../../base/infra/BaseHttpController';
import { Request, Response } from 'express';

import MemorandumrrhhService from '../../../../core/rrhh/memorandum_rrhh';
import SettingView from '..';
import { extractData } from '../../../../tools/util';
import AsignacionService from '../../../../core/admin/bsss/asignacion';
import ValeService from '../../../../core/admin/bsss/vale';
import BitacoraService from '../../../../core/system/auditoria/bitacora';
import AccesoService from '../../../../core/system/autenticacion/acceso';
import AperturaGeneralService from '../../../../core/admin/apertura/apertura_general';
import HistorialAperturaService from '../../../../core/admin/apertura/historial_apertura';
import HistorialGastoService from '../../../../core/admin/apertura/historial_gasto';
import MemorandumService from '../../../../core/admin/conta_viatico/memorandum';
import ViaticoService from '../../../../core/admin/conta_viatico/viatico';
import DescargoService from '../../../../core/admin/conta_viatico/descargo';
import DetalleDestinoService from '../../../../core/admin/conta_viatico/detalle_destino';
import DetalleDestinorrhhService from '../../../../core/rrhh/detalle_destino_rrhh';
import AperturaViaticoService from '../../../../core/admin/conta_viatico/apertura_viatico';
import PersonalService from '../../../../core/rrhh/personal';
import UsuarioService from '../../../../core/system/autenticacion/usuario';
import VehiculoService from '../../../../core/admin/bsss/vehiculo';


export type SigapoTableModel = {
    id?               : string;
    hoja_de_ruta      : string;
    fecha_hora_salida : string;
    procedencia       : string;
    nombre            : string;
    referencia        : string;
    hojas             : string;
    derivado_a        : string;
    derivado_area     : string;
    objeto            : string;
    instruccion       : string;
    permanencia       : string;
    entregado_a       : string;
};

export type SigapoTableDetalleModel = {
    id?            : string;
    hoja_de_ruta   : string;
    nro            : string;
    destino        : string;
    lugar          : string;
    instruccion    : string;
    objeto         : string;
    fecha_recepcion: string;
    fecha_salida   : string;
    permanencia    : string;
};

export class SettingViewController extends BaseHttpController {           

        public async purgeAll(req: Request, res: Response): Promise<any> {

            const resultasignacion = await AsignacionService.setPurgeAll();
            if (resultasignacion.isFailure) return this.fail(res, String(resultasignacion.error));

            const resultvale = await ValeService.setPurgeAll();
            if (resultvale.isFailure) return this.fail(res, String(resultvale.error));

            const resultBitacora = await BitacoraService.setPurgeAll();
            if (resultBitacora.isFailure) return this.fail(res, String(resultBitacora.error));

            const resultAcceso = await AccesoService.setPurgeAll();
            if (resultAcceso.isFailure) return this.fail(res, String(resultAcceso.error));

            const resultAperturaGeneral = await AperturaGeneralService.setPurgeAll();
            if (resultAperturaGeneral.isFailure) return this.fail(res, String(resultAperturaGeneral.error));

            const resultHistorialDetalle = await HistorialAperturaService.setPurgeAll();
            if (resultHistorialDetalle.isFailure) return this.fail(res, String(resultHistorialDetalle.error));

            const resultHistorialGasto = await HistorialGastoService.setPurgeAll();
            if (resultHistorialGasto.isFailure) return this.fail(res, String(resultHistorialGasto.error));

            const resultMemorandum = await MemorandumService.setPurgeAll();
            if (resultMemorandum.isFailure) return this.fail(res, String(resultMemorandum.error));
            
            const resultMemorandumRRHH = await MemorandumrrhhService.setPurgeAll();
            if (resultMemorandumRRHH.isFailure) return this.fail(res, String(resultMemorandumRRHH.error));

            const resultViaticos = await ViaticoService.setPurgeAll();
            if (resultViaticos.isFailure) return this.fail(res, String(resultViaticos.error));
            
            const resultDescargo = await DescargoService.setPurgeAll();
            if (resultDescargo.isFailure) return this.fail(res, String(resultDescargo.error));
            
            const resultDetalleDestino = await DetalleDestinoService.setPurgeAll();
            if (resultDetalleDestino.isFailure) return this.fail(res, String(resultDetalleDestino.error));
            
            const resultDetalleDestinorrhh = await DetalleDestinorrhhService.setPurgeAll();
            if (resultDetalleDestinorrhh.isFailure) return this.fail(res, String(resultDetalleDestinorrhh.error));
            
            const resultAperturaViatico = await AperturaViaticoService.setPurgeAll();
            if (resultAperturaViatico.isFailure) return this.fail(res, String(resultAperturaViatico.error));

            const resultpersonal = await PersonalService.desactivarPersonal(); 
            if (resultpersonal.isFailure) return this.fail(res, String(resultpersonal.error)); 
            
            const resultusuario = await UsuarioService.desactivarUsuario(); 
            if (resultusuario.isFailure) return this.fail(res, String(resultusuario.error));            
            
            const resultvehiculo = await VehiculoService.desactivarVehiculo();
            if (resultvehiculo.isFailure) return this.fail(res, String(resultvehiculo.error));

            return this.ok(res,true);
        }            
       
        public async getTableSigapo(req: Request, response: any,  res: Response): Promise<any> {
            const personalArray = response.data;
            const result: SigapoTableModel[] = personalArray.map((s: any) => {
                const cadena = extractData(s.procedencia);
                const nombre = cadena.name || "";
                const area = cadena.area || "";
                return {
                    hoja_de_ruta      : s.cod,
                    fecha_hora_salida : s.fecha_creacion,
                    procedencia       : area,
                    nombre            : nombre,
                    referencia        : area,
                    hojas             : s.nhojas,
                    derivado_a        : "",
                    derivado_area     : area,
                    objeto            : "Para su conocimiento",
                    instruccion       : s.ref,
                    permanencia       : "1 dias",
                    entregado_a       : "",
                }
        });
            const sigapo = await SettingView.getTableSigapo(req.query, result);
            if (sigapo.isFailure) return this.fail(res, "Falló al obtener la tabla de sigapo");
            return this.ok<any>(res, sigapo.getValue());
        }
        
        public async getTableDetalleSigapo(req: Request, res: Response): Promise<any> {
            //const personalArray = response.data.filter((a: any) => a.activo);

            
            /* const data = await RevisionHorarioService.getRegistroPersonal("req.query");
            if (data.isFailure) return this.fail(res, data.error as string); */
            //const result = data.getValue();
            
            const sigapo = await SettingView.getTableDetalleSigapo(req.query);
            if (sigapo.isFailure) return this.fail(res, "Falló al obtener la tabla de sigapo");
            return this.ok<any>(res, sigapo.getValue());
        }

        public async getTableDetalleSigapoV2(req: Request, response: any, response2: any, res: Response): Promise<any> {
            const hojaDeRutaArray = response.data;                       
            const derivacionesArray = response2.data;                       
            /* const data = await RevisionHorarioService.getRegistroPersonal("req.query");
            if (data.isFailure) return this.fail(res, data.error as string); */
            //const result = data.getValue();
            
            const sigapo = await SettingView.getTableDetalleSigapoV2(req.query, hojaDeRutaArray, derivacionesArray);
            if (sigapo.isFailure) return this.fail(res, "Falló al obtener la tabla de sigapo");
            return this.ok<any>(res, sigapo.getValue());
        }
    
        
}
