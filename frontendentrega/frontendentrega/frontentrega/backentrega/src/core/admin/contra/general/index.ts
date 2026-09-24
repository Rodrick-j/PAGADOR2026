import { GeneralRepository } from "./infra";
import { GeneralService } from "./GeneralService";

const service = new GeneralService(GeneralRepository);

export default service;
