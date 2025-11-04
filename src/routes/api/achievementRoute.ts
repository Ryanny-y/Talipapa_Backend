import express, { Router } from 'express';
import { createAchievement, getPaginatedAchievements } from '../../controller/api/achievementController';
import verifyJwt from '../../middleware/verifyJwt';
import upload from '../../middleware/upload';
import verifyRoles from '../../middleware/verifyRoles';
import { Roles } from '../../config/roles';
const router: Router = express.Router();

router.route("/")
  .get(getPaginatedAchievements)
  .post(verifyJwt, verifyRoles(Roles.SUPER_ADMIN), upload.single("image"), createAchievement)

export default router;