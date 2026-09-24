import { AperturaViaticoRepository } from "./infra";
import { AperturaViaticoService } from "./AperturaViaticoService";

const service = new AperturaViaticoService(AperturaViaticoRepository);

export default service;
