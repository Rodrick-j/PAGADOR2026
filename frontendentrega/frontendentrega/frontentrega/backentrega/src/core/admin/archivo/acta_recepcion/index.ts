import { ActaRecepcionRepository } from "./infra";
import { ActaRecepcionService } from "./ActaRecepcionService";

const service = new ActaRecepcionService(ActaRecepcionRepository);

export default service;
