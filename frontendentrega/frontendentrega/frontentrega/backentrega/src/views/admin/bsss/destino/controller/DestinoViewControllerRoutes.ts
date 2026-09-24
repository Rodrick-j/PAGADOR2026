import express from "express";
import { DestinoViewController } from "./DestinoViewController";
import { checkIfAuthenticated, registerSesionActivity } from "../../../../../base/infra/AuthMiddleware";

const controller = new DestinoViewController();

const router = express.Router();

router.get("/destino_table", checkIfAuthenticated, (req, res) => controller.getDestinosTable(req, res));
router.get("/destino_form/:destino_id", checkIfAuthenticated, (req, res) => controller.getDestinoFormData(req, res));

router.get("/destinos", (req, res) => controller.getAllDestinos(req, res));
router.post("/destino_form", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.createOrUpdateDestino(req, res));
router.delete("/destino_table/:destino_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.destroyDestino(req, res));

export default router;
