import express, { Router } from 'express';
import verifyJwt from '../../middleware/verifyJwt';
import verifyRoles from '../../middleware/verifyRoles';
import { Roles } from '../../config/roles';
import { createGuidelines, deleteGuideline, getPaginatedGuidelines, updateGuideline } from '../../controller/api/guidelineController';

const router: Router = express.Router();

router.route("")
  .get(getPaginatedGuidelines)
  .post(verifyJwt, verifyRoles(Roles.SUPER_ADMIN), createGuidelines)

router.route("/:id")
  .all(verifyJwt, verifyRoles(Roles.SUPER_ADMIN))
  .put(updateGuideline)
  .delete(deleteGuideline)

export default router;