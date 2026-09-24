import express from "express";
import { AsignacionViewController } from "./AsignacionViewController";
import { checkIfAuthenticated, registerSesionActivity } from "../../../../../base/infra/AuthMiddleware";

const controller = new AsignacionViewController();

const router = express.Router();

router.get("/asignacion_table", checkIfAuthenticated, (req, res) => controller.getAsignacionsTable(req, res));
router.get("/asignacion_form/:asignacion_id", checkIfAuthenticated, (req, res) => controller.getAsignacionFormData(req, res));
router.get("/asignacion_id/:asignacion_id", (req, res) => controller.getByIdAsignacion(req, res));

router.get("/asignacions", checkIfAuthenticated, (req, res) => controller.getAllAsignacions(req, res));
router.post("/asignacion_form", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.createOrUpdateAsignacion(req, res));
router.post("/asignacion_table/:asignacion_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.changeState(req, res));
router.delete("/asignacion_table/:asignacion_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.destroyAsignacion(req, res));

export default router;
