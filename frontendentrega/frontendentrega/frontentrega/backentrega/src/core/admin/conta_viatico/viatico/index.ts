import { ViaticoRepository } from "./infra";
import { ViaticoService } from "./ViaticoService";

const service = new ViaticoService(ViaticoRepository);

export default service;
