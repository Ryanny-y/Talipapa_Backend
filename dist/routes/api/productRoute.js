"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyJwt_1 = __importDefault(require("../../middleware/verifyJwt"));
const verifyRoles_1 = __importDefault(require("../../middleware/verifyRoles"));
const roles_1 = require("../../config/roles");
const productController_1 = require("../../controller/api/productController");
const upload_1 = __importDefault(require("../../middleware/upload"));
const router = express_1.default.Router();
router.route("/")
    .get(productController_1.getPaginatedProducts)
    .post(verifyJwt_1.default, (0, verifyRoles_1.default)(roles_1.Roles.SUPER_ADMIN), upload_1.default.single("productImage"), productController_1.createProduct);
router.route("/:id")
    .all(verifyJwt_1.default, (0, verifyRoles_1.default)(roles_1.Roles.SUPER_ADMIN))
    .patch(upload_1.default.single("productImage"), productController_1.updateProduct)
    .delete(productController_1.deleteProduct);
exports.default = router;
