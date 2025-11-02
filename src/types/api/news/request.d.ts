export interface NewsQuery {
  page?: number,
  limit?: number
}

export interface CreateNewsRequest {
  title: string;
  description: string;
  dateTime: Date,
  location: string;
  category: string;
  priority: string;
}