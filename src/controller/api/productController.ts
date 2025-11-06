import { Request, Response } from "express";
import * as productService from '../../service/api/productService';
import { handleError } from "../../utils/errorResponseHandler";
import { ErrorResponse, PaginatedResponse, PaginationRequestQuery } from "../../types";
import { IProduct } from "../../model/Products";
import { ApiResponse, CreateProductRequest, UpdateProductRequest } from "../../types/api/api-types";

export const getPaginatedProducts = async (request: Request<{}, {}, {}, PaginationRequestQuery>, response: Response<PaginatedResponse<IProduct> | ErrorResponse>) => {
  try {
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;

    const result: PaginatedResponse<IProduct> = await productService.getPaginatedProducts(page, limit);

    response.json(result);
  } catch (error) {
    handleError(error, response);
  }
}

export const createProduct = async (request: Request<{}, {}, CreateProductRequest>, response: Response<ApiResponse<IProduct>>) => {
  try {
    const productImage = request.file
    const createdProduct: IProduct = await productService.createProduct(request.body, productImage);
    const responsePayload: ApiResponse<IProduct> = {
      success: true,
      message: `Product ${createdProduct.name} created successfully!`,
      data: createdProduct
    }

    response.status(201).json(responsePayload);
  } catch (error) {
    handleError(error, response)
  }
}

export const updateProduct = async (request: Request<{ id: string }, {}, UpdateProductRequest>, response: Response<ApiResponse<IProduct>>) => {
  try {
    const { id } = request.params;
    const productImage = request.file
    const updatedProduct: IProduct = await productService.updateProduct(id, request.body, productImage);
    const payloadResponse: ApiResponse<IProduct> = {
      success: true,
      message: `Product ${updatedProduct.name} updated successfully!`,
      data: updatedProduct
    }

    response.json(payloadResponse);
  } catch (error) {
    handleError(error, response);
  }
}

export const deleteProduct = async (request: Request<{ id: string }>, response: Response<ApiResponse<IProduct>>) => {
  try {
    const { id } = request.params;
    const deletedProduct: IProduct = await productService.deleteProduct(id);
    const payloadResponse: ApiResponse<IProduct> = {
      success: true,
      message: `Product ${deletedProduct.name} deleted successfully!`,
      data: deletedProduct
    }

    response.json(payloadResponse);
  } catch (error) {
    handleError(error, response);
  }
}