import express from "express";
import { DeudaViewController } from "./DeudaViewController";
import { checkIfAuthenticated, registerSesionActivity } from "../../../../../base/infra/AuthMiddleware";

const controller = new DeudaViewController();

const router = express.Router();

router.get("/deuda_table", checkIfAuthenticated, (req, res) => controller.getDeudasTable(req, res));
router.get("/historial_table", checkIfAuthenticated, (req, res) => controller.getHistorialTable(req, res));

router.get("/deuda_form/:deuda_id", checkIfAuthenticated, (req, res) => controller.getDeudaFormData(req, res));
router.post("/deuda_form", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.createOrUpdateDeuda(req, res));
router.post("/deuda_historial/:cuenta_id", checkIfAuthenticated, (req, res) => controller.setDeudaHistorial(req, res));

router.post("/deuda_table/:deuda_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.changeState(req, res));

router.delete("/deuda_item/:deuda_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.destroyDeuda(req, res));
router.delete("/historial_item/:historial_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.destroyHistorial(req, res));

router.get("/deuda_detalle/:deuda_id", checkIfAuthenticated, (req, res) => controller.getDeudaDetalle(req, res));

router.post('/pdf_deudor', checkIfAuthenticated, registerSesionActivity, (req, res) => controller.getPDFDeudor(req, res));

export default router;
