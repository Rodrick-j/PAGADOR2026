import { BaseHttpController } from "../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import AreaView from "..";
import { AreaProps } from "../../../../core/rrhh/area/AreaEntity";
import AreaService from "../../../../core/rrhh/area";
import { AreaFormDataResponse } from "../AreaView";
import { AuthUser } from "../../../../base/types/AuthUser";

export class AreaViewController extends BaseHttpController {
    public async getTableArea(req: Request, res: Response): Promise<any> {
        const areas = await AreaView.getTableArea(req.query);
        if (areas.isFailure) return this.fail(res, "Falló al obtener la tabla de areas");
        return this.ok<any>(res, areas.getValue());
    }

    public async getAreaFormData(req: Request, res: Response): Promise<any> {
        const formData = await AreaView.getAreaFormDataView(req.params.area_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<AreaFormDataResponse>(res, formData.getValue());
    }

    public async getAllArea(req: Request, res: Response): Promise<any> {
        const result = await AreaView.getAllArea();
        return this.ok<any>(res, result.getValue());
    }
    
    public async getAllAreaCliente(req: Request, res: Response): Promise<any> {
        const AUTH_USER: AuthUser = req.authUser;
        const result = await AreaView.getAllAreaCliente(AUTH_USER);
        return this.ok<any>(res, result.getValue());
    }

    public async createOrUpdateArea(req: Request, res: Response): Promise<any> {
        const data = req.body;
        const PADRE_VALUE = data.padre === "si";
        const props: AreaProps = {
            sigla: data.sigla,
            nombre: data.nombre,
            indice: data.indice,
            padre: PADRE_VALUE,
            activo: data.activo,
            areaId: data.area_id,
        };
        const ID_AREA = req.body.id;
        let result = null;

        if (ID_AREA) {
            result = await AreaService.update(ID_AREA, props);
            if (result.isFailure) return this.fail(res, "Falló al modificar la area");
            return this.ok<any>(res, result);
        }
        result = await AreaService.create(props, ID_AREA);
        if (result.isFailure) return this.fail(res, "Falló al crear la area");
        return this.ok<any>(res, result);
    }

    public async changeState(req: Request, res: Response): Promise<any> {
        const areaId = req.params.area_id;
        const activo = Boolean(req.body.activo);

        const result = await AreaService.update(areaId, { activo });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado");
        return this.ok(res);
    }

    public async destroyArea(req: Request, res: Response): Promise<any> {
        const ID_AREA = req.params.area_id;
        const result = await AreaService.eliminaArea(ID_AREA);
        if (result.isFailure) {
            return this.fail(res, "Error al eliminar el area");
        }
        return this.ok<any>(res);
    }

     //Se agrega para la busqueda de area hijos
 public async getAreaHijos(req: Request, res: Response): Promise<any> {   
    
    const areaHijos = await AreaView.getAreaHijos();	
    if (areaHijos.isFailure) return this.fail(res, 'Falló al obtener el area Hijo ');
    return this.ok<any>(res, areaHijos.getValue());
  }

  public async getCite(req: Request, res: Response): Promise<any> { 
    const cite = await AreaView.getCite();	
    if (cite.isFailure) return this.fail(res, 'Falló al obtener el CITE ');
    return this.ok<any>(res, cite.getValue());
  }
}
