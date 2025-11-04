import express, { Router } from 'express';
import { getPaginatedAchievements } from '../../controller/api/achievementController';
const router: Router = express.Router();

router.route("/")
  .get(getPaginatedAchievements)
  // .post()

export default router;