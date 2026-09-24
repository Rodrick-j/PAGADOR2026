import express from "express";
import { AreaViewController } from "./AreaViewController";
import { checkIfAuthenticated, registerSesionActivity } from "../../../../base/infra/AuthMiddleware";

const controller = new AreaViewController();

const router = express.Router();

router.get("/area_table", checkIfAuthenticated, (req, res) => controller.getTableArea(req, res));
router.get("/area_form/:area_id", (req, res) => controller.getAreaFormData(req, res));
router.get("/areas", (req, res) => controller.getAllArea(req, res));
router.get("/areas_cliente", checkIfAuthenticated, (req, res) => controller.getAllAreaCliente(req, res));

router.post("/area_form", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.createOrUpdateArea(req, res));
router.delete("/area_table/:area_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.destroyArea(req, res));
router.post("/area_table/:area_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.changeState(req, res));

router.get("/area_hijos", (req, res) => controller.getAreaHijos(req, res));
router.get("/area_cite", checkIfAuthenticated, (req, res) => controller.getCite(req, res));


export default router;
