import express from "express";
import { MemorandumrrhhViewController } from "./MemorandumrrhhViewController";
import { checkIfAuthenticated } from "../../../../base/infra/AuthMiddleware";

const controller = new MemorandumrrhhViewController();

const router = express.Router();

router.get("/memorandum_rrhh_table", checkIfAuthenticated, (req, res) => controller.getMemorandumsTable(req, res));
router.get("/memorandum_rrhh_table_user", checkIfAuthenticated, (req, res) => controller.getMemorandumsUserTable(req, res));
router.get("/memorandum_rrhh_solicitada_table_user", checkIfAuthenticated, (req, res) => controller.getMemorandumsSolicitadaUserTable(req, res));
router.get("/memorandum_rrhh_form/:memorandum_rrhh_id", checkIfAuthenticated, (req, res) => controller.getMemorandumFormData(req, res));
//Se aumenta para detalle memorandum_rrhh
router.get('/memorandum_rrhh_table/:memorandum_rrhh_id', checkIfAuthenticated, (req, res) => controller.getTableMemorandumDetalle(req, res));
//Se aumenta para tipoPCP memorandum_rrhh
router.get('/memorandum_rrhh_tipo_pcp/:memorandum_rrhh_id', checkIfAuthenticated, (req, res) => controller.getTipoPCP(req, res));
router.get('/memorandum_rrhh_control_dias/:memorandum_rrhh_id', checkIfAuthenticated, (req, res) => controller.getControlCountDias(req, res));

router.post("/memorandum_rrhh_form", checkIfAuthenticated, (req, res) => controller.createOrUpdateMemorandum(req, res));
router.post("/memorandum_rrhh_table_approve/:memorandum_rrhh_id", checkIfAuthenticated, (req, res) => controller.changeApprove(req, res));
router.post("/memorandum_rrhh_table/:memorandum_rrhh_id", checkIfAuthenticated, (req, res) => controller.changeModificacion(req, res));
router.delete("/memorandum_rrhh_table/:memorandum_rrhh_id", checkIfAuthenticated, (req, res) => controller.destroyMemorandum(req, res));
router.delete("/memorandum_rrhh_detalle_table/:detalle_id", checkIfAuthenticated, (req, res) => controller.destroyMemorandumDetalle(req, res));
router.get('/memorandum_rrhh_detalle_dias/:memorandum_rrhh_id', checkIfAuthenticated, (req, res) => controller.getDatosMemorandum(req, res));
//router.get("/reporte_proceso_table", checkIfAuthenticated, (req, res) => controller.getReporteMemorandumTable(req, res));

router.post('/pdf_reporte', checkIfAuthenticated, (req, res) => controller.getPDFMemorandum(req, res));
router.get("/memorandum_rrhh_nro/:nro", checkIfAuthenticated, (req, res) => controller.getCodMemoData(req, res));
router.get('/memorandum_rrhh_dia_habil/:memorandum_rrhh_id', checkIfAuthenticated, (req, res) => controller.getDiaHabil(req, res));
router.post("/solicitud_memorandum_rrhh_table/:memorandum_rrhh_id", checkIfAuthenticated, (req, res) => controller.changeState(req, res));
router.get("/memorandum_rrhh_all_cites", checkIfAuthenticated, (req, res) => controller.getAllCites(req, res));
            
router.post('/pdf_memorandum_rrhh/:id?', checkIfAuthenticated, (req, res) => controller.getPDFMemorandumReporte(req, res)); //reportes
router.get("/memorandum_rrhh_fecha_filtro/:fechaInicio/:fechaFin", checkIfAuthenticated, (req, res) => controller.getFechaFiltro(req, res));
router.get("/memorandum_rrhh_nombre_filtro/:nombre?/:apellido?", checkIfAuthenticated, (req, res) => controller.getNombreApellido(req, res));
router.get("/memorandum_rrhh_beneficiario_filtro/:fechaInicio/:fechaFin/:beneficiario", checkIfAuthenticated, (req, res) => controller.getDatosBeneficiario(req, res));
router.get("/memorandum_rrhh_tipo_filtro/:tipo?", checkIfAuthenticated, (req, res) => controller.getTipoUsuario(req, res));
router.get("/memorandum_rrhh_estado_filtro/:estado?", checkIfAuthenticated, (req, res) => controller.getTipoEstado(req, res));
router.post('/json_reporte/:id?', checkIfAuthenticated, (req, res) => controller.getReportJSON(req, res));

export default router;



