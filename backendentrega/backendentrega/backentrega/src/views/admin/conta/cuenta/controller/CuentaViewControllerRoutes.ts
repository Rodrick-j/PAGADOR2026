import express from "express";
import { CuentaViewController } from "./CuentaViewController";
import { checkIfAuthenticated, registerSesionActivity } from "../../../../../base/infra/AuthMiddleware";

const controller = new CuentaViewController();

const router = express.Router();

router.get("/cuenta_table", checkIfAuthenticated, (req, res) => controller.getCuentasTable(req, res));
router.get("/seguimiento_table", checkIfAuthenticated, (req, res) => controller.getSeguimientolTable(req, res));

router.get("/cuenta_form/:cuenta_id", checkIfAuthenticated, (req, res) => controller.getCuentaFormData(req, res));
router.get("/seguimiento_form/:cuenta_id", checkIfAuthenticated, (req, res) => controller.getSeguimientoFormData(req, res));

router.post("/cuenta_form", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.createOrUpdateCuenta(req, res));
router.post("/seguimiento_form", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.createOrUpdateSeguimiento(req, res));

router.delete("/cuenta_table/:cuenta_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.destroyCuenta(req, res));

router.post("/cuenta_table/:cuenta_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.changeActive(req, res));

router.post('/pdf_cuenta', checkIfAuthenticated, registerSesionActivity, (req, res) => controller.getPDFCuenta(req, res));
router.post('/pdf_seguimiento_envio', checkIfAuthenticated, (req, res) => controller.getPDFSeguimientoEnvio(req, res));
router.get('/imprimir_seguimiento/:id/:input', checkIfAuthenticated, (req, res) => controller.getSeguimientoImpresion(req, res));

export default router;
