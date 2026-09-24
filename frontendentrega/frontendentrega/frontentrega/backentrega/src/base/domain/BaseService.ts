import { Result } from "../types/Result";
import { Entity } from "./Entity";
import { IRepository } from "../infra/IRepository";

export abstract class BaseService<T extends Entity<any>, P> {
    protected repo: IRepository<T>;

    public constructor(repo: IRepository<T>) {
        this.repo = repo;
    }

    public abstract factory(props: P, id?: string): Promise<Result<T>>;

    public async create(props: P, id?: string): Promise<Result<T>> {
        const entity = await this.factory(props, id);
        if (entity.isFailure) {
            return Result.fail<T>(entity.error);
        }
        const exists = await this.repo.exists(entity.getValue());
        if (exists.isFailure) {
            return Result.fail<T>(entity.error);
        }
        if (exists.getValue() === true) {
            return Result.fail<T>("Entity con ese id ya existe");
        }

        return await this.repo.save(entity.getValue());
    }

    public async bulkCreate(propsList: P[]): Promise<Result<T>> {
        const valuesToSave = [];
        for (const i in propsList) {
            const props = propsList[i];

            const entity = await this.factory(props);
            if (entity.isFailure) {
                return Result.fail<T>(entity.error);
            }
            const exists = await this.repo.exists(entity.getValue());
            if (exists.isFailure) {
                return Result.fail<T>(entity.error);
            }
            if (exists.getValue() === true) {
                return Result.fail<T>("Entity con ese id ya existe");
            }
            valuesToSave.push(entity.getValue());
        }
        return await this.repo.bulkSave(valuesToSave);
    }

    public async update<P>(id: string, props: P): Promise<Result<T>> {
        const entity = await this.repo.getById(id);
        if (entity.isFailure) {
            return Result.fail<T>(entity.error);
        }
        const entityProps = { ...entity.getValue().props, ...props };
        const newEntity = await this.factory(entityProps, id);
        if (newEntity.isFailure) {
            return Result.fail<T>(newEntity.error);
        }
        return await this.repo.save(newEntity.getValue());
    }

    public async getById(id: string): Promise<Result<T>> {
        return await this.repo.getById(id);
    }

    public async getAll(query?: any): Promise<Result<T[]>> {
        return await this.repo.getAll(query);
    }

    public async delete(id: string): Promise<Result<boolean>> {
        return await this.repo.destroy(id);
    }

    public async purgeAll(): Promise<Result<boolean>> {
        return await this.repo.purgeAll();
    }
    
    public async countAllExact(query?: any): Promise<number> {
        return (this.repo as any).countAllExact(query);
    }
}
