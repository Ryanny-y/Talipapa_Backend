import express, { Router } from 'express';
import verifyJwt from '../../middleware/verifyJwt';
import upload from '../../middleware/upload';
import verifyRoles from '../../middleware/verifyRoles';
import { Roles } from '../../config/roles';
import { createFarm, getFarm } from '../../controller/api/farmController';
const router: Router = express.Router();

router.route("/")
  .get(getFarm)
  .post(verifyJwt, verifyRoles(Roles.SUPER_ADMIN), upload.single("farmImage"), createFarm)

router.route("/:id")
  // .all(verifyJwt, verifyRoles(Roles.SUPER_ADMIN))
  // .patch(upload.single("image"), updateAchievement)
  // .delete(deleteAchievement)

export default router;