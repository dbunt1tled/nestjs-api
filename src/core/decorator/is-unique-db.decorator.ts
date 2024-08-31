// decorator options interface
import { registerDecorator, ValidationOptions } from 'class-validator';
import { UniqueConstraintsType } from 'src/core/types/constraints/unique-constraints.type';
import { IsUniqueDBConstraint } from 'src/core/constraint/is-unique-db.constraint';

export function IsUniqueDB(
  options: UniqueConstraintsType,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUniqueDB',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsUniqueDBConstraint,
    });
  };
}
