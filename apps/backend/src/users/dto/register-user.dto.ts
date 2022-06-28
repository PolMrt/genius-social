import { IsEmail, IsString, Length } from "class-validator";

export class RegisterUserDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(6)
  readonly password: string;
}
