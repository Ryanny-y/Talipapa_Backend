import express, { Router } from 'express';
import { getPaginatedNews } from '../../controller/api/newsController';

const router: Router = express.Router();

router.route("")
  .get(getPaginatedNews)
  // .post()

// router.route("/:id")
  // .put()
  // .delete();

export default router;