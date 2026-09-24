import { ActaRecepcionDetalleRepositoryInMemory } from "./_in_memory/ActaRecepcionDetalleRepositoryInMemory";
import { IActaRecepcionDetalleRepository } from "./IActaRecepcionDetalleRepository";
import { ActaRecepcionDetalleRepositorySQL } from "./_sql/ActaRecepcionDetalleRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const ActaRecepcionDetalleRepository: IActaRecepcionDetalleRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new ActaRecepcionDetalleRepositorySQL(db.models.acta_recepcion_detalle)
        : new ActaRecepcionDetalleRepositoryInMemory();

export { ActaRecepcionDetalleRepository };
