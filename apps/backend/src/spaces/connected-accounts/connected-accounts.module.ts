import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { ConnectedAccountsController } from "./connected-accounts.controller";
import { ConnectedAccountsService } from "./connected-accounts.service";
import { Invitation } from "./entities/invitation.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Invitation])],
  controllers: [ConnectedAccountsController],
  providers: [ConnectedAccountsService],
})
export class ConnectedAccountsModule {}
