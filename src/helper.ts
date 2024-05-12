import type { PaginationQueryParams } from "./interface";

export const convertToQueryParams = (
  queryParams: PaginationQueryParams,
): string => {
  const queryString = Object.entries(queryParams)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => {
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        return `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`;
      } else {
        console.error(`Invalid query parameter value for key "${key}":`, value);
        return "";
      }
    })
    .filter((param) => param !== "")
    .join("&");

  return queryString;
};
