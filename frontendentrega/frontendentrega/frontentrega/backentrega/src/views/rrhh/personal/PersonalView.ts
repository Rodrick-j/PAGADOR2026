import { Result } from "../../../base/types/Result";
import moment from "moment";

import { AuthUser } from "../../../base/types/AuthUser";

import PersonalService from "../../../core/rrhh/personal";
import CargoService from "../../../core/rrhh/cargo";
import AreaService from "../../../core/rrhh/area";
import { findAndCountResult } from "../../../tools/util";

export type PersonalTableModel = {
    id                    ?: string;
    nombre_completo        : string;
    nombres                : string;
    apellido_paterno       : string;
    apellido_materno       : string;
    ci                     : string;
    fecha_nacimiento       : string;
    fecha_ingreso          : string;
    profesion              : string;
    telefono               : string;
    fecha_presentacion_cas : string;
    anhos_antiguedad_gador : number;
    anhos_antiguedad_cas   : number;
    meses_antiguedad_cas   : number;
    dias_antiguedad_cas    : number;
    activo                 : boolean;
    cargo                  : string;
    area                   : string;
    item_contrato?         : string;
};

export type PersonalFormDataResponse = {
    id                    : string;
    nombres               : string;
    apellido_paterno      : string;
    apellido_materno      : string;
    apellido_casada       : string;
    ci                    : string;
    expedicion            : string;
    sexo                  : string;
    fecha_nacimiento      : string;
    fecha_ingreso         : string;
    estado_civil          : string;
    profesion             : string;
    telefono              : string;
    direccion             : string;
    activo                : boolean;
    afp                   : string;
    rentista              : string;
    fecha_presentacion_cas: string;
    anhos_antiguedad_gador: number;
    anhos_antiguedad_cas  : number;
    meses_antiguedad_cas  : number;
    dias_antiguedad_cas   : number;
    usuario_id            : string;
    cargo_id              : string;
    area_id               : string;
};

export type PersonalOptionsFormModel = {
    id: string;
    nombre: string;
    id_area?: string | null;
};

export type GetPersonalTableResponse = {
    rows: PersonalTableModel[];
    count: number;
};

export class PersonalView {
    public async getTablePersonal(query: any): Promise<Result<GetPersonalTableResponse>> {
        /* listado de personal */
        const personal = await PersonalService.getAll();
        if (personal.isFailure) return Result.fail("Falló al obtener la personal");
        const personalResult = personal.getValue();

        const cargo = await CargoService.getAll();
        if (cargo.isFailure) return Result.fail("Falló al obtener la cargo");
        const cargoResult = cargo.getValue();

        const area = await AreaService.getAll();
        if (area.isFailure) return Result.fail("Falló al obtener la area");
        const areaResult = area.getValue();

        /* listado general de la tabla personal ordenados */
        const result: PersonalTableModel[] = personalResult        
        .map((item) => {
            const cargoNombre = cargoResult.find((c) => c.id === item.props.cargoId)?.props.nombre || "-";
            const areaNombre = areaResult.find((c) => c.id === item.props.areaId)?.props.nombre || "-";
            const itemContrato = cargoResult.find((c) => c.id === item.props.cargoId)?.props.item|| "-"; 
            return {
                id                    : String(item.id),
                nombre_completo       : item.getNombreCompleto(),
                nombres               : item.props.nombres,
                apellido_paterno      : item.props.apellidoPaterno,
                apellido_materno      : item.props.apellidoMaterno,
                ci                    : item.props.ci,
                fecha_nacimiento      : moment(item.props.fechaNacimiento, "DD/MM/YYYY").toString(),
                fecha_ingreso         : item.props.fechaIngreso?moment(item.props.fechaIngreso, "DD/MM/YYYY HH:mm").toString():'',
                profesion             : item.props.profesion,
                telefono              : item.props.telefono,
                activo                : item.props.activo,
                fecha_presentacion_cas: item.props.fechaPresentacionCas?moment(item.props.fechaPresentacionCas).format("DD/MM/YYYY").toString(): '',
                anhos_antiguedad_gador: item.props.anhosAntiguedadGador || 0,
                anhos_antiguedad_cas  : item.props.anhosAntiguedadCas || 0,
                meses_antiguedad_cas  : item.props.mesesAntiguedadCas || 0,
                dias_antiguedad_cas   : item.props.diasAntiguedadCas || 0,
                cargo                 : cargoNombre,
                area                  : areaNombre,
                item_contrato         : itemContrato,
            };
        });
        
        const response = findAndCountResult(result, query);
        return Result.ok<GetPersonalTableResponse>(response);
    }

    public async getPersonalFormDataView(id_personal: string): Promise<Result<PersonalFormDataResponse>> {
        const personal = await PersonalService.getById(id_personal);
        if (personal.isFailure) {
            return Result.fail<PersonalFormDataResponse>("Personal no encontrado");
        }

        const props = personal.getValue().props;
        const result: PersonalFormDataResponse = {
            id                    : personal.getValue().id,
            nombres               : props.nombres,
            apellido_paterno      : props.apellidoPaterno,
            apellido_materno      : props.apellidoMaterno,
            apellido_casada       : props.apellidoCasada,
            ci                    : props.ci,
            expedicion            : props.expedicion,
            sexo                  : props.sexo,
            fecha_nacimiento      : moment(props.fechaNacimiento, "DD/MM/YYYY HH:mm").toString(),
            fecha_ingreso         : props.fechaIngreso?moment(props.fechaIngreso, "DD/MM/YYYY HH:mm").toString():'',
            estado_civil          : props.estadoCivil,
            profesion             : props.profesion,
            telefono              : props.telefono,
            direccion             : props.direccion,
            activo                : props.activo,
            afp                   : props.afp,
            rentista              : props.rentista ? "1" : "0",
            fecha_presentacion_cas: props.fechaPresentacionCas?moment(props.fechaPresentacionCas, "DD/MM/YYYY HH:mm").toString():'',
            anhos_antiguedad_gador: props.anhosAntiguedadGador || 0,
            anhos_antiguedad_cas  : props.anhosAntiguedadCas || 0,
            meses_antiguedad_cas  : props.mesesAntiguedadCas || 0,
            dias_antiguedad_cas   : props.diasAntiguedadCas || 0,
            usuario_id            : props.usuarioId || "",
            cargo_id              : props.cargoId || "",
            area_id               : props.areaId || "",
        };
        return Result.ok(result);
    }

    public async getAllPersonal(): Promise<Result<{ rows: PersonalOptionsFormModel[]; count: number }>> {
        const personal = await PersonalService.getAll();
        if (personal.isFailure)  return Result.fail("Personal no encontrado");

        const result: PersonalOptionsFormModel[] = personal
            .getValue()
            .filter((u) => u.props.activo)
            .map((item) => {                
                return {
                    id: item.id.toString(),
                    nombre: item.getNombreCompletoCI(),
                    id_area: item.props.areaId,
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
        return Result.ok({ rows: result, count: result.length });
    }
    
    public async getAllPersonalCliente(authUser: AuthUser): Promise<Result<{ rows: PersonalOptionsFormModel[]; count: number }>> {
        const ID_USUARIO = authUser.uid;

        const personals = await PersonalService.getAll();
        if (personals.isFailure)  return Result.fail("Personals no encontrado");
        const personalsResult = personals.getValue().filter((p) => p.props.activo);

        const personalResult = personalsResult.find((p) => p.props.usuarioId === ID_USUARIO);
        if (!personalResult) return Result.fail("Personal no encontrado");

        const areas = await AreaService.getAll();
        if (areas.isFailure) return Result.fail("Areas no encontrado");
        const areasResult = areas.getValue()
                                 .filter((a) => a.props.activo)
                                 .filter((a) => a.props.areaId === personalResult?.props.areaId)
                                 .map((a) => a.id);


        const result: PersonalOptionsFormModel[] = personalsResult
            .filter((p) => p.props.areaId && areasResult.includes(p.props.areaId))
            .map((item) => {                
                return {
                    id: item.id.toString(),
                    nombre: item.getNombreCompletoCI(),
                    id_area: item.props.areaId,
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
        return Result.ok({ rows: result, count: result.length });
    }

    public async getAllPersonalCI(): Promise<Result<{ rows: PersonalOptionsFormModel[]; count: number }>> {
        const personal = await PersonalService.getAll();
        if (personal.isFailure)  return Result.fail("Personal no encontrado");

        const result: PersonalOptionsFormModel[] = personal
            .getValue()
            .filter((u) => u.props.activo)
            .map((item) => {
                return {
                    id: item.id.toString(),
                    nombre: item.getNombreCompleto(),
                    ci: item.props.ci,
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
        return Result.ok({ rows: result, count: result.length });
    }
}
