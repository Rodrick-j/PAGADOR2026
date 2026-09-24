import { BaseService } from "../../../../base/domain/BaseService";
import { ValeEntity, ValeProps } from "./ValeEntity";
import { Result } from "../../../../base/types/Result";
//import AsignacionService from "../asignacion";

export class ValeService extends BaseService<ValeEntity, ValeProps> {
    public async factory(props: ValeProps, id?: string): Promise<Result<ValeEntity>> {
        return ValeEntity.create(props, id);
    }

    public async setPurgeAll(): Promise<Result<boolean>> {
        return super.purgeAll();
    }

    public async eliminaVale(id: string): Promise<Result<boolean>> {
        
        /* const vale = await super.getById(id);
        if (vale.isFailure) return Result.fail(vale.error);
        const valeResult = vale.getValue();
        
        const asignacion = await AsignacionService.getById(valeResult.props.asignacionId || "");
        if (asignacion.isFailure) return Result.fail(asignacion.error);
        const asignacionResult = asignacion.getValue();
        
        let saldo = asignacionResult.props.saldo;
        
        const vale_aux = valeResult?.props;
        const precio_total_old = Number(vale_aux?.precioTotal) || 0;
        saldo = saldo + precio_total_old;

        const asignacionUpdate = await AsignacionService.update(asignacionResult.id, { saldo });
        if (asignacionUpdate.isFailure) return Result.fail("Falló al actualizar asignacion"); */ 

        return super.delete(id);
    }
}
