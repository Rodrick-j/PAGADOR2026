import { CuentaRepository } from "./infra";
import { CuentaService } from "./CuentaService";

const service = new CuentaService(CuentaRepository);

export default service;
