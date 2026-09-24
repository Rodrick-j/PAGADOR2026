import express from "express";
import { UsuarioViewController } from "./UsuarioViewController";
import {
    registerLogin,
    registerSesionActivity,
    checkIfSuperAdmin,
    checkIfAuthenticatedWithoutError,
    checkIfAuthenticatedLogin,    
    checkIfAuthenticated,
    checkIfAuthenticatedLoginCD,
} from "../../../../../base/infra/AuthMiddleware";

const controller = new UsuarioViewController();

const router = express.Router();

router.get("/session-info", checkIfAuthenticatedWithoutError, registerLogin, registerSesionActivity, (req, res) =>
    controller.getSessionInfo(req, res),
);
router.post('/login', async (req, res) => {
    controller.login(req, res);
});
//Autenticacion por Login - API
router.post('/user_login', checkIfAuthenticatedLogin, registerSesionActivity, (req, res) => {
    controller.getSessionInfoLogin(req, res);
});
//Autenticacion por Login - CD
router.post('/callback', checkIfAuthenticatedLoginCD, registerSesionActivity, (req, res) => {
    controller.getSessionInfoLoginCD(req, res);
});
router.get("/user_table", checkIfSuperAdmin, (req, res) => controller.getUsersTable(req, res));
router.get("/user_form/:user_id", (req, res) => controller.getUserFormData(req, res));
router.get("/usuarios", checkIfAuthenticated, (req, res) => controller.getAllUsuarios(req, res));
router.get("/usuario_area/:area_id", checkIfAuthenticated, (req, res) => controller.getAllUsuarioArea(req, res));
router.get("/usuarios_area", checkIfAuthenticated, (req, res) => controller.getAllUsuariosArea(req, res));

router.post('/user_image', checkIfAuthenticated, (req, res) => controller.setAvatarUser(req, res));
router.post('/user_reset2', checkIfAuthenticated, registerSesionActivity, (req, res) => controller.changeAuthenticatedUserPassword(req, res));

router.post("/user_form", checkIfSuperAdmin, registerSesionActivity, (req, res) => controller.createUser(req, res));
router.post("/register", registerSesionActivity, (req, res) => controller.registerUser(req, res));
router.put("/user_form", checkIfSuperAdmin, registerSesionActivity, (req, res) => controller.updateUser(req, res));
router.delete("/user_table/:user_id", checkIfSuperAdmin, registerSesionActivity, (req, res) => controller.destroyUser(req, res));
router.post("/user_table/:user_id", checkIfSuperAdmin, registerSesionActivity, (req, res) => controller.changeState(req, res));
router.post("/user_reset/:user_id", checkIfSuperAdmin, registerSesionActivity, (req, res) => controller.resetPassword(req, res));
router.get("/user_area", checkIfAuthenticated, (req, res) => controller.getUsuarioArea(req, res));

export default router;
