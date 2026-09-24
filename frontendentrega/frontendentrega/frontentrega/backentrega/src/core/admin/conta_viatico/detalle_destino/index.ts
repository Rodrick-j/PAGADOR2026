import { DetalleDestinoRepository } from "./infra";
import { DetalleDestinoService } from "./DetalleDestinoService";

const service = new DetalleDestinoService(DetalleDestinoRepository);

export default service;
