import { AperturaGeneralRepository } from "./infra";
import { AperturaGeneralService } from "./AperturaGeneralService";

const service = new AperturaGeneralService(AperturaGeneralRepository);

export default service;
