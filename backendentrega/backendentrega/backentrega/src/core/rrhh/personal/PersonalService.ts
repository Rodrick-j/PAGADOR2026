import { BaseService } from "../../../base/domain/BaseService";
import { PersonalEntity, PersonalProps } from "./PersonalEntity";
import { Result } from "../../../base/types/Result";

export class PersonalService extends BaseService<PersonalEntity, PersonalProps> {
    public async factory(props: PersonalProps, id?: string): Promise<Result<PersonalEntity>> {
        return PersonalEntity.create(props, id);
    }

    public async eliminaPersonal(id: string): Promise<Result<boolean>> {
        return super.delete(id);
    }

    public async desactivarPersonal(): Promise<Result<boolean>> {
        const personal = await this.repo.getAll({ activo: true });
        const result = await Promise.all(
        personal.getValue().map((a) =>
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
