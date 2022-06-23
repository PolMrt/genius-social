import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { ConnectedAccountsController } from "./connected-accounts.controller";
import { ConnectedAccountsService } from "./connected-accounts.service";
import { ConnectedAccount } from "./entities/connected-accounts.entity";
import { SpacesModule } from "../spaces/spaces.module";

@Module({
  imports: [TypeOrmModule.forFeature([ConnectedAccount]), SpacesModule],
  controllers: [ConnectedAccountsController],
  providers: [ConnectedAccountsService],
  exports: [ConnectedAccountsService],
})
export class ConnectedAccountsModule {}
