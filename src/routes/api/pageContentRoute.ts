import express, { Router } from 'express';
import { getPageContent } from '../../controller/api/pageContentController';

const router: Router = express.Router();

router.route("")
  .get(getPageContent)
//   .post()
// router.patch("/:id");


// For Carousel
// router.route("/:id/carousel", )
//   .get()
//   .post();
// router.patch("/:id/carousel/:carouselItemId", )
// router.delete("/:id/carousel/:carouselItemId", )


export default router;