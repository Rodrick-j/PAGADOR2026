import { MemorandumrrhhRepository } from "./infra";
import { MemorandumrrhhService } from "./MemorandumrrhhService";

const service = new MemorandumrrhhService(MemorandumrrhhRepository);

export default service;
