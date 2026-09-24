import { IDocumentoRepository } from "../IDocumentoRepository";
import { DocumentoEntity } from "../../DocumentoEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class DocumentoRepositoryInMemory extends BaseInMemoryRepository<DocumentoEntity> implements IDocumentoRepository {}
