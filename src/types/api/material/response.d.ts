import { PaginatedResponse } from "../..";
import { IMaterial } from "../../../model/Material";

interface MaterialResponse {
  message: string,
  data: IMaterial
} 

export type PaginatedMaterialResponse = PaginatedResponse<IMaterial>;
export type CreateMaterialResponse = MaterialResponse;
export type UpdateMaterialResponse = MaterialResponse;