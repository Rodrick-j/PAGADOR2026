import { ObjetoGastoRepository } from "./infra";
import { ObjetoGastoService } from "./ObjetoGastoService";

const service = new ObjetoGastoService(ObjetoGastoRepository);

export default service;
