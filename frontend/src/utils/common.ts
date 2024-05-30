import { UsersFilterParams } from "../store/api-actions";
import { Gender } from "../types";

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

export function formatGender(gender: Gender): string {
  switch (gender) {
    case Gender.Woman:
      return 'для_женщин';
    case Gender.Man:
      return 'для_мужчин';
    case Gender.Unknown:
    default:
      return 'для_всех';
  }
}

export function clearEmptyFields<T>(object: T): Partial<T> {
  const cleanedFilter: Partial<T> = {};
  for (const key in object) {
    if (object[key] !== null && object[key] !== undefined && object[key] !== '') {
      cleanedFilter[key] = object[key];
    }
  }
  return cleanedFilter;
}
