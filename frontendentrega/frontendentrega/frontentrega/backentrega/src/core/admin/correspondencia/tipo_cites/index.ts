import { TipoCitesRepository } from "./infra";
import { TipoCitesService } from "./TipoCitesService";

const service = new TipoCitesService(TipoCitesRepository);

export default service;
