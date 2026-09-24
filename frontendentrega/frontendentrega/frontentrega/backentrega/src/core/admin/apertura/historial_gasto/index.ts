import { HistorialGastoRepository } from "./infra";
import { HistorialGastoService } from "./HistorialGastoService";

const service = new HistorialGastoService(HistorialGastoRepository);

export default service;
