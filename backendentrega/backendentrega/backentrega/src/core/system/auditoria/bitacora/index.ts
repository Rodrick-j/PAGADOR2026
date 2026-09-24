import { BitacoraRepository } from "./infra";
import { BitacoraService } from "./BitacoraService";

const service = new BitacoraService(BitacoraRepository);

export default service;
