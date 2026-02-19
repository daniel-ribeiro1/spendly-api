import { ValidateIf, ValidationOptions } from 'class-validator';

export function IsStrictOptional(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateIf((object, value) => value !== undefined, validationOptions);
}
