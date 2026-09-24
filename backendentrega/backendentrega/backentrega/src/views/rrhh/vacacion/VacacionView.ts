import { Result } from "../../../base/types/Result";

import VacacionService from "../../../core/rrhh/vacacion";
import UsuarioService from "../../../core/system/autenticacion/usuario";
import AreaService from "../../../core/rrhh/area";

import { findAndCountResult } from "../../../tools/util";
import { AuthUser } from "../../../base/types/AuthUser";
import moment from "moment";

export type VacacionTableModel = {
    id           ?: string;
    usuario        : string;
    ci             : string;
    gestion        : string;
    tipo_vacacion  : string;
    fecha_registro : string;
    fecha_ini      : string;
    fecha_fin      : string;
    dias_total     : number;
    dias_utilizados: number;
    dias_pendiente : number;
    estado         : string;
    jefe           : string;
    area           : string;
};

export type VacacionFormDataResponse = {
    id            : string;
    fecha_registro: Date;
    tipo_vacacion : string;
    fecha_ini     : Date;
    fecha_fin     : Date;
    estado        : string;
    usuario_id    : string;
    jefe_id       : string;
    area_id       : string;
};

export type VacacionOptionsFormModel = {
    id    : string;
    nombre: string;
    dias  : number;
};

export class VacacionView {
    public async getTableVacacion(authUser: AuthUser, query: any): Promise<Result<{ rows: VacacionTableModel[] }>> {
        /* listado de vacacion */
        const vacacion = await VacacionService.getAll();
        if (vacacion.isFailure) return Result.fail("Falló al obtener la vacacion");
        const vacacionResult = vacacion.getValue();

        const usuarios = await UsuarioService.getAll();
        if (usuarios.isFailure) return Result.fail("Falló al obtener la usuarios");
        const usuariosResult = usuarios.getValue();

        const areas = await AreaService.getAll();
        if (areas.isFailure) return Result.fail("Falló al obtener la areas");
        const areasResult = areas.getValue();

        /* listado general de la tabla vacacion ordenados */
        const result: VacacionTableModel[] = vacacionResult.map((item) => {
            const usuario = usuariosResult.find((u) => u.id === item.props.usuarioId);
            const jefe = usuariosResult.find((u) => u.id === item.props.jefeId)?.getNombreCompleto() || "";
            const area = areasResult.find((u) => u.id === item.props.areaId)?.props.nombre || "";
            const gestion = new Date(item.props.fechaFin).getFullYear().toString();
            const dias_total = 0;
            const dias_utilizados = 0;
            const dias_pendiente = 0;
            return {
                id            : String(item.id),
                usuario        : usuario?.getNombreCompleto() || "",
                ci             : usuario?.props.ci || "",
                gestion        : gestion,
                tipo_vacacion  : item.props.tipoVacacion,                
                dias_total     : dias_total,
                dias_utilizados: dias_utilizados,
                dias_pendiente : dias_pendiente,
                jefe           : jefe,
                area           : area,
                fecha_registro : moment(item.props.fechaRegistro).format("DD/MM/YYYY HH:mm").toString(),
                fecha_ini      : moment(item.props.fechaIni).format("DD/MM/YYYY HH:mm").toString(),
                fecha_fin      : moment(item.props.fechaFin).format("DD/MM/YYYY HH:mm").toString(),
                estado         : item.props.estado,
            };
        });
        const response = findAndCountResult(result, query);
        return Result.ok(response);
    }

    public async getVacacionFormDataView(id_vacacion: string): Promise<Result<VacacionFormDataResponse>> {
        const vacacion = await VacacionService.getById(id_vacacion);
        if (vacacion.isFailure) return Result.fail<VacacionFormDataResponse>("Vacacion no encontrado");
        const vacacionProps = vacacion.getValue().props;        
        
        const result: VacacionFormDataResponse = {
            id            : vacacion.getValue().id,
            fecha_registro: vacacionProps.fechaRegistro,
            tipo_vacacion : vacacionProps.tipoVacacion,
            fecha_ini     : vacacionProps.fechaIni,
            fecha_fin     : vacacionProps.fechaFin,
            estado        : vacacionProps.estado,
            usuario_id    : vacacionProps.usuarioId,
            jefe_id       : vacacionProps.jefeId,
            area_id       : vacacionProps.areaId,
        };
        return Result.ok(result);
    }

    public async getIdVacacionByIdUsuario(id_usuario: string): Promise<Result<any>> {
      
        const vacacion = await VacacionService.getAll();
        if (vacacion.isFailure) return Result.fail<any>("Vacacion no encontrado");

        const vacacion_persona = vacacion.getValue().find((v) => v.props.usuarioId === id_usuario);
        const result = {
            vacacion_id: vacacion_persona?.id || "",
        };

        return Result.ok(result);
    }

    public async getAllVacacion(
        authUser: AuthUser,
    ): Promise<Result<{ rows: VacacionOptionsFormModel[]; count: number }>> {
        const ID_USUARIO = authUser.uid;
        
        const vacacions = await VacacionService.getAll();
        const result: VacacionOptionsFormModel[] = vacacions
            .getValue()
            .filter((v) => v.props.usuarioId === ID_USUARIO)
            .map((item) => {
                return {
                    id    : item.id.toString(),
                    nombre: item.props.tipoVacacion,
                    dias  : 0,
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
        return Result.ok({ rows: result, count: result.length });
    }
}
