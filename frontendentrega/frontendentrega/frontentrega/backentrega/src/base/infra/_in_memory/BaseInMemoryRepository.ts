import { IRepository } from "../IRepository";
import { Result } from "../../types/Result";
import { Entity } from "../../domain/Entity";

export class BaseInMemoryRepository<T extends Entity<any>> implements IRepository<T> {
    protected entities: T[] = [];

    constructor() {
        this.entities = [];
    }

    async getById(id: string): Promise<Result<T>> {
        const entity = this.entities.find((u) => u.id === id);
        const result = entity ? Result.ok<T>(entity) : Result.fail<T>("Entity no existe");
        return result;
    }

    async getAll(): Promise<Result<T[]>> {
        return Result.ok<T[]>(this.entities);
    }

    async exists(entity: T): Promise<Result<boolean>> {
        const foundEntity = this.entities.find((u) => u.equals(entity));
        return Result.ok<boolean>(!!foundEntity);
    }

    async save(entity: T): Promise<Result<T>> {
        const existsResult = await this.exists(entity);
        if (existsResult.isSuccess && existsResult.getValue() === true) {
            this.entities[this.entities.findIndex((u) => entity.equals(u))] = entity;
        } else {
            this.entities.push(entity);
        }
        return Result.ok<T>(entity);
    }

    async bulkSave(entities: T[]): Promise<Result<any>> {
        for (const i in entities) {
            const entity = entities[i];
            const existsResult = await this.exists(entity);
            if (existsResult.isSuccess && existsResult.getValue() === true) {
                this.entities[this.entities.findIndex((u) => entity.equals(u))] = entity;
            } else {
                this.entities.push(entity);
            }
        }
        return Result.ok<T>();
    }

    public async findAll(): Promise<Result<{ rows: T[]; count: number }>> {
        const result: { rows: T[]; count: number } = {
            rows: this.entities,
            count: this.entities.length,
        };
        return Result.ok<{ rows: T[]; count: number }>(result);
    }

    async purgeAll(): Promise<Result<boolean>> {
        this.entities = []; // Vaciar completamente el array de entidades
        return Result.ok<boolean>(true);
    }

    async destroy(id: string): Promise<Result<boolean>> {
        const entityIndex = this.entities.findIndex((u) => u.id === id);
        if (entityIndex === -1) {
            Result.fail<boolean>("Entity no existe");
        }
        this.entities = this.entities.filter((entity) => entity.id !== id);
        return Result.ok<boolean>(true);
    }
}

export class TestBaseInMemoryRepository<T extends Entity<any>> extends BaseInMemoryRepository<T> {
    public clearEntities(): void {
        this.entities = [];
    }
}

let BaseInMemoryRepositoryImpl = BaseInMemoryRepository;
if (process.env.NODE_ENV === "test") {
    BaseInMemoryRepositoryImpl = TestBaseInMemoryRepository;
}

export default BaseInMemoryRepositoryImpl;
