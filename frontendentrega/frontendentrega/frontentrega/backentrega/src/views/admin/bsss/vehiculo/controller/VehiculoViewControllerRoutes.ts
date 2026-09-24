import express from "express";
import { VehiculoViewController } from "./VehiculoViewController";
import { checkIfAuthenticated, registerSesionActivity } from "../../../../../base/infra/AuthMiddleware";

const controller = new VehiculoViewController();

const router = express.Router();

router.get("/vehiculo_table", checkIfAuthenticated, (req, res) => controller.getTableVehiculo(req, res));
router.get("/vehiculo_form/:vehiculo_id", (req, res) => controller.getVehiculoFormData(req, res));
router.get("/vehiculos/:id", checkIfAuthenticated, (req, res) => controller.getAllVehiculo(req, res));
router.get("/vehiculo_id/:vehiculo_id", (req, res) => controller.getByIdVehiculo(req, res));
//aumentando busqueda de vehiculos
router.get("/vehiculos", (req, res) => controller.getAllVehiculos(req, res));


router.post("/vehiculo_form", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.createOrUpdateVehiculo(req, res));
router.delete("/vehiculo_item/:vehiculo_id", registerSesionActivity, (req, res) => controller.destroyVehiculo(req, res));
router.post("/vehiculo_table/:vehiculo_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.changeState(req, res));

export default router;
