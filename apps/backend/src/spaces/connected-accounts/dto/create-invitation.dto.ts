import { IsNumber, IsString } from "class-validator";

export class CreateInvitationDto {
  @IsString()
  readonly identifier: string;

  @IsNumber()
  readonly spaceId: number;
}
