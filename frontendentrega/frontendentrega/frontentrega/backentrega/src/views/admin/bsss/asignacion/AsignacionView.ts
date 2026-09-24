import { Result } from "../../../../base/types/Result";

import { findAndCountResult, formatearNumero, numberToString } from "../../../../tools/util";

import AsignacionService from "../../../../core/admin/bsss/asignacion";
import AreaService from "../../../../core/rrhh/area";
import UsuarioService from "../../../../core/system/autenticacion/usuario";
import { AuthUser } from "../../../../base/types/AuthUser";
import VehiculoService from "../../../../core/admin/bsss/vehiculo";
import PersonalService from "../../../../core/rrhh/personal";
import AperturaGeneralService from "../../../../core/admin/apertura/apertura_general";

type AsignacionTableModel = {
    id            : string;
    inicial       : string;
    restante      : string;
    real      : string;
    nombre_area   : string;
    nombre_usuario: string;
    observacion   : string;
    cod_asignacion: string;
    estado?       : boolean;
    contrato?     : string;
};

export type GetAsignacionsTableResponse = {
    rows: AsignacionTableModel[];
    count: number;
};

export type AsignacionFormDataResponse = {
    id         : string;
    observacion: string | null;
    apertura_id: string | null;
    usuario_id : string | null;
    contrato?  : string; 
};

export type AsignacionsOptionsFormModel = {
    id: string;
    nombre: string;
    concepto: string;
};

export class AsignacionView {
    public async getAsignacionsTable(query: any): Promise<Result<{ rows: AsignacionTableModel[] }>> {
            const asignacion = await AsignacionService.getAll();
            if (asignacion.isFailure) return Result.fail("Falló al obtener la asignacion");
            const asignacionResult = asignacion.getValue();
            
            const aperturageneral = await AperturaGeneralService.getAll();
            if (aperturageneral.isFailure) return Result.fail("Falló al obtener la apertura");
            const aperturaGeneralResult = aperturageneral.getValue();

            const areas = await AreaService.getAll();
            if (areas.isFailure) return Result.fail("Falló al obtener la area");
            const areaResult = areas.getValue();

            const usuarios = await UsuarioService.getAll();
            if (usuarios.isFailure) return Result.fail("Falló al obtener la usuario");
            const usuarioResult = usuarios.getValue();

            const result: AsignacionTableModel[] = asignacionResult.map((item) => {
                const apertura  = aperturaGeneralResult.find((v) => v.id===item.props.partidaGeneralId);
                const areaPadre = areaResult.find((a) => a.id===apertura?.props.areaId || "")?.props.nombre || "";
                const areaHijo  = areaResult.find((a) => a.id===apertura?.props.areaHijoId || "")?.props.nombre || "";
                const usuario   = usuarioResult.find((u) => u.id === item.props.usuarioId);
                const INICIAL   = apertura?.props.presupuestoInicial || 0;
                const RESTANTE  = item?.props.saldo || 0;
                const REAL      = apertura?.props.presupuestoRestante || 0;
                let nombreArea = areaPadre;
                if(areaHijo)  nombreArea = areaHijo +" ::: "+ areaPadre+ " ";

                return {
                    id            : String(item.id),
                    nombre_area   : nombreArea,
                    nombre_usuario: usuario?.getNombreCompletoCI() || "",
                    cod_asignacion: apertura?.props.aperturaProgramatica || "",
                    inicial       : formatearNumero(Number(INICIAL),'en-US'),
                    restante      : formatearNumero(Number(RESTANTE),'en-US'),
                    real          : formatearNumero(Number(REAL),'en-US'),
                    observacion   : item.props.observacion || "",
                    estado        : item.props.estado,
                    contrato      : item.props.contrato,
                };
            });
            
            const response = findAndCountResult(result, query);
            return Result.ok(response);
    }

    public async getAsignacionFormDataView(id_asignacion: string): Promise<Result<AsignacionFormDataResponse>> {
        const asignacion = await AsignacionService.getById(id_asignacion);
        if (asignacion.isFailure) return Result.fail<AsignacionFormDataResponse>("Asignacion no encontrado");
        const asignacionResult = asignacion.getValue();
        
        const result: AsignacionFormDataResponse = {
            id         : asignacion.getValue().id,
            observacion: asignacionResult.props.observacion,
            apertura_id: asignacionResult?.props.partidaGeneralId,
            usuario_id : asignacionResult.props.usuarioId,
            contrato   : asignacionResult.props.contrato,
        };

        return Result.ok(result);
    }

    public async getAllAsignacions(authUser: AuthUser): Promise<Result<{ rows: AsignacionsOptionsFormModel[]; count: number }>> {
        const ID_USUARIO = authUser.uid;

        const asignacions = await AsignacionService.getAll();
        if (asignacions.isFailure) return Result.fail("Falló al obtener la asignacions");
        let asignacionResult = asignacions.getValue()
                                                    .filter((a) => a.props.estado)
                                                    .filter((a) => a.props.usuarioId === ID_USUARIO);
        if (authUser.superadministrador) asignacionResult = asignacions.getValue();
        if (!asignacionResult) return Result.fail("Error no existe asignacion asignada.");

        const aperturageneral = await AperturaGeneralService.getAll();
        if (aperturageneral.isFailure) return Result.fail("Falló al obtener la apertura general");
        const aperturaGeneralResult = aperturageneral.getValue();
        
        const area = await AreaService.getAll();
        if (area.isFailure) return Result.fail("Falló al obtener la area");
        const areaResult = area.getValue();
        
        const result: AsignacionsOptionsFormModel[] = asignacionResult.map((item) => {
            const aperturaGeneralR = aperturaGeneralResult.find((v) => v.id===item.props.partidaGeneralId);
            const areaPadre = areaResult.find((a) => a.id===aperturaGeneralR?.props.areaId || "")?.props.nombre || "";
            const areaHijo = areaResult.find((a) => a.id===aperturaGeneralR?.props.areaHijoId || "")?.props.nombre || "";            
            let nombreArea = areaPadre;
            if(areaHijo)  nombreArea = areaHijo +" ::: "+ areaPadre+ " ";
            const nombrePartidadPresupuestaria = aperturaGeneralR?.props.aperturaProgramatica || ""; 
            return {
                id: item.id.toString(),
                nombre: nombreArea,
                concepto: nombrePartidadPresupuestaria
            };
        })
        .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));

        return Result.ok({ rows: result, count: result.length });
    }

    public async getByIdAsignacion(asignacion_id: string): Promise<Result<any>> {
        const asignacion = await AsignacionService.getById(asignacion_id);
        if (asignacion.isFailure) return Result.fail<AsignacionFormDataResponse>("Asignacion no encontrado");
        const asignacionResult = asignacion.getValue().props;
        const aperturaID = asignacionResult.partidaGeneralId || "";

        const apertura = await AperturaGeneralService.getById(aperturaID);
        if (apertura.isFailure) return Result.fail("Falló al obtener la apertura");
        const aperturaGeneralResult = apertura.getValue();

        const vehiculos = await VehiculoService.getAll();
        if (vehiculos.isFailure) return Result.fail(String(vehiculos.error));

        const vehiculosResult = vehiculos.getValue().filter((v) => v.props.estado);
        if (!vehiculosResult) return Result.fail("Error no existe vehiculos asignado.");

        const areaPadre = aperturaGeneralResult?.props.areaId || null;
        const areaHijo = aperturaGeneralResult?.props.areaHijoId || null;
        
        const vehiculoPadreResult = vehiculosResult.find((v) => v.props.areaId === areaPadre) || null;        
        const vehiculoHijoResult = vehiculosResult.find((v) => v.props.areaId === areaHijo);

        let vehiculoResult = vehiculoPadreResult;        
        if(vehiculoHijoResult) vehiculoResult = vehiculoHijoResult;
                   
        if (!vehiculoResult) return Result.fail("Error no existe vehiculo asignado.");

        const usuario = await UsuarioService.getById(asignacionResult.usuarioId || "");
        if (usuario.isFailure) return Result.fail(String(usuario.error));
        const usuarioResult = usuario.getValue();
        
        const personal = await PersonalService.getAll();
        if (personal.isFailure) return Result.fail(String(personal.error));
        const personalResult = personal.getValue().find((p) => p.props.usuarioId === usuarioResult.id)?.getNombreCompleto() || "";
        const INICIAL = aperturaGeneralResult?.props.presupuestoInicial || 0;
        const RESTANTE = asignacionResult?.saldo || 0;
        const result = {
            vehiculo_id  : vehiculoResult?.id || null,
            asignacion_id: asignacion.getValue().id,
            asignacion   : "Apertura Programatica: "+aperturaGeneralResult.props.aperturaProgramatica+" :: "+personalResult,
            inicial      : "Presupuesto Inicial: "+numberToString(INICIAL)+" Bs." || "",
            restante     : "Presupuesto Restante: "+numberToString(RESTANTE)+" Bs." || "",
        };

        return Result.ok(result);
    }
}
