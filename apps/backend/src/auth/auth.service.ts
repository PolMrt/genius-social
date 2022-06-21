import { ConfigService } from "@nestjs/config";
import bcrypt from "bcrypt";
import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(mail: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(mail);

    if (user) {
      const isSamePassword = await bcrypt.compare(pass, user.password);
      if (isSamePassword) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: User) {
    const payload = { mail: user.mail, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
