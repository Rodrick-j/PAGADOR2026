import { ProcesoRepository } from "./infra";
import { ProcesoService } from "./ProcesoService";

const service = new ProcesoService(ProcesoRepository);

export default service;
