export type SortOrder = "asc" | "desc";

export interface SortParams {
  sortBy?: string;
  order?: SortOrder;
}

export const getSorting = ({ sortBy = "createdAt", order = "asc" }: SortParams) => {
  return { [sortBy]: order };
};
