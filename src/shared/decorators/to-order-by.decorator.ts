import { Transform } from 'class-transformer';

import { OrderBy } from '@/shared/enums/pagination.enum';

export function ToOrderBy(): PropertyDecorator {
  return Transform(({ value }) => {
    const orderBy: Partial<Record<string, OrderBy>>[] = [];

    if (typeof value !== 'object' && !Array.isArray(value)) {
      value = [value];
    }

    for (const field of value as string[]) {
      const [key, value] = field.split(':');

      orderBy.push({
        [key]: value as OrderBy,
      });
    }

    return orderBy;
  });
}
