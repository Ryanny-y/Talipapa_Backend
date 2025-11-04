import mongoose from "mongoose";
import { CustomError } from "../../error/CustomError";
import Product, { IProduct } from "../../model/Products";
import { CreateProductRequest, ProductPayload, UpdateProductRequest } from "../../types/api/product/request";
import { PaginatedProductResponse } from "../../types/api/product/response";
import { MulterS3File } from "../../types/express";
import deleteFromS3 from "../../utils/deleteFromS3";

export const getPaginatedProducts = async (page: number, limit: number): Promise<PaginatedProductResponse> => {
  const skip = (page - 1) * limit;

  const totalItems = await Product.countDocuments();
  const data = await Product.find()
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
  }
};

export const createProduct = async (productDetails: CreateProductRequest, productImage: MulterS3File | undefined): Promise<IProduct> => {
  const { name, description, category, subCategory, stocks, requiredPoints } = productDetails

  if (!name || !description || !category || !subCategory || !requiredPoints) throw new CustomError(400, "All Fields are Required!");

  if(isNaN(stocks) || isNaN(requiredPoints) || stocks < 0 || requiredPoints <= 0) throw new CustomError(400, "Stocks and Required points must be a positive integer.");

  if(!productImage) throw new CustomError(400, "Product Image is required!");
  
  const categories = ["Agricultural", "Non-Agricultural"];
  const isValidCategory = categories.includes(category);
  if(!isValidCategory) throw new CustomError(400, "Invalid Product Category. Must be Agricultural and Non-Agricultural only.");

  const existingProduct = await Product.findOne({ name }).lean();
  if(existingProduct) throw new CustomError(409, `Product with the name ${name} already exists`);

  const newProduct: IProduct = await Product.create({
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
}

export const updateProduct = async (id: string, productDetails: UpdateProductRequest, productImage: MulterS3File | undefined ): Promise<IProduct> => {
  if(!mongoose.Types.ObjectId.isValid(id)) throw new CustomError(400, `Product ID: ${id} is invalid.`);

  const existingProduct = await Product.findById(id);
  if(!existingProduct) throw new CustomError(404, `Product with ID: ${id} not found.`);

  const { name, description, category, subCategory, stocks, requiredPoints } = productDetails


  if(name && name !== existingProduct.name) {
    const existingName = await Product.findOne({
      name,
      _id: { $ne: id }
    })
    if(existingName) throw new CustomError(409, `Product with name ${name} already exists.`);
  }

  if(stocks !== undefined) {
    if(isNaN(stocks) || stocks < 0 ) throw new CustomError(400, "Stocks must be a positive integer.");
  }

  if(requiredPoints !== undefined) {
    if(isNaN(requiredPoints) || requiredPoints < 0 ) throw new CustomError(400, "Required Points must be a positive integer.");
  }

  if(category) {
    const categories = ["Agricultural", "Non-Agricultural"];
    const isValidCategory = categories.includes(category);
    if(!isValidCategory) throw new CustomError(400, "Invalid Product Category. Must be Agricultural and Non-Agricultural only.");
  }

  const fieldsToUpdate: Record<string, any> = {};
  if (name) fieldsToUpdate.name = name;
  if (description) fieldsToUpdate.description = description;
  if (category) fieldsToUpdate.category = category;
  if (subCategory) fieldsToUpdate.subCategory = subCategory;
  if (stocks !== undefined) fieldsToUpdate.stocks = stocks;
  if (requiredPoints !== undefined) fieldsToUpdate.requiredPoints = requiredPoints;

  if(productImage) {
    if(existingProduct.image && existingProduct.image.key) {
      await deleteFromS3(existingProduct.image.key);
    }

    fieldsToUpdate.image = {
      url: productImage.location,
      key: productImage.key,
      originalName: productImage.originalname,
      size: productImage.size,
      mimetype: productImage.mimetype
    }
  };

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { $set: fieldsToUpdate },
    { new: true, runValidators: true }
  );

  if (!updatedProduct) throw new CustomError(500, `Unexpected error: Product update failed for ID ${id}.`);

  return updatedProduct;
} 