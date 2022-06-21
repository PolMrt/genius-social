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
  Delete,
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
      req.user.id,
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
  @Delete("invitations/:id")
  async deleteInvitation(
    @Request() req: any,
    @Param("spaceSlug") spaceSlug: string,
    @Param("id") invitationUniqueId: number
  ) {
    const deleted = await this.connectedAccountsService.deleteInvitation(
      req.user.id,
      spaceSlug,
      invitationUniqueId
    );
    return deleted;
  }

  @UseGuards(JwtAuthGuard)
  @Post("invitations")
  async createNewInvitation(
    @Request() req: any,
    @Param("spaceSlug") spaceSlug: string,
    @Body() createInvitationDto: CreateInvitationDto
  ) {
    const invitation = await this.connectedAccountsService.createInvitation(
      req.user.id,
      spaceSlug,
      createInvitationDto
    );

    return { ...invitation, user: undefined };
  }
}
