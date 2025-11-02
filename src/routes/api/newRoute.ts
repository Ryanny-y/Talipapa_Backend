import express, { Router } from 'express';
import { createNews, getPaginatedNews } from '../../controller/api/newsController';

const router: Router = express.Router();

router.route("")
  .get(getPaginatedNews)
  .post(createNews)

// router.route("/:id")
  // .put()
  // .delete();

export default router;