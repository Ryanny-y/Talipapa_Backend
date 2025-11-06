import * as recordService from '../../service/api/recordService';
import { Request, Response } from "express";
import { ErrorResponse, PaginatedResponse, SearchRecordQuery } from '../../types';
import { handleError } from '../../utils/errorResponseHandler';
import { IRecord } from '../../model/Record';
import { ApiResponse, CreateRecordRequest, UpdateRecordRequest } from '../../types/api/api-types';

export const getPaginatedRecords = async (
  request: Request<{}, {}, {}, SearchRecordQuery>, 
  response: Response<PaginatedResponse<IRecord> | ErrorResponse>
) => {
  try {
    const { residentStatus = "resident" } = request.query;
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;

    const result = await recordService.getPaginatedRecords(page, limit, residentStatus);
    response.json(result);

  } catch (error) {
    handleError(error, response);
  }
};

export const createRecord = async (request: Request<{}, {}, CreateRecordRequest>, response: Response<ApiResponse<IRecord>>) => {
  try {
    const createdRecord: IRecord = await recordService.createRecord(request.body);
    const responsePayload: ApiResponse<IRecord> = {
      success: true,
      message: `Record ${createdRecord.firstName} ${createdRecord.lastName} created successfully.`,
      data: createdRecord
    }
    
    response.status(201).json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
}

export const updateRecord = async (
  request: Request<{ id: string }, {}, UpdateRecordRequest>,
  response: Response<ApiResponse<IRecord>>
) => {
  try {
    const { id } = request.params;
    const updatedRecord: IRecord = await recordService.updateRecord(id, request.body);
    const responsePayload: ApiResponse<IRecord> = {
      success: true,
      message: `Record ${updatedRecord.firstName} ${updatedRecord.lastName} updated successfully.`,
      data: updatedRecord
    }

    response.json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
};

export const deleteRecord = async (
  request: Request<{ id: string }>,
  response: Response<ApiResponse<IRecord>>
) => {
  try {
    const { id } = request.params;
    const deletedRecord = await recordService.deleteRecord(id);
    const responsePayload: ApiResponse<IRecord> = {
      success: true,
      message: `Record ${deletedRecord.firstName} ${deletedRecord.lastName} deleted successfully.`,
      data: deletedRecord
    }

    response.json(responsePayload);
  } catch (error) {
  }
};

export const searchRecords = async (
  request: Request<{}, {}, {}, SearchRecordQuery>, 
  response: Response<PaginatedResponse<IRecord> | ErrorResponse>
) => {
  try {
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;
    const { residentStatus = "resident", query = "" } = request.query;
    const result = await recordService.searchRecords(page, limit, query, residentStatus);

    response.json(result);
  } catch (error) {
    handleError(error, response);
  }
}