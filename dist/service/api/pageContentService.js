"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePageContent = exports.createPageContent = exports.getPageContent = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CustomError_1 = require("../../error/CustomError");
const PageContent_1 = __importDefault(require("../../model/PageContent"));
const deleteFromS3_1 = __importDefault(require("../../utils/deleteFromS3"));
const getPageContent = async () => {
    const result = await PageContent_1.default.findOne().lean();
    if (!result) {
        throw new CustomError_1.CustomError(404, "No available page content");
    }
    return result;
};
exports.getPageContent = getPageContent;
const createPageContent = async (pageContentDetails, barangayLogo) => {
    const { mission, vision, barangayName, barangayDescription, barangayHistory } = pageContentDetails;
    if (!mission || !vision || !barangayName || !barangayDescription || !barangayHistory) {
        throw new CustomError_1.CustomError(400, "All fields are required!");
    }
    const pageContentCount = await PageContent_1.default.countDocuments();
    if (pageContentCount > 0) {
        throw new CustomError_1.CustomError(400, "Barangay Content already exists");
    }
    if (!barangayLogo) {
        throw new CustomError_1.CustomError(400, "Barangay Logo is required!");
    }
    const createdPageContent = await PageContent_1.default.create({
        mission,
        vision,
        barangayName,
        barangayDescription,
        barangayHistory,
        barangayLogo: {
            url: barangayLogo.location,
            key: barangayLogo.key,
            originalName: barangayLogo.originalname,
            size: barangayLogo.size,
            mimetype: barangayLogo.mimetype,
        }
    });
    return createdPageContent;
};
exports.createPageContent = createPageContent;
const updatePageContent = async (id, pageContentDetails, barangayLogo) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new CustomError_1.CustomError(400, "Invalid Page Content ID!");
    }
    const existingPageContent = await PageContent_1.default.findById(id);
    if (!existingPageContent) {
        throw new CustomError_1.CustomError(400, `Page Content not found with ID: ${id}`);
    }
    const { mission, vision, barangayName, barangayDescription, barangayHistory } = pageContentDetails;
    const fieldsToUpdate = {};
    if (mission)
        fieldsToUpdate.mission = mission;
    if (vision)
        fieldsToUpdate.vision = vision;
    if (barangayName)
        fieldsToUpdate.barangayName = barangayName;
    if (barangayDescription)
        fieldsToUpdate.barangayDescription = barangayDescription;
    if (barangayHistory)
        fieldsToUpdate.barangayHistory = barangayHistory;
    if (barangayLogo) {
        if (existingPageContent.barangayLogo && existingPageContent.barangayLogo.key) {
            await (0, deleteFromS3_1.default)(existingPageContent.barangayLogo.key);
        }
        fieldsToUpdate.barangayLogo = {
            url: barangayLogo.location,
            key: barangayLogo.key,
            originalName: barangayLogo.originalname,
            size: barangayLogo.size,
            mimetype: barangayLogo.mimetype,
        };
    }
    const updatedPageContent = await PageContent_1.default.findByIdAndUpdate(id, { $set: fieldsToUpdate }, { new: true, runValidators: true });
    if (!updatedPageContent)
        throw new CustomError_1.CustomError(500, `Unexpected error: Page Content update failed for ID ${id}.`);
    return updatedPageContent;
};
exports.updatePageContent = updatePageContent;
