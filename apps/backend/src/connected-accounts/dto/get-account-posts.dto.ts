import { IsOptional, IsString } from "class-validator";

export class GetAccountPostsDto {
  @IsOptional()
  @IsString()
  readonly next?: string;
}
