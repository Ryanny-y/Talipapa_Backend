import express, { Router } from 'express'
import verifyJwt from '../../middleware/verifyJwt';
import verifyRoles from '../../middleware/verifyRoles';
import { Roles } from '../../config/roles';
import { createSkill, deleteSkill, getAllSkills, getSingleSkill, updateSkill } from '../../controller/api/skillController';

const router: Router = express.Router();

router.route("/")
  .all(verifyJwt, verifyRoles(Roles.SUPER_ADMIN))
  .get(getAllSkills)
  .post(createSkill)

router.route("/:id")
  .all(verifyJwt, verifyRoles(Roles.SUPER_ADMIN))
  .get(getSingleSkill)
  .patch(updateSkill)
  .delete(deleteSkill)

export default router;