import { DetalleDestinorrhhRepository } from "./infra";
import { DetalleDestinorrhhService } from "./DetalleDestinorrhhService";

const service = new DetalleDestinorrhhService(DetalleDestinorrhhRepository);

export default service;
