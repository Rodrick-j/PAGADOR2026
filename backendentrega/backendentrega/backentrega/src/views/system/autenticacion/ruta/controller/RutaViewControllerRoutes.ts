import express from "express";
import { RutaViewController } from "./RutaViewController";
import { checkIfAuthenticated, checkIfSuperAdmin, registerSesionActivity } from "../../../../../base/infra/AuthMiddleware";

const controller = new RutaViewController();

const router = express.Router();

router.get("/ruta_table", checkIfSuperAdmin, (req, res) => controller.getRutasTable(req, res));
router.get("/ruta_form/:ruta_id", checkIfSuperAdmin, (req, res) => controller.getRutaFormData(req, res));
router.post("/ruta_form", checkIfSuperAdmin, registerSesionActivity, (req, res) => controller.createOrUpdateRuta(req, res));
router.get("/rutas", checkIfAuthenticated, (req, res) => controller.getAllRutas(req, res));
router.delete("/ruta_table/:ruta_id", checkIfSuperAdmin, registerSesionActivity, (req, res) => controller.destroyRuta(req, res));

export default router;
