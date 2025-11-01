import express, { Router } from "express";
import { createAdmin, loginAdmin } from "../controller/v1/authController";

const router: Router = express.Router();

router.post("/create", createAdmin);
router.post("/login", loginAdmin);

export default router;