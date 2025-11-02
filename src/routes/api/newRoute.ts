import express, { Router } from 'express';
import { createNews, getPaginatedNews, updateNews } from '../../controller/api/newsController';

const router: Router = express.Router();

router.route("")
  .get(getPaginatedNews)
  .post(createNews)

router.route("/:id")
  .put(updateNews)
  // .delete();

export default router;