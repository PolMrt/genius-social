import { ConfigService } from "@nestjs/config";
import bcrypt from "bcrypt";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(mail: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.findOne(mail, {
        selectPassword: true,
      });

      const isSamePassword = await bcrypt.compare(pass, user.password);
      if (isSamePassword) {
        const { password, ...result } = user;
        return result;
      } else {
        throw new Error();
      }
    } catch (e) {
      throw new HttpException("Wrong email or password", HttpStatus.FORBIDDEN);
    }

    return null;
  }

  async login(user: any) {
    const xsrfToken =
      Math.random().toString(36).substr(2, 20) +
      Math.random().toString(36).substr(2, 20);

    const payload = { mail: user.mail, sub: user.id, xsrfToken };
    return {
      user,
      access_token: this.jwtService.sign(payload),
      xsrfToken,
    };
  }
}
