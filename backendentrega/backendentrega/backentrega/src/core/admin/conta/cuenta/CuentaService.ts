import { BaseService } from "../../../../base/domain/BaseService";
import { CuentaEntity, CuentaProps } from "./CuentaEntity";
import { Result } from "../../../../base/types/Result";

export class CuentaService extends BaseService<CuentaEntity, CuentaProps> {
    public async factory(props: CuentaProps, id?: string): Promise<Result<CuentaEntity>> {
        return CuentaEntity.create(props, id);
    }
}
