import { Request, Response } from "express";
import * as productService from '../../service/api/productService';
import { handleError } from "../../utils/errorResponseHandler";
import { ErrorResponse, PaginationRequestQuery } from "../../types";
import { PaginatedProductResponse } from "../../types/api/product/response";

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

