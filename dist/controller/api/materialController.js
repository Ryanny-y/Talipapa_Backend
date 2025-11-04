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
exports.createMaterial = exports.getPaginatedMaterials = void 0;
const materialService = __importStar(require("../../service/api/materialService"));
const errorResponseHandler_1 = require("../../utils/errorResponseHandler");
const getPaginatedMaterials = async (request, response) => {
    try {
        const page = Number(request.query.page) || 1;
        const limit = Number(request.query.limit) || 10;
        const result = await materialService.getPaginatedMaterials(page, limit);
        response.json(result);
    }
    catch (error) {
        (0, errorResponseHandler_1.handleError)(error, response);
    }
};
exports.getPaginatedMaterials = getPaginatedMaterials;
const createMaterial = async (request, response) => {
    try {
        const materialImage = request.file;
        const createdMaterial = await materialService.createMaterial(request.body, materialImage);
        const responsePayload = {
            message: `Material ${createdMaterial.name} created successfully.`,
            data: createdMaterial
        };
        response.status(201).json(responsePayload);
    }
    catch (error) {
        (0, errorResponseHandler_1.handleError)(error, response);
    }
};
exports.createMaterial = createMaterial;
