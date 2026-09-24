import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type Permiso = {
    read: boolean;
    create: boolean;
    edit: boolean;
    remove: boolean;
    send: boolean;
    download: boolean;
    approve: boolean;
    lock?: boolean;
};

export type Modulo = {
    id?: number;
    name: string;
    path: string;
    title: string;
    icon: string;
    color: string;
};

export type RoleProps = {
    nombre: string;
    tipo: string;
    permisos: string;
    modulos: string[];
};

export class RoleEntity extends Entity<RoleProps> {
    public static create(props: RoleProps, id?: string): Result<RoleEntity> {
        return Result.ok<RoleEntity>(new RoleEntity(props, id));
    }
}
