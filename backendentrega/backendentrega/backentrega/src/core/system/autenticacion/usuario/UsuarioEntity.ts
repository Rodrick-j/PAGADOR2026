import { Entity } from "../../../../base/domain/Entity";

import { Result } from "../../../../base/types/Result";
import { DeviceInfo } from "../../../../base/types/DeviceInfo";
import { construirNombre, construirNombreConApellido, construirNombrePorApellido } from "../../../../tools/util";

export interface UsuarioProps {
    username        : string;
    password        : string;
    fullname        : string;
    nombre          : string;
    primerApellido  : string;
    segundoApellido : string;
    ci              : string;
    email           : string;
    direccion       : string;
    celular         : string;
    genero          : string;
    isJefe         ?: boolean;
    activo          : boolean;
    estado          : string;
    avatar         ?: string;
    roleId          : string;
    devices        ?: DeviceInfo[];
}

export class UsuarioEntity extends Entity<UsuarioProps> {
    public static create(props: UsuarioProps, id?: string): Result<UsuarioEntity> {
        return Result.ok<UsuarioEntity>(new UsuarioEntity(props, id));
    }
    public getNombreCompleto(): string {
        return construirNombre(this.props.nombre, this.props.primerApellido, this.props.segundoApellido);
    }

    public getNombreCompletoPorApellido(): string {
        return construirNombrePorApellido(this.props.nombre, this.props.primerApellido, this.props.segundoApellido);
    }
    public getNombreConApellido(): string {
        return construirNombreConApellido(this.props.nombre, this.props.primerApellido, this.props.segundoApellido);
    }
    public getNombreCompletoCI(): string {
        return (
            construirNombrePorApellido(this.props.nombre, this.props.primerApellido, this.props.segundoApellido) +
            " - " +
            this.props.ci
        );
    }
}
