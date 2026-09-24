import express from "express";
import { VacacionViewController } from "./VacacionViewController";
import { checkIfAuthenticated } from "../../../../base/infra/AuthMiddleware";

const controller = new VacacionViewController();

const router = express.Router();

router.get("/vacacion_table", checkIfAuthenticated, (req, res) => controller.getTableVacacion(req, res));
router.get("/vacacion_form/:vacacion_id", (req, res) => controller.getVacacionFormData(req, res));
router.get("/vacacion_usuario/:usuario_id", (req, res) => controller.getIdVacacionByIdUsuario(req, res));
router.get("/vacacions", checkIfAuthenticated, (req, res) => controller.getAllVacacion(req, res));

router.post("/vacacion_form", checkIfAuthenticated, (req, res) => controller.createOrUpdateVacacion(req, res));
router.delete("/vacacion_item/:vacacion_id", (req, res) => controller.destroyVacacion(req, res));
router.post("/vacacion_table/:vacacion_id", checkIfAuthenticated, (req, res) => controller.changeState(req, res));
export default router;
