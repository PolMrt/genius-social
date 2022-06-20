import { GetInvitationsDto } from "./dto/get-invitations.dto";
import { CreateInvitationDto } from "./dto/create-invitation.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ConnectedAccountsService } from "./connected-accounts.service";
import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Param,
} from "@nestjs/common";

@Controller("space/:spaceSlug/connected-accounts")
export class ConnectedAccountsController {
  constructor(
    private readonly connectedAccountsService: ConnectedAccountsService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get("invitations")
  async getInvitations(
    @Request() req: any,
    @Param("spaceSlug") spaceSlug: string
  ) {
    const invitations = await this.connectedAccountsService.getInvitations(
      req.userId,
      spaceSlug
    );
    return invitations;
  }

  @Get("invitations/:id")
  async getInvitation(
    @Param("spaceSlug") spaceSlug: string,
    @Param("id") invitationUniqueId: string
  ) {
    const invitation = await this.connectedAccountsService.getInvitation(
      spaceSlug,
      invitationUniqueId
    );

    return invitation;
  }

  @UseGuards(JwtAuthGuard)
  @Post("invitations")
  async createNewInvitation(
    @Request() req: any,
    @Body() createInvitationDto: CreateInvitationDto
  ) {
    const invitation = await this.connectedAccountsService.createInvitation(
      req.userId,
      createInvitationDto
    );

    return { ...invitation, user: undefined };
  }
}
