import { User } from "./entities/user.entity";
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

type FindUserOptions = {
  selectPassword?: boolean;
  includeSpaces?: boolean;
};

const defaultOptions: FindUserOptions = {
  selectPassword: false,
  includeSpaces: false,
};
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findById(
    id: number,
    options: FindUserOptions = defaultOptions
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: options.selectPassword ? ["password"] : [],
      relations: options.includeSpaces ? ["spaces"] : [],
    });
    if (!user) {
      throw new HttpException("No user with that id", HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findOne(
    mail: string,
    options: FindUserOptions = defaultOptions
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { mail: mail },
      select: options.selectPassword ? ["password"] : [],
      relations: options.includeSpaces ? ["spaces"] : [],
    });
    if (!user) {
      throw new HttpException("No user with that mail", HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
