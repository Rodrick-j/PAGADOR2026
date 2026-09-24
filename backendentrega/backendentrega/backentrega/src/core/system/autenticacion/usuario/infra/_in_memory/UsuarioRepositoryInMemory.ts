import { IUsuarioRepository } from "../IUsuarioRepository";
import { UsuarioEntity } from "../../UsuarioEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class UsuarioRepositoryInMemory extends BaseInMemoryRepository<UsuarioEntity> implements IUsuarioRepository {}
