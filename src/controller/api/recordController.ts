import * as recordService from '../../service/api/recordService';
import { Request, Response } from "express";
import { ErrorResponse, PaginationRequestQuery } from '../../types';
import { CreateRecordResponse, PaginatedRecordResponse } from '../../types/api/record/response';
import { handleError } from '../../utils/errorResponseHandler';
import { CreateRecordRequest, UpdateRecordRequest } from '../../types/api/record/request';
import { IRecord } from '../../model/Record';

export const getPaginatedRecords = async (request: Request<{}, {}, {}, PaginationRequestQuery>, response: Response<PaginatedRecordResponse | ErrorResponse>) => {
  try {
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;

    const result = await recordService.getPaginatedRecords(page, limit);
    response.json(result);
  } catch (error) {
    handleError(error, response);
  }
};

export const createRecord = async (request: Request<{}, {}, CreateRecordRequest>, response: Response<CreateRecordResponse | ErrorResponse>) => {
  try {
    const createdRecord: IRecord = await recordService.createRecord(request.body);
    const recordPayload: CreateRecordResponse = {
      message: `Record ${createdRecord.firstName} ${createdRecord.lastName} created successfully.`,
      data: createdRecord
    }
    
    response.json(recordPayload);
  } catch (error) {
    handleError(error, response);
  }
}

// export const updateRecord = async (
//   request: Request<{ id: string }, {}, UpdateRecordRequest>,
//   response: Response<{ message: string; data: IRecord } | ErrorResponse>
// ) => {
//   try {
//     const { id } = request.params;
//     const updatedRecord = await recordService.updateRecord(id, request.body);

//     response.json({
//       message: `Record ${updatedRecord.firstName} ${updatedRecord.lastName} updated successfully.`,
//       data: updatedRecord,
//     });
//   } catch (error) {
//     handleError(error, response);
//   }
// };