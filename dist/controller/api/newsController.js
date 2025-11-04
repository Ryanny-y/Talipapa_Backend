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
exports.deleteNews = exports.updateNews = exports.createNews = exports.getPaginatedNews = void 0;
const newsService = __importStar(require("../../service/api/newsService"));
const errorResponseHandler_1 = require("../../utils/errorResponseHandler");
const CustomError_1 = require("../../error/CustomError");
const getPaginatedNews = async (request, response) => {
    try {
        const page = Number(request.query.page) || 1;
        const limit = Number(request.query.limit) || 10;
        const result = await newsService.getPaginatedNews(page, limit);
        response.json(result);
    }
    catch (error) {
        (0, errorResponseHandler_1.handleError)(error, response);
    }
};
exports.getPaginatedNews = getPaginatedNews;
const createNews = async (request, response) => {
    try {
        const createdNews = await newsService.createNews(request.body);
        const responsePayload = {
            message: 'News Created',
            data: createdNews
        };
        response.status(201).json(responsePayload);
    }
    catch (error) {
        (0, errorResponseHandler_1.handleError)(error, response);
    }
};
exports.createNews = createNews;
const updateNews = async (request, response) => {
    try {
        const { id } = request.params;
        if (!id)
            throw new CustomError_1.CustomError(400, "ID is required to update news!");
        const updatedNews = await newsService.updateNews(id, request.body);
        const responsePayload = {
            message: `News ${updatedNews.title} Updated`,
            data: updatedNews
        };
        return response.json(responsePayload);
    }
    catch (error) {
        (0, errorResponseHandler_1.handleError)(error, response);
    }
};
exports.updateNews = updateNews;
const deleteNews = async (request, response) => {
    try {
        const { id } = request.params;
        const deletedNews = await newsService.deleteNews(id);
        response.json({ message: `News "${deletedNews.title}" deleted successfully!` });
    }
    catch (error) {
        (0, errorResponseHandler_1.handleError)(error, response);
    }
};
exports.deleteNews = deleteNews;
