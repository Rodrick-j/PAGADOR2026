import express from "express";
import { checkIfAuthenticated } from "../../../../base/infra/AuthMiddleware";
import { StorageViewController } from "./StorageViewController";

const controller = new StorageViewController();

const router = express.Router();

//router.get("/file/:filename", (req, res) => controller.getFile(req, res));

router.post("/register", checkIfAuthenticated, (req, res) => controller.registerFile(req, res));
router.post("/upload", checkIfAuthenticated, (req, res) => controller.uploadFile(req, res));
router.delete("/upload", checkIfAuthenticated, (req, res) => controller.deleteFile(req, res));

router.get("/file/:filename", (req, res) => controller.getFile(req, res));


export default router;
