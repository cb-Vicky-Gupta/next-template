export interface PaginationParams {
  page?: number;
  limit?: number;
}

export const getPagination = ({ page = 1, limit = 10 }: PaginationParams) => {
  const take = limit;
  const skip = (page - 1) * limit;
  return { take, skip };
};
