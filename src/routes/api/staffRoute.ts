import express, { Router } from 'express'
import verifyJwt from '../../middleware/verifyJwt';
import verifyRoles from '../../middleware/verifyRoles';
import { Roles } from '../../config/roles';
import { addStaffToFarm, deleteStaff, getStaffByFarm, updateStaff } from '../../controller/api/staffController';

const router: Router = express.Router();

router.route("/")
  .all(verifyJwt, verifyRoles(Roles.SUPER_ADMIN))
  .post(addStaffToFarm)
  
  router.route("/:id")
  .all(verifyJwt, verifyRoles(Roles.SUPER_ADMIN))
  // .get(getSingleSkill)
  .patch(updateStaff)
  .delete(deleteStaff)
  
router.get("/farm/:id", verifyJwt, verifyRoles(Roles.SUPER_ADMIN), getStaffByFarm);

export default router;