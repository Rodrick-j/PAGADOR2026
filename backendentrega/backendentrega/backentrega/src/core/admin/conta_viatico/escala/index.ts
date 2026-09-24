import { EscalaRepository } from "./infra";
import { EscalaService } from "./EscalaService";

const service = new EscalaService(EscalaRepository);

export default service;
