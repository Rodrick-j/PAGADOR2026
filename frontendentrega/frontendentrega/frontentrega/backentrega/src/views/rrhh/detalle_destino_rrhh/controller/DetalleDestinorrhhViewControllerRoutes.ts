import express from "express";
import { DetalleDestinorrhhViewController } from "./DetalleDestinorrhhViewController";
import { checkIfAuthenticated } from "../../../../base/infra/AuthMiddleware";

const controller = new DetalleDestinorrhhViewController();

const router = express.Router();

router.get("/detalle_destino_rrhh_table", checkIfAuthenticated, (req, res) => controller.getDetalleDestinosTable(req, res));
router.get("/detalle_destino_rrhh_unico_table", checkIfAuthenticated, (req, res) => controller.getDetalleDestinosUnicoTable(req, res));
router.get("/detalle_destino_rrhh_form/:detalle_destino_rrhh_id", checkIfAuthenticated, (req, res) => controller.getDetalleDestinoFormData(req, res));

router.post("/detalle_destino_rrhh_form", checkIfAuthenticated, (req, res) => controller.createOrUpdateDetalleDestino(req, res));
router.delete("/detalle_destino_rrhh_table/:detalle_destino_rrhh_id", checkIfAuthenticated, (req, res) => controller.destroyDetalleDestino(req, res));
//se aumenta 
router.get('/detalle_destino_rrhh_tipo_vehiculo/:detalle_destino_rrhh_id', checkIfAuthenticated, (req, res) => controller.getTipoVehiculo(req, res));
router.post("/detalle_destino_rrhh_table_approve/:detalle_destino_rrhh_id", checkIfAuthenticated, (req, res) => controller.changeApprove(req, res));

//router.get('/detalle_destino_rrhh_suma_pasaje/:viatico_id', checkIfAuthenticated, (req, res) => controller.getSumatoriaPasaje(req, res));
router.get('/detalle_destino_rrhh_exterior/:memorandum_id', checkIfAuthenticated, (req, res) => controller.getDestinoExterior(req, res));

router.get('/detalle_destino_rrhh_exist/:memorandum_id', checkIfAuthenticated, (req, res) => controller.getDetalleDestinoExist(req, res));
router.get('/detalle_destino_rrhh_rango_fechas/:memorandum_id', checkIfAuthenticated, (req, res) => controller.getRangoFechas(req, res));
router.get("/detalle_destino_rrhh_nro/:nro/:memorandum_id", checkIfAuthenticated, (req, res) => controller.getFechaData(req, res));
router.get('/detalle_destino_rrhh_pernocte/:memorandum_id', checkIfAuthenticated, (req, res) => controller.getListaPernocte(req, res));

export default router;
