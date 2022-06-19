import { IsString } from "class-validator";

export class GetInvitationsDto {
  @IsString()
  readonly spaceSlug: string;
}
