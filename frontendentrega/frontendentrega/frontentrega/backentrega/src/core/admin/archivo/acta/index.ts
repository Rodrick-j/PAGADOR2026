import { ActaRepository } from "./infra";
import { ActaService } from "./ActaService";

const service = new ActaService(ActaRepository);

export default service;
