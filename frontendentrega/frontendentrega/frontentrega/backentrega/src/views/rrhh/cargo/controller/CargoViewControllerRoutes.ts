import express from "express";
import { CargoViewController } from "./CargoViewController";
import { checkIfAuthenticated, registerSesionActivity } from "../../../../base/infra/AuthMiddleware";

const controller = new CargoViewController();

const router = express.Router();

router.get("/cargo_table", checkIfAuthenticated, (req, res) => controller.getTableCargo(req, res));
router.get("/cargo_form/:cargo_id", (req, res) => controller.getCargoFormData(req, res));
router.get("/cargos", (req, res) => controller.getAllCargo(req, res));

router.post("/cargo_form", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.createOrUpdateCargo(req, res));
router.delete("/cargo_item/:cargo_id", registerSesionActivity, (req, res) => controller.destroyCargo(req, res));
router.post("/cargo_table/:cargo_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.changeState(req, res));

export default router;
