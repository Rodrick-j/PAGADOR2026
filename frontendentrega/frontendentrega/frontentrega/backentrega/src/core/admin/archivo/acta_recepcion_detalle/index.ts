import { ActaRecepcionDetalleRepository } from "./infra";
import { ActaRecepcionDetalleService } from "./ActaRecepcionDetalleService";

const service = new ActaRecepcionDetalleService(ActaRecepcionDetalleRepository);

export default service;
