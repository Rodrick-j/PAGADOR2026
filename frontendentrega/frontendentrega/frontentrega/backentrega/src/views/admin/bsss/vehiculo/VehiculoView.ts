import { Result } from "../../../../base/types/Result";
import { AuthUser } from "../../../../base/types/AuthUser";

import VehiculoService from "../../../../core/admin/bsss/vehiculo";
import PersonalService from "../../../../core/rrhh/personal";
import AreaService from "../../../../core/rrhh/area";
import AsignacionService from "../../../../core/admin/bsss/asignacion";

import { findAndCountResult } from "../../../../tools/util";
import AperturaGeneralService from "../../../../core/admin/apertura/apertura_general";

export type VehiculoTableModel = {
    id?: string;
    cod_activo  : string;
    num_placa   : string;
    tipo        : string;
    marca       : string;
    carga       : string;
    nombre      : string;
    observacion : string;
    estado      : boolean;
};

export type VehiculoFormDataResponse = {
    id          : string;
    cod_activo  : string;
    num_placa   : string;
    tipo        : string;
    marca       : string;
    carga       : string;
    observacion : string;
    estado      : boolean;
    personal_id?: string | null;
    area_id?    : string | null;
};

export type VehiculoOptionsFormModel = {
    id: string;
    nombre: string;
};

export class VehiculoView {
    public async getTableVehiculo(query: any, authUser: AuthUser): Promise<Result<{ rows: VehiculoTableModel[] }>> {
        /* listado de vehiculo */
        const vehiculo = await VehiculoService.getAll();
        if (vehiculo.isFailure) return Result.fail("Falló al obtener la vehiculo");
        let vehiculosResult = vehiculo.getValue().filter((a) => a.props.estado); 
        if (authUser.superadministrador) vehiculosResult = vehiculo.getValue();
        if(!vehiculosResult) return Result.fail("Error no existe vehiculos");
        
        const personal = await PersonalService.getAll();
        if (personal.isFailure) return Result.fail("Falló al obtener la personal");
        const personalResult = personal.getValue().filter((a) => a.props.activo);

        const areas = await AreaService.getAll();
        if (areas.isFailure) return Result.fail("Falló al obtener la areas");
        const areasResult = areas.getValue().filter((a) => a.props.activo);

        /* listado general de la tabla vehiculo ordenados */
        const result: VehiculoTableModel[] = vehiculosResult.map((item) => {
            const nombre          = personalResult.find((p) => p.id === item.props.personalId)?.getNombreCompletoCI() || "";
            const area            = areasResult.find((a) => a.id === item.props.areaId);
            const nombre_area = area?area?.props.nombre:".:: NO EXISTE AREA ASOCIADA A ESTE VEHICULO ::.";
            return {
                id         : String(item.id),
                cod_activo : item.props.codActivo,
                num_placa  : item.props.numPlaca,
                tipo       : item.props.tipo,
                marca      : item.props.marca,
                carga      : item.props.carga,
                observacion: item.props.observacion,
                estado     : item.props.estado,
                nombre     : nombre,
                area       : nombre_area,
                personal_id: item.props.personalId,
                area_id    : item.props.areaId,
            };
        });
        const response = findAndCountResult(result, query);
        return Result.ok(response);
    }

    public async getVehiculoFormDataView(id_vehiculo: string): Promise<Result<VehiculoFormDataResponse>> {
        const vehiculo = await VehiculoService.getById(id_vehiculo);
        if (vehiculo.isFailure) {
            return Result.fail<VehiculoFormDataResponse>("Vehiculo no encontrado");
        }

        const props = vehiculo.getValue().props;
        const result: VehiculoFormDataResponse = {
            id         : vehiculo.getValue().id,
            cod_activo : props.codActivo,
            num_placa  : props.numPlaca,
            tipo       : props.tipo,
            marca      : props.marca,
            carga      : props.carga,
            observacion: props.observacion,
            estado     : props.estado,
            personal_id: props.personalId,
            area_id    : props.areaId,
        };

        return Result.ok(result);
    }

    public async getAllVehiculo(authUser: AuthUser, params?: any): Promise<Result<{ rows: VehiculoOptionsFormModel[]; count: number }>> {
        const ID_USUARIO = authUser.uid;
        
        const vehiculos = await VehiculoService.getAll();
        if (vehiculos.isFailure) return Result.fail("Falló al obtener la vehiculos");
        let vehiculosResult = vehiculos.getValue().filter((a) => a.props.estado);
        if (authUser.superadministrador) vehiculosResult = vehiculos.getValue();
        if(!vehiculosResult) return Result.fail("Error no existe vehiculos");
        
        const personas = await PersonalService.getAll();
        if (personas.isFailure) return Result.fail("Falló al obtener la persona");
        const personalResult = personas.getValue();
        
        const area = await AreaService.getAll();
        if (area.isFailure) return Result.fail("Falló al obtener la area");
        const areaResult = area.getValue();

        const apertura = await AperturaGeneralService.getAll();
        if (apertura.isFailure) return Result.fail("Falló al obtener la apertura");
        const aperturaGeneralResult = apertura.getValue();
        
        const asignacion = await AsignacionService.getAll();
        if (asignacion.isFailure) return Result.fail("Falló al obtener la asignacion");
        let asignacionResult = asignacion.getValue().filter((a) => a.props.estado).filter((a) => a.props.usuarioId === ID_USUARIO);
        if (authUser.superadministrador) asignacionResult = asignacion.getValue();
        if (!asignacionResult) return Result.fail("Error no existe apertura asignada.");

        if(params==='false') {
            const APERTURASIDS = asignacionResult.map((a) => a.props.partidaGeneralId);
            const AREAHIJOSIDS = aperturaGeneralResult.filter((a) => APERTURASIDS.includes(a.id)).map((a) => a.props.areaHijoId);
            let vehiculosResult2 = vehiculosResult.filter((v) => AREAHIJOSIDS.includes(v.props.areaId));
            if(vehiculosResult2.length===0) {
                const AREAPADREIDS = aperturaGeneralResult.filter((a) => APERTURASIDS.includes(a.id)).map((a) => a.props.areaId);
                vehiculosResult2 = vehiculosResult.filter((v) => AREAPADREIDS.includes(v.props.areaId));
            }
            vehiculosResult = vehiculosResult2; 
        }

        const result: VehiculoOptionsFormModel[] = vehiculosResult.map((item) => {
                const persona = personalResult.find((p) => p.id === item.props.personalId);
                const areas   = areaResult.find((a) => a.id === item.props.areaId);
                const nombre  = persona?.getNombreCompleto();
                const area    = areas?.props.sigla;
                
                return {
                    id: item.id.toString(),
                    nombre: item.props.numPlaca+'-'+
                            item.props.tipo+'-'+
                            item.props.marca+'-'+
                            item.props.carga+'-'+
                            area,
                    concepto: nombre
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
            
        return Result.ok({ rows: result, count: result.length });
    }

    public async getByIdVehiculo(vehiculo_id: string | null): Promise<Result<any>> {
      
        const vehiculo = await VehiculoService.getById(vehiculo_id || "");
        if (vehiculo.isFailure) return Result.fail<VehiculoFormDataResponse>("Vehiculo no encontrado");
        const vehiculoResult = vehiculo.getValue();

        const persona = await PersonalService.getAll();
        if (persona.isFailure) return Result.fail("Falló al obtener la persona");
        const personaResult = persona.getValue();

        const area = await AreaService.getById(vehiculoResult.props.areaId);
        if (area.isFailure) return Result.fail(String(area.error));
        const areaResult = area.getValue();
        
        const nombre = personaResult.find((p) => p.id === vehiculo.getValue().props.personalId)?.getNombreCompletoCon() || "";

        const result = {
            nombre     : nombre,
            placa      : vehiculoResult.props.numPlaca,
            area       : areaResult.props.nombre,
        };

        return Result.ok(result);
    }
    // se aumenta el metodo get all para la busqueda de vehiculos 
    public async getAllVehiculos(): Promise<Result<{ rows: VehiculoOptionsFormModel[]; count: number }>> {
        const vehiculos = await VehiculoService.getAll();
        if (vehiculos.isFailure) return Result.fail("Falló al obtener la persona");
        const vehiculosResult = vehiculos.getValue().filter((a) => a.props.estado);
        if(!vehiculosResult) return Result.fail("Error no existe vehiculos");
        
        const persona = await PersonalService.getAll();
        if (persona.isFailure) return Result.fail("Falló al obtener la persona");
        const personaResult = persona.getValue();

        const result: VehiculoOptionsFormModel[] = vehiculosResult
            .filter((a) => a.props.estado)
            .map((item) => {
                const nombre = personaResult.find((p) => p.id === item.props.personalId)?.getNombreCompletoCon() || "";
                return {
                    id: item.id.toString(),
                    nombre: item.props.numPlaca.concat(' - ').concat(item.props.tipo).concat(' - ').concat(item.props.marca),
                    concepto: nombre,
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
        return Result.ok({ rows: result, count: result.length });
    }
}
