import express from "express";
import { DescargoViewController } from "./DescargoViewController";
import { checkIfAuthenticated } from "../../../../../base/infra/AuthMiddleware";

const controller = new DescargoViewController();

const router = express.Router();

router.get("/descargo_table", checkIfAuthenticated, (req, res) => controller.getDescargosTable(req, res));
router.get("/descargo_form/:descargo_id", checkIfAuthenticated, (req, res) => controller.getDescargoFormData(req, res));

router.post("/descargo_form", checkIfAuthenticated, (req, res) => controller.createOrUpdateDescargo(req, res));
router.delete("/descargo_table/:descargo_id", checkIfAuthenticated, (req, res) => controller.destroyDescargo(req, res));

router.post("/descargo_table_approve/:id_descargo", checkIfAuthenticated, (req, res) => controller.changeApproveDescargo(req, res));
router.post("/informe_table_approve/:id_descargo", checkIfAuthenticated, (req, res) => controller.changeApproveInforme(req, res));
router.post('/pdf_viatico/:id?', checkIfAuthenticated, (req, res) => controller.getPDFReporte(req, res));

router.get("/descargo_fecha_filtro/:fechaInicio/:fechaFin", checkIfAuthenticated, (req, res) => controller.getFechaFiltro(req, res));
router.get("/descargo_nombre_filtro/:nombre?/:apellido?", checkIfAuthenticated, (req, res) => controller.getNombreApellido(req, res));
router.get("/descargo_beneficiario_filtro/:fechaInicio/:fechaFin/:beneficiario", checkIfAuthenticated, (req, res) => controller.getDatosBeneficiario(req, res));
router.get("/descargo_tipo_filtro/:fechaInicio?/:fechaFin?/:tipo?", checkIfAuthenticated, (req, res) => controller.getTipoUsuario(req, res));
router.get("/descargo_estado_filtro/:fechaInicio?/:fechaFin?/:estado?", checkIfAuthenticated, (req, res) => controller.getTipoEstado(req, res));
router.get("/descargo_estado_pago/:fechaInicio?/:fechaFin?/:estado?", checkIfAuthenticated, (req, res) => controller.getEstadoPago(req, res));
router.get("/descargo_tipo_vencimiento/:fechaInicio?/:fechaFin?/:tipo?", checkIfAuthenticated, (req, res) => controller.getTipoVencimiento(req, res));
router.get("/descargo_tipo_postpago_cancelado/:fechaInicio?/:fechaFin?/:tipo?", checkIfAuthenticated, (req, res) => controller.getTipoPostPagoCancelado(req, res));
router.get("/descargo_tipo_anulado/:fechaInicio?/:fechaFin?/:tipo?", checkIfAuthenticated, (req, res) => controller.getTipoAnulado(req, res));
router.post('/json_reporte/:id?', checkIfAuthenticated, (req, res) => controller.getReportJSON(req, res));
export default router;

