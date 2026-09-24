import { DescargoRepository } from "./infra";
import { DescargoService } from "./DescargoService";

const service = new DescargoService(DescargoRepository);

export default service;
