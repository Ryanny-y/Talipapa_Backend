import express, { Router } from 'express';
import verifyJwt from '../../middleware/verifyJwt';
import upload from '../../middleware/upload';
import verifyRoles from '../../middleware/verifyRoles';
import { Roles } from '../../config/roles';
import { createFarm, getFarm, updateFarm } from '../../controller/api/farmController';
const router: Router = express.Router();

router.route("/")
  .get(getFarm)
  .post(verifyJwt, verifyRoles(Roles.SUPER_ADMIN), upload.single("farmImage"), createFarm)

router.route("/:id")
  .all(verifyJwt, verifyRoles(Roles.SUPER_ADMIN))
  .patch(upload.single("farmImage"), updateFarm)

export default router;