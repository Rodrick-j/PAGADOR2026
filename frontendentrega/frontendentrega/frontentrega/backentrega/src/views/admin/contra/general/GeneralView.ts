import { Result } from "../../../../base/types/Result";

import { findAndCountResult } from "../../../../tools/util";

import GeneralService from "../../../../core/admin/contra/general";
import UsuarioService from "../../../../core/system/autenticacion/usuario";

type GeneralTableModel = {
    id     : string;
    nombre : string;
    tiempo : string;
    tipo   : string;
    paso   : number;
    usuario: string;
};

export type GetGeneralsTableResponse = {
    rows: GeneralTableModel[];
    count: number;
};

export type GeneralFormDataResponse = {
    id        : string;
    nombre    : string;
    tiempo    : string;
    tipo      : string;
    paso      : number;
    usuario_id: string | null;
};

export type GeneralsOptionsFormModel = {
    id: string;
    nombre: string;
    concepto: string;
};

export class GeneralView {
    public async getGeneralsTable(query: any): Promise<Result<{ rows: GeneralTableModel[] }>> {
            const general = await GeneralService.getAll();
            if (general.isFailure) return Result.fail("Falló al obtener la general");
            const generalResult = general.getValue();
            
            const usuarios = await UsuarioService.getAll(); 
            if (usuarios.isFailure) Result.fail(String(usuarios.error));
            

            const result: GeneralTableModel[] = generalResult.map((item) => {
                const userFind = usuarios.getValue().find((u: any) => u.id===item.props.usuarioId);
                const nombre = userFind?.getNombreConApellido() || "";
                return {
                    id     : String(item.id),
                    nombre : item.props.nombre,
                    tiempo : item.props.tiempo,
                    tipo   : item.props.tipo,
                    paso   : item.props.paso,
                    usuario: nombre,
                };
            });
            
            const response = findAndCountResult(result, query);
            return Result.ok(response);
    }

    public async getGeneralFormDataView(id_general: string): Promise<Result<GeneralFormDataResponse>> {
        const general = await GeneralService.getById(id_general);
        if (general.isFailure) return Result.fail<GeneralFormDataResponse>("General no encontrado");
        
        const props = general.getValue().props;

        const result: GeneralFormDataResponse = {
            id        : general.getValue().id,
            nombre    : props.nombre,
            tiempo    : props.tiempo,
            tipo      : props.tipo,
            paso      : props.paso,
            usuario_id: props.usuarioId
        };

        return Result.ok(result);
    }
}