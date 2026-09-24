import { Result } from "../../../../base/types/Result";

import { findAndCountResult } from "../../../../tools/util";

import BitacoraViajeService from "../../../../core/admin/bsss/bitacora_viaje";
import VehiculoService from "../../../../core/admin/bsss/vehiculo";
import AreaService from "../../../../core/rrhh/area";
import UsuarioService from "../../../../core/system/autenticacion/usuario";
import { AuthUser } from "../../../../base/types/AuthUser";

type BitacoraViajeTableModel = {
    id: string;
    semana: number;
    area_id: string;
    vehiculo_id: string;
    usuario_id: string;
    area_nombre?: string;
    vehiculo_nombre?: string;
    usuario_nombre?: string;
};

export type GetBitacoraViajesTableResponse = {
    rows: BitacoraViajeTableModel[];
    count: number;
};

export type BitacoraViajeFormDataResponse = {
    id: string;
    semana: string;
    area_id: string;
    vehiculo_id: string;
    usuario_id: string;
};

export type BitacoraViajesOptionsFormModel = {
    id: string;
    nombre: number;
    concepto?: string;
};

export class BitacoraViajeView {
    public async getBitacoraViajesTable(query: any, authUser: AuthUser ): Promise<Result<GetBitacoraViajesTableResponse>> {

        const ID_USUARIO = authUser.uid;
        
        const bitacoraViaje = await BitacoraViajeService.getAll();
        if (bitacoraViaje.isFailure) return Result.fail("Falló al obtener la bitacoraViaje");
        let bitacoraViajeResult = bitacoraViaje.getValue();
        if(!authUser.superadministrador){
            bitacoraViajeResult = bitacoraViaje.getValue().filter((b) => b.props.usuarioId === ID_USUARIO);            
        }  

        /*Listado de vehiculos*/
        const vehiculo = await VehiculoService.getAll();
        if (vehiculo.isFailure) return Result.fail("Fallo al obtener el Vehiculo");
        const vehiculoResult = vehiculo.getValue();

        /*Listado de area*/
        const area = await AreaService.getAll();
        if (area.isFailure) return Result.fail("Falló al obtener la Area");
        const areaResult = area.getValue();

        /*Listado de usuarios*/
        const usuarios = await UsuarioService.getAll();
        if (usuarios.isFailure) return Result.fail("Fallo al obtener el Usuario");
        const usuariosResult = usuarios.getValue();
        
        const result: BitacoraViajeTableModel[] = bitacoraViajeResult.map((item) => {
            const nombreArea = areaResult.find((c) => c.id === item.props.areaId)?.props.nombre || "-";
            const nombreVehiculo = vehiculoResult.find((c) => c.id === item.props.vehiculoId)?.props.numPlaca || "-";
            const NombreUsuario = usuariosResult.find((c) => c.id === item.props.usuarioId)?.props.fullname || "-";
            return {
                id: String(item.id),
                semana: item.props.semana,
                area_id: item.props.areaId,
                vehiculo_id: item.props.vehiculoId,
                usuario_id: item.props.usuarioId,
                area_nombre: nombreArea,
                vehiculo_nombre: nombreVehiculo,
                usuario_nombre: NombreUsuario,
            };
        });
        const response = findAndCountResult(result, query);
        return Result.ok(response);
    }

    public async getBitacoraViajeFormDataView(
        id_bitacoraViaje: string,
    ): Promise<Result<BitacoraViajeFormDataResponse>> {
        const bitacoraViaje = await BitacoraViajeService.getById(id_bitacoraViaje);
        if (bitacoraViaje.isFailure) {
            return Result.fail<BitacoraViajeFormDataResponse>("Bitacora Viaje no encontrado");
        }

        const props = bitacoraViaje.getValue().props;
        const result: BitacoraViajeFormDataResponse = {
            id: bitacoraViaje.getValue().id,
            semana: String(props.semana),
            area_id: props.areaId,
            vehiculo_id: props.vehiculoId,
            usuario_id: props.usuarioId,
        };

        return Result.ok(result);
    }

    public async getAllBitacoraViajes(): Promise<Result<{ rows: BitacoraViajesOptionsFormModel[]; count: number }>> {
        const aperturas = await BitacoraViajeService.getAll();
        if (aperturas.isFailure) return Result.fail("Falló al obtener la aperturas");
        //  const aperturaResult = aperturas.getValue().filter((a) => a.props.estado);
        //  if (!aperturaResult) return Result.fail("Error no existe apertura asignada.");

        const result: BitacoraViajesOptionsFormModel[] = aperturas
            .getValue()
            .map((item) => {
                return {
                    id: item.id.toString(),
                    nombre: item.props.semana,
                    //concepto: item.props.semana+' km - '+item.props.litros+' litros'
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));

        return Result.ok({ rows: result, count: result.length });
    }
}
