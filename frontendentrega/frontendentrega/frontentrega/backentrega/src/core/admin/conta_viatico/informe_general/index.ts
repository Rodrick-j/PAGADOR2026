import { InformeGeneralRepository } from "./infra";
import { InformeGeneralService } from "./InformeGeneralService";

const service = new InformeGeneralService(InformeGeneralRepository);

export default service;
