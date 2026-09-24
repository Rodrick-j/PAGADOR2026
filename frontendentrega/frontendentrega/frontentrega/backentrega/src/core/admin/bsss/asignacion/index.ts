import { AsignacionRepository } from "./infra";
import { AsignacionService } from "./AsignacionService";

const service = new AsignacionService(AsignacionRepository);

export default service;
