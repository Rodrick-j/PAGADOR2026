import express from "express";
import { MemorandumViewController } from "./MemorandumViewController";
import { checkIfAuthenticated } from "../../../../../base/infra/AuthMiddleware";

const controller = new MemorandumViewController();

const router = express.Router();

router.get("/memorandum_table", checkIfAuthenticated, (req, res) => controller.getMemorandumsTable(req, res));
router.get("/memorandum_table_user", checkIfAuthenticated, (req, res) => controller.getMemorandumsUserTable(req, res));
router.get("/memorandum_solicitada_table_user", checkIfAuthenticated, (req, res) => controller.getMemorandumsSolicitadaUserTable(req, res));
router.get("/memorandum_form/:memorandum_id", checkIfAuthenticated, (req, res) => controller.getMemorandumFormData(req, res));
//Se aumenta para detalle memorandum
router.get('/memorandum_table/:memorandum_id', checkIfAuthenticated, (req, res) => controller.getTableMemorandumDetalle(req, res));
//Se aumenta para tipoPCP memorandum
router.get('/memorandum_tipo_pcp/:memorandum_id', checkIfAuthenticated, (req, res) => controller.getTipoPCP(req, res));
router.get('/memorandum_control_dias/:memorandum_id', checkIfAuthenticated, (req, res) => controller.getControlCountDias(req, res));

router.post("/memorandum_form", checkIfAuthenticated, (req, res) => controller.createOrUpdateMemorandum(req, res));
router.post("/memorandum_table_approve/:memorandum_id", checkIfAuthenticated, (req, res) => controller.changeApprove(req, res));
router.post("/memorandum_table/:memorandum_id", checkIfAuthenticated, (req, res) => controller.changeModificacion(req, res));
router.delete("/memorandum_table/:memorandum_id", checkIfAuthenticated, (req, res) => controller.destroyMemorandum(req, res));
router.delete("/memorandum_detalle_table/:detalle_id", checkIfAuthenticated, (req, res) => controller.destroyMemorandumDetalle(req, res));
router.get('/memorandum_detalle_dias/:memorandum_id', checkIfAuthenticated, (req, res) => controller.getDatosMemorandum(req, res));
//router.get("/reporte_proceso_table", checkIfAuthenticated, (req, res) => controller.getReporteMemorandumTable(req, res));
router.post('/pdf_reporte', checkIfAuthenticated, (req, res) => controller.getPDFMemorandumReporte(req, res));
router.get("/memorandum_nro/:nro", checkIfAuthenticated, (req, res) => controller.getCodMemoData(req, res));
router.get('/memorandum_dia_habil/:memorandum_id', checkIfAuthenticated, (req, res) => controller.getDiaHabil(req, res));
router.post("/solicitud_memorandum_table/:memorandum_id", checkIfAuthenticated, (req, res) => controller.changeState(req, res));
router.get("/memorandum_all_cites", checkIfAuthenticated, (req, res) => controller.getAllCites(req, res));
router.get("/memorandum_cite_server/:id_usuario", checkIfAuthenticated, (req, res) => controller.getCiteServer(req, res));

router.post("/memorandum_table_changeMemoRepo/:memorandum_id", checkIfAuthenticated, (req, res) => controller.changeMemoRepo(req, res));

export default router;



