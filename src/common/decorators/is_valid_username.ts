import { registerDecorator, ValidationOptions } from 'class-validator';
import { isEmail, isPhone } from '../utils';

export function IsValidUsername(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidUsername',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return isEmail(value) || isPhone(value);
        },
      },
    });
  };
}
