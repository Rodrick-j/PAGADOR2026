import { BaseHttpController } from "../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import CargoView from "..";
import { CargoProps } from "../../../../core/rrhh/cargo/CargoEntity";
import CargoService from "../../../../core/rrhh/cargo";
import { CargoFormDataResponse } from "../CargoView";

export class CargoViewController extends BaseHttpController {
    public async getTableCargo(req: Request, res: Response): Promise<any> {
        const cargos = await CargoView.getTableCargo(req.query);
        if (cargos.isFailure) return this.fail(res, "Falló al obtener la tabla de cargos");
        return this.ok<any>(res, cargos.getValue());
    }

    public async getCargoFormData(req: Request, res: Response): Promise<any> {
        const formData = await CargoView.getCargoFormDataView(req.params.cargo_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<CargoFormDataResponse>(res, formData.getValue());
    }

    public async getAllCargo(req: Request, res: Response): Promise<any> {
        const result = await CargoView.getAllCargo();
        return this.ok<any>(res, result.getValue());
    }

    public async createOrUpdateCargo(req: Request, res: Response): Promise<any> {
        const data = req.body;
        const props: CargoProps = {
            nombre         : data.nombre,
            item           : data.item,
            gestionCreacion: data.gestion_creacion,
            tipo           : data.tipo,
            salario        : data.salario,
            privilegio     : data.privilegio,
            libre          : data.libre,
            nivel          : data.nivel,
            activo         : data.activo,
        };
        const ID_CARGO = req.body.id;
        let result = null;

        if (ID_CARGO) {
            result = await CargoService.update(ID_CARGO, props);
            if (result.isFailure) return this.fail(res, "Falló al modificar la cargo");
            return this.ok<any>(res, result);
        }
        result = await CargoService.create(props, ID_CARGO);
        if (result.isFailure) return this.fail(res, "Falló al crear la cargo");
        return this.ok<any>(res, result);
    }

    public async changeState(req: Request, res: Response): Promise<any> {
        const cargoId = req.params.cargo_id;
        const activo = Boolean(req.body.activo);

        const result = await CargoService.update(cargoId, { activo });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado");
        return this.ok(res);
    }

    public async destroyCargo(req: Request, res: Response): Promise<any> {
        const ID_CARGO = req.params.cargo_id;
        const result = await CargoService.eliminaCargo(ID_CARGO);
        if (result.isFailure) {
            return this.fail(res, "Error al eliminar el cargo");
        }
        return this.ok<any>(res);
    }    
}
