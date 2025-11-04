"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMaterial = exports.getPaginatedMaterials = void 0;
const CustomError_1 = require("../../error/CustomError");
const Material_1 = __importDefault(require("../../model/Material"));
const getPaginatedMaterials = async (page, limit) => {
    const skip = (page - 1) * limit;
    const totalItems = await Material_1.default.countDocuments();
    const data = await Material_1.default.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    const totalPages = Math.ceil(totalItems / limit);
    return {
        data,
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page * limit < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page * limit < totalItems ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
    };
};
exports.getPaginatedMaterials = getPaginatedMaterials;
const createMaterial = async (materialDetails, materialImage) => {
    const { name, description, pointsPerKg } = materialDetails;
    if (!name || pointsPerKg === undefined)
        throw new CustomError_1.CustomError(400, "Material name and points per kilogram is required.");
    if (isNaN(pointsPerKg) || pointsPerKg <= 0)
        throw new CustomError_1.CustomError(400, "Point per kilogram is must be a positive integer.");
    if (!materialImage)
        throw new CustomError_1.CustomError(400, "Material image is required.");
    const existingMaterial = await Material_1.default.findOne({ name }).lean();
    if (existingMaterial)
        throw new CustomError_1.CustomError(409, `Material with name ${name} already exists.`);
    const newMaterialData = await Material_1.default.create({
        name,
        description,
        image: {
            url: materialImage.location,
            key: materialImage.key,
            originalName: materialImage.originalname,
            size: materialImage.size,
            mimetype: materialImage.mimetype,
        },
    });
    return newMaterialData;
};
exports.createMaterial = createMaterial;
