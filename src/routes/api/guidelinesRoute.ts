import express, { Router } from 'express';
import verifyJwt from '../../middleware/verifyJwt';
import verifyRoles from '../../middleware/verifyRoles';
import { Roles } from '../../config/roles';
import { getPaginatedGuidelines } from '../../controller/api/guidelineController';

const router: Router = express.Router();

router.route("")
  .get(getPaginatedGuidelines)
  // .post(verifyJwt, verifyRoles(Roles.SUPER_ADMIN), upload.single("materialImage"), createMaterial)

router.route("/:id")
  .all(verifyJwt, verifyRoles(Roles.SUPER_ADMIN))
  // .patch(upload.single("materialImage"), updateMaterial)
  // .delete(deleteMaterial)

export default router;