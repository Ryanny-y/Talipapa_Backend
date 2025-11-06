import express, { Router } from 'express';
import { createOfficial, deleteOfficial, getAllOfficials, updateOfficial } from '../../controller/api/officialController';
import verifyJwt from '../../middleware/verifyJwt';
import verifyRoles from '../../middleware/verifyRoles';
import { Roles } from '../../config/roles';
import upload from '../../middleware/upload';
const router: Router = express.Router();

router.route("/")
  .get(getAllOfficials)
  .post(verifyJwt, verifyRoles(Roles.SUPER_ADMIN), upload.single("officialImage"), createOfficial)

router.route("/:id")
  .all(verifyJwt, verifyRoles(Roles.SUPER_ADMIN))
  .patch(upload.single("officialImage"), updateOfficial)
  .delete(deleteOfficial);

export default router;