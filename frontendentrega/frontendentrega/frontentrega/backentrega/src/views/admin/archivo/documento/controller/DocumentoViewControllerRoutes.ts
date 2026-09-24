import express from "express";
import { DocumentoViewController } from "./DocumentoViewController";
import { checkIfAuthenticated, registerSesionActivity } from "../../../../../base/infra/AuthMiddleware";

const controller = new DocumentoViewController();

const router = express.Router();

router.get("/documento_table", checkIfAuthenticated, (req, res) => controller.getDocumentosTable(req, res));
router.get("/documento_table2", checkIfAuthenticated, (req, res) => controller.getDocumentosTable2(req, res));
router.get("/documento_form/:documento_id", checkIfAuthenticated, (req, res) => controller.getDocumentoFormData(req, res));

router.get("/documento_nro/:nro/:gestion/:tipo", checkIfAuthenticated, (req, res) => controller.getNroDocumentoData(req, res));
router.post("/documento_nro2", checkIfAuthenticated, (req, res) => controller.getNroDocumentoData2(req, res));

router.get("/documentos/:tipo", (req, res) => controller.getAllDocumento(req, res));
router.get("/documentos2", (req, res) => controller.getAllDocumento2(req, res));
router.post("/documento_form", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.createOrUpdateDocumento(req, res));
router.delete("/documento_table/:documento_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.destroyDocumento(req, res));
router.post("/documento_table_permiso/:documento_id", checkIfAuthenticated, (req, res) => controller.changePermiso(req, res));

router.post("/documento_table/:documento_id", checkIfAuthenticated, (req, res) => controller.changeActive(req, res));
router.post('/pdf_documento', checkIfAuthenticated, registerSesionActivity, (req, res) => controller.getPDFDocumento(req, res));
router.post('/json_reporte/:id?', checkIfAuthenticated, (req, res) => controller.getReportJSON(req, res));

export default router;
