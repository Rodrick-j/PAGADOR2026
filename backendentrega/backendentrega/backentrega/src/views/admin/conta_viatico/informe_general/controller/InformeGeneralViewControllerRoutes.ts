import express from "express";
import { InformeGeneralViewController } from "./InformeGeneralViewController";
import { checkIfAuthenticated } from "../../../../../base/infra/AuthMiddleware";

const controller = new InformeGeneralViewController();

const router = express.Router();

router.get("/informe_general_table", checkIfAuthenticated, (req, res) => controller.getInformeGeneralsTable(req, res));
router.get("/informe_general_form/:informe_general_id", checkIfAuthenticated, (req, res) => controller.getInformeGeneralFormData(req, res));

router.post("/informe_general_form", checkIfAuthenticated, (req, res) => controller.createOrUpdateInformeGeneral(req, res));
router.delete("/informe_general_table/:informe_general_id", checkIfAuthenticated, (req, res) => controller.destroyInformeGeneral(req, res));

export default router;
