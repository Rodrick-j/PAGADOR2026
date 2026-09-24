import { AccesoRepository } from "./infra";
import { AccesoService } from "./AccesoService";

const service = new AccesoService(AccesoRepository);

export default service;
