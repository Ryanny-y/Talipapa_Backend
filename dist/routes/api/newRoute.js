"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const newsController_1 = require("../../controller/api/newsController");
const verifyJwt_1 = __importDefault(require("../../middleware/verifyJwt"));
const verifyRoles_1 = __importDefault(require("../../middleware/verifyRoles"));
const roles_1 = require("../../config/roles");
const router = express_1.default.Router();
router.route("")
    .get(newsController_1.getPaginatedNews)
    .post(verifyJwt_1.default, (0, verifyRoles_1.default)(roles_1.Roles.SUPER_ADMIN), newsController_1.createNews);
router.route("/:id")
    .put(verifyJwt_1.default, (0, verifyRoles_1.default)(roles_1.Roles.SUPER_ADMIN), newsController_1.updateNews)
    .delete(verifyJwt_1.default, (0, verifyRoles_1.default)(roles_1.Roles.SUPER_ADMIN), newsController_1.deleteNews);
exports.default = router;
