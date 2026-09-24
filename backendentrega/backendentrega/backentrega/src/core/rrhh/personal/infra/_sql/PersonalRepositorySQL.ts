import BaseSQLRepository from "../../../../../base/infra/_sql/BaseSQLRepository";
import { PersonalEntity } from "../../PersonalEntity";
import { IPersonalRepository } from "../IPersonalRepository";
import { Result } from "../../../../../base/types/Result";
import { PersonalSQLModelData } from "./PersonalSQLModel";

export class PersonalRepositorySQL
    extends BaseSQLRepository<PersonalEntity, PersonalSQLModelData>
    implements IPersonalRepository
{
    fromSQLModelData(data: PersonalSQLModelData, id: string): Result<PersonalEntity> {
        return PersonalEntity.create(
            {
                nombres             : data.nombres,
                apellidoPaterno     : data.apellido_paterno,
                apellidoMaterno     : data.apellido_materno,
                apellidoCasada      : data.apellido_casada,
                ci                  : data.ci,
                expedicion          : data.expedicion,
                sexo                : data.sexo,
                fechaNacimiento     : data.fecha_nacimiento,
                fechaIngreso        : data.fecha_ingreso,
                estadoCivil         : data.estado_civil,
                profesion           : data.profesion,
                telefono            : data.telefono,
                direccion           : data.direccion,
                activo              : data.activo,
                afp                 : data.afp,
                rentista            : data.rentista,
                fechaPresentacionCas: data.fecha_presentacion_cas,
                anhosAntiguedadGador: data.anhos_antiguedad_gador,
                anhosAntiguedadCas  : data.anhos_antiguedad_cas,
                mesesAntiguedadCas  : data.meses_antiguedad_cas,
                diasAntiguedadCas   : data.dias_antiguedad_cas,
                usuarioId           : data.fid_usuario,
                cargoId             : data.fid_cargo,
                areaId              : data.fid_area,
            },
            id,
        );
    }
    toSQLModelData(entity: PersonalEntity): PersonalSQLModelData {
        return {
            nombres               : entity.props.nombres,
            apellido_paterno      : entity.props.apellidoPaterno,
            apellido_materno      : entity.props.apellidoMaterno,
            apellido_casada       : entity.props.apellidoCasada,
            ci                    : entity.props.ci,
            expedicion            : entity.props.expedicion,
            sexo                  : entity.props.sexo,
            fecha_nacimiento      : entity.props.fechaNacimiento,
            fecha_ingreso         : entity.props.fechaIngreso,
            estado_civil          : entity.props.estadoCivil,
            profesion             : entity.props.profesion,
            telefono              : entity.props.telefono,
            direccion             : entity.props.direccion,
            activo                : entity.props.activo,
            afp                   : entity.props.afp,
            rentista              : entity.props.rentista,
            fecha_presentacion_cas: entity.props.fechaPresentacionCas??null,
            anhos_antiguedad_gador: entity.props.anhosAntiguedadGador??null,
            anhos_antiguedad_cas  : entity.props.anhosAntiguedadCas??null,
            meses_antiguedad_cas  : entity.props.mesesAntiguedadCas??null,
            dias_antiguedad_cas   : entity.props.diasAntiguedadCas??null,
            fid_usuario           : entity.props.usuarioId,
            fid_cargo             : entity.props.cargoId,
            fid_area              : entity.props.areaId,
        };
    }
}
