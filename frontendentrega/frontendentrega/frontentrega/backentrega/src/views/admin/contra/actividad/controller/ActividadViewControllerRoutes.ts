import express from "express";
import { ActividadViewController } from "./ActividadViewController";
import { checkIfAuthenticated, registerSesionActivity } from "../../../../../base/infra/AuthMiddleware";

const controller = new ActividadViewController();

const router = express.Router();

router.get("/actividad_table", checkIfAuthenticated, (req, res) => controller.getActividadsTable(req, res));
router.get("/actividad_form/:actividad_id", checkIfAuthenticated, (req, res) => controller.getActividadFormData(req, res));

router.post("/actividad_form", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.createOrUpdateActividad(req, res));
router.post("/actividad_table/:actividad_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.changeState(req, res));
router.delete("/actividad_table/:actividad_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.destroyActividad(req, res));
router.get("/actividad_nro/:nro/:proceso_id/:paso", checkIfAuthenticated, (req, res) => controller.getFechaLimiteData(req, res));
export default router;
