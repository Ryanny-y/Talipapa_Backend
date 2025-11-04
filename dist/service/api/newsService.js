"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNews = exports.updateNews = exports.createNews = exports.getPaginatedNews = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CustomError_1 = require("../../error/CustomError");
const News_1 = __importDefault(require("../../model/News"));
const getPaginatedNews = async (page, limit) => {
    if (page < 1 || limit < 1) {
        throw new CustomError_1.CustomError(400, "Page and limit must be a positive integers.");
    }
    const skip = (page - 1) * limit;
    const totalItems = await News_1.default.countDocuments();
    const data = await News_1.default.find()
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
exports.getPaginatedNews = getPaginatedNews;
const createNews = async (newsDetails) => {
    const { title, description, dateTime, location, category, priority } = newsDetails;
    if (!title ||
        !description ||
        !dateTime ||
        !location ||
        !category ||
        !priority) {
        throw new CustomError_1.CustomError(400, "All Fields Are Required!");
    }
    const existingNews = await News_1.default.findOne({ title });
    if (existingNews)
        throw new CustomError_1.CustomError(409, `News already exists with Title: ${title}`);
    const priorities = ["LOW", "MEDIUM", "HIGH"];
    if (!priorities.includes(priority)) {
        throw new CustomError_1.CustomError(400, "Invalid Priority! Should be: LOW, MEDIUM or HIGH only!");
    }
    return await News_1.default.create(newsDetails);
};
exports.createNews = createNews;
const updateNews = async (id, newsDetails) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new CustomError_1.CustomError(400, "Invalid News ID!");
    }
    const existingNews = await News_1.default.findById(id);
    if (!existingNews) {
        throw new CustomError_1.CustomError(404, `News not found with ID: ${id}`);
    }
    const { title, description, dateTime, location, category, priority } = newsDetails;
    if (title && title !== existingNews.title) {
        const existingTitle = await News_1.default.findOne({
            title: title,
            _id: { $ne: id },
        });
        if (existingTitle) {
            throw new CustomError_1.CustomError(409, `News already exists with Title: ${title}`);
        }
    }
    const fieldsToUpdate = {};
    if (title)
        fieldsToUpdate.title = title;
    if (description)
        fieldsToUpdate.description = description;
    if (dateTime)
        fieldsToUpdate.dateTime = dateTime;
    if (location)
        fieldsToUpdate.location = location;
    if (category)
        fieldsToUpdate.category = category;
    if (priority)
        fieldsToUpdate.priority = priority;
    const updatedNews = await News_1.default.findByIdAndUpdate(id, { $set: fieldsToUpdate }, { new: true, runValidators: true });
    if (!updatedNews) {
        throw new CustomError_1.CustomError(500, `Unexpected error: News update failed for ID ${id}.)`);
    }
    return updatedNews;
};
exports.updateNews = updateNews;
const deleteNews = async (id) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new CustomError_1.CustomError(400, "Invalid News ID!");
    }
    const deletedNews = await News_1.default.findByIdAndDelete(id);
    if (!deletedNews)
        throw new CustomError_1.CustomError(404, `News not found with ID ${id}.)`);
    return deletedNews;
};
exports.deleteNews = deleteNews;
