interface PageContentPayload {
  mission: string;
  vision: string;
  barangayName: string;
  barangayHistory: string;
  barangayDescription: string;
}

export type CreatePageContentRequest = PageContentPayload;