import { CitesRepository } from "./infra";
import { CitesService } from "./CitesService";

const service = new CitesService(CitesRepository);

export default service;
