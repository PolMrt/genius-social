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

@Controller("connected-accounts")
export class ConnectedAccountsController {
  constructor(
    private readonly connectedAccountsService: ConnectedAccountsService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get("invitations/:spaceSlug")
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
