export interface NewsQuery {
  page?: number,
  limit?: number
}

export interface NewsPayload {
  title: string;
  description: string;
  dateTime: Date,
  location: string;
  category: string;
  priority: string;
}

export type CreateNewsRequest = NewsPayload;
export type UpdateNewsRequest = Partial<NewsPayload>