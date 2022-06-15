import { CreateSpaceDto } from "./dto/create-space.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { Space } from "./entities/space.entity";

@Injectable()
export class SpacesService {
  constructor(
    @InjectRepository(Space)
    private readonly spaceRepository: Repository<Space>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async createSpace(userId: number, createSpaceDto: CreateSpaceDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException();
    }
    const newSpace = await this.spaceRepository.create({
      ...createSpaceDto,
      users: [user],
    });
    return this.spaceRepository.save(newSpace);
  }

  async getUserSpace(userId: number): Promise<Space[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException();
    }

    return user.spaces;
  }
}
