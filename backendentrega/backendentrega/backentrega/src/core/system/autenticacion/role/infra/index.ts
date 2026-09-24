import { RoleRepositoryInMemory } from "./_in_memory/RoleRepositoryInMemory";
import { IRoleRepository } from "./IRoleRepository";
import { RoleRepositorySQL } from "./_sql/RoleRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const RoleRepository: IRoleRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new RoleRepositorySQL(db.models.role)
        : new RoleRepositoryInMemory();

export { RoleRepository };
