import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { OrderBy } from '@/shared/enums/pagination.enum';

@ValidatorConstraint({ name: 'isOrderBy', async: false })
class IsOrderByValidator implements ValidatorConstraintInterface {
  validate(
    fields: Record<string, OrderBy>[],
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    if (
      !fields.length ||
      (typeof fields !== 'object' && !Array.isArray(fields)) ||
      !fields
    )
      return false;

    const allowedFields =
      (validationArguments && (validationArguments.constraints as string[])) ||
      [];

    return fields.every((field) => {
      return Object.entries(field).every(([key, value]) => {
        const isFieldAllowed = allowedFields.includes(key);
        const isValueValid = value === OrderBy.ASC || value === OrderBy.DESC;

        return isFieldAllowed && isValueValid;
      });
    });
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Invalid order by. Allowed fields: '${validationArguments?.constraints.join("', '")}'. Allowed values: '${OrderBy.ASC}', '${OrderBy.DESC}.'`;
  }
}

export function IsOrderBy<T, K = keyof T>(
  allowedFields: K[],
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isOrderBy',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: allowedFields,
      validator: IsOrderByValidator,
    });
  };
}
