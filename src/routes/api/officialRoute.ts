import express, { Router } from 'express';
import { getAllOfficials } from '../../controller/api/officialController';
const router: Router = express.Router();

router.route("/")
  .get(getAllOfficials)

export default router;