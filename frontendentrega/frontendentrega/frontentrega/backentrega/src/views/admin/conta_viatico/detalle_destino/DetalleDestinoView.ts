import { Result } from "../../../../base/types/Result";
import { esFeriado, findAndCountResult, obtenerFeriadosBolivia } from "../../../../tools/util";
import DetalleDestinoService from "../../../../core/admin/conta_viatico/detalle_destino";
import moment from "moment";
import VehiculoService from "../../../../core/admin/bsss/vehiculo";
import MemorandumService from "../../../../core/admin/conta_viatico/memorandum";
import EscalaDestinoService from "../../../../core/admin/conta_viatico/escala_destino";
import  AreaService  from "../../../../core/rrhh/area";
import  AperturaViaticoService from "../../../../core/admin/conta_viatico/apertura_viatico";
import AperturaGeneralService  from "../../../../core/admin/apertura/apertura_general";

type DetalleDestinoTableModel = {
    id                       : string;
    tipo_vehiculo_op         : string;
    objetivo_viaje           : string;
    destino_reg              : string;
    fecha_dia                : string;
    hora_inicio              : string;
    hora_fin                 : string;
    pernocte                 : string;
    pasaje_ida               : number;
    pasaje_retorno           : number;
    total_pasaje_dia         : number;
    tipo_vehiculo_opvida     : string;
    tipo_vehiculo_opvuelta   : string;
    estado                   : string;
    modificacion             : boolean;
    observacion              : string;
    estado_observacion       : string;
    memorandum_id            : string;
    viatico_id               : string;
    vehiculo_id              : string;
    destino_id               : string;
    destino_id2              : string;
    dia_semana?              : string;
    hay_viaje?: string;
     apertura_viatico_id?     :string;
    apertura_pasaje_id?      :string;
    fecha_dia_date?          : Date;   

    //aumentando campos
    num_placa: string;
    cod_memorandum: string;
     // campo para el control de apertura
    apertura_nombre_viatico?   : string;
    apertura_nombre_pasaje?    : string;
    apertura_prog_viatico?   : string;
    apertura_prog_pasaje?    : string;
    apertura_saldo_pasaje? : number;
    apertura_saldo_viatico? : number;

};

export type GetDetalleDestinosTableResponse = {
    rows: DetalleDestinoTableModel[];
    count: number;
};

export type DetalleDestinoFormDataResponse = {
    id                       : string;
    tipo_vehiculo_op         : string;
    objetivo_viaje           : string;
    destino_reg              : string;
    fecha_dia                : Date;
    hora_inicio              : string;
    hora_fin                 : string;
    pernocte                 : string;
    pasaje_ida               : number;
    pasaje_retorno           : number;
    total_pasaje_dia         : number;
    tipo_vehiculo_opvida     : string;
    tipo_vehiculo_opvuelta   : string;
    estado                    : string;
    modificacion             : boolean;
    observacion              : string;
    estado_observacion       : string;
    memorandum_id            : string;
    viatico_id               : string;
    vehiculo_id              : string;
    destino_id               : string;
    destino_id2               : string;
    dia_semana?              : string;
    dia_habil?              : string;
    apertura_viatico_id?     :string;
    apertura_pasaje_id?      :string;
    
     // campo para el control de apertura
    apertura_nombre_viatico?   : string;
    apertura_nombre_pasaje?    : string;
    apertura_prog_viatico?   : string;
    apertura_prog_pasaje?    : string;
    apertura_saldo_pasaje? : number;
    apertura_saldo_viatico? : number;

};
export type DetalleDestinoOptionsFormModel = {
    id: string;
    nombre: string;
    caption?: string;
    estado?: string;
    dia?   : Date;
};
export type DetalleDestinoOptionsFormModel2 = {
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
export type DetalleDestinoSumaPasajeOptionsFormModel = {
    id?: string;
    pasaje_ida_suma: number;
    pasaje_retorno_suma: number;
    total_pasaje_dia: number;
};
export type DetalleDestinoDetallePasajeOptionsFormModel = {
    id: string;
    id_viatico: string;
    destino: string;
    tipo_vehiculo_ida: string;
    tipo_vehiculo_vuelta: string;
    fecha_dia: Date;
    pasaje_ida: number;
    pasaje_retorno: number;
};
export type DetalleDestinoPernocte = {
    id                      : string;
    id_viatico              : string;
    id_memorandum           : string;
   // destino                 : string; 
   // tipo_vehiculo_ida       : string;
   // tipo_vehiculo_vuelta    : string;   
    fecha_dia               : Date;
   // pasaje_ida              : number;
   // pasaje_retorno          : number;   
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

export class DetalleDestinoView {
    public async getDetalleDestinosTable(query: any): Promise<Result<{ rows: DetalleDestinoTableModel[] }>> {
        const detalleDestino = await DetalleDestinoService.getAll();
        if (detalleDestino.isFailure) return Result.fail("Falló al obtener la DetalleDestino");
        const detalleDestinoResult = detalleDestino.getValue();
        let destinoMemo = "";

             /*Listado de vehiculos*/
             const vehiculo = await VehiculoService.getAll();
             if(vehiculo.isFailure) return Result.fail("Fallo al obtener el Vehiculo");
             const vehiculosResult = vehiculo.getValue().filter((c) => c.props.estado);
             if (!vehiculosResult) return Result.fail("Error no existe vehiculos");

             /*Listado de memorandum */
             const memorandum = await MemorandumService.getAll();
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
             
            const result: DetalleDestinoTableModel[] = detalleDestinoResult.map((item) => {
              
         //datos vehiculo
         const tipoVehiculo = vehiculosResult.find((c) => c.id === item.props.vehiculoId)?.props.tipo|| "-";
         const placaVehiculo = vehiculosResult.find((c) => c.id === item.props.vehiculoId)?.props.numPlaca|| "-";
         const codigoMemo = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.codDepartMemo|| "-";
         const aperturaViatico = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.aperturaViaticoId||"-";
        const aperturaPasaje = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.aperturaPasajeId||"-";
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
                    fecha_dia_date           : item.props.fechaDia,
                    hora_inicio              : item.props.horaInicio,//?moment(item.props.horaInicio).format("HH:MM").toString(): '',
                    hora_fin                 : item.props.horaFin,//?moment(item.props.horaFin).format("HH:MM").toString(): '',
                    pernocte                 : item.props.pernocte,
                    pasaje_ida               : item.props.pasajeIda,
                    pasaje_retorno           : item.props.pasajeRetorno,
                    total_pasaje_dia         : item.props.totalPasajedia,
                    tipo_vehiculo_opvida     : item.props.tipoVehiculoOPIda|| "-",
                    tipo_vehiculo_opvuelta   : item.props.tipoVehiculoOPVuelta|| "-",
                    estado                   : item.props.estado,
                    memorandum_id            : item.props.memorandumId,
                    viatico_id               : item.props.viaticoId,
                    vehiculo_id              : placaVehiculo,
                    destino_id               : modalidadIda,
                    destino_id2              : modalidadRetorno,
                    hay_viaje                : hayViaje,

                    num_placa   : tipoVehiculo,  
                    cod_memorandum:codigoMemo,  
                    dia_semana  :diaSemana,   
                    apertura_viatico_id      : aperturaViatico,			
                    apertura_pasaje_id       : aperturaPasaje,
                    modificacion             : item.props.modificacion,
                    observacion              : item.props.observacion,
                    estado_observacion       : item.props.estadoObservacion,
                };
            })
            .sort((a, b) => (a.fecha_dia_date > b.fecha_dia_date ? 1 : -1));

        const response = findAndCountResult(result, query);
        return Result.ok(response);
    }
    public async getDetalleDestinosUnicoTable(query: any): Promise<Result<{ rows: DetalleDestinoTableModel[] }>> {
        const detalleDestino = await DetalleDestinoService.getAll();
        if (detalleDestino.isFailure) return Result.fail("Falló al obtener la DetalleDestino");
        const detalleDestinoResult = detalleDestino.getValue();
        let destinoMemo = "";

        /*Listado de vehiculos*/
        const vehiculo = await VehiculoService.getAll();
        if (vehiculo.isFailure) return Result.fail("Fallo al obtener el Vehiculo");
        const vehiculosResult = vehiculo.getValue().filter((v) => v.props.estado);
        if (!vehiculosResult) return Result.fail("Error no existe vehiculos");

        /*Listado de memorandum */
        const memorandum = await MemorandumService.getAll();
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

        const result: DetalleDestinoTableModel[] = detalleDestinoResult
            .filter((a) => a.props.estado !== 'SIN_VIAJE')
            .map((item) => {
                //datos vehiculo
                const tipoVehiculo = vehiculosResult.find((c) => c.id === item.props.vehiculoId)?.props.tipo || "-";
                const placaVehiculo = vehiculosResult.find((c) => c.id === item.props.vehiculoId)?.props.numPlaca || "-";
                const codigoMemo =
                    memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.codDepartMemo || "-";
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
                    pasaje_ida: item.props.pasajeIda,
                    pasaje_retorno: item.props.pasajeRetorno,
                    total_pasaje_dia: item.props.totalPasajedia,
                    tipo_vehiculo_opvida: item.props.tipoVehiculoOPIda || "-",
                    tipo_vehiculo_opvuelta: item.props.tipoVehiculoOPVuelta || "-",
                    estado: item.props.estado,
                    memorandum_id: item.props.memorandumId,
                    viatico_id: item.props.viaticoId,
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
    ): Promise<Result<DetalleDestinoFormDataResponse>> {
        const detalleDestino = await DetalleDestinoService.getById(id_detalle_destino);
		
		
        if (detalleDestino.isFailure) return Result.fail<DetalleDestinoFormDataResponse>("DetalleDestino no encontrado");
      
         /*Listado de escala Destino*/
         const escalaDestino =await EscalaDestinoService.getAll();
         if(escalaDestino.isFailure) return Result.fail("Fallo al obtener el Cargo");
         const escalaDestinoResult = escalaDestino.getValue();
         const props = detalleDestino.getValue().props;

          /*Listado de memorandum */
          const memorandum = await MemorandumService.getAll();
          if(memorandum.isFailure) return Result.fail("Fallo al obtener el Vehiculo");
          const memorandumResult = memorandum.getValue();

           /*Listado de apertura viatico*/
            const aperturaViaticoMain = await AperturaViaticoService.getAll();
            if(aperturaViaticoMain.isFailure) return Result.fail("Fallo al obtener la Apertura Viatico");
            const aperturaViaticoResult = aperturaViaticoMain.getValue();

             /*Listado de apertura viatico*/
            const aperturaGeneral = await AperturaGeneralService.getAll();
            if(aperturaGeneral.isFailure) return Result.fail("Fallo al obtener la Apertura General");
            const aperturaGeneralResult = aperturaGeneral.getValue(); 

          /*Listado de area*/
            const area = await AreaService.getAll();
            if (area.isFailure) return Result.fail("Falló al obtener la Area");
            const areaResult = area.getValue(); 
        // Desde este punto realizamos la busqueda del tipo de escala para la determinacion del id de escala 
        const destinoNombre = (escalaDestinoResult.find((c) => c.id ===props.destinoReg))?
        escalaDestinoResult.find((c) => c.id === props.destinoReg)?.props.destino|| "-":  props.destinoReg;  
        
       //Dia Semana
       const diasSemana = [
        'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
      ];
  
    // Obtenemos el día de la semana (0-6)
    const diaSemana = diasSemana[props.fechaDia.getDay()];
    const diaHabil = memorandumResult.find((c) => c.id === props.memorandumId)?.props.diasHabiles|| "-";
    
    const aperturaViatico = memorandumResult.find((c) => c.id === props.memorandumId)?.props.aperturaViaticoId||"-";	
    const aperturaPasaje = memorandumResult.find((c) => c.id === props.memorandumId)?.props.aperturaPasajeId||"-";
     // campo para el control de apertura
     let aperturaNombreViatico;
     let aperturaNombrePasaje;
    const aperturaIDGeneralViatico = aperturaViaticoResult.find((c) => c.id === aperturaViatico)?.props.aperturaGeneralId;
    const aperturaHijoIDViatico = aperturaGeneralResult.find((c) => c.id === aperturaIDGeneralViatico)?.props.areaHijoId;						
			//aqui sino existe una apertura para esa direccion obtner todos los del padre
    if(aperturaHijoIDViatico){
           aperturaNombreViatico =  areaResult.find((c) => c.id === aperturaHijoIDViatico)?.props.nombre|| "-";	                    
     }else{
           const aperturaPadreIDViatico = aperturaViaticoResult.find((c) => c.id=== aperturaIDGeneralViatico)?.props.areaId;                    
           aperturaNombreViatico =  areaResult.find((c) => c.id === aperturaPadreIDViatico)?.props.nombre|| "-";	                    
    }   
    //pasajes 
    const aperturaIDGeneralPasaje = aperturaViaticoResult.find((c) => c.id === aperturaPasaje)?.props.aperturaGeneralId;     
    const aperturaHijoIDPasaje = aperturaGeneralResult.find((c) => c.id=== aperturaIDGeneralPasaje)?.props.areaHijoId;						
			//aqui sino existe una apertura para esa direccion obtner todos los del padre
    if(aperturaHijoIDPasaje){
           aperturaNombrePasaje =  areaResult.find((c) => c.id === aperturaHijoIDPasaje)?.props.nombre|| "-";	                    
     }else{
           const aperturaPadreIDPasaje = aperturaViaticoResult.find((c) => c.id === aperturaViatico)?.props.areaId;                    
           aperturaNombrePasaje =  areaResult.find((c) => c.id === aperturaPadreIDPasaje)?.props.nombre|| "-";	                    
    }   
  
    const aperturaProgViatico = aperturaViaticoResult.find((c) => c.id=== aperturaViatico)?.props.aperturaProgramatica;   
    const aperturaProgPasaje = aperturaViaticoResult.find((c) => c.id=== aperturaPasaje)?.props.aperturaProgramatica;	
    const aperturaSaldoPasaje = aperturaViaticoResult.find((c) => c.id=== aperturaViatico)?.props.presupuestoRestante;	
    const aperturaSaldoViatico =  aperturaViaticoResult.find((c) => c.id=== aperturaPasaje)?.props.presupuestoRestante;	


        const result: DetalleDestinoFormDataResponse = {
            id                       :  detalleDestino.getValue().id,
            tipo_vehiculo_op         :  props.tipoVehiculoOP,
            objetivo_viaje           :  props.objetivoViaje,
            destino_reg              :  destinoNombre,
            fecha_dia                :  props.fechaDia,
            hora_inicio              :  props.horaInicio,
            hora_fin                 :  props.horaFin,
            pernocte                 :  props.pernocte,
            pasaje_ida               :  props.pasajeIda,
            pasaje_retorno           :  props.pasajeRetorno,
            total_pasaje_dia         :  props.totalPasajedia,
            tipo_vehiculo_opvida     :  props.tipoVehiculoOPIda,
            tipo_vehiculo_opvuelta   :  props.tipoVehiculoOPVuelta, 
            estado                    :  props.estado,        
            memorandum_id            :  props.memorandumId,
            viatico_id               :  props.viaticoId,
            vehiculo_id              :  props.vehiculoId,
            destino_id               :  props.destinoId,
            destino_id2               :  props.destinoId2,
            dia_semana                :diaSemana,
            dia_habil                :diaHabil,
            apertura_viatico_id      : aperturaViatico,			
            apertura_pasaje_id       : aperturaPasaje,

            modificacion             : props.modificacion,
            observacion              : props.observacion,
            estado_observacion       : props.estadoObservacion,
             // campo para el control de apertura
            apertura_nombre_viatico  : aperturaNombreViatico,
            apertura_nombre_pasaje   : aperturaNombrePasaje,
            apertura_prog_viatico    : aperturaProgViatico,
            apertura_prog_pasaje     : aperturaProgPasaje,
            apertura_saldo_pasaje    : aperturaSaldoViatico,
            apertura_saldo_viatico   : aperturaSaldoPasaje,

        };
       
        return Result.ok(result);
		
    }

    //Se envia el tipo de PCP seleccionando en memorandum
    public async getTipoVehiculo(detalle_destino_id: string): Promise<Result<DetalleDestinoOptionsFormModel>> {
        /* listado de actividades */
        const detalleDestino = await DetalleDestinoService.getAll();
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

        const result: DetalleDestinoOptionsFormModel = {
            id: detalle_destino_id,
            nombre: tipoVehiculo,
            caption: destinoNombre,
        };
        return Result.ok(result);
    }

    //Se envia el tipo de PCP seleccionando en memorandum
    public async getSumatoriaPasaje(viatico_id: string): Promise<Result<DetalleDestinoSumaPasajeOptionsFormModel>> {
        /* listado de actividades */
        const detalleDestino = await DetalleDestinoService.getAll();
        if (detalleDestino.isFailure) return Result.fail("Falló al obtener la detalleDestino");
        //Lista de destinos
        const listaDestinos: DetalleDestinoDetallePasajeOptionsFormModel[] = detalleDestino.getValue().map((item) => {
            return {
                id: item.id.toString(),
                id_viatico: item.props.viaticoId,
                destino: item.props.destinoReg,
                tipo_vehiculo_ida: item.props.tipoVehiculoOPIda,
                tipo_vehiculo_vuelta: item.props.tipoVehiculoOPVuelta,
                fecha_dia: item.props.fechaDia,
                pasaje_ida: item.props.pasajeIda,
                pasaje_retorno: item.props.pasajeRetorno,
            };
        });

        // Se filta por los destinos
        const filtroDestinos: DetalleDestinoDetallePasajeOptionsFormModel[] = listaDestinos.filter((item) =>
            this.filtrarId(item.id_viatico, viatico_id),
        );

        /* const listaSumaPasajes: DetalleDestinoDetallePasajeOptionsFormModel[] =filtroDestinos    
    .map((item) => {                   
        return {
            
            id: item.id.toString(),
            id_memorandum: item.id_memorandum,
            destino                 : item.destino, 
            tipo_vehiculo_ida       : item.tipo_vehiculo_ida,
            tipo_vehiculo_vuelta    : item.tipo_vehiculo_vuelta,
            fecha_dia               : item.fecha_dia,
            pasaje_ida              : item.pasaje_ida,
            pasaje_retorno          : item.pasaje_retorno,                              
        };
    })  */
        // Se realiza la sumatoria del campo pasajes
        const sumaPasajes = filtroDestinos.reduce(
            (suma, item) => {
                suma.pasaje_ida += item.pasaje_ida || 0;
                suma.pasaje_retorno += item.pasaje_retorno || 0;
                return suma;
            },
            { pasaje_ida: 0, pasaje_retorno: 0 },
        );

        const sumaTotal = sumaPasajes.pasaje_ida + sumaPasajes.pasaje_retorno;

        const result: DetalleDestinoSumaPasajeOptionsFormModel = {
            id: viatico_id,
            pasaje_ida_suma: sumaPasajes.pasaje_ida,
            pasaje_retorno_suma: sumaPasajes.pasaje_retorno,
            total_pasaje_dia: sumaTotal,
        };

        return Result.ok(result);
    }

    //filtramos por el tipo de id 
    public filtrarId(item:string, id:string) { 
        return (item === id); 
     } 

     public filtrarEstado(item:string, estado:string) { 
        return (item != estado); 
     } 

      //Se envia el tipo de PCP seleccionando en memorandum
public async getDestinoExterior(memorandum_id: string): Promise<Result<DetalleDestinoOptionsFormModel>> {
    /* listado de actividades */
    const detalleDestino = await DetalleDestinoService.getAll();
    if (detalleDestino.isFailure) return Result.fail('Falló al obtener la detalleDestino');  
    const detalleDestinoResult = detalleDestino.getValue();     
    
        /* listado de actividades */
        const escalaDestino = await EscalaDestinoService.getAll();
        if (escalaDestino.isFailure) return Result.fail("Falló al obtener la detalleDestino");
        const escalaDestinoResult = escalaDestino.getValue();
        /* listado de actividades */
        const memorandum = await MemorandumService.getAll();
        if (memorandum.isFailure) return Result.fail("Falló al obtener la detalleDestino");
        const memorandumResult = memorandum.getValue();

        //seleccionamos del listado de area el nombre del departamento y su sigla
        const destinoID = detalleDestinoResult.find((c) => c.props.memorandumId === memorandum_id)?.id || "-"; //Revisar
        const destino =
            detalleDestinoResult.find((c) => c.props.memorandumId === memorandum_id)?.props.destinoReg || "-"; //Revisar
        const tipoComision = memorandumResult.find((c) => c.id === memorandum_id)?.props.tipoComisionIDP || "-"; //Revisar

        const destinoNombre = escalaDestinoResult.find((c) => c.id === destino)
            ? escalaDestinoResult.find((c) => c.id === destino)?.props.destino || "-"
            : destino;
        //Seleccionamos la escala segun el destino
        const escalaExterior =
            tipoComision === "INTERNACIONAL"
                ? escalaDestinoResult.find((c) => c.props.destino === destinoNombre)?.props.escalaExterior || "-"
                : "No corresponde";

        const result: DetalleDestinoOptionsFormModel = {
            id: destinoID,
            nombre: destinoNombre,
            caption: escalaExterior,
        };

        return Result.ok(result);
    }   

   //Se envia el tipo de PCP seleccionando en memorandum
   public async getRangoFechas(memorandum_id: string): Promise<Result<{ rows: RangoFechasOptionsFormModel[]; count: number }>> {
    /* listado de actividades */
    const memorandum = await MemorandumService.getAll();
    if (memorandum.isFailure) return Result.fail('Falló al obtener la Memorandum');  
    const memorandumResult = memorandum.getValue();     
    /* listado de actividades */
    const detalleDestino = await DetalleDestinoService.getAll();
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
    const memorandum = await MemorandumService.getAll();
    if (memorandum.isFailure) return Result.fail('Falló al obtener la Memorandum');  
    //const memorandumResult = memorandum.getValue();     
    /* listado de actividades */
    const detalleDestino = await DetalleDestinoService.getAll();
    if (detalleDestino.isFailure) return Result.fail('Falló al obtener la detalleDestino');  
    //const detalleDestinoResult = detalleDestino.getValue();     
    //Dia Semana   
    
    const listaDestinos: DetalleDestinoPernocte[] = detalleDestino
    .getValue()
    .map((item) => {  
        
        const diasSemana = [
            'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
          ];
      
        // Obtenemos el día de la semana (0-6)
        const diaSemana = diasSemana[item.props.fechaDia.getDay()];
        return {
            
            id: item.id.toString(),
            id_viatico: item.props.viaticoId,  
            id_memorandum: item.props.memorandumId,      
            fecha_dia : item.props.fechaDia,
            pernocte  : item.props.pernocte,
            dia_semana : diaSemana,
            estado     : item.props.estado,  
         };
    }) ; 
    
    // Se filta por los destinos de acuerdo al id memorandum para ordenarlos por fecha
    const filtroDestinos : DetalleDestinoPernocte [] = listaDestinos
    .filter((item) => this.filtrarId(item.id_memorandum, memorandum_id)).
    sort((a, b) => a.fecha_dia > b.fecha_dia ? 1 : -1);

    const filtroPorEstado : DetalleDestinoPernocte [] = filtroDestinos
    .filter((item) => this.filtrarEstado(item.estado, 'SIN_VIAJE')).
    sort((a, b) => a.fecha_dia > b.fecha_dia ? 1 : -1);

    const listaPernocte  = this.generarFechasMemorandum(filtroPorEstado);
         //seleccionamos del listado de area el nombre del departamento y su sigla    
    
  
    return Result.ok({ rows: listaPernocte, count: listaPernocte.length });
}

//Realizacion de lista de fechas para Reportes
public generarFechasMemorandum(listaPernocte:DetalleDestinoPernocte[]) {
	
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
    const detalleDestino = await DetalleDestinoService.getAll();
    if (detalleDestino.isFailure) return Result.fail('Falló al obtener la detalleDestino');  
  //  const detalleDestinoResult = detalleDestino.getValue();   
    
     //Lista de destinos
     const listaDestinos: DetalleDestinoOptionsFormModel[] = detalleDestino
        .getValue()
        .map((item) => {                
                return {                
                    id: item.id.toString(),
                    nombre: item.props.memorandumId,
                    caption : item.props.destinoReg,                                             
                };            
        }) ; 
   
     
           // Se filta por los destinos
    const filtroDestinos : DetalleDestinoOptionsFormModel [] = listaDestinos
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
