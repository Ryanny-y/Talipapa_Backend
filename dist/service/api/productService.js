"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getPaginatedProducts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CustomError_1 = require("../../error/CustomError");
const Products_1 = __importDefault(require("../../model/Products"));
const deleteFromS3_1 = __importDefault(require("../../utils/deleteFromS3"));
const getPaginatedProducts = async (page, limit) => {
    const skip = (page - 1) * limit;
    const totalItems = await Products_1.default.countDocuments();
    const data = await Products_1.default.find()
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
exports.getPaginatedProducts = getPaginatedProducts;
const createProduct = async (productDetails, productImage) => {
    const { name, description, category, subCategory, stocks, requiredPoints } = productDetails;
    if (!name || !description || !category || !subCategory || !requiredPoints)
        throw new CustomError_1.CustomError(400, "All Fields are Required!");
    if (isNaN(stocks) || isNaN(requiredPoints) || stocks < 0 || requiredPoints <= 0)
        throw new CustomError_1.CustomError(400, "Stocks and Required points must be a positive integer.");
    if (!productImage)
        throw new CustomError_1.CustomError(400, "Product Image is required!");
    const categories = ["Agricultural", "Non-Agricultural"];
    const isValidCategory = categories.includes(category);
    if (!isValidCategory)
        throw new CustomError_1.CustomError(400, "Invalid Product Category. Must be Agricultural and Non-Agricultural only.");
    const existingProduct = await Products_1.default.findOne({ name }).lean();
    if (existingProduct)
        throw new CustomError_1.CustomError(409, `Product with the name ${name} already exists`);
    const newProduct = await Products_1.default.create({
        name,
        description,
        category,
        subCategory,
        stocks: Number(stocks),
        requiredPoints: Number(requiredPoints),
        image: {
            url: productImage.location,
            key: productImage.key,
            originalName: productImage.originalname,
            size: productImage.size,
            mimetype: productImage.mimetype
        }
    });
    return newProduct;
};
exports.createProduct = createProduct;
const updateProduct = async (id, productDetails, productImage) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        throw new CustomError_1.CustomError(400, `Product ID: ${id} is invalid.`);
    const existingProduct = await Products_1.default.findById(id);
    if (!existingProduct)
        throw new CustomError_1.CustomError(404, `Product with ID: ${id} not found.`);
    const { name, description, category, subCategory, stocks, requiredPoints } = productDetails;
    if (name && name !== existingProduct.name) {
        const existingName = await Products_1.default.findOne({
            name,
            _id: { $ne: id }
        });
        if (existingName)
            throw new CustomError_1.CustomError(409, `Product with name ${name} already exists.`);
    }
    if (stocks !== undefined) {
        if (isNaN(stocks) || stocks < 0)
            throw new CustomError_1.CustomError(400, "Stocks must be a positive integer.");
    }
    if (requiredPoints !== undefined) {
        if (isNaN(requiredPoints) || requiredPoints < 0)
            throw new CustomError_1.CustomError(400, "Required Points must be a positive integer.");
    }
    if (category) {
        const categories = ["Agricultural", "Non-Agricultural"];
        const isValidCategory = categories.includes(category);
        if (!isValidCategory)
            throw new CustomError_1.CustomError(400, "Invalid Product Category. Must be Agricultural and Non-Agricultural only.");
    }
    const fieldsToUpdate = {};
    if (name)
        fieldsToUpdate.name = name;
    if (description)
        fieldsToUpdate.description = description;
    if (category)
        fieldsToUpdate.category = category;
    if (subCategory)
        fieldsToUpdate.subCategory = subCategory;
    if (stocks !== undefined)
        fieldsToUpdate.stocks = stocks;
    if (requiredPoints !== undefined)
        fieldsToUpdate.requiredPoints = requiredPoints;
    if (productImage) {
        if (existingProduct.image && existingProduct.image.key) {
            await (0, deleteFromS3_1.default)(existingProduct.image.key);
        }
        fieldsToUpdate.image = {
            url: productImage.location,
            key: productImage.key,
            originalName: productImage.originalname,
            size: productImage.size,
            mimetype: productImage.mimetype
        };
    }
    ;
    const updatedProduct = await Products_1.default.findByIdAndUpdate(id, { $set: fieldsToUpdate }, { new: true, runValidators: true });
    if (!updatedProduct)
        throw new CustomError_1.CustomError(500, `Unexpected error: Product update failed for ID ${id}.`);
    return updatedProduct;
};
exports.updateProduct = updateProduct;
const deleteProduct = async (id) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        throw new CustomError_1.CustomError(400, `Product ID: ${id} is invalid.`);
    const deletedProduct = await Products_1.default.findByIdAndDelete(id);
    if (!deletedProduct)
        throw new CustomError_1.CustomError(404, `News not found with ID: ${id}.)`);
    if (deletedProduct.image?.key) {
        await (0, deleteFromS3_1.default)(deletedProduct.image.key);
    }
    return deletedProduct;
};
exports.deleteProduct = deleteProduct;
