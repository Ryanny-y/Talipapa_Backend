import express, { Router } from 'express';
import { createPageContent, getPageContent, updatePageContent } from '../../controller/api/pageContentController';
import verifyJwt from '../../middleware/verifyJwt';
import upload from '../../middleware/upload';
import verifyRoles from '../../middleware/verifyRoles';
import { Roles } from '../../config/roles';

const router: Router = express.Router();

router.route("")
  .get(getPageContent)
  .post(verifyJwt, verifyRoles(Roles.SUPER_ADMIN), upload.single("barangayLogo"), createPageContent)
router.patch("/:id", verifyJwt, verifyRoles(Roles.SUPER_ADMIN), upload.single("barangayLogo"), updatePageContent);


// For Carousel
// router.route("/:id/carousel", )
//   .get()
//   .post();
// router.patch("/:id/carousel/:carouselItemId", )
// router.delete("/:id/carousel/:carouselItemId", )


export default router;