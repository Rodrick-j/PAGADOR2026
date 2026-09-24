import { CargoRepository } from "./infra";
import { CargoService } from "./CargoService";

const service = new CargoService(CargoRepository);

export default service;
