"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controller/authController");
const verifyJwt_1 = __importDefault(require("../middleware/verifyJwt"));
const verifyRoles_1 = __importDefault(require("../middleware/verifyRoles"));
const roles_1 = require("../config/roles");
const router = express_1.default.Router();
router.post("/create", verifyJwt_1.default, (0, verifyRoles_1.default)(roles_1.Roles.SUPER_ADMIN), authController_1.createAdmin);
router.post("/login", authController_1.loginAdmin);
router.post("/refreshToken", authController_1.refreshToken);
exports.default = router;
