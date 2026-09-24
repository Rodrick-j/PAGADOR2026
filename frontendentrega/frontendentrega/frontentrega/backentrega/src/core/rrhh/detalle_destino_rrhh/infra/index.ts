import { DetalleDestinorrhhRepositoryInMemory } from "./_in_memory/DetalleDestinorrhhRepositoryInMemory";
import { IDetalleDestinorrhhRepository } from "./IDetalleDestinorrhhRepository";
import { DetalleDestinorrhhRepositorySQL } from "./_sql/DetalleDestinorrhhRepositorySQL";
import { Database } from "../../../../Database";

const db = Database.getInstance();
const DetalleDestinorrhhRepository: IDetalleDestinorrhhRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new DetalleDestinorrhhRepositorySQL(db.models.detalle_destino_rrhh)
        : new DetalleDestinorrhhRepositoryInMemory();

export { DetalleDestinorrhhRepository };