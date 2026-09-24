import { CargoRepositoryInMemory } from "./_in_memory/CargoRepositoryInMemory";
import { ICargoRepository } from "./ICargoRepository";
import { CargoRepositorySQL } from "./_sql/CargoRepositorySQL";
import { Database } from "../../../../Database";

const db = Database.getInstance();
const CargoRepository: ICargoRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new CargoRepositorySQL(db.models.cargo)
        : new CargoRepositoryInMemory();

export { CargoRepository };
