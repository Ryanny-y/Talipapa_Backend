"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAchievement = exports.updateAchievement = exports.createAchievement = exports.getPaginatedAchievements = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CustomError_1 = require("../../error/CustomError");
const Achievement_1 = __importDefault(require("../../model/Achievement"));
const deleteFromS3_1 = __importDefault(require("../../utils/deleteFromS3"));
const getPaginatedAchievements = async (page, limit) => {
    if (page < 1 || limit < 1) {
        throw new CustomError_1.CustomError(400, "Page and limit must be a positive integers.");
    }
    const skip = (page - 1) * limit;
    const totalItems = await Achievement_1.default.countDocuments();
    const data = await Achievement_1.default.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
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
exports.getPaginatedAchievements = getPaginatedAchievements;
const createAchievement = async (achievementDetails, image) => {
    const { title, description, link } = achievementDetails;
    if (!title || !description)
        throw new CustomError_1.CustomError(400, "Title and Description is required!");
    if (!image)
        throw new CustomError_1.CustomError(400, "Achievement Photo is required!");
    const existingAchievement = await Achievement_1.default.findOne({ title });
    if (existingAchievement)
        throw new CustomError_1.CustomError(409, "Achievement already exists");
    const createdAchievement = await Achievement_1.default.create({
        title,
        description,
        link,
        image: {
            url: image.location,
            key: image.key,
            originalName: image.originalname,
            size: image.size,
            mimetype: image.mimetype
        }
    });
    return createdAchievement;
};
exports.createAchievement = createAchievement;
const updateAchievement = async (id, achievementDetails, image) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        throw new CustomError_1.CustomError(400, "Achievement ID is invalid!");
    const existingAchievement = await Achievement_1.default.findById(id);
    if (!existingAchievement)
        throw new CustomError_1.CustomError(404, `Achievement not found with ID: ${id}`);
    const { title, description, link } = achievementDetails;
    if (title && title !== existingAchievement.title) {
        const existingTitle = await Achievement_1.default.findOne({
            title,
            _id: { $ne: id }
        }).lean();
        if (existingTitle) {
            throw new CustomError_1.CustomError(409, `Achievement with title ${title} already exists`);
        }
    }
    const fieldsToUpdate = {};
    if (title)
        fieldsToUpdate.title = title;
    if (description)
        fieldsToUpdate.description = description;
    if (link)
        fieldsToUpdate.link = link;
    if (image) {
        if (existingAchievement.image && existingAchievement.image.key) {
            await (0, deleteFromS3_1.default)(image.key);
        }
        fieldsToUpdate.image = {
            url: image.location,
            key: image.key,
            originalName: image.originalname,
            size: image.size,
            mimetype: image.mimetype,
        };
    }
    const updatedAchievement = await Achievement_1.default.findByIdAndUpdate(id, { $set: fieldsToUpdate }, { new: true, runValidators: true });
    if (!updatedAchievement)
        throw new CustomError_1.CustomError(500, `Unexpected error: Achievement update failed for ID ${id}.`);
    return updatedAchievement;
};
exports.updateAchievement = updateAchievement;
const deleteAchievement = async (id) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        throw new CustomError_1.CustomError(400, `Achievement ID: ${id} is invalid`);
    const deletedAchievement = await Achievement_1.default.findByIdAndDelete(id);
    if (!deletedAchievement)
        throw new CustomError_1.CustomError(404, `Achievement not found with ID: ${id}`);
    if (deletedAchievement.image?.key) {
        await (0, deleteFromS3_1.default)(deletedAchievement.image.key);
    }
    return deletedAchievement;
};
exports.deleteAchievement = deleteAchievement;
