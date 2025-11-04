import express, { Router } from 'express';
import { createNews, deleteNews, getPaginatedNews, updateNews } from '../../controller/api/newsController';
import verifyJwt from '../../middleware/verifyJwt';
import verifyRoles from '../../middleware/verifyRoles';
import { Roles } from '../../config/roles';

const router: Router = express.Router();

router.route("")
  .get(getPaginatedNews)
  .post(verifyJwt, verifyRoles(Roles.SUPER_ADMIN), createNews)

router.route("/:id")
  .put(verifyJwt, verifyRoles(Roles.SUPER_ADMIN), updateNews)
  .delete(verifyJwt, verifyRoles(Roles.SUPER_ADMIN), deleteNews);

export default router;