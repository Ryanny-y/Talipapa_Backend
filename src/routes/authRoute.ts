import express, { Router } from "express";
import { createAdmin, loginAdmin, refreshToken } from "../controller/authController";
import verifyJwt from "../middleware/verifyJwt";
import verifyRoles from "../middleware/verifyRoles";
import { Roles } from "../config/roles";

const router: Router = express.Router();

router.post("/create", verifyJwt, verifyRoles(Roles.SUPER_ADMIN), createAdmin);
router.post("/login", loginAdmin);
router.post("/refreshToken", refreshToken);

export default router;