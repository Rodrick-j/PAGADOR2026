import { ActividadRepository } from "./infra";
import { ActividadService } from "./ActividadService";

const service = new ActividadService(ActividadRepository);

export default service;
