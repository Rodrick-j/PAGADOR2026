import { BaseService } from "../../../../base/domain/BaseService";
import { VehiculoEntity, VehiculoProps } from "./VehiculoEntity";
import { Result } from "../../../../base/types/Result";

export class VehiculoService extends BaseService<VehiculoEntity, VehiculoProps> {
    public async factory(props: VehiculoProps, id?: string): Promise<Result<VehiculoEntity>> {
        return VehiculoEntity.create(props, id);
    }

    public async eliminaVehiculo(id: string): Promise<Result<boolean>> {
        return super.delete(id);
    }

    public async desactivarVehiculo(): Promise<Result<boolean>> {
        const vehiculo = await this.repo.getAll({ activo: true });
        const result = await Promise.all(
        vehiculo.getValue().map((a) =>
            super.update(a.id, { activo: false })
        )
        );

        const failure = result.find(r => r.isFailure);

        if (failure) {
        return Result.fail(failure.error);
        }

        return Result.ok();
    }
}
