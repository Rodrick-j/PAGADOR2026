import express from "express";
import { ViaticoViewController } from "./ViaticoViewController";
import { checkIfAuthenticated } from "../../../../../base/infra/AuthMiddleware";

const controller = new ViaticoViewController();

const router = express.Router();

router.get("/viatico_table", checkIfAuthenticated, (req, res) => controller.getViaticosTable(req, res));
router.get("/viatico_form/:viatico_id", checkIfAuthenticated, (req, res) => controller.getViaticoFormData(req, res));

//router.get("/viatico_form_destino/:viatico_id", checkIfAuthenticated, (req, res) => controller.getDestinoFormData(req, res));

router.post("/viatico_form", checkIfAuthenticated, (req, res) => controller.createOrUpdateViatico(req, res));
router.delete("/viatico_table/:viatico_id", checkIfAuthenticated, (req, res) => controller.destroyViatico(req, res));
router.get("/viatico_nro/:nro", checkIfAuthenticated, (req, res) => controller.getNroReciboData(req, res));
router.post("/viatico_table_approve/:viatico_id", checkIfAuthenticated, (req, res) => controller.changeApprove(req, res));

router.post('/pdf_reporte', checkIfAuthenticated, (req, res) => controller.getPDFViaticoReporte(req, res));
router.get("/viatico_fecha_filtro/:fechaInicio/:fechaFin", checkIfAuthenticated, (req, res) => controller.getFechaFiltroRRHH(req, res));
router.get("/viatico_tipo_filtro/:tipo?", checkIfAuthenticated, (req, res) => controller.getTipoUsuarioRRHH(req, res));
router.get("/viatico_estado_pago/:estado?", checkIfAuthenticated, (req, res) => controller.getEstadoPagoRRHH(req, res));
router.get("/viatico_estado_modificacion/:estado?", checkIfAuthenticated, (req, res) => controller.getEstadoModificacionRRHH(req, res));
router.post('/json_reporte/:id?', checkIfAuthenticated, (req, res) => controller.getReportJSON(req, res));
router.post("/viatico_anular_recibo", checkIfAuthenticated, (req, res) => controller.anularRecibo(req, res));

export default router;
