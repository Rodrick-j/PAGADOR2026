import express from "express";
import { EscalaDestinoViewController } from "./EscalaDestinoViewController";
import { checkIfAuthenticated } from "../../../../../base/infra/AuthMiddleware";

const controller = new EscalaDestinoViewController();

const router = express.Router();

router.get("/escala_destino_table", checkIfAuthenticated, (req, res) => controller.getEscalaDestinosTable(req, res));
router.get("/escala_destino_form/:escala_destino_id", checkIfAuthenticated, (req, res) => controller.getEscalaDestinoFormData(req, res));

//aumentando busqueda de vehiculos
router.get("/escala_destino", (req, res) => controller.getAllEscalaDestino(req, res));
router.get("/escala_destino_pais", (req, res) => controller.getAllPaises(req, res));
router.get("/escala_destino_comunidad", (req, res) => controller.getAllComunidades(req, res));
router.get("/escala_destino_modalidad", (req, res) => controller.getAllModalidades(req, res));
router.get("/escala_destino_pasaje/:destino", (req, res) => controller.getAllPasajes(req, res));

router.post("/escala_destino_form", checkIfAuthenticated, (req, res) => controller.createOrUpdateEscalaDestino(req, res));
router.delete("/escala_destino_table/:escala_destino_id", checkIfAuthenticated, (req, res) => controller.destroyEscalaDestino(req, res));

export default router;
