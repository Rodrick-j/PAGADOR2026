import { VehiculoRepository } from "./infra";
import { VehiculoService } from "./VehiculoService";

const service = new VehiculoService(VehiculoRepository);

export default service;
