import express, { Router } from 'express';
import { createNews, deleteNews, getPaginatedNews, updateNews } from '../../controller/api/newsController';
import verifyJwt from '../../middleware/verifyJwt';

const router: Router = express.Router();

router.route("")
  .get(getPaginatedNews)
  .post(verifyJwt, createNews)

router.route("/:id")
  .put(verifyJwt, updateNews)
  .delete(verifyJwt, deleteNews);

export default router;