import { UsersFilterParams } from "../store/api-actions";

export const removeNullFields = <T extends object>(obj: T): T => {
  const newObj = {} as T;
  Object.keys(obj).forEach((key) => {
    const value = obj[key as keyof T];
    if (value !== null && value !== undefined) {
      newObj[key as keyof T] = value;
    }
  });
  return newObj;
};

export const buildQueryString = (params: UsersFilterParams) => {
  const queryParts: string[] = [];
  Object.keys(params).forEach(key => {
    const value = params[key as keyof typeof params];
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(item => {
          queryParts.push(`${encodeURIComponent(key)}[]=${encodeURIComponent(item)}`);
        });
      } else {
        queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
      }
    }
  });
  return queryParts.join('&');
};

export const capitalizeFirst = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
