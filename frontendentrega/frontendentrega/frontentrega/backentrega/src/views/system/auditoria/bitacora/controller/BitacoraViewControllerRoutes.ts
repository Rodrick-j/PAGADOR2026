import express from "express";
import { BitacoraViewController } from "./BitacoraViewController";
import { checkIfAuthenticated } from "../../../../../base/infra/AuthMiddleware";

const controller = new BitacoraViewController();

const router = express.Router();

router.get("/bitacora_table", checkIfAuthenticated, (req, res) => controller.getBitacoraTable(req, res));
router.get("/bitacora_form/:bitacora_id", (req, res) => controller.getBitacoraFormData(req, res));

export default router;
