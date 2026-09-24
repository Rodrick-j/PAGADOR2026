import { VehiculoPublicoRepository } from "./infra";
import { VehiculoPublicoService } from "./VehiculoPublicoService";

const service = new VehiculoPublicoService(VehiculoPublicoRepository);

export default service;
