import express, { Router } from 'express';
import verifyJwt from '../../middleware/verifyJwt';
import verifyRoles from '../../middleware/verifyRoles';
import { Roles } from '../../config/roles';
import { getPaginatedProducts } from '../../controller/api/productController';

const router: Router = express.Router();

router.route("/")
  .get(getPaginatedProducts)
  // .post(verifyJwt, verifyRoles(Roles.SUPER_ADMIN), )

router.route("/:id")
  // .all(verifyJwt, verifyRoles(Roles.SUPER_ADMIN))
  // .patch()
  // .delete()

export default router;