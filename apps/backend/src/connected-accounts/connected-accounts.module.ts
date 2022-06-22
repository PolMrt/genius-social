import { FacebookGraphModule } from "./../facebook-graph/facebook-graph.module";
import { UsersModule } from "./../users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { ConnectedAccountsController } from "./connected-accounts.controller";
import { ConnectedAccountsService } from "./connected-accounts.service";
import { Invitation } from "./entities/invitation.entity";
import { SpacesModule } from "../spaces/spaces.module";
import { UsersService } from "../users/users.service";
import { ConnectedAccount } from "./entities/connected-accounts.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Invitation, ConnectedAccount]),
    UsersModule,
    SpacesModule,
    FacebookGraphModule,
  ],
  controllers: [ConnectedAccountsController],
  providers: [ConnectedAccountsService],
})
export class ConnectedAccountsModule {}
