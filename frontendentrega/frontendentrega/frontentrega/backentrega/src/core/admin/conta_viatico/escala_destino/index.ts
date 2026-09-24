import { EscalaDestinoRepository } from "./infra";
import { EscalaDestinoService } from "./EscalaDestinoService";

const service = new EscalaDestinoService(EscalaDestinoRepository);

export default service;
