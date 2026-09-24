import { DocumentoRepositoryInMemory } from "./_in_memory/DocumentoRepositoryInMemory";
import { IDocumentoRepository } from "./IDocumentoRepository";
import { DocumentoRepositorySQL } from "./_sql/DocumentoRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const DocumentoRepository: IDocumentoRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new DocumentoRepositorySQL(db.models.documento)
        : new DocumentoRepositoryInMemory();

export { DocumentoRepository };
