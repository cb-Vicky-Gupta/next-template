export interface FilterParams {
  [key: string]: string | number | undefined;
}
export const getFilters = (filters: FilterParams) => {
  const where: any = {};
  for (const key in filters) {
    const value = filters[key];
    if (value !== undefined && value !== "") {
      where[key] = typeof value === "string" ? { contains: value, mode: "insensitive" } : value;
    }
  }
  return where;
};
