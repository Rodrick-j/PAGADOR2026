import express from "express";
import { CitesViewController } from "./CitesViewController";
import { checkIfAuthenticated, registerSesionActivity } from "../../../../../base/infra/AuthMiddleware";

const controller = new CitesViewController();

const router = express.Router();

router.get("/cites_table", checkIfAuthenticated, (req, res) => controller.getCitesTable(req, res));
router.get("/cites_form/:cites_id", checkIfAuthenticated, (req, res) => controller.getCitesFormData(req, res));

//Apertura por  - API
router.get('/cites_api', (req, res) => {
    controller.getCitesApi(req, res);
});

router.post("/cites_form", checkIfAuthenticated, (req, res) => controller.createOrUpdateCites(req, res));
router.delete("/cites_table/:cites_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.destroyCites(req, res));
router.get("/cites_all_documentos", (req, res) => controller.getAllDocumentos(req, res));
router.get("/tipo_cites", (req, res) => controller.getTipoCites(req, res));
router.get("/cites_all_rutas", (req, res) => controller.getAllCitesRutas(req, res));
router.post("/cites_table_estado/:cites_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.setChangeEstado(req, res));
router.post('/pdf_cites',checkIfAuthenticated, registerSesionActivity, (req, res) => controller.getReporteCitesPDF(req, res));
router.post('/pdf_cites_tabla', checkIfAuthenticated, (req, res) => controller.getAllCitesPDF(req, res));

export default router;
