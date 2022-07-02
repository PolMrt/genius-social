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
}
