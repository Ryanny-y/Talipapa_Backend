"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getPaginatedProducts = void 0;
const productService = __importStar(require("../../service/api/productService"));
const errorResponseHandler_1 = require("../../utils/errorResponseHandler");
const getPaginatedProducts = async (request, response) => {
    try {
        const page = Number(request.query.page) || 1;
        const limit = Number(request.query.limit) || 10;
        const result = await productService.getPaginatedProducts(page, limit);
        response.json(result);
    }
    catch (error) {
        (0, errorResponseHandler_1.handleError)(error, response);
    }
};
exports.getPaginatedProducts = getPaginatedProducts;
const createProduct = async (request, response) => {
    try {
        const productImage = request.file;
        const createdProduct = await productService.createProduct(request.body, productImage);
        const responsePayload = {
            message: `Product ${createdProduct.name} created successfully!`,
            data: createdProduct
        };
        response.status(201).json(responsePayload);
    }
    catch (error) {
        (0, errorResponseHandler_1.handleError)(error, response);
    }
};
exports.createProduct = createProduct;
const updateProduct = async (request, response) => {
    try {
        const { id } = request.params;
        const productImage = request.file;
        const updatedProduct = await productService.updateProduct(id, request.body, productImage);
        const payloadResponse = {
            message: `Product ${updatedProduct.name} updated successfully!`,
            data: updatedProduct
        };
        response.json(payloadResponse);
    }
    catch (error) {
        (0, errorResponseHandler_1.handleError)(error, response);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (request, response) => {
    try {
        const { id } = request.params;
        const deletedProduct = await productService.deleteProduct(id);
        response.json({ message: `Product ${deletedProduct.name} deleted successfully!` });
    }
    catch (error) {
        (0, errorResponseHandler_1.handleError)(error, response);
    }
};
exports.deleteProduct = deleteProduct;
