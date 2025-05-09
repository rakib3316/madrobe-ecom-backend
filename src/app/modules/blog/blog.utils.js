export function getFilterQuery(filters) {
  const query = {};

  Object.keys(filters).forEach((key) => {
    if (filters[key] !== null) {
      query[key] = Array.isArray(filters[key])
        ? { $in: filters[key] }
        : filters[key];
    }
  });

  return query;
}
