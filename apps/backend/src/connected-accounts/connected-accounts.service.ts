import { GetInvitationsDto } from "./dto/get-invitations.dto";
import { UsersService } from "./../users/users.service";
import { SpacesService } from "../spaces/spaces.service";
import { CreateInvitationDto } from "./dto/create-invitation.dto";
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Invitation } from "./entities/invitation.entity";

@Injectable()
export class ConnectedAccountsService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    private readonly spacesService: SpacesService,
    private readonly usersService: UsersService
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
    createInvitationDto: CreateInvitationDto
  ): Promise<Invitation> {
    const user = await this.usersService.findById(userId);
    const userSpace = await this.spacesService.getUserSpace(
      userId,
      createInvitationDto.spaceSlug
    );

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
}
