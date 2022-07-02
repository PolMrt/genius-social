import { User } from "./entities/user.entity";
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { RegisterUserDto } from "./dto/register-user.dto";
import bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";

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
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService
  ) {}

  async findById(
    id: number,
    options: FindUserOptions = defaultOptions
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: options.includeSpaces ? ["spaces", "spaces.space"] : [],
    });

    if (!user) {
      throw new HttpException("No user with that id", HttpStatus.NOT_FOUND);
    }

    return options.selectPassword ? this.userWithPassword(user) : user;
  }

  async findOne(
    mail: string,
    options: FindUserOptions = defaultOptions
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { mail: mail },
      relations: options.includeSpaces ? ["spaces"] : [],
    });

    if (!user) {
      throw new HttpException("No user with that mail", HttpStatus.NOT_FOUND);
    }

    return options.selectPassword ? this.userWithPassword(user) : user;
  }

  async userWithPassword(user: User): Promise<User> {
    const userWithPassword = await this.userRepository.findOne({
      where: { id: user.id },
      select: ["id", "password"],
    });

    if (!userWithPassword) {
      throw new HttpException("No user found", HttpStatus.NOT_FOUND);
    }

    return { ...user, password: userWithPassword.password };
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const alreadyExistingUser = await this.userRepository.findOne({
      where: { mail: registerUserDto.email },
    });
    if (alreadyExistingUser) {
      throw new HttpException(
        "An user already has this email",
        HttpStatus.CONFLICT
      );
    }

    const passwordHashed = await bcrypt.hash(
      registerUserDto.password,
      +this.configService.get("HASH_SALT_ROUND")
    );

    const newUser = await this.userRepository.create({
      name: registerUserDto.name,
      mail: registerUserDto.email,
      password: passwordHashed,
      activate: false,
    });

    const user = await this.userRepository.save(newUser);

    return { ...user, password: undefined };
  }
}
