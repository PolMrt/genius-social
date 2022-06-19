import { IsString } from "class-validator";

export class CreateInvitationDto {
  @IsString()
  readonly identifier: string;

  @IsString()
  readonly spaceSlug: string;
}
