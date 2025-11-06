import { Request, Response } from "express";
import * as productService from '../../service/api/productService';
import { handleError } from "../../utils/errorResponseHandler";
import { ErrorResponse, PaginationRequestQuery } from "../../types";
import { CreateProductResponse, DeleteProductResponse, PaginatedProductResponse, UpdateProductResponse } from "../../types/api/product/response";
import { CreateProductRequest, UpdateProductRequest } from "../../types/api/product/request";
import { IProduct } from "../../model/Products";
import deleteFromS3 from "../../utils/deleteFromS3";
import { MulterS3File } from "../../types/express";

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
    const productImage = request.file
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

export const updateProduct = async (request: Request<{ id: string }, {}, UpdateProductRequest>, response: Response<UpdateProductResponse | ErrorResponse>) => {
  try {
    const { id } = request.params;
    const productImage = request.file
    const updatedProduct: IProduct = await productService.updateProduct(id, request.body, productImage);
    const payloadResponse: UpdateProductResponse = {
      message: `Product ${updatedProduct.name} updated successfully!`,
      data: updatedProduct
    }
    response.json(payloadResponse);
  } catch (error) {
    handleError(error, response);
  }
}

export const deleteProduct = async (request: Request<{ id: string }>, response: Response<DeleteProductResponse | ErrorResponse>) => {
  try {
    const { id } = request.params;
    const deletedProduct: IProduct = await productService.deleteProduct(id);
    
    
    response.json({ message: `Product ${deletedProduct.name} deleted successfully!`})
  } catch (error) {
    handleError(error, response);
  }
}