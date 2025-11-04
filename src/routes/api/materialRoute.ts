import express, { Router } from 'express';
import { createMaterial, getPaginatedMaterials } from '../../controller/api/materialController';
import verifyJwt from '../../middleware/verifyJwt';
import verifyRoles from '../../middleware/verifyRoles';
import { Roles } from '../../config/roles';
import upload from '../../middleware/upload';

const router: Router = express.Router();

router.route("")
  .get(getPaginatedMaterials)
  .post(verifyJwt, verifyRoles(Roles.SUPER_ADMIN), upload.single("materialImage"), createMaterial)


export default router;