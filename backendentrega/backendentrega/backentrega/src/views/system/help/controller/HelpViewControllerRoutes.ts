import express from "express";
import { checkIfAuthenticatedWithoutError } from "../../../../base/infra/AuthMiddleware";
import { HelpViewController } from "./HelpViewController";

const controller = new HelpViewController();

const router = express.Router();

router.post("/log", checkIfAuthenticatedWithoutError, (req, res) => controller.registrarLog(req, res));

export default router;
