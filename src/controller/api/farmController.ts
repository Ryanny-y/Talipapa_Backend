import * as farmService from "../../service/api/farmService";
import { Request, Response } from "express";
import { handleError } from "../../utils/errorResponseHandler"

export const getFarm = async (request: Request, response: Response) => {
  try {
    const result = await farmService.getFarm();
    response.json(result);
  } catch (error) {
    handleError(error, response);
  }
}

// export const createFarm = async (request: Request<{}, {}, {}>, response: Response) => {
//   try {
//     const createdFarm = await farmService.createFarm(request.body);
//     response.status(201).json(createdFarm);
//   } catch (error) {
//     handleError(error, response);
//   }
// }