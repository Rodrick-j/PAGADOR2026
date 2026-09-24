import { BaseService } from "../../../base/domain/BaseService";
import { CargoEntity, CargoProps } from "./CargoEntity";
import { Result } from "../../../base/types/Result";

export class CargoService extends BaseService<CargoEntity, CargoProps> {
    public async factory(props: CargoProps, id?: string): Promise<Result<CargoEntity>> {
        return CargoEntity.create(props, id);
    }

    public async eliminaCargo(id: string): Promise<Result<boolean>> {
        return super.delete(id);
    }
}
