import { BaseService } from "../../../base/domain/BaseService";
import { Result } from "../../../base/types/Result";
import { esFeriado, obtenerFeriadosBolivia } from "../../../tools/util";
import { MemorandumrrhhEntity, MemorandumrrhhProps } from "./MemorandumrrhhEntity";

export class MemorandumrrhhService extends BaseService<MemorandumrrhhEntity, MemorandumrrhhProps> {
    public async factory(props: MemorandumrrhhProps, id?: string): Promise<Result<MemorandumrrhhEntity>> {
        return MemorandumrrhhEntity.create(props, id);
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
