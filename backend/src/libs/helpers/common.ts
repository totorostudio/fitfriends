import { ValidationError } from 'class-validator';
import dayjs from 'dayjs';

export function transformObjectValuesToString(items: Object) {
  return Object.values(items).join(', ');
}

export function reduceValidationErrors(
  errors: ValidationError[]
) {
  return errors.map(({ property, value, constraints }) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : [],
  }));
}

export function calculatePages(totalItems: number, itemsPerPage: number): number {
  return Math.ceil(totalItems / itemsPerPage);
}
