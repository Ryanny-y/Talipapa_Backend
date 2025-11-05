interface PageContentPayload {
  mission: string;
  vision: string;
  barangayName: string;
  barangayHistory: string;
  barangayDescription: string;
  youtubeVideoUrl: string;
}

export type CreatePageContentRequest = PageContentPayload;
export type UpdatePageContentRequest = Partial<PageContentPayload>;