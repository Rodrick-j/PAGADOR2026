import { UsuarioRepositoryInMemory } from "./_in_memory/UsuarioRepositoryInMemory";
import { IUsuarioRepository } from "./IUsuarioRepository";
import { UsuarioRepositorySQL } from "./_sql/UsuarioRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const UsuarioRepository: IUsuarioRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new UsuarioRepositorySQL(db.models.usuario)
        : new UsuarioRepositoryInMemory();

export { UsuarioRepository };
