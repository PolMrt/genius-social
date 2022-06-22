import { FacebookGraphService } from "./../facebook-graph/facebook-graph.service";
import { GetInvitationsDto } from "./dto/get-invitations.dto";
import { UsersService } from "./../users/users.service";
import { SpacesService } from "../spaces/spaces.service";
import { CreateInvitationDto } from "./dto/create-invitation.dto";
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Invitation } from "./entities/invitation.entity";
import { AcceptInvitationDto } from "./dto/accept-invitation.dto";
import { ConnectedAccount } from "./entities/connected-accounts.entity";
import { InvitationStates } from "./enum/invitation-states.enum";

@Injectable()
export class ConnectedAccountsService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    @InjectRepository(ConnectedAccount)
    private readonly connectedAccountRepository: Repository<ConnectedAccount>,
    private readonly spacesService: SpacesService,
    private readonly usersService: UsersService,
    private readonly fbGraphService: FacebookGraphService
  ) {}

  async getInvitations(
    userId: number,
    spaceSlug: string
  ): Promise<Invitation[]> {
    const userSpace = await this.spacesService.getUserSpace(userId, spaceSlug);
    const invitations = await this.invitationRepository.find({
      where: { space: userSpace },
    });

    return invitations;
  }

  async getInvitation(
    spaceSlug: string,
    invitationUniqueId: string
  ): Promise<Invitation> {
    const invitation = await this.invitationRepository.findOne({
      where: { uniqueId: invitationUniqueId },
      relations: ["space"],
    });

    if (!invitation || invitation.space.slug !== spaceSlug) {
      throw new NotFoundException();
    }

    return invitation;
  }

  async createInvitation(
    userId: number,
    spaceSlug: string,
    createInvitationDto: CreateInvitationDto
  ): Promise<Invitation> {
    const user = await this.usersService.findById(userId);
    const userSpace = await this.spacesService.getUserSpace(userId, spaceSlug);

    const uniqueId = Math.random().toString(36).substr(2, 8);

    const newInvitation = await this.invitationRepository.create({
      identifier: createInvitationDto.identifier,
      space: userSpace,
      user: user,
      uniqueId,
    });

    return this.invitationRepository.save(newInvitation);
    // Check if user exists and has this space
  }

  async acceptInvitation(
    spaceSlug: string,
    invitationUniqueId: string,
    acceptInvitationDto: AcceptInvitationDto
  ) {
    const invitation = await this.getInvitation(spaceSlug, invitationUniqueId);

    const pages = await this.fbGraphService.getUserPages(
      acceptInvitationDto.accessToken
    );

    if (
      !pages?.data?.find(
        (thisPage: any) => thisPage.id === acceptInvitationDto.pageId
      )
    ) {
      throw new HttpException(
        "Page ID not accessible from the user token",
        HttpStatus.BAD_REQUEST
      );
    }

    const instagramAccount = await this.fbGraphService.getPageInstagramAccount(
      acceptInvitationDto.accessToken,
      acceptInvitationDto.pageId
    );

    if (
      instagramAccount?.instagram_business_account?.id !==
      acceptInvitationDto.instagramAccountId
    ) {
      throw new HttpException(
        "Instagram account does not match",
        HttpStatus.BAD_REQUEST
      );
    }

    const instagramAccountInformations =
      await this.fbGraphService.getInstagramBusinessAccountInfos(
        acceptInvitationDto.accessToken,
        acceptInvitationDto.instagramAccountId
      );

    if (instagramAccountInformations.username !== invitation.identifier) {
      throw new HttpException(
        "Instagram account does not match requested account",
        HttpStatus.BAD_REQUEST
      );
    }

    const llToken = await this.fbGraphService.getLongToken(
      acceptInvitationDto.accessToken
    );

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + llToken.expires_in);

    const newConnectedAccount = this.connectedAccountRepository.create({
      accountType: invitation.accountType,
      identifier: invitation.identifier,
      token: llToken.access_token,
      expires: expires,
      space: invitation.space,
      profilePictureUrl: instagramAccountInformations.profile_picture_url,
      name: instagramAccountInformations.name,
    });

    const editedInvitation = await this.invitationRepository.preload({
      ...invitation,
      state: InvitationStates.accepted,
    });

    if (!editedInvitation) {
      throw new Error();
    }

    await this.invitationRepository.save(editedInvitation);
    await this.connectedAccountRepository.save(newConnectedAccount);

    return { ok: true };
  }

  async deleteInvitation(
    userId: number,
    spaceSlug: string,
    invitationId: number
  ) {
    const userSpace = await this.spacesService.getUserSpace(userId, spaceSlug);
    const invitation = await this.invitationRepository.findOne({
      where: { id: invitationId },
      relations: ["space"],
    });

    if (!invitation) {
      throw new NotFoundException();
    }

    if (invitation.space.id !== userSpace.id) {
      throw new ForbiddenException();
    }

    return this.invitationRepository.remove(invitation);
  }
}
