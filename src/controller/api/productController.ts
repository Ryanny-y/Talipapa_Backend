import { Request, Response } from "express";
import * as productService from '../../service/api/productService';
import { handleError } from "../../utils/errorResponseHandler";
import { ErrorResponse, PaginationRequestQuery } from "../../types";
import { CreateProductResponse, PaginatedProductResponse } from "../../types/api/product/response";
import { CreateProductRequest } from "../../types/api/product/request";
import { IProduct } from "../../model/Products";

export const getPaginatedProducts = async (request: Request<{}, {}, {}, PaginationRequestQuery>, response: Response<PaginatedProductResponse | ErrorResponse>) => {
  try {
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;

    const result: PaginatedProductResponse = await productService.getPaginatedProducts(page, limit);

    response.json(result);
  } catch (error) {
    handleError(error, response);
  }
}

export const createProduct = async (request: Request<{}, {}, CreateProductRequest>, response: Response<CreateProductResponse | ErrorResponse>) => {
  try {
    const productImage = request.file;
    const createdProduct: IProduct = await productService.createProduct(request.body, productImage);
    const responsePayload: CreateProductResponse = {
      message: `Product ${createdProduct.name} created successfully!`,
      data: createdProduct
    }

    response.status(201).json(responsePayload);
  } catch (error) {
    handleError(error, response)
  }
}

