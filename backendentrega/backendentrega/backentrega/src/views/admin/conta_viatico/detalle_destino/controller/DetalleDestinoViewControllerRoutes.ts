import express from "express";
import { DetalleDestinoViewController } from "./DetalleDestinoViewController";
import { checkIfAuthenticated } from "../../../../../base/infra/AuthMiddleware";

const controller = new DetalleDestinoViewController();

const router = express.Router();

router.get("/detalle_destino_table", checkIfAuthenticated, (req, res) => controller.getDetalleDestinosTable(req, res));
router.get("/detalle_destino_unico_table", checkIfAuthenticated, (req, res) => controller.getDetalleDestinosUnicoTable(req, res));
router.get("/detalle_destino_form/:detalle_destino_id", checkIfAuthenticated, (req, res) => controller.getDetalleDestinoFormData(req, res));

router.post("/detalle_destino_form", checkIfAuthenticated, (req, res) => controller.createOrUpdateDetalleDestino(req, res));
router.delete("/detalle_destino_table/:detalle_destino_id", checkIfAuthenticated, (req, res) => controller.destroyDetalleDestino(req, res));
//se aumenta 
router.get('/detalle_destino_tipo_vehiculo/:detalle_destino_id', checkIfAuthenticated, (req, res) => controller.getTipoVehiculo(req, res));
router.post("/detalle_destino_table_approve/:detalle_destino_id", checkIfAuthenticated, (req, res) => controller.changeApprove(req, res));

router.get('/detalle_destino_suma_pasaje/:viatico_id', checkIfAuthenticated, (req, res) => controller.getSumatoriaPasaje(req, res));
router.get('/detalle_destino_exterior/:memorandum_id', checkIfAuthenticated, (req, res) => controller.getDestinoExterior(req, res));

router.get('/detalle_destino_exist/:memorandum_id', checkIfAuthenticated, (req, res) => controller.getDetalleDestinoExist(req, res));
router.get('/detalle_destino_rango_fechas/:memorandum_id', checkIfAuthenticated, (req, res) => controller.getRangoFechas(req, res));
router.get("/detalle_destino_nro/:nro/:memorandum_id", checkIfAuthenticated, (req, res) => controller.getFechaData(req, res));
router.get('/detalle_destino_pernocte/:memorandum_id', checkIfAuthenticated, (req, res) => controller.getListaPernocte(req, res));

export default router;
