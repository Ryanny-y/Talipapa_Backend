import { CustomError } from "../../error/CustomError";
import Product, { IProduct } from "../../model/Products";
import { ProductPayload } from "../../types/api/product/request";
import { PaginatedProductResponse } from "../../types/api/product/response";
import { MulterS3File } from "../../types/express";

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

export const createProduct = async (productDetails: ProductPayload, productImage: MulterS3File | undefined): Promise<IProduct> => {
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

