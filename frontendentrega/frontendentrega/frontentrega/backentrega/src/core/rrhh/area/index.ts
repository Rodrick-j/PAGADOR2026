import { AreaRepository } from "./infra";
import { AreaService } from "./AreaService";

const service = new AreaService(AreaRepository);

export default service;
