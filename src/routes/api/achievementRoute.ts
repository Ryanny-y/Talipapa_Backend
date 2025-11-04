import express, { Router } from 'express';
import { createAchievement, getPaginatedAchievements } from '../../controller/api/achievementController';
import verifyJwt from '../../middleware/verifyJwt';
import upload from '../../middleware/upload';
const router: Router = express.Router();

router.route("/")
  .get(getPaginatedAchievements)
  .post(verifyJwt, upload.single("image"), createAchievement)

export default router;