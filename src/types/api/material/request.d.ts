export interface MaterialRequest {
  name: string;
  description?: string;
  pointsPerKg: number;
  image: ImageInterface;
}

export type CreateMaterialRequest = MaterialRequest;
export type UpdateMaterialRequest = Partial<MaterialRequest>