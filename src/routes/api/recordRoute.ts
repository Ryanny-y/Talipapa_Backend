import express, { Router } from 'express'
import verifyJwt from '../../middleware/verifyJwt';
import verifyRoles from '../../middleware/verifyRoles';
import { Roles } from '../../config/roles';
import { createRecord, deleteRecord, getPaginatedRecords, searchRecords, updateRecord } from '../../controller/api/recordController';

const router: Router = express.Router();

router.route("/")
  .all(verifyJwt, verifyRoles(Roles.SUPER_ADMIN))
  .get(getPaginatedRecords)
  .post(createRecord)

router.route("/:id")
  .all(verifyJwt, verifyRoles(Roles.SUPER_ADMIN))
  .patch(updateRecord)
  .delete(deleteRecord)

router.get("/search", verifyJwt, verifyRoles(Roles.SUPER_ADMIN), searchRecords);

export default router;