import { BitacoraDetalleRepository } from "./infra";
import { BitacoraDetalleService } from "./BitacoraDetalleService";

const service = new BitacoraDetalleService(BitacoraDetalleRepository);

export default service;
