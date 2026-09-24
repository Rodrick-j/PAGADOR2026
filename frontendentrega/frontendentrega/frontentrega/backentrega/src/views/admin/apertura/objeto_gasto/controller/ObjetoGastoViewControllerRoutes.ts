import express from "express";
import { ObjetoGastoViewController } from "./ObjetoGastoViewController";
import { checkIfAuthenticated } from "../../../../../base/infra/AuthMiddleware";

const controller = new ObjetoGastoViewController();

const router = express.Router();

router.get("/objeto_gasto_table", checkIfAuthenticated, (req, res) => controller.getObjetoGastosTable(req, res));
router.get("/objeto_gasto_form/:objeto_gasto_id", checkIfAuthenticated, (req, res) => controller.getObjetoGastoFormData(req, res));

//Apertura por  - API
router.get('/objeto_gasto_api/:objeto_gasto_id', (req, res) => {
    controller.getObjetoGastoApiData(req, res);
});

router.post("/objeto_gasto_form", checkIfAuthenticated, (req, res) => controller.createOrUpdateObjetoGasto(req, res));
router.delete("/objeto_gasto_table/:objeto_gasto_id", checkIfAuthenticated, (req, res) => controller.destroyObjetoGasto(req, res));
//aumentando busqueda de objetos
router.get("/objeto_gasto", (req, res) => controller.getAllObjetoGasto(req, res));
router.get("/objeto_gasto_codigo/:codigo", checkIfAuthenticated, (req, res) => controller.getObjetoGastoData(req, res));
router.get("/objeto_gasto_id/:id", checkIfAuthenticated, (req, res) => controller.getFindObjetoGastoData(req, res));

router.post("/objeto_gasto_table/:objeto_gasto_id", checkIfAuthenticated, (req, res) => controller.changeState(req, res));
export default router;
