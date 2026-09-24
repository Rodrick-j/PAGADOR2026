import { RutaRepository } from "./infra";
import { RutaService } from "./RutaService";

const service = new RutaService(RutaRepository);

export default service;
