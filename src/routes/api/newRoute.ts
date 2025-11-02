import express, { Router } from 'express';
import { createNews, deleteNews, getPaginatedNews, updateNews } from '../../controller/api/newsController';

const router: Router = express.Router();

router.route("")
  .get(getPaginatedNews)
  .post(createNews)

router.route("/:id")
  .put(updateNews)
  .delete(deleteNews);

export default router;