import express, { Router } from "express";
import { createAdmin } from "../controller/v1/authController";

const router: Router = express.Router();

router.post("/create", createAdmin);

export default router;