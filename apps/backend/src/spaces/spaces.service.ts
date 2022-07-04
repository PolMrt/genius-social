import { AddUserDto } from "./dto/add-user.dto";
import { UsersService } from "./../users/users.service";
import { CreateSpaceDto } from "./dto/create-space.dto";
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Space } from "./entities/space.entity";
import bannedTerms from "./data/banned-slugs";
import { SpacesUsers } from "./entities/spaces-users.entity";
import { Role } from "./enum/roles.enum";

@Injectable()
export class SpacesService {
  constructor(
    @InjectRepository(Space)
    private readonly spaceRepository: Repository<Space>,
    @InjectRepository(SpacesUsers)
    private readonly spaceUsersRepository: Repository<SpacesUsers>,
    private readonly usersService: UsersService
  ) {}

  async createSpace(userId: number, createSpaceDto: CreateSpaceDto) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    if (bannedTerms.indexOf(createSpaceDto.slug) !== -1) {
      throw new HttpException(
        "This slug is not allowed.",
        HttpStatus.NOT_ACCEPTABLE
      );
    }

    const newSpace = await this.spaceRepository.create({
      ...createSpaceDto,
    });

    const createdSpace = await this.spaceRepository.save(newSpace);

    const newLink = await this.spaceUsersRepository.create({
      user,
      space: createdSpace,
    });

    await this.spaceUsersRepository.save(newLink);

    return createdSpace;
  }

  async getUserSpaces(userId: number): Promise<any[]> {
    const user = await this.usersService.findById(userId, {
      includeSpaces: true,
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user.spaces.map((thisS: SpacesUsers) => ({
      ...thisS.space,
      role: thisS.role,
    }));
  }

  async getUserSpace(userId: number, slug: string): Promise<Space> {
    const user = await this.usersService.findById(userId, {
      includeSpaces: true,
    });

    if (!user) {
      throw new NotFoundException();
    }

    const thisSpace = user.spaces.find((space) => space.space.slug === slug);

    if (!thisSpace) {
      throw new NotFoundException();
    }

    return thisSpace.space;
  }

  async getRoleInSpace(userId: number, slug: string): Promise<Role> {
    const user = await this.usersService.findById(userId, {
      includeSpaces: true,
    });

    if (!user) {
      throw new NotFoundException();
    }

    const thisSpace = user.spaces.find((space) => space.space.slug === slug);

    if (!thisSpace) {
      throw new NotFoundException();
    }

    return thisSpace.role;
  }

  async getSpaceUsers(space: Space): Promise<SpacesUsers[]> {
    const fspace = await this.spaceRepository.findOne({
      where: { id: space.id },
      relations: ["users", "users.user"],
    });

    if (!fspace) {
      throw new NotFoundException();
    }

    return fspace.users;
  }

  async addUser(userId: number, slug: string, addUserDto: AddUserDto) {
    const space = await this.getUserSpace(userId, slug);

    const user = await this.usersService.findOne(addUserDto.email);

    const users = await this.getSpaceUsers(space);

    if (users.length > 10) {
      throw new HttpException(
        "User limit reached, please upgrade.",
        HttpStatus.FORBIDDEN
      );
    }

    if (users.find((thisUser) => thisUser.user.mail === addUserDto.email)) {
      throw new HttpException(
        "This user is alredy in this space",
        HttpStatus.CONFLICT
      );
    }

    const newUserSpace = this.spaceUsersRepository.create({
      user,
      space,
      role: Role.user,
    });

    return this.spaceUsersRepository.save(newUserSpace);
  }
}
