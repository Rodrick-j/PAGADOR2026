import { UsuarioRepository } from "./infra";
import { UsuarioService } from "./UsuarioService";

const service = new UsuarioService(UsuarioRepository);

export default service;
