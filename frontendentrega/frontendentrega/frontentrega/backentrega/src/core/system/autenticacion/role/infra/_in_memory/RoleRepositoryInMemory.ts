import { IRoleRepository } from "../IRoleRepository";
import { RoleEntity } from "../../RoleEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class RoleRepositoryInMemory extends BaseInMemoryRepository<RoleEntity> implements IRoleRepository {}
