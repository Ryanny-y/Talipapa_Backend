"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const achievementController_1 = require("../../controller/api/achievementController");
const verifyJwt_1 = __importDefault(require("../../middleware/verifyJwt"));
const upload_1 = __importDefault(require("../../middleware/upload"));
const verifyRoles_1 = __importDefault(require("../../middleware/verifyRoles"));
const roles_1 = require("../../config/roles");
const router = express_1.default.Router();
router.route("/")
    .get(achievementController_1.getPaginatedAchievements)
    .post(verifyJwt_1.default, (0, verifyRoles_1.default)(roles_1.Roles.SUPER_ADMIN), upload_1.default.single("image"), achievementController_1.createAchievement);
router.route("/:id")
    .all(verifyJwt_1.default, (0, verifyRoles_1.default)(roles_1.Roles.SUPER_ADMIN))
    .patch(upload_1.default.single("image"), achievementController_1.updateAchievement)
    .delete(achievementController_1.deleteAchievement);
exports.default = router;
