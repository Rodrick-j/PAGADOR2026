import express from "express";
import { PersonalViewController } from "./PersonalViewController";
import { checkIfAuthenticated, registerSesionActivity } from "../../../../base/infra/AuthMiddleware";

const controller = new PersonalViewController();

const router = express.Router();

router.get("/personal_table", checkIfAuthenticated, (req, res) => controller.getTablePersonal(req, res));
router.get("/personal_form/:personal_id", (req, res) => controller.getPersonalFormData(req, res));
router.get("/personals", (req, res) => controller.getAllPersonal(req, res));
router.get("/personals_ci", (req, res) => controller.getAllPersonalCI(req, res));

router.get("/personals_cliente", checkIfAuthenticated, (req, res) => controller.getAllPersonalCliente(req, res));

router.post("/personal_form", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.createOrUpdatePersonal(req, res));
router.delete("/personal_item/:personal_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.destroyPersonal(req, res));
router.post("/personal_table/:personal_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.changeState(req, res));
export default router;
