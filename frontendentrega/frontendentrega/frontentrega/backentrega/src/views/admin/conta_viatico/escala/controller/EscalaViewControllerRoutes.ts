import express from "express";
import { EscalaViewController } from "./EscalaViewController";
import { checkIfAuthenticated } from "../../../../../base/infra/AuthMiddleware";

const controller = new EscalaViewController();

const router = express.Router();

router.get("/escala_table", checkIfAuthenticated, (req, res) => controller.getEscalasTable(req, res));
router.get("/escala_form/:escala_id", checkIfAuthenticated, (req, res) => controller.getEscalaFormData(req, res));
router.get("/escala", (req, res) => controller.getAllEscala(req, res));
router.get("/escala_categoria_tipo/:cargo/:tipo_comision_idp/:usuario_id", (req, res) => controller.getEscalaCategoriaIDP(req, res));

router.post("/escala_form", checkIfAuthenticated, (req, res) => controller.createOrUpdateEscala(req, res));
router.delete("/escala_table/:escala_id", checkIfAuthenticated, (req, res) => controller.destroyEscala(req, res));

export default router;
