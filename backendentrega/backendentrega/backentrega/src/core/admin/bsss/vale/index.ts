import { ValeRepository } from "./infra";
import { ValeService } from "./ValeService";

const service = new ValeService(ValeRepository);

export default service;
