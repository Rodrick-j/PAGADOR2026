import { BaseService } from "../../../../base/domain/BaseService";
import { DocumentoEntity, DocumentoProps } from "./DocumentoEntity";
import { Result } from "../../../../base/types/Result";

export class DocumentoService extends BaseService<DocumentoEntity, DocumentoProps> {
    public async factory(props: DocumentoProps, id?: string): Promise<Result<DocumentoEntity>> {
        return DocumentoEntity.create(props, id);
    }
}
