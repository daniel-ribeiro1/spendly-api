import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import Decimal from 'decimal.js';

@ValidatorConstraint({ name: 'isDecimalJs', async: false })
class IsDecimalJsConstraint implements ValidatorConstraintInterface {
  validate(value: unknown) {
    if (value instanceof Decimal) return true;

    if (typeof value !== 'number' || typeof value !== 'string') return false;

    try {
      new Decimal(value);

      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `The value of '${args.property}' must be a valid number or string.`;
  }
}

export function IsDecimalJs(): PropertyDecorator {
  return (target: object, propertyName: string): void => {
    registerDecorator({
      name: 'isDecimalJs',
      target: target.constructor,
      propertyName,
      validator: IsDecimalJsConstraint,
    });
  };
}
