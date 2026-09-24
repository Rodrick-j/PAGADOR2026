import { DeudaRepository } from "./infra";
import { DeudaService } from "./DeudaService";

const service = new DeudaService(DeudaRepository);

export default service;
