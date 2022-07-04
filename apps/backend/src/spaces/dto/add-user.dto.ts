import { IsEmail, IsString } from "class-validator";

export class AddUserDto {
  @IsString()
  @IsEmail()
  readonly email: string;
}
