import express, { Request } from 'express';
import axios from "axios";
import { verifyToken } from "../../../../base/utils/jwt";
import { SettingViewController } from './SettingViewController';
import { checkIfAuthenticated } from '../../../../base/infra/AuthMiddleware';
import { URL_SIGAPO, URL_SIGAPO2 } from '../../../../config/app-config';
import { AuthUser } from '../../../../base/types/AuthUser';
import UsuarioService from '../../../../core/system/autenticacion/usuario';

const controller = new SettingViewController();

const router = express.Router();

const getAuthToken = (req: Request): string | null => {
    try {
        return String(req.headers.authorization).split(" ")[1];
    } catch (e) {
        return null;
    }
};


router.get("/purgar_all", (req, res) => controller.purgeAll(req, res));
/* router.get("/user_all", (req, res) => controller.userAll(req, res)); */

router.get("/sigapo_table", checkIfAuthenticated, async (req, res) => {
    const authToken = getAuthToken(req);
    if (!authToken) throw new Error("Acceso no autorizado");
    const authUser = verifyToken(authToken) as AuthUser;
    const usuario = await UsuarioService.getById(authUser.uid);
    if (usuario.isFailure) throw new Error(String(usuario.error));
    if (!usuario.getValue().props.activo) throw new Error("Usuario inactivo");
    const nombre= usuario.getValue().getNombreCompleto();
    const response = await axios.post(URL_SIGAPO+nombre);
    return controller.getTableSigapo(req, response,  res);
});

router.get("/sigapo_detalle_table", checkIfAuthenticated, async (req, res) => {
    //const response = await axios.get(URL_SIGAPO);
    return controller.getTableDetalleSigapo(req,  res);
});

router.get("/sigapo_detalle_table2", checkIfAuthenticated, async (req, res) => {
    const hojaDeRuta = req.query.hoja_de_ruta;

    const response = await axios.post(URL_SIGAPO+hojaDeRuta);
    const response2 = await axios.post(URL_SIGAPO2+hojaDeRuta);
    return controller.getTableDetalleSigapoV2(req, response, response2, res);
});

export default router;
