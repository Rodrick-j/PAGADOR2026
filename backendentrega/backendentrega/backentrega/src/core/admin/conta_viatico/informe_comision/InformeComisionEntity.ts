import { FileItem } from "../../../../base/types/FileItem";
import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type InformeComisionProps ={
    ida                   :boolean;
    retorno               :boolean;
    objetoViaje           :string;
    desarrollo            :string;
    conclusion            :string;
    imagenUno             :FileItem[];
    descripcionUno        :string;
    imagenDos             :FileItem[];
    descripcionDos        :string;
    imagenTres            :FileItem[];
    descripcionTres       :string;
    vehiculoId            :string;
    vehiculoPublicoId     :string;
    memorandumId          :string; 
};

export class InformeComisionEntity extends Entity<InformeComisionProps>{
    public static create(props : InformeComisionProps, id?: string): Result<InformeComisionEntity>{
        return Result.ok<InformeComisionEntity>(new InformeComisionEntity(props, id));
    }
}

