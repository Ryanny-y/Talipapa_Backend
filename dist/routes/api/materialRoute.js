"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const materialController_1 = require("../../controller/api/materialController");
const verifyJwt_1 = __importDefault(require("../../middleware/verifyJwt"));
const verifyRoles_1 = __importDefault(require("../../middleware/verifyRoles"));
const roles_1 = require("../../config/roles");
const upload_1 = __importDefault(require("../../middleware/upload"));
const router = express_1.default.Router();
router.route("")
    .get(materialController_1.getPaginatedMaterials)
    .post(verifyJwt_1.default, (0, verifyRoles_1.default)(roles_1.Roles.SUPER_ADMIN), upload_1.default.single("materialImage"), materialController_1.createMaterial);
exports.default = router;
