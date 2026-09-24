import { BitacoraViajeRepository } from "./infra";
import { BitacoraViajeService } from "./BitacoraViajeService";

const service = new BitacoraViajeService(BitacoraViajeRepository);

export default service;
