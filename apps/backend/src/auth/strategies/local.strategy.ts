import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: "mail" }); // here we can pass config to passport-local
  }

  async validate(mail: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(mail, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.activate) {
      throw new HttpException("User not activated", HttpStatus.FORBIDDEN);
    }

    return user;
  }
}
