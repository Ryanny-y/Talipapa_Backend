import News, { INews } from "../../model/News";

export const getPaginatedNews = async (page: number, limit: number) : Promise<PaginatedResponse<INews>> => {
  const skip = (page - 1) * limit;

  const totalItems: number = await News.countDocuments();
  const data: INews[] = await News.find().skip(skip).limit(limit);

  return {
    data,
    page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    hasNextPage: page * limit < totalItems,
    hasPreviousPage: page > 1,
    nextPage: page * limit < totalItems ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  }
};
