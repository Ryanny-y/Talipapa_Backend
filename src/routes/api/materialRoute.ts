import express, { Router } from 'express';
import { getPaginatedMaterials } from '../../controller/api/materialController';

const router: Router = express.Router();

router.route("")
  .get(getPaginatedMaterials)


export default router;