import { User } from "./entities/user.entity";
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException("No user with that id", HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findOne(mail: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { mail: mail } });
    if (!user) {
      throw new HttpException("No user with that mail", HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
