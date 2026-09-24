import express from "express";
import { InformeComisionViewController } from "./InformeComisionViewController";
import { checkIfAuthenticated } from "../../../../../base/infra/AuthMiddleware";

const controller = new InformeComisionViewController();

const router = express.Router();

router.get("/informe_comision_table", checkIfAuthenticated, (req, res) => controller.getInformeComisionsTable(req, res));
router.get("/informe_comision_form/:informe_comision_id", checkIfAuthenticated, (req, res) => controller.getInformeComisionFormData(req, res));

router.post("/informe_comision_form", checkIfAuthenticated, (req, res) => controller.createOrUpdateInformeComision(req, res));
router.delete("/informe_comision_table/:informe_comision_id", checkIfAuthenticated, (req, res) => controller.destroyInformeComision(req, res));

export default router;
