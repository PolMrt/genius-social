import {
  IsLowercase,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from "class-validator";

export class CreateSpaceDto {
  @IsString()
  @Length(3, 20)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @IsLowercase()
  @Length(3, 20)
  @Matches(/^[a-z0-9-_]+$/, {
    message: "slug must only contains letters, number or dashes",
  })
  readonly slug: string;
}
