import { DestinoRepository } from "./infra";
import { DestinoService } from "./DestinoService";

const service = new DestinoService(DestinoRepository);

export default service;
