import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function MatchRegex(
  pattern: RegExp,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'matchRegex',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [pattern],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = relatedPropertyName;
          if (typeof value !== 'string' || !relatedValue) {
            return false;
          }
          return relatedValue.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must match the ${relatedPropertyName} field.`;
        },
      },
    });
  };
}
