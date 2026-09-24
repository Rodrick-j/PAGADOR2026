import { DocumentoRepository } from "./infra";
import { DocumentoService } from "./DocumentoService";

const service = new DocumentoService(DocumentoRepository);

export default service;
