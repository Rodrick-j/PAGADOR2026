import { Result } from "../../../../base/types/Result";

import { findAndCountResult } from "../../../../tools/util";

import DestinoService from "../../../../core/admin/bsss/destino";

type DestinoTableModel = {
    id       : string;
    nombre   : string;
    distancia: number;
    litros   : number;
    estado   : boolean;
};

export type GetDestinosTableResponse = {
    rows: DestinoTableModel[];
    count: number;
};

export type DestinoFormDataResponse = {
    id: string;
    nombre   : string;
    distancia: number;
    litros   : number;
    estado   : boolean;
};

export type DestinosOptionsFormModel = {
    id: string;
    nombre: string;
    concepto: string;
};

export class DestinoView {
    public async getDestinosTable(query: any): Promise<Result<GetDestinosTableResponse>> {
        const cuenta = await DestinoService.getAll();
            if (cuenta.isFailure) return Result.fail("Falló al obtener la cuenta");
            const cuentaResult = cuenta.getValue();
            const result: DestinoTableModel[] = cuentaResult.map((item) => {
                return {
                    id: String(item.id),
                    nombre   : item.props.nombre,
                    distancia: item.props.distancia,
                    litros   : item.props.litros,
                    estado   : item.props.estado,
                };
            });
            const response = findAndCountResult(result, query);
            return Result.ok(response);
    }

    public async getDestinoFormDataView(id_destino: string): Promise<Result<DestinoFormDataResponse>> {
        const destino = await DestinoService.getById(id_destino);
        if (destino.isFailure) {
            return Result.fail<DestinoFormDataResponse>("Destino no encontrado");
        }

        const props = destino.getValue().props;
        const result: DestinoFormDataResponse = {
            id: destino.getValue().id,
            nombre   : props.nombre,
            distancia: props.distancia,
            litros   : props.litros,
            estado   : props.estado,
        };

        return Result.ok(result);
    }

    public async getAllDestinos(): Promise<Result<{ rows: DestinosOptionsFormModel[]; count: number }>> {
        const aperturas = await DestinoService.getAll();
        if (aperturas.isFailure) return Result.fail("Falló al obtener la aperturas");        
        const aperturaResult = aperturas.getValue().filter((a) => a.props.estado);
        if (!aperturaResult) return Result.fail("Error no existe apertura asignada.");

        const result: DestinosOptionsFormModel[] = aperturas.getValue().map((item) => {
            return {
                id: item.id.toString(),
                nombre: item.props.nombre.toUpperCase(),
                concepto: item.props.distancia+' km - '+item.props.litros+' litros'
            };
        })
        .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));

        return Result.ok({ rows: result, count: result.length });
    }

   
}
