import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { UsuarioEntity } from "../../UsuarioEntity";
import { IUsuarioRepository } from "../IUsuarioRepository";
import { Result } from "../../../../../../base/types/Result";
import { UsuarioSQLModelData } from "./UsuarioSQLModel";

export class UsuarioRepositorySQL
    extends BaseSQLRepository<UsuarioEntity, UsuarioSQLModelData>
    implements IUsuarioRepository
{
    fromSQLModelData(data: UsuarioSQLModelData, id: string): Result<UsuarioEntity> {
        return UsuarioEntity.create(
            {
                username       : data.username,
                password       : data.password,
                fullname       : data.fullname,
                nombre         : data.nombre,
                primerApellido : data.primer_apellido,
                segundoApellido: data.segundo_apellido,
                ci             : data.ci,
                celular        : data.celular,
                direccion      : data.direccion,
                email          : data.email,
                genero         : data.genero,
                isJefe         : data.is_jefe,
                activo         : data.activo,
                estado         : data.estado,
                avatar         : data.avatar,
                roleId         : data.fid_role,
                devices        : data.devices,
            },
            id,
        );
    }
    toSQLModelData(entity: UsuarioEntity): UsuarioSQLModelData {
        return {
            username        : entity.props.username,
            password        : entity.props.password,
            fullname        : entity.props.fullname,
            nombre          : entity.props.nombre,
            primer_apellido : entity.props.primerApellido,
            segundo_apellido: entity.props.segundoApellido,
            ci              : entity.props.ci,
            celular         : entity.props.celular,
            direccion       : entity.props.direccion,
            email           : entity.props.email,
            genero          : entity.props.genero,
            is_jefe         : entity.props.isJefe,
            activo          : entity.props.activo,
            estado          : entity.props.estado,
            avatar          : entity.props.avatar,
            fid_role        : entity.props.roleId,
            devices         : entity.props.devices,
        };
    }
}
