import { CreateInvitationDto } from "./dto/create-invitation.dto";
import { JwtAuthGuard } from "./../../auth/guards/jwt-auth.guard";
import { ConnectedAccountsService } from "./connected-accounts.service";
import { Controller, Post, UseGuards, Request, Body } from "@nestjs/common";

@Controller("connected-accounts")
export class ConnectedAccountsController {
  constructor(
    private readonly connectedAccountsService: ConnectedAccountsService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post("invitations")
  createNewInvitation(
    @Request() req: any,
    @Body() createInvitationDto: CreateInvitationDto
  ) {
    return createInvitationDto;
  }
}
