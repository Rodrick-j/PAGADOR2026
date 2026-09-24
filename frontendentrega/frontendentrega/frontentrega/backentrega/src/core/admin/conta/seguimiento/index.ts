import { SeguimientoRepository } from "./infra";
import { SeguimientoService } from "./SeguimientoService";

const service = new SeguimientoService(SeguimientoRepository);

export default service;
