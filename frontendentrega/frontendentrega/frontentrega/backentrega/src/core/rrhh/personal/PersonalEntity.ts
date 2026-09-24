import { construirNombreConApellido, construirNombrePorApellido } from "../../../tools/util";
import { Entity } from "../../../base/domain/Entity";
import { Result } from "../../../base/types/Result";

export interface PersonalProps {
    nombres              : string;
    apellidoPaterno      : string;
    apellidoMaterno      : string;
    apellidoCasada       : string;
    ci                   : string;
    expedicion           : string;
    sexo                 : string;
    fechaNacimiento      : Date;
    fechaIngreso         : Date;
    estadoCivil          : string;
    profesion            : string;
    telefono             : string;
    direccion            : string;
    activo               : boolean;
    afp                  : string;
    rentista             : boolean;
    fechaPresentacionCas?: Date  | null;
    anhosAntiguedadGador?: number | null;
    anhosAntiguedadCas?  : number | null;
    mesesAntiguedadCas?  : number | null;
    diasAntiguedadCas?   : number | null;
    usuarioId            : string | null;
    cargoId              : string | null;
    areaId               : string | null;
}

export class PersonalEntity extends Entity<PersonalProps> {
    public static create(props: PersonalProps, id?: string): Result<PersonalEntity> {
        return Result.ok<PersonalEntity>(new PersonalEntity(props, id));
    }

    public getNombreCompleto(): string {
        return construirNombrePorApellido(this.props.nombres, this.props.apellidoPaterno, this.props.apellidoMaterno);
    }

    public getNombreCompletoCI(): string {
        return (
            construirNombrePorApellido(this.props.nombres, this.props.apellidoPaterno, this.props.apellidoMaterno) +
            " - " +
            this.props.ci
        );
    }
    public getNombreCompletoCon(): string {
        return construirNombreConApellido(this.props.nombres, this.props.apellidoPaterno, this.props.apellidoMaterno);
    }
}
