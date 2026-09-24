import { PersonalRepository } from "./infra";
import { PersonalService } from "./PersonalService";

const service = new PersonalService(PersonalRepository);

export default service;
