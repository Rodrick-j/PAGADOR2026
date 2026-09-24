import { DetalleDestinoRepositoryInMemory } from "./_in_memory/DetalleDestinoRepositoryInMemory";
import { IDetalleDestinoRepository } from "./IDetalleDestinoRepository";
import { DetalleDestinoRepositorySQL } from "./_sql/DetalleDestinoRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const DetalleDestinoRepository: IDetalleDestinoRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new DetalleDestinoRepositorySQL(db.models.detalle_destino)
        : new DetalleDestinoRepositoryInMemory();

export { DetalleDestinoRepository };