import Product from "../../model/Products";
import { PaginatedProductResponse } from "../../types/api/product/response";

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

