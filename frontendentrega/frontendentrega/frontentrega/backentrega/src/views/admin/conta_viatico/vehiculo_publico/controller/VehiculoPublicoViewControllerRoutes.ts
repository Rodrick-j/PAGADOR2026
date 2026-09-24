import express from "express";
import { VehiculoPublicoViewController } from "./VehiculoPublicoViewController";
import { checkIfAuthenticated } from "../../../../../base/infra/AuthMiddleware";

const controller = new VehiculoPublicoViewController();

const router = express.Router();

router.get("/vehiculo_publico_table", checkIfAuthenticated, (req, res) => controller.getVehiculoPublicosTable(req, res));
router.get("/vehiculo_publico_form/:vehiculo_publico_id", checkIfAuthenticated, (req, res) => controller.getVehiculoPublicoFormData(req, res));

router.post("/vehiculo_publico_form", checkIfAuthenticated, (req, res) => controller.createOrUpdateVehiculoPublico(req, res));
router.delete("/vehiculo_publico_table/:vehiculo_publico_id", checkIfAuthenticated, (req, res) => controller.destroyVehiculoPublico(req, res));

export default router;
