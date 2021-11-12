import { UserProfile } from '../entities/user-profile';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsEmailExistConstraint implements ValidatorConstraintInterface {
  async validate(email: string): Promise<any> {
    const user = await UserProfile.findOne({ where: { email } });
    if (user) return false;
    return true;
  }
}

export function IsEmailExist(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string): any => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailExistConstraint,
    });
  };
}
