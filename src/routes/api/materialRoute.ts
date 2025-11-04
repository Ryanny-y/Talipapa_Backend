import express, { Router } from 'express';
import { createMaterial, getPaginatedMaterials, updateMaterial } from '../../controller/api/materialController';
import verifyJwt from '../../middleware/verifyJwt';
import verifyRoles from '../../middleware/verifyRoles';
import { Roles } from '../../config/roles';
import upload from '../../middleware/upload';

const router: Router = express.Router();

router.route("")
  .get(getPaginatedMaterials)
  .post(verifyJwt, verifyRoles(Roles.SUPER_ADMIN), upload.single("materialImage"), createMaterial)

router.route("/:id")
  .all(verifyJwt, verifyRoles(Roles.SUPER_ADMIN))
  .patch(upload.single("materialImage"), updateMaterial)

export default router;