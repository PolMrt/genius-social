import { UsersModule } from "./../users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { ConnectedAccountsController } from "./connected-accounts.controller";
import { ConnectedAccountsService } from "./connected-accounts.service";
import { Invitation } from "./entities/invitation.entity";
import { SpacesModule } from "../spaces/spaces.module";
import { UsersService } from "../users/users.service";

@Module({
  imports: [TypeOrmModule.forFeature([Invitation]), UsersModule, SpacesModule],
  controllers: [ConnectedAccountsController],
  providers: [ConnectedAccountsService],
})
export class ConnectedAccountsModule {}
