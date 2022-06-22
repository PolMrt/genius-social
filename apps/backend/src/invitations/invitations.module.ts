import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { FacebookGraphModule } from "../facebook-graph/facebook-graph.module";
import { SpacesModule } from "../spaces/spaces.module";
import { UsersModule } from "../users/users.module";
import { InvitationsController } from "./invitations.controller";
import { InvitationsService } from "./invitations.service";
import { Invitation } from "./entities/invitation.entity";
import { ConnectedAccountsModule } from "../connected-accounts/connected-accounts.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Invitation]),
    UsersModule,
    SpacesModule,
    FacebookGraphModule,
    ConnectedAccountsModule,
  ],
  controllers: [InvitationsController],
  providers: [InvitationsService],
})
export class InvitationsModule {}
