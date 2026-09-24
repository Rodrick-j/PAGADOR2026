import { ValueObject } from "../../domain/ValueObject";
import { Result } from "../Result";

type TimepoProps = {
    hora: number;
    minutos: number;
    segundos?: number;
};

export type TimepoFromJSONProps = {
    hora: number;
    minutos: number;
    segundos?: number;
};

export class TimepoVO extends ValueObject {
    public hora: number;
    public minutos: number;
    public segundos: number;

    private constructor(props: TimepoProps) {
        super();
        this.hora = props.hora;
        this.minutos = props.minutos;
        this.segundos = props.segundos || 0;
    }

    public greaterThan(vo: TimepoVO): boolean {
        return (
            this.hora > vo.hora ||
            (this.hora === vo.hora && this.minutos > vo.minutos) ||
            (this.hora === vo.hora && this.minutos === vo.minutos && this.segundos > vo.segundos)
        );
    }

    public lessThan(vo: TimepoVO): boolean {
        return (
            this.hora < vo.hora ||
            (this.hora === vo.hora && this.minutos < vo.minutos) ||
            (this.hora === vo.hora && this.minutos === vo.minutos && this.segundos < vo.segundos)
        );
    }

    public equalTo(vo: TimepoVO): boolean {
        return (
            this.hora === vo.hora &&
            this.minutos === vo.minutos &&
            this.segundos === vo.segundos
        );
    }

    public greaterOrEqual(vo: TimepoVO): boolean {
        return this.greaterThan(vo) || this.equalTo(vo);
    }

    public lessOrEqual(vo: TimepoVO): boolean {
        return this.lessThan(vo) || this.equalTo(vo);
    }

    public static create(props: TimepoProps): Result<TimepoVO> {
        if (
            props.hora > 23 || props.hora < 0 ||
            props.minutos > 59 || props.minutos < 0 ||
            (props.segundos && (props.segundos > 59 || props.segundos < 0))
        ) {
            return Result.fail<TimepoVO>("Hora / minutos / segundos inválidos");
        }
        return Result.ok<TimepoVO>(new TimepoVO(props));
    }

    public static fromString(timeString: string): Result<TimepoVO> {
        const timeParts = timeString.split(":");
        if (timeParts.length < 2 || timeParts.length > 3) {
            return Result.fail<TimepoVO>("Formato de tiempo inválido");
        }

        const hora = parseInt(timeParts[0], 10);
        const minutos = parseInt(timeParts[1], 10);
        const segundos = timeParts.length === 3 ? parseInt(timeParts[2], 10) : 0;

        if (isNaN(hora) || isNaN(minutos) || (timeParts.length === 3 && isNaN(segundos))) {
            return Result.fail<TimepoVO>("Formato de tiempo inválido");
        }

        return TimepoVO.create({ hora, minutos, segundos });
    }
}
