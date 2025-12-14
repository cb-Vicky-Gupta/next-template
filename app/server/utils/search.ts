export const getSearchQuery = (fields: string[], search?: string) => {
  if (!search) return {};

  return {
    OR: fields.map((field) => ({
      [field]: { contains: search, mode: "insensitive" },
    })),
  };
};
