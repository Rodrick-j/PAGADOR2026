import { BaseService } from "../../../../base/domain/BaseService";
import { MemorandumEntity, MemorandumProps } from "./MemorandumEntity";
import { Result } from "../../../../base/types/Result";
import { esFeriado, obtenerFeriadosBolivia } from "../../../../tools/util";

export class MemorandumService extends BaseService<MemorandumEntity, MemorandumProps> {
    public async factory(props: MemorandumProps, id?: string): Promise<Result<MemorandumEntity>> {
        return MemorandumEntity.create(props, id);
    }

    public async contarDiasHabilesRango(fechaInicio: Date, fechaFin: Date): Promise<number> {
        // contador
        let diasHabiles = 0;
        const currentDate = new Date(fechaInicio);
        const endDate = new Date(fechaFin);

        //obtener listado de feriados
        const feriados = await obtenerFeriadosBolivia();
        // Recorrer cada día desde fechaInicio hasta fechaFin
        while (currentDate <= endDate) {
            //verificacion de feriados
            if (!esFeriado(currentDate, feriados)) {
                const diaSemana = currentDate.getDay();
                // 0 es Domingo, 6 es Sábado
                if (diaSemana !== 0 && diaSemana !== 6) {
                    diasHabiles++;
                }
                // Avanzar al siguiente día
                currentDate.setDate(currentDate.getDate() + 1);
            } else {
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
        return diasHabiles;
    }

    public async contarDiasHabilesRangoInhabiles(fechaInicio: Date, fechaFin: Date): Promise<number> {
        // contador
        let diasHabiles = 0;
        const currentDate = new Date(fechaInicio);
        const endDate = new Date(fechaFin);

        // Recorrer cada día desde fechaInicio hasta fechaFin
        while (currentDate <= endDate) {
            diasHabiles++;
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return diasHabiles;
    }

    public async setPurgeAll(): Promise<Result<boolean>> {
        return super.purgeAll();
    }
}
