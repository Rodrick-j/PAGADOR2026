import { ValueObject } from "../../domain/ValueObject";
import { Result } from "../Result";
import { TimepoVO } from "./TiempoVO";

export type HorarioProps = {
    dia: string;
    horaInicio: TimepoVO;
    horaFin: TimepoVO;
};

export type HorarioFromJSONProps = {
    dia: string;
    horaInicio: { hora: number; minutos: number };
    horaFin: { hora: number; minutos: number };
};

export class HorarioVO extends ValueObject {
    public readonly dia: string;
    public readonly horaInicio: TimepoVO;
    public readonly horaFin: TimepoVO;

    private constructor(props: HorarioProps) {
        super();
        this.dia = props.dia;
        this.horaInicio = props.horaInicio;
        this.horaFin = props.horaFin;
    }

    public static create(props: HorarioProps): Result<HorarioVO> {
        if (!props.horaFin.greaterThan(props.horaInicio)) {
            return Result.fail<HorarioVO>("Hora fin debe ser mayor a hora inicio");
        }
        return Result.ok<HorarioVO>(new HorarioVO(props));
    }

    public static fromJSON(props: HorarioFromJSONProps): Result<HorarioVO> {
        const horaInicio = TimepoVO.create(props.horaInicio);
        const horaFin = TimepoVO.create(props.horaFin);
        if (horaFin.isFailure || horaInicio.isFailure) {
            return Result.fail<HorarioVO>("Invalid JSON");
        }
        return this.create({
            dia: props.dia,
            horaInicio: horaInicio.getValue(),
            horaFin: horaFin.getValue(),
        });
    }
}
