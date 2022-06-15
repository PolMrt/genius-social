import { User } from "./entities/user.entity";
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Space } from "../spaces/entities/space.entity";

// TODO: This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findOne(mail: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { mail: mail } });
    if (!user) {
      throw new HttpException("No user with that mail", HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
