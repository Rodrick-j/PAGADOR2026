import { Result } from "../../../../base/types/Result";
import { findAndCountResult } from "../../../../tools/util";
import BitacoraService from "../../../../core/system/auditoria/bitacora";
import UsuarioService from "../../../../core/system/autenticacion/usuario";
import moment from "moment";

export type BitacoraTableModel = {
    id       : string;
    fecha    : string;
    usuarioId: string;
    nombre   : string;
    rol      : string;
    ruta     : string;
    metodo   : string;
    ip       : string;
    modulo  ?: string | null;
};

export type BitacoraFormDataResponse = {
    id        : string;
    fecha     : string;    
    nombre    : string;
    rol       : string;
    ruta      : string;
    metodo    : string;
    ip        : string;
    modulo    : string;

};

export type BitacoraTableResponse = {
    rows : BitacoraTableModel[];
    count: number;
};

export class BitacoraView {
    public async getBitacoraTable(query: any): Promise<Result<BitacoraTableResponse>> {
        const bitacoraResult = await BitacoraService.getAll();
        if (bitacoraResult.isFailure) return Result.fail("Falló al obtener la bitácora");
        const bitacoras = bitacoraResult.getValue();

        const usuariosResult = await UsuarioService.getAll();
        if (usuariosResult.isFailure) return Result.fail("Falló al obtener los usuarios");
        const usuarios = usuariosResult.getValue();

        const rows: BitacoraTableModel[] = bitacoras.map((b) => {
            const usuario = usuarios.find((u: any) => u.id === b.props.usuarioId);
            return {
                id       : String(b.id),
                fecha    : moment(b.props.fecha).format("YYYY-MM-DD HH:mm:ss"),
                fecha_   : b.props.fecha,
                usuarioId: b.props.usuarioId,
                nombre   : usuario ? usuario.getNombreCompletoPorApellido() : "",
                rol      : b.props.rol,
                ruta     : b.props.ruta,
                metodo   : b.props.metodo,
                ip       : b.props.ip,
                modulo   : b.props.modulo ?? null,
            };
        }).sort((a, b) => {
            return new Date(b.fecha_).getTime() - new Date(a.fecha_).getTime();
        });

        const response = findAndCountResult(rows, query);
        return Result.ok<BitacoraTableResponse>(response);
    }

    public async getBitacoraFormDataView(id_bitacora: string): Promise<Result<BitacoraFormDataResponse>> {
        const bitacora = await BitacoraService.getById(id_bitacora);
        if (bitacora.isFailure) {
            return Result.fail<BitacoraFormDataResponse>("Bitacora no encontrado");
        }

        const usuariosResult = await UsuarioService.getAll();
        if (usuariosResult.isFailure) return Result.fail("Falló al obtener los usuarios");
        const usuarios = usuariosResult.getValue().find((u: any) => u.id === bitacora.getValue().props.usuarioId);

        const props = bitacora.getValue().props;
        
        const result: BitacoraFormDataResponse = {
            id     : bitacora.getValue().id,
            fecha  : moment(props.fecha).format("YYYY-MM-DD HH:mm:ss"),
            nombre : usuarios?.getNombreCompletoPorApellido() ?? "-",
            rol    : props.rol,
            ruta   : props.ruta,
            metodo : props.metodo,
            ip     : props.ip,
            modulo : props.modulo ?? "-",
        };

        return Result.ok(result);
    }
}
