import { Result } from "../types/Result";

export interface IRepository<T> {
    getById(id: string): Promise<Result<T>>;
    getAll(query?: any): Promise<Result<T[]>>;
    exists(t: T): Promise<Result<boolean>>;
    save(t: T): Promise<Result<T>>;
    bulkSave(t: T[]): Promise<Result<any>>;
    findAll(query?: any): Promise<Result<{ rows: T[]; count: number }>>;
    destroy(id: string): Promise<Result<boolean>>;
    purgeAll(): Promise<Result<boolean>>;
}
