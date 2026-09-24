import { Result } from "../../../base/types/Result";

import CargoService from "../../../core/rrhh/cargo";

import { findAndCountResult } from "../../../tools/util";

export type CargoTableModel = {
    id?: string;
    nombre: string;
    item: string;
    gestion_creacion: string;
    tipo: string;
    salario: number;
    libre: boolean;
    nivel: number;
    activo: boolean;
};

export type CargoFormDataResponse = {
    id: string;
    nombre: string;
    item: string;
    gestion_creacion: string;
    tipo: string;
    salario: number;
    libre: string;
    nivel: number;
    activo: boolean;
};

export type CargoOptionsFormModel = {
    id: string;
    nombre: string;
};
export class CargoView {
    public async getTableCargo(query: any): Promise<Result<{ rows: CargoTableModel[] }>> {
        /* listado de cargo */
        const cargo = await CargoService.getAll();
        if (cargo.isFailure) return Result.fail("Falló al obtener la cargo");
        const cargoResult = cargo.getValue();

        /* listado general de la tabla cargo ordenados */
        const result: CargoTableModel[] = cargoResult.map((item) => {
                return {
                    id              : String(item.id),
                    nombre          : item.props.nombre,
                    item            : item.props.item,
                    gestion_creacion: item.props.gestionCreacion,
                    tipo            : item.props.tipo,
                    salario         : item.props.salario,
                    libre           : item.props.libre,
                    nivel           : item.props.nivel,
                    activo          : item.props.activo,
                };
            })
            .sort((a, b) => (a.item > b.item ? 1 : -1));
        const response = findAndCountResult(result, query);
        return Result.ok(response);
    }

    public async getCargoFormDataView(id_cargo: string): Promise<Result<CargoFormDataResponse>> {
        const cargo = await CargoService.getById(id_cargo);
        if (cargo.isFailure) {
            return Result.fail<CargoFormDataResponse>("Cargo no encontrado");
        }

        const props = cargo.getValue().props;

        const result: CargoFormDataResponse = {
            id              : cargo.getValue().id,
            nombre          : props.nombre,
            item            : props.item,
            gestion_creacion: props.gestionCreacion,
            tipo            : props.tipo,
            salario         : props.salario,
            libre           : props.libre ? "1"    : "0",
            nivel           : props.nivel,
            activo          : props.activo,
        };

        return Result.ok(result);
    }

    public async getAllCargo(): Promise<Result<{ rows: CargoOptionsFormModel[]; count: number }>> {
        const cargos = await CargoService.getAll();
        const result: CargoOptionsFormModel[] = cargos
            .getValue()
            .filter((c) => c.props.activo)
            .map((item) => {
                return {
                    id: item.id.toString(),
                    nombre: item.getCargoCompleto(),
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
        return Result.ok({ rows: result, count: result.length });
    }    
}
