import { Entity } from "../../../base/domain/Entity";
import { Result } from "../../../base/types/Result";

export interface CargoProps {
    nombre: string;
    item: string;
    gestionCreacion: string;
    tipo: string;
    salario: number;
    privilegio: boolean;
    libre: boolean;
    nivel: number;
    activo: boolean;
}

export class CargoEntity extends Entity<CargoProps> {
    public static create(props: CargoProps, id?: string): Result<CargoEntity> {
        return Result.ok<CargoEntity>(new CargoEntity(props, id));
    }
    public getCargoCompleto(): string {
        return this.props.nombre + " - Nro: " + this.props.item;
    }
}
