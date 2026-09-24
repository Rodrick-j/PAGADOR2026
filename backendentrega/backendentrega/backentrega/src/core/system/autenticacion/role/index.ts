import { RoleRepository } from "./infra";
import { RoleService } from "./RoleService";

const service = new RoleService(RoleRepository);

export default service;
