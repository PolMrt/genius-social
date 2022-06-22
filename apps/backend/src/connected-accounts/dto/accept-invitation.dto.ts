import { IsNotEmpty, IsString } from "class-validator";

export class AcceptInvitationDto {
  @IsString()
  @IsNotEmpty()
  readonly instagramAccountId: string;

  @IsString()
  @IsNotEmpty()
  readonly pageId: string;

  @IsString()
  @IsNotEmpty()
  readonly accessToken: string;
}
