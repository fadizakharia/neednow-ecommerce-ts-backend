import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { getRepository } from "typeorm";
import { User } from "../../../Entity/User";
@ValidatorConstraint({ name: "EmailExistsCheck", async: true })
export class EmailExists implements ValidatorConstraintInterface {
  async validate(text: string, _args?: ValidationArguments): Promise<boolean> {
    const userRepository = await getRepository(User);
    const result = await userRepository.findOne({ where: { email: text } });

    return result === undefined
      ? Promise.resolve(true)
      : Promise.resolve(false);
  }

  defaultMessage(_args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return "Email already exists!";
  }
}
