import { IsAlphanumeric, IsNotEmpty, IsString } from "class-validator";
import { Space } from "../../spaces/entities/space.entity";
import { ConnectionTypes } from "../enum/connection-types.enum";

export class CreateConnectedAccountDto {
  readonly identifier: string;
  readonly plateformId: string;
  readonly accountType: ConnectionTypes;
  readonly expires: Date;
  readonly name: string;
  readonly email: string;
  readonly profilePictureUrl: string;
  readonly token: string;
  readonly space: Space;
}
