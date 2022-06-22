import {
  Controller,
  Get,
  UseGuards,
  Request,
  Param,
  Post,
  Body,
  Delete,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AcceptInvitationDto } from "./dto/accept-invitation.dto";
import { CreateInvitationDto } from "./dto/create-invitation.dto";
import { InvitationStates } from "./enum/invitation-states.enum";
import { InvitationsService } from "./invitations.service";

@Controller("space/:spaceSlug/invitations")
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getInvitations(
    @Request() req: any,
    @Param("spaceSlug") spaceSlug: string
  ) {
    const invitations = await this.invitationsService.getInvitations(
      req.user.id,
      spaceSlug
    );
    return invitations;
  }

  @Get(":id")
  async getInvitation(
    @Param("spaceSlug") spaceSlug: string,
    @Param("id") invitationUniqueId: string
  ) {
    const invitation = await this.invitationsService.getInvitation(
      spaceSlug,
      invitationUniqueId
    );

    return invitation;
  }

  @Post("accept/:id")
  async acceptInvitation(
    @Param("spaceSlug") spaceSlug: string,
    @Param("id") invitationUniqueId: string,
    @Body() acceptInvitationDto: AcceptInvitationDto
  ) {
    const acceptedInvitation = await this.invitationsService.acceptInvitation(
      spaceSlug,
      invitationUniqueId,
      acceptInvitationDto
    );

    return acceptedInvitation;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deleteInvitation(
    @Request() req: any,
    @Param("spaceSlug") spaceSlug: string,
    @Param("id") invitationUniqueId: number
  ) {
    const deleted = await this.invitationsService.deleteInvitation(
      req.user.id,
      spaceSlug,
      invitationUniqueId
    );
    return deleted;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createNewInvitation(
    @Request() req: any,
    @Param("spaceSlug") spaceSlug: string,
    @Body() createInvitationDto: CreateInvitationDto
  ) {
    const invitation = await this.invitationsService.createInvitation(
      req.user.id,
      spaceSlug,
      createInvitationDto
    );

    return { ...invitation, user: undefined };
  }
}
