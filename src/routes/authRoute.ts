import express, { Router } from "express";
import { createAdmin, loginAdmin, refreshToken } from "../controller/authController";

const router: Router = express.Router();

router.post("/create", createAdmin);
router.post("/login", loginAdmin);
router.post("/refreshToken", refreshToken);

export default router;