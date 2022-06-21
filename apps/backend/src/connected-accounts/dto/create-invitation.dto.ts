import { IsAlphanumeric, IsNotEmpty, IsString } from "class-validator";

export class CreateInvitationDto {
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  readonly identifier: string;
}
