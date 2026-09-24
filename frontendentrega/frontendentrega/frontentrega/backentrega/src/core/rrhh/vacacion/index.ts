import { VacacionRepository } from "./infra";
import { VacacionService } from "./VacacionService";

const service = new VacacionService(VacacionRepository);

export default service;
