interface ProductPayload {
  name: string;
  description: string;
  category: string;
  subCategory: string;
  stocks: number;
  requiredPoints: number;
}

export type CreateProductRequest = ProductPayload;