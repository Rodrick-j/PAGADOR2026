import express from "express";
import { GeneralViewController } from "./GeneralViewController";
import { checkIfAuthenticated } from "../../../../../base/infra/AuthMiddleware";

const controller = new GeneralViewController();

const router = express.Router();

router.get("/general_table", checkIfAuthenticated, (req, res) => controller.getGeneralsTable(req, res));
router.get("/general_form/:general_id", checkIfAuthenticated, (req, res) => controller.getGeneralFormData(req, res));

router.post("/general_form", checkIfAuthenticated, (req, res) => controller.createOrUpdateGeneral(req, res));
router.delete("/general_table/:general_id", checkIfAuthenticated, (req, res) => controller.destroyGeneral(req, res));

export default router;
