import express, { Router } from 'express'
import verifyJwt from '../../middleware/verifyJwt';
import verifyRoles from '../../middleware/verifyRoles';
import { Roles } from '../../config/roles';
import { getPaginatedRecords } from '../../controller/api/recordController';

const router: Router = express.Router();

router.route("/")
  .all(verifyJwt, verifyRoles(Roles.SUPER_ADMIN))
  .get(getPaginatedRecords)

export default router;