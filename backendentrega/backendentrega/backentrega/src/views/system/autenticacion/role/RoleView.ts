import { Result } from "../../../../base/types/Result";

import { findAndCountResult } from "../../../../tools/util";

import RoleService from "../../../../core/system/autenticacion/role";
import RutaService from "../../../../core/system/autenticacion/ruta";

type RoleTableItem = {
    id      : string;
    nombre  : string;
    tipo    : string;
    permisos: string;
    modulos : any[];
};

export type GetRolesTableResponse = {
    rows: RoleTableItem[];
    count: number;
};

export type GetRoleFormDataResponse = {
    id      : string;
    nombre  : string;
    tipo    : string;
    permisos: any;
    modulos : any;

    _createdBy: string;
    _createdAt: string;
    _updatedBy: string;
    _updatedAt: string;
};

export class RoleView {
    public async getRolesTable(query: any): Promise<Result<GetRolesTableResponse>> {
        const role = await RoleService.getAll();
        if (role.isFailure) return Result.fail(role.error);
        const rutas = await RutaService.getAll();
        if (rutas.isFailure) return Result.fail(rutas.error);
        const rutasResult = rutas.getValue();
        
        const rolesList: RoleTableItem[] = role.getValue().map((item) => {
            const modulosObject = item.props.modulos || [];
            const modulos: any[] = [];
            modulosObject.forEach((e: any) => {
                const ruta = rutasResult.find((r) => r.id === e.id);
                if (ruta) {
                    const propsRuta = {
                        id       : ruta.id,
                        name     : ruta.props.name,
                        path     : ruta.props.path,
                        title    : ruta.props.title,
                        icon     : ruta.props.icon,
                        color    : ruta.props.color,
                        is_client: ruta.props.isClient,
                    };
                    modulos.push(propsRuta);
                }
            });
            return {
                id      : item.id,
                nombre  : item.props.nombre,
                tipo    : item.props.tipo,
                permisos: item.props.permisos,
                modulos : modulos,
            };
        });

        const response = findAndCountResult(rolesList, query);
        return Result.ok<GetRolesTableResponse>(response);
    }

    public async getRoleFormDataView(id_role: string): Promise<Result<GetRoleFormDataResponse>> {
        const role = await RoleService.getById(id_role);
        if (role.isFailure) return Result.fail(role.error);
        const roleResult = role.getValue();
        
        const rutas = await RutaService.getAll();
        if (rutas.isFailure) return Result.fail(rutas.error);
        const rutasResult = rutas.getValue();

        const modulosArray = roleResult.props.modulos.map((r: any) => {
            const ruta = rutasResult.find((ru) => ru.id === r.id);
            if (ruta) return ruta.props.name;
        });
        
        const permisosArray = Object.keys(JSON.parse(roleResult.props.permisos));

        const response = {
            id: roleResult.id,
            nombre: roleResult.props.nombre,
            tipo: roleResult.props.tipo,
            permisos: permisosArray,
            modulos: modulosArray,

            _createdBy: "",
            _createdAt: "",
            _updatedBy: "",
            _updatedAt: "",
        };

        return Result.ok<GetRoleFormDataResponse>(response);
    }

    public async getAllRoles(): Promise<Result<{ rows: any[]; count: number }>> {
        const roles = await RoleService.getAll();
        const result: any[] = roles
            .getValue()
            .map((item) => {
                return {
                    id: item.id.toString(),
                    nombre: item.props.nombre,
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
        return Result.ok({ rows: result, count: result.length });
    }
}
