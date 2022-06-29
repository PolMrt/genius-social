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

@Injectable()
export class SpacesService {
  constructor(
    @InjectRepository(Space)
    private readonly spaceRepository: Repository<Space>,
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
      users: [user],
    });
    return this.spaceRepository.save(newSpace);
  }

  async getUserSpaces(userId: number): Promise<Space[]> {
    const user = await this.usersService.findById(userId, {
      includeSpaces: true,
    });
    if (!user) {
      throw new NotFoundException();
    }

    return user.spaces;
  }

  async getUserSpace(userId: number, slug: string): Promise<Space> {
    const user = await this.usersService.findById(userId, {
      includeSpaces: true,
    });
    if (!user) {
      throw new NotFoundException();
    }

    const thisSpace = user.spaces.find((space) => space.slug === slug);
    if (!thisSpace) {
      throw new NotFoundException();
    }
    return thisSpace;
  }
}
