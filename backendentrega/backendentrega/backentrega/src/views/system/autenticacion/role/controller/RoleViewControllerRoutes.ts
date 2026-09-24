import express from "express";
import { RoleViewController } from "./RoleViewController";
import { checkIfAuthenticated, checkIfSuperAdmin, registerSesionActivity } from "../../../../../base/infra/AuthMiddleware";

const controller = new RoleViewController();

const router = express.Router();

router.get("/role_table", checkIfSuperAdmin, (req, res) => controller.getRolesTable(req, res));
router.get("/role_form/:role_id", checkIfSuperAdmin, (req, res) => controller.getRoleFormData(req, res));
router.post("/role_form", checkIfSuperAdmin, registerSesionActivity, (req, res) => controller.createOrUpdateRole(req, res));
router.get("/roles", checkIfAuthenticated, (req, res) => controller.getAllRoles(req, res));
router.delete("/role_table/:role_id", checkIfSuperAdmin, registerSesionActivity, (req, res) => controller.destroyRole(req, res));

export default router;
