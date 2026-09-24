import { InformeComisionRepository } from "./infra";
import { InformeComisionService } from "./InformeComisionService";

const service = new InformeComisionService(InformeComisionRepository);

export default service;
