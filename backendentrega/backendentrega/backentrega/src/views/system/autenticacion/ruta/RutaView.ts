import { Result } from "../../../../base/types/Result";

import { findAndCountResult } from "../../../../tools/util";

import RutaService from "../../../../core/system/autenticacion/ruta";

type RutaTableItem = {
    id          : string;
    name        : string;
    path        : string;
    title       : string;
    descripcion?: string;
    icon        : string;
    color       : string;
    is_client   : boolean | null;
};

export type GetRutasTableResponse = {
    rows: RutaTableItem[];
    count: number;
};

export type GetRutaFormDataResponse = {
    id          : string;
    name        : string;
    path        : string;
    title       : string;
    descripcion?: string;
    icon        : string;
    color       : string;
    is_client   : number | boolean | null;
};

export class RutaView {
    public async getRutasTable(query: any): Promise<Result<GetRutasTableResponse>> {
        const ruta = await RutaService.getAll();
        if (ruta.isFailure) return Result.fail(ruta.error);

        const rolesList: RutaTableItem[] = ruta.getValue().map((item) => {
            return {
                id         : item.id,
                name       : item.props.name,
                path       : item.props.path,
                title      : item.props.title,
                descripcion: item.props.descripcion,
                icon       : item.props.icon,
                color      : item.props.color,
                is_client  : item.props.isClient,
            };
        });
        const response = findAndCountResult(rolesList, query);
        return Result.ok<GetRutasTableResponse>(response);
    }

    public async getRutaFormDataView(id_role: string): Promise<Result<GetRutaFormDataResponse>> {
        const ruta = await RutaService.getById(id_role);
        if (ruta.isFailure) {
            return Result.fail<GetRutaFormDataResponse>("Ruta no encontrado");
        }

        const props = ruta.getValue().props;

        const response = {
            id         : ruta.getValue().id,
            name       : props.name,
            path       : props.path,
            title      : props.title,
            descripcion: props.descripcion,
            icon       : props.icon,
            color      : props.color,
            is_client  : props.isClient?1  : 0,
        };

        return Result.ok<GetRutaFormDataResponse>(response);
    }

    public async getAllRutas(): Promise<Result<{ rows: any[]; count: number }>> {
        const rutas = await RutaService.getAll();
        const result: any[] = rutas
            .getValue()
            .map((item) => {
                return {
                    id: item.id.toString(),
                    nombre: item.props.name,
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
        return Result.ok({ rows: result, count: result.length });
    }
}
