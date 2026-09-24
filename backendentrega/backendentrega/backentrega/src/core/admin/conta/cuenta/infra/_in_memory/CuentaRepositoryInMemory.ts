import { ICuentaRepository } from "../ICuentaRepository";
import { CuentaEntity } from "../../CuentaEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class CuentaRepositoryInMemory extends BaseInMemoryRepository<CuentaEntity> implements ICuentaRepository {}
