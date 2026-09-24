import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import RoleView from "..";
import { GetRoleFormDataResponse, GetRolesTableResponse } from "../RoleView";
import RoleService from "../../../../../core/system/autenticacion/role";
import { RoleProps } from "../../../../../core/system/autenticacion/role/RoleEntity";
import RutaService from "../../../../../core/system/autenticacion/ruta";

export class RoleViewController extends BaseHttpController {
    public async getRolesTable(req: Request, res: Response): Promise<Response<any>> {
        const data = await RoleView.getRolesTable(req.query);
        if (data.isFailure) {
            return this.fail(res, data.error as string);
        }
        return this.ok<GetRolesTableResponse>(res, data.getValue());
    }

    public async getRoleFormData(req: Request, res: Response): Promise<any> {
        const formData = await RoleView.getRoleFormDataView(req.params.role_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<GetRoleFormDataResponse>(res, formData.getValue());
    }

    public async getAllRoles(req: Request, res: Response): Promise<any> {
        const result = await RoleView.getAllRoles();
        return this.ok<any>(res, result.getValue());
    }
    public async createOrUpdateRole(req: Request, res: Response): Promise<any> {
        const data = req.body;
        /* dar formato a los datos recibidos */
        const permisosArray =
            (data.permisos.length > 0 && data.permisos.reduce((a: any, v: any) => ({ ...a, [v]: true }), {})) || [];
        const permisosObject = `${JSON.stringify(permisosArray)}`;
        const rutas = await RutaService.getAll();
        if (rutas.isFailure) return Result.fail(rutas.error);
        const rutasResult = rutas.getValue();

        const modulosArray = (data.modulos.length > 0 && data.modulos.reduce((a: any, v: any) => ({ ...a, [v]: v }), {})) || [];
        const modulosString: any[] = [];
        Object.keys(modulosArray).map((e: any) => {
            const ruta = rutasResult.find((r) => r.props.name === e);
            if (ruta) {
                const propsRuta = { id: ruta.id };
                modulosString.push(propsRuta);
            }
        });

        const modulosObject = modulosString;
        const ID_ROLE = data.id;
        let TIPO_ROL = data.tipo;
        if (data.tipo === "" || ID_ROLE) {
            const originalString = data.nombre;
            const convertedString = originalString
                .toLowerCase()
                .replace(/[^\w\s]/g, "")
                .replace(/\s/g, "");
            TIPO_ROL = convertedString;
        }
        const props: RoleProps = {
            nombre: data.nombre,
            tipo: TIPO_ROL,
            permisos: permisosObject,
            modulos: modulosObject,
        };
        let result = null;
        if (ID_ROLE) {
            result = await RoleService.update(ID_ROLE, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }
        result = await RoleService.create(props);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async destroyRole(req: Request, res: Response): Promise<any> {
        const ID_ROLE = req.params.role_id;
        const roleR = await RoleService.getById(ID_ROLE);
        if (roleR.isFailure) return this.fail(res, String(roleR.error));

        const result = await RoleService.delete(ID_ROLE);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }
}
