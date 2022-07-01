import { IsOptional, IsISO8601, MaxDate } from "class-validator";

export class GetAccountInsightsDto {
  @IsISO8601()
  readonly from: number;

  @IsISO8601()
  readonly until: string;
}
