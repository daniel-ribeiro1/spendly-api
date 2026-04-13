import { Transform } from 'class-transformer';
import Decimal from 'decimal.js';

export function ToDecimalJs(): PropertyDecorator {
  return Transform(({ value }) => {
    if (value instanceof Decimal) return value;

    if (typeof value !== 'number') {
      if (typeof value !== 'string' || isNaN(parseFloat(value))) {
        return value as unknown;
      }
    }

    return new Decimal(value);
  });
}
