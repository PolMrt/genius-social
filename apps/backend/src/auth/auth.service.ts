import { ConfigService } from "@nestjs/config";
import bcrypt from "bcrypt";
import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";

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

  async login(user: any) {
    const payload = { mail: user.mail, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
