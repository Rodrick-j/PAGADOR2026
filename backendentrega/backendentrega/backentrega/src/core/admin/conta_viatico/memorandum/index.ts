import { MemorandumRepository } from "./infra";
import { MemorandumService } from "./MemorandumService";

const service = new MemorandumService(MemorandumRepository);

export default service;
