import { HistorialRepository } from "./infra";
import { HistorialService } from "./HistorialService";

const service = new HistorialService(HistorialRepository);

export default service;
