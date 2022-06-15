import { IsString } from "class-validator";

export class CreateSpaceDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly slug: string;
}
