"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pageContentController_1 = require("../../controller/api/pageContentController");
const verifyJwt_1 = __importDefault(require("../../middleware/verifyJwt"));
const upload_1 = __importDefault(require("../../middleware/upload"));
const verifyRoles_1 = __importDefault(require("../../middleware/verifyRoles"));
const roles_1 = require("../../config/roles");
const router = express_1.default.Router();
router.route("")
    .get(pageContentController_1.getPageContent)
    .post(verifyJwt_1.default, (0, verifyRoles_1.default)(roles_1.Roles.SUPER_ADMIN), upload_1.default.single("barangayLogo"), pageContentController_1.createPageContent);
router.patch("/:id", verifyJwt_1.default, (0, verifyRoles_1.default)(roles_1.Roles.SUPER_ADMIN), upload_1.default.single("barangayLogo"), pageContentController_1.updatePageContent);
// For Carousel
// router.route("/:id/carousel", )
//   .get()
//   .post();
// router.patch("/:id/carousel/:carouselItemId", )
// router.delete("/:id/carousel/:carouselItemId", )
exports.default = router;
