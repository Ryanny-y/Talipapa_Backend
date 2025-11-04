import { PaginatedResponse } from "../..";
import { IProduct } from "../../../model/Products";

interface ProductResponse {
  message: string;
  data: IProduct
}

export type PaginatedProductResponse = PaginatedResponse<IProduct>;
export type CreateProductResponse = ProductResponse;
export type UpdateProductResponse = ProductResponse;