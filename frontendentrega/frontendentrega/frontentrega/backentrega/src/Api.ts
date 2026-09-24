/**
 * Proyecto: Plataforma PAGADOR
 * Autor técnico: Ing. Giancarlo Delgadillo Coca
 * Desarrollado para el Gobierno Autónomo Departamental de Oruro.
 *
 * Se reconoce la autoría técnica al Ing. Giancarlo Delgadillo Coca en la implementación de este
 * código fuente, sin perjuicio de la titularidad institucional aplicable.
 */
import express from "express";
//@SYSTEM
import usuarioRouter from "./views/system/autenticacion/usuario/controller/UsuarioViewControllerRoutes";
import roleRouter from "./views/system/autenticacion/role/controller/RoleViewControllerRoutes";
import rutaRouter from "./views/system/autenticacion/ruta/controller/RutaViewControllerRoutes";
import helpRouter from "./views/system/help/controller/HelpViewControllerRoutes";
import storageRouter from "./views/system/storage/controller/StorageViewControllerRoutes";
import settingRouter from "./views/system/setting/controller/SettingViewControllerRoutes";
import bitacoraRouter from "./views/system/auditoria/bitacora/controller/BitacoraViewControllerRoutes";
//@ADMIN
//RRHH
import personalRouter from "./views/rrhh/personal/controller/PersonalViewControllerRoutes";
import areaRouter from "./views/rrhh/area/controller/AreaViewControllerRoutes";
import cargoRouter from "./views/rrhh/cargo/controller/CargoViewControllerRoutes";
import vacacionRouter from "./views/rrhh/vacacion/controller/VacacionViewControllerRoutes";
import memorandumrrhh from "./views/rrhh/memorandum_rrhh/controller/MemorandumrrhhViewControllerRoutes";
import detalledestinorrhh from "./views/rrhh/detalle_destino_rrhh/controller/DetalleDestinorrhhViewControllerRoutes";

//BSSS
import asignacionRouter from "./views/admin/bsss/asignacion/controller/AsignacionViewControllerRoutes";
import destinoRouter from "./views/admin/bsss/destino/controller/DestinoViewControllerRoutes";
import valeRouter from "./views/admin/bsss/vale/controller/ValeViewControllerRoutes";
import vehiculoRouter from "./views/admin/bsss/vehiculo/controller/VehiculoViewControllerRoutes";
import bitacoraViajeRouter from "./views/admin/bsss/bitacora_viaje/controller/BitacoraViajeViewControllerRoutes";
import bitacoraDetalleRouter from "./views/admin/bsss/bitacora_detalle/controller/BitacoraDetalleViewControllerRoutes";
//CONTA
import cuentaRouter from "./views/admin/conta/cuenta/controller/CuentaViewControllerRoutes";
import deudaRouter from "./views/admin/conta/deuda/controller/DeudaViewControllerRoutes";
//CONTRA
import procesoRouter from "./views/admin/contra/proceso/controller/ProcesoViewControllerRoutes";
import actividadRouter from "./views/admin/contra/actividad/controller/ActividadViewControllerRoutes";
import generalRouter from "./views/admin/contra/general/controller/GeneralViewControllerRoutes";
//ARCHIVO
import documentoRouter from "./views/admin/archivo/documento/controller/DocumentoViewControllerRoutes";
import actaRouter from "./views/admin/archivo/acta/controller/ActaViewControllerRoutes";
import actaRecepcionRouter from "./views/admin/archivo/acta_recepcion/controller/ActaRecepcionViewControllerRoutes";
//VIATICOS
import aperturaViaticoRouter from "./views/admin/conta_viatico/apertura_viatico/controller/AperturaViaticoViewControllerRoutes";
import descargoRouter from "./views/admin/conta_viatico/descargo/controller/DescargoViewControllerRoutes";
import detalleDestinoRouter from "./views/admin/conta_viatico/detalle_destino/controller/DetalleDestinoViewControllerRoutes";
import escalaRouter from "./views/admin/conta_viatico/escala/controller/EscalaViewControllerRoutes";
import informeComisionRouter from "./views/admin/conta_viatico/informe_comision/controller/InformeComisionViewControllerRoutes";
import informeGeneralRouter from "./views/admin/conta_viatico/informe_general/controller/InformeGeneralViewControllerRoutes";
import memorandumRouter from "./views/admin/conta_viatico/memorandum/controller/MemorandumViewControllerRoutes";
import vehiculoPublicoRouter from "./views/admin/conta_viatico/vehiculo_publico/controller/VehiculoPublicoViewControllerRoutes";
import viaticoRouter from "./views/admin/conta_viatico/viatico/controller/ViaticoViewControllerRoutes";
import escalaDestinoRouter from "./views/admin/conta_viatico/escala_destino/controller/EscalaDestinoViewControllerRoutes";
//APERTURA
import aperturaGeneralRouter from "./views/admin/apertura/apertura_general/controller/AperturaGeneralViewControllerRoutes"
import objetoGastoRouter from "./views/admin/apertura/objeto_gasto/controller/ObjetoGastoViewControllerRoutes"
import historialAperturaRouter from "./views/admin/apertura/historial_apertura/controller/HistorialAperturaViewControllerRoutes"

//CITES
import citesRouter from "./views/admin/correspondencia/cites/controller/CitesViewControllerRoutes"

const router = express.Router();

//@SYSTEM
router.use("/users", usuarioRouter);
router.use("/roles", roleRouter);
router.use("/rutas", rutaRouter);
router.use("/help", helpRouter);
router.use("/storage", storageRouter);
router.use("/setting", settingRouter);
router.use("/bitacora", bitacoraRouter); 
//@ADMIN 
//RRHH
router.use("/personal", personalRouter);
router.use("/cargo", cargoRouter);
router.use("/area", areaRouter);
router.use("/vacacion", vacacionRouter);
router.use("/memorandum_rrhh", memorandumrrhh)
router.use("/detalle_destino_rrhh", detalledestinorrhh)
//BSSS
router.use("/asignacion", asignacionRouter);
router.use("/destino", destinoRouter);
router.use("/vale", valeRouter);
router.use("/vehiculo", vehiculoRouter);
router.use("/bitacora_viaje", bitacoraViajeRouter);
router.use("/bitacora_detalle", bitacoraDetalleRouter);
//CONTA
router.use("/cuenta", cuentaRouter);
router.use("/deuda", deudaRouter);
//CONTRA
router.use("/proceso", procesoRouter);
router.use("/actividad", actividadRouter);
router.use("/general", generalRouter);
//ARCHIVO
router.use("/documento", documentoRouter);
router.use("/acta", actaRouter);
router.use("/acta_recepcion", actaRecepcionRouter);
//VIATICOS
router.use("/apertura_viatico",aperturaViaticoRouter);
router.use("/descargo", descargoRouter);
router.use("/detalle_destino", detalleDestinoRouter);
router.use("/escala", escalaRouter);
router.use("/informe_comision", informeComisionRouter);
router.use("/informe_general", informeGeneralRouter);
router.use("/memorandum", memorandumRouter);
router.use("/vehiculo_publico", vehiculoPublicoRouter);
router.use("/viatico", viaticoRouter);
router.use("/escala_destino", escalaDestinoRouter);
//APERTURA
router.use("/apertura_general", aperturaGeneralRouter);
router.use("/objeto_gasto", objetoGastoRouter);
router.use("/historial_apertura", historialAperturaRouter);
//CITES
router.use("/cites", citesRouter);


export default { routes: router };
