import { Result } from "../../../base/types/Result";
import { esFeriado, findAndCountResult, obtenerFeriadosBolivia } from "../../../tools/util";
import moment from "moment";
import VehiculoService from "../../../core/admin/bsss/vehiculo";
import MemorandumrrhhService  from "../../../core/rrhh/memorandum_rrhh";
import EscalaDestinoService from "../../../core/admin/conta_viatico/escala_destino";
import DetalleDestinorrhhService  from "../../../core/rrhh/detalle_destino_rrhh";


type DetalleDestinorrhhTableModel = {
    id                       : string;
    
    tipo_vehiculo_op         : string;
    objetivo_viaje           : string;
    destino_reg              : string;
    fecha_dia                : string;
    hora_inicio              : string;
    hora_fin                 : string;
    pernocte                 : string;
    estado                   : string;
    modificacion             : boolean;
    observacion              : string;
    estado_observacion       : string;
    memorandum_rrhh_id        : string;   
    vehiculo_id              : string;
    destino_id               : string;
    destino_id2              : string;
    dia_semana?              : string;
    hay_viaje?: string;
     apertura_viatico_id?     :string;
    apertura_pasaje_id?      :string;
 

    //aumentando campos
    num_placa: string;
    cod_memorandum: string;
};

export type GetDetalleDestinosrrhhTableResponse = {
    rows: DetalleDestinorrhhTableModel[];
    count: number;
};

export type DetalleDestinorrhhFormDataResponse = {
    id                       : string;
    tipo_vehiculo_op         : string;
    objetivo_viaje           : string;
    destino_reg              : string;
    fecha_dia                : Date;
    hora_inicio              : string;
    hora_fin                 : string;
    pernocte                 : string;   
    estado                    : string;
    modificacion             : boolean;
    observacion              : string;
    estado_observacion       : string;
    memorandumrrhh_id            : string;    
    vehiculo_id              : string;
    destino_id               : string;
    destino_id2               : string;
    dia_semana?              : string;
    dia_habil?              : string;
    apertura_viatico_id?     :string;
    apertura_pasaje_id?      :string;
};
export type DetalleDestinorrhhOptionsFormModel = {
    id: string;
    nombre: string;
    caption?: string;
    estado?: string;
};
export type DetalleDestinorrhhOptionsFormModel2 = {
    id: string;
    nombre: string;
    caption?: Date;
    estado?: string;
};

export type RangoFechasOptionsFormModel = {
    id: Date;
    nombre: string;
    caption?: string;
};
export type DetalleDestinorrhhSumaPasajeOptionsFormModel = {
    id?: string;
    pasaje_ida_suma: number;
    pasaje_retorno_suma: number;
    total_pasaje_dia: number;
};
export type DetalleDestinorrhhDetallePasajeOptionsFormModel = {
    id: string;  
    destino: string;
   // tipo_vehiculo_ida: string;
   // tipo_vehiculo_vuelta: string;
    fecha_dia: Date;
};
export type DetalleDestinorrhhPernocte = {
    id                      : string;
//id_viatico              : string;
    id_memorandum           : string;
   // destino                 : string;      
    fecha_dia               : Date;    
    pernocte                : string; 
    dia_semana              : string;
    estado                  : string;
};

export type DetalleFechasOptionsFormModel = {
    id: string;
    id_memorandum: string;
    destino: string;
    fecha_dia: Date;
};

/*export type DetalleDestinosOptionsFormModel = {
    id: string;
    nombre: string;
    concepto: string;
};*/

export class DetalleDestinorrhhView {
    public async getDetalleDestinosTable(query: any): Promise<Result<{ rows: DetalleDestinorrhhTableModel[] }>> {
		
        const detalleDestino = await DetalleDestinorrhhService.getAll();
        if (detalleDestino.isFailure) return Result.fail("Falló al obtener la DetalleDestino");
        const detalleDestinoResult = detalleDestino.getValue();
		
        let destinoMemo = "";

             /*Listado de vehiculos*/
             const vehiculo = await VehiculoService.getAll();
             if(vehiculo.isFailure) return Result.fail("Fallo al obtener el Vehiculo");
             const vehiculosResult = vehiculo.getValue().filter((c) => c.props.estado);
             if (!vehiculosResult) return Result.fail("Error no existe vehiculos");

             /*Listado de memorandum */
             const memorandum = await MemorandumrrhhService.getAll();            
             if(memorandum.isFailure) return Result.fail("Fallo al obtener el Vehiculo");
             const memorandumResult = memorandum.getValue();
              /*Listado de destinos*/
            const destino = await EscalaDestinoService.getAll();
            if (destino.isFailure) return Result.fail("Falló al obtener la Destino");
            const destinoResult = destino.getValue();
             /*Listado de escalaDestino*/
             const escalaDestino = await EscalaDestinoService.getAll();
             if(escalaDestino.isFailure) return Result.fail("Fallo al obtener La escala");
             const escalaDestinoResult = escalaDestino.getValue();
             
            const result: DetalleDestinorrhhTableModel[] = detalleDestinoResult.map((item) => {
              
         //datos vehiculo
         const tipoVehiculo = vehiculosResult.find((c) => c.id === item.props.vehiculoId)?.props.tipo|| "-";
         const placaVehiculo = vehiculosResult.find((c) => c.id === item.props.vehiculoId)?.props.numPlaca|| "-";
         const codigoMemo = memorandumResult.find((c) => c.id === item.props.memorandumrrhhId)?.props.codDepartMemo|| "-";
         
         //destino
         if(destinoResult.find((c) => c.id === item.props.destinoReg)){
            destinoMemo = destinoResult.find((c) => c.id === item.props.destinoReg)?.props.destino|| "-";
         }else{
            destinoMemo =item.props.destinoReg;
         }
        //Dia Semana
        const diasSemana = [
            'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
          ];
      
		// Obtenemos el día de la semana (0-6)
        const diaSemana = diasSemana[item.props.fechaDia.getDay()];
            //Escala Destino
            const modalidadIda = escalaDestinoResult.find((c) => c.id === item.props.destinoId)?.props.modalidad|| "-";
            const modalidadRetorno = escalaDestinoResult.find((c) => c.id === item.props.destinoId2)?.props.modalidad|| "-";
            const hayViaje = item.props.estado === 'SIN_VIAJE'?'DIA SIN VIAJE':'DIA CON VIAJE';
         
                return {
                    id                       : String(item.id),
                    tipo_vehiculo_op         : item.props.tipoVehiculoOP,
                    objetivo_viaje           : item.props.objetivoViaje,
                    destino_reg              : destinoMemo,//item.props.destinoReg,
                    fecha_dia                : item.props.fechaDia?moment(item.props.fechaDia).format("DD/MM/YYYY").toString(): '',
                    hora_inicio              : item.props.horaInicio,//?moment(item.props.horaInicio).format("HH:MM").toString(): '',
                    hora_fin                 : item.props.horaFin,//?moment(item.props.horaFin).format("HH:MM").toString(): '',
                    pernocte                 : item.props.pernocte,
                    estado                   : item.props.estado,
                    memorandum_rrhh_id        : item.props.memorandumrrhhId,       				
                    vehiculo_id              : placaVehiculo,
                    destino_id               : modalidadIda,
                    destino_id2              : modalidadRetorno,
                    hay_viaje                : hayViaje,

                    num_placa   : tipoVehiculo,  
                    cod_memorandum:codigoMemo,  
                    dia_semana  :diaSemana,   
                  
                    modificacion             : item.props.modificacion,
                    observacion              : item.props.observacion,
                    estado_observacion       : item.props.estadoObservacion,
                };
            })
            .sort((a, b) => (a.fecha_dia > b.fecha_dia ? 1 : -1));

        const response = findAndCountResult(result, query);
		
        return Result.ok(response);
    }
    public async getDetalleDestinosUnicoTable(query: any): Promise<Result<{ rows: DetalleDestinorrhhTableModel[] }>> {
        const detalleDestino = await DetalleDestinorrhhService.getAll();
        if (detalleDestino.isFailure) return Result.fail("Falló al obtener la DetalleDestino");
        const detalleDestinoResult = detalleDestino.getValue();
        let destinoMemo = "";

        /*Listado de vehiculos*/
        const vehiculo = await VehiculoService.getAll();
        if (vehiculo.isFailure) return Result.fail("Fallo al obtener el Vehiculo");
        const vehiculosResult = vehiculo.getValue().filter((v) => v.props.estado);
        if (!vehiculosResult) return Result.fail("Error no existe vehiculos");

        /*Listado de memorandum */
        const memorandum = await MemorandumrrhhService.getAll();
        if (memorandum.isFailure) return Result.fail("Fallo al obtener el Vehiculo");
        const memorandumResult = memorandum.getValue();
        /*Listado de destinos*/
        const destino = await EscalaDestinoService.getAll();
        if (destino.isFailure) return Result.fail("Falló al obtener la Destino");
        const destinoResult = destino.getValue();
        /*Listado de escalaDestino*/
        const escalaDestino = await EscalaDestinoService.getAll();
        if (escalaDestino.isFailure) return Result.fail("Fallo al obtener La escala");
        const escalaDestinoResult = escalaDestino.getValue();

        const result: DetalleDestinorrhhTableModel[] = detalleDestinoResult
            .filter((a) => a.props.estado !== 'SIN_VIAJE')
            .map((item) => {
                //datos vehiculo
                const tipoVehiculo = vehiculosResult.find((c) => c.id === item.props.vehiculoId)?.props.tipo || "-";
                const placaVehiculo = vehiculosResult.find((c) => c.id === item.props.vehiculoId)?.props.numPlaca || "-";
                const codigoMemo =
                    memorandumResult.find((c) => c.id === item.props.memorandumrrhhId)?.props.codDepartMemo || "-";
                //destino
                if (destinoResult.find((c) => c.id === item.props.destinoReg)) {
                    destinoMemo = destinoResult.find((c) => c.id === item.props.destinoReg)?.props.destino || "-";
                } else {
                    destinoMemo = item.props.destinoReg;
                }

                //Escala Destino
                const modalidadIda =
                    escalaDestinoResult.find((c) => c.id === item.props.destinoId)?.props.modalidad || "-";
                const modalidadRetorno =
                    escalaDestinoResult.find((c) => c.id === item.props.destinoId2)?.props.modalidad || "-";

                return {
                    id: String(item.id),
                    tipo_vehiculo_op: item.props.tipoVehiculoOP,
                    objetivo_viaje: item.props.objetivoViaje,
                    destino_reg: destinoMemo, 
                    fecha_dia: item.props.fechaDia ? moment(item.props.fechaDia).format("DD/MM/YYYY").toString() : "",
                    hora_inicio: item.props.horaInicio, 
                    hora_fin: item.props.horaFin, 
                    pernocte: item.props.pernocte,                    
                    estado: item.props.estado,
                    memorandum_rrhh_id: item.props.memorandumrrhhId,                    
                    vehiculo_id: placaVehiculo,
                    destino_id: modalidadIda,
                    destino_id2: modalidadRetorno,

                    num_placa: tipoVehiculo,
                    cod_memorandum: codigoMemo,

                    modificacion             : item.props.modificacion,
                    observacion              : item.props.observacion,
                    estado_observacion       : item.props.estadoObservacion,
                };
            })
            .sort((a, b) => (a.fecha_dia > b.fecha_dia ? 1 : -1));
           
 
        const response = findAndCountResult(result, query);
        return Result.ok(response);
    }

    public async getDetalleDestinoFormDataView(
        id_detalle_destino: string,
    ): Promise<Result<DetalleDestinorrhhFormDataResponse>> {
        const detalleDestino = await DetalleDestinorrhhService.getById(id_detalle_destino);
		
        if (detalleDestino.isFailure) return Result.fail<DetalleDestinorrhhFormDataResponse>("DetalleDestino no encontrado");
      
         /*Listado de escala Destino*/
         const escalaDestino =await EscalaDestinoService.getAll();
         if(escalaDestino.isFailure) return Result.fail("Fallo al obtener el Cargo");
         const escalaDestinoResult = escalaDestino.getValue();
         const props = detalleDestino.getValue().props;

          /*Listado de memorandum */
          const memorandum = await MemorandumrrhhService.getAll();
          if(memorandum.isFailure) return Result.fail("Fallo al obtener el Vehiculo");
          const memorandumResult = memorandum.getValue();

        // Desde este punto realizamos la busqueda del tipo de escala para la determinacion del id de escala 
        const destinoNombre = (escalaDestinoResult.find((c) => c.id ===props.destinoReg))?
        escalaDestinoResult.find((c) => c.id === props.destinoReg)?.props.destino|| "-":  props.destinoReg;  
        
       //Dia Semana
       const diasSemana = [
        'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
      ];
  
    // Obtenemos el día de la semana (0-6)
    const diaSemana = diasSemana[props.fechaDia.getDay()];
    const diaHabil = memorandumResult.find((c) => c.id === props.memorandumrrhhId)?.props.diasHabiles|| "-";
   
        const result: DetalleDestinorrhhFormDataResponse = {
            id                       :  detalleDestino.getValue().id,
            tipo_vehiculo_op         :  props.tipoVehiculoOP,
            objetivo_viaje           :  props.objetivoViaje,
            destino_reg              :  destinoNombre,
            fecha_dia                :  props.fechaDia,
            hora_inicio              :  props.horaInicio,
            hora_fin                 :  props.horaFin,
            pernocte                 :  props.pernocte,            
            estado                   :  props.estado,        
            memorandumrrhh_id        :  props.memorandumrrhhId,            
            vehiculo_id              :  props.vehiculoId,
            destino_id               :  props.destinoId,
            destino_id2               :  props.destinoId2,
            dia_semana                :diaSemana,
            dia_habil                :diaHabil,
          
            modificacion             : props.modificacion,
            observacion              : props.observacion,
            estado_observacion       : props.estadoObservacion,
        };
       
        return Result.ok(result);
		
    }

    //Se envia el tipo de PCP seleccionando en memorandum
    public async getTipoVehiculo(detalle_destino_id: string): Promise<Result<DetalleDestinorrhhOptionsFormModel>> {
        /* listado de actividades */
        const detalleDestino = await DetalleDestinorrhhService.getAll();
        if (detalleDestino.isFailure) return Result.fail("Falló al obtener la detalleDestino");
        const tipoVehiculoResult = detalleDestino.getValue();
        /* listado de escalas destino */
        const escalaDestino = await EscalaDestinoService.getAll();
        if (escalaDestino.isFailure) return Result.fail("Falló al obtener la detalleDestino");
        const escalaDestinoResult = escalaDestino.getValue();
        //seleccionamos del listado de area el nombre del departamento y su sigla
        const tipoVehiculo = tipoVehiculoResult.find((c) => c.id === detalle_destino_id)?.props.tipoVehiculoOP || "-"; //Revisar
        const destino = tipoVehiculoResult.find((c) => c.id === detalle_destino_id)?.props.destinoReg || "-"; //Revisar

        const destinoNombre = escalaDestinoResult.find((c) => c.id === destino)
            ? escalaDestinoResult.find((c) => c.id === destino)?.props.destino || "-"
            : destino;

        const result: DetalleDestinorrhhOptionsFormModel = {
            id: detalle_destino_id,
            nombre: tipoVehiculo,
            caption: destinoNombre,
        };
        return Result.ok(result);
    }

    //Se envia el tipo de PCP seleccionando en memorandum
   
    //filtramos por el tipo de id 
    public filtrarId(item:string, id:string) { 
        return (item === id); 
     } 

     public filtrarEstado(item:string, estado:string) { 
        return (item != estado); 
     } 

      //Se envia el tipo de PCP seleccionando en memorandum
public async getDestinoExterior(memorandum_id: string): Promise<Result<DetalleDestinorrhhOptionsFormModel>> {
    /* listado de actividades */
    const detalleDestino = await DetalleDestinorrhhService.getAll();
    if (detalleDestino.isFailure) return Result.fail('Falló al obtener la detalleDestino');  
    const detalleDestinoResult = detalleDestino.getValue();     
    
        /* listado de actividades */
        const escalaDestino = await EscalaDestinoService.getAll();
        if (escalaDestino.isFailure) return Result.fail("Falló al obtener la detalleDestino");
        const escalaDestinoResult = escalaDestino.getValue();
        /* listado de actividades */
        const memorandum = await MemorandumrrhhService.getAll();
        if (memorandum.isFailure) return Result.fail("Falló al obtener la detalleDestino");
        const memorandumResult = memorandum.getValue();

        //seleccionamos del listado de area el nombre del departamento y su sigla
        const destinoID = detalleDestinoResult.find((c) => c.props.memorandumrrhhId === memorandum_id)?.id || "-"; //Revisar
        const destino =
            detalleDestinoResult.find((c) => c.props.memorandumrrhhId === memorandum_id)?.props.destinoReg || "-"; //Revisar
        const tipoComision = memorandumResult.find((c) => c.id === memorandum_id)?.props.tipoComisionIDP || "-"; //Revisar

        const destinoNombre = escalaDestinoResult.find((c) => c.id === destino)
            ? escalaDestinoResult.find((c) => c.id === destino)?.props.destino || "-"
            : destino;
        //Seleccionamos la escala segun el destino
        const escalaExterior =
            tipoComision === "INTERNACIONAL"
                ? escalaDestinoResult.find((c) => c.props.destino === destinoNombre)?.props.escalaExterior || "-"
                : "No corresponde";

        const result: DetalleDestinorrhhOptionsFormModel = {
            id: destinoID,
            nombre: destinoNombre,
            caption: escalaExterior,
        };

        return Result.ok(result);
    }   

   //Se envia el tipo de PCP seleccionando en memorandum
   public async getRangoFechas(memorandum_id: string): Promise<Result<{ rows: RangoFechasOptionsFormModel[]; count: number }>> {
    /* listado de actividades */
    const memorandum = await MemorandumrrhhService.getAll();
    if (memorandum.isFailure) return Result.fail('Falló al obtener la Memorandum');  
    const memorandumResult = memorandum.getValue();     
    /* listado de actividades */
    const detalleDestino = await DetalleDestinorrhhService.getAll();
    if (detalleDestino.isFailure) return Result.fail('Falló al obtener la detalleDestino');  
    //const detalleDestinoResult = detalleDestino.getValue();           
     //seleccionamos del listado de area el nombre del departamento y su sigla
    
     const fechaInicioViaje = memorandumResult.find((c) =>c.id === memorandum_id)?.props.fechaInicioViaje;//Revisar
     const fechaFinViaje = memorandumResult.find((c) =>c.id === memorandum_id)?.props.fechaFinViaje;//Revisar
     const diasHabiles = memorandumResult.find((c) =>c.id === memorandum_id)?.props.diasHabiles;//Revisar
     //props.fechaFinViaje?moment(props.fechaFinViaje).format("DD/MM/YYYY").toString(): '',
     let rangoFechas:string[] = [] ;
     if(diasHabiles === 'HABILES'){
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        rangoFechas = await this.contarDiasHabilesRango(fechaInicioViaje!, fechaFinViaje!);    
     }else{
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        rangoFechas = await this.contarDiasInHabilesRango(fechaInicioViaje!, fechaFinViaje!);    
     }
   
     const result: RangoFechasOptionsFormModel[] = rangoFechas
            .map((item) => {     
                //dia de la semana     
                const diasSemana = [
                    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
                  ];
                const dateObject: Date = new Date(item); 
              
                // Obtenemos el día de la semana (0-6)
                const diaSemana = diasSemana[dateObject.getDay()];
                const fechaCadena = dateObject?moment(dateObject).format("DD/MM/YYYY").toString(): ''; 
                const fechaDiaSemana = `${diaSemana}`;
                return {                    
                    id:dateObject,
                    nombre: fechaCadena,
                    caption: fechaDiaSemana,
                };
            });       
  
    return Result.ok({ rows: result, count: result.length });
}

public async getListaPernocte(memorandum_id: string): Promise<Result<{ rows: RangoFechasOptionsFormModel[]; count: number }>> {
    /* listado de actividades */
    const memorandum = await MemorandumrrhhService.getAll();
    if (memorandum.isFailure) return Result.fail('Falló al obtener la Memorandum');  
    //const memorandumResult = memorandum.getValue();     
    /* listado de actividades */
    const detalleDestino = await DetalleDestinorrhhService.getAll();
    if (detalleDestino.isFailure) return Result.fail('Falló al obtener la detalleDestino');  
    //const detalleDestinoResult = detalleDestino.getValue();     
    //Dia Semana   
    
    const listaDestinos: DetalleDestinorrhhPernocte[] = detalleDestino
    .getValue()
    .map((item) => {  
        
        const diasSemana = [
            'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
          ];
      
        // Obtenemos el día de la semana (0-6)
        const diaSemana = diasSemana[item.props.fechaDia.getDay()];
        return {
            
            id: item.id.toString(),
           
            id_memorandum: item.props.memorandumrrhhId,      
            fecha_dia : item.props.fechaDia,
            pernocte  : item.props.pernocte,
            dia_semana : diaSemana,
            estado     : item.props.estado,  
         };
    }) ; 
    
    // Se filta por los destinos de acuerdo al id memorandum para ordenarlos por fecha
    const filtroDestinos : DetalleDestinorrhhPernocte [] = listaDestinos
    .filter((item) => this.filtrarId(item.id_memorandum, memorandum_id)).
    sort((a, b) => a.fecha_dia > b.fecha_dia ? 1 : -1);

    const filtroPorEstado : DetalleDestinorrhhPernocte [] = filtroDestinos
    .filter((item) => this.filtrarEstado(item.estado, 'SIN_VIAJE')).
    sort((a, b) => a.fecha_dia > b.fecha_dia ? 1 : -1);

    const listaPernocte  = this.generarFechasMemorandum(filtroPorEstado);
         //seleccionamos del listado de area el nombre del departamento y su sigla    
    
  
    return Result.ok({ rows: listaPernocte, count: listaPernocte.length });
}

//Realizacion de lista de fechas para Reportes
public generarFechasMemorandum(listaPernocte:DetalleDestinorrhhPernocte[]) {
	
    const result: RangoFechasOptionsFormModel[] = [];   
    let contador_cp = 0;
    //let contador_sp = 0;  
    let contador_dias_cp = 0; 
    const CERO = '0';// cuando no hay pernocte que hay ida y vuelta
    const UNO = '1'; // el primer valor es cp lo que significa que solo hay pasaje de ida 
    const DOS = '2'; // el siguiente valor es cp lo que significa que no hay ni ida ni vuelta
    const TRES = '3';// el valor final de todos los viajes SP debe ser unico que solicite pasaje de vuelta
   
    //generamos las fechas
    for(let i = 0; i <listaPernocte.length; i++) {
     /*   if(listaPernocte[i].pernocte === 'SIN PERNOCTE'){
            result.push({id:listaPernocte[i].fecha_dia,nombre:CERO,caption:listaPernocte[i].pernocte}); 

        }else */if(listaPernocte[i].pernocte === 'CON PERNOCTE' && contador_cp===0){
            contador_cp ++;
       //     contador_sp ++;
            contador_dias_cp++;
            result.push({id:listaPernocte[i].fecha_dia,nombre:UNO,caption:listaPernocte[i].pernocte});

        }else if(listaPernocte[i].pernocte === 'CON PERNOCTE' && contador_cp > 0){
            contador_cp ++;
       //     contador_sp ++;
            contador_dias_cp++;
            result.push({id:listaPernocte[i].fecha_dia,nombre:DOS,caption:listaPernocte[i].pernocte});

        }else if(listaPernocte[i].pernocte === 'SIN PERNOCTE' && listaPernocte[i+1] != undefined && contador_dias_cp >0){
            contador_cp = 0;
            contador_dias_cp = 0;  
          //  contador_sp ++;           
            result.push({id:listaPernocte[i].fecha_dia,nombre:TRES,caption:listaPernocte[i].pernocte}); 
        }else if(listaPernocte[i].pernocte === 'SIN PERNOCTE' && listaPernocte[i+1] === undefined && contador_dias_cp > 0 ){
            contador_cp = 0; 
            contador_dias_cp = 0;       
            result.push({id:listaPernocte[i].fecha_dia,nombre:TRES,caption:listaPernocte[i].pernocte}); 
        }else{
         //   contador_sp++;
            result.push({id:listaPernocte[i].fecha_dia,nombre:CERO,caption:listaPernocte[i].pernocte});                         
        }
    }
    return result;
}


 //Se envia el tipo de PCP seleccionando en memorandum
 public async getDetalleDestinoExist(memorandum_id: string): Promise<Result<number>> {
    /* listado de actividades */
    const detalleDestino = await DetalleDestinorrhhService.getAll();
    if (detalleDestino.isFailure) return Result.fail('Falló al obtener la detalleDestino');  
  //  const detalleDestinoResult = detalleDestino.getValue();   
    
     //Lista de destinos
     const listaDestinos: DetalleDestinorrhhOptionsFormModel[] = detalleDestino
        .getValue()
        .map((item) => {                
                return {                
                    id: item.id.toString(),
                    nombre: item.props.memorandumrrhhId,
                    caption : item.props.destinoReg,                                             
                };            
        }) ; 
   
     
           // Se filta por los destinos
    const filtroDestinos : DetalleDestinorrhhOptionsFormModel [] = listaDestinos
    .filter((item) => this.filtrarId(item.nombre, memorandum_id));
          
    return Result.ok(filtroDestinos.length);
}

public async contarDiasHabilesRango(fechaInicio: Date , fechaFin: Date):Promise<string[]>  {
    // contador
 //   let diasHabiles = 0;
    const currentDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);
    const rangoDias:string []= [];  
    
   //obtener listado de feriados 
   const feriados =  await obtenerFeriadosBolivia();
   // Recorrer cada día desde fechaInicio hasta fechaFin
   while (currentDate <= endDate) {
       //verificacion de feriados
       if (!esFeriado(currentDate,feriados)) {
          const diaSemana = currentDate.getDay();
          // 0 es Domingo, 6 es Sábado
           if (diaSemana !== 0 && diaSemana !== 6) {
            const fechaCadena = currentDate?moment(currentDate).format("YYYY/MM/DD").toString(): '';          
			
              rangoDias.push(fechaCadena);            
           }    
           // Avanzar al siguiente día
           currentDate.setDate(currentDate.getDate() + 1); 
         } else {
           currentDate.setDate(currentDate.getDate() + 1);  
         }       
   }         

   return rangoDias;
}
 

public async contarDiasInHabilesRango(fechaInicio: Date , fechaFin: Date):Promise<string[]>  {
    // contador
 //   let diasHabiles = 0;
    const currentDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);
    const rangoDias:string []= [];  
    
 
   // Recorrer cada día desde fechaInicio hasta fechaFin
   while (currentDate <= endDate) {
       //verificacion de feriados
      const fechaCadena = currentDate?moment(currentDate).format("YYYY/MM/DD").toString(): '';     
      rangoDias.push(fechaCadena);     
      currentDate.setDate(currentDate.getDate() + 1);  
      }      
    return rangoDias;
}


}
