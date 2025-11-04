import express, { Router } from 'express';
import verifyJwt from '../../middleware/verifyJwt';
import verifyRoles from '../../middleware/verifyRoles';
import { Roles } from '../../config/roles';
import { createProduct, getPaginatedProducts } from '../../controller/api/productController';
import upload from '../../middleware/upload';

const router: Router = express.Router();

router.route("/")
  .get(getPaginatedProducts)
  .post(verifyJwt, verifyRoles(Roles.SUPER_ADMIN), upload.single("productImage"), createProduct)

router.route("/:id")
  // .all(verifyJwt, verifyRoles(Roles.SUPER_ADMIN))
  // .patch()
  // .delete()

export default router;