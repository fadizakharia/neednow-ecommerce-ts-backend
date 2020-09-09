import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { getRepository } from "typeorm";
import { User } from "../../../Entity/User";
import argon from "argon2";
@ValidatorConstraint({ name: "ValidateLogin", async: true })
export class ValidateLogin implements ValidatorConstraintInterface {
  async validate(text: string, args: ValidationArguments): Promise<boolean> {
    let validity = Promise.resolve(false);
    const userRepository = await getRepository(User);
    const userObject = args.object as any;
    const result = await userRepository.findOne({
      where: { email: userObject["email"] },
    });

    validity =
      result === undefined ? Promise.resolve(false) : Promise.resolve(true);
    if (await validity) {
      validity = Promise.resolve(await argon.verify(result!.password, text));
    }
    return validity;
  }

  defaultMessage(_args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return "Email already exists!";
  }
}
