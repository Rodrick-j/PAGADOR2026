import { HistorialAperturaRepository } from "./infra";
import { HistorialAperturaService } from "./HistorialAperturaService";

const service = new HistorialAperturaService(HistorialAperturaRepository);

export default service;
