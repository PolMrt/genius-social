import { ConfigService } from "@nestjs/config";
import { ExtractJwt, JwtFromRequestFunction, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        // ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET"),
      passReqToCallback: true,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      "ACCESS-TOKEN" in req.cookies &&
      req.cookies["ACCESS-TOKEN"].length > 0
    ) {
      return req.cookies["ACCESS-TOKEN"];
    }
    return null;
  }

  async validate(req: Request, payload: any) {
    if (
      req.headers &&
      "xsrf-token" in req.headers &&
      req.headers["xsrf-token"] === payload.xsrfToken
    ) {
      return { id: payload.sub, mail: payload.mail };
    } else {
      throw new UnauthorizedException();
    }
    // TODO: check si pas revoke, si user existe bien, et enrichire les info de l'user si besoin
  }
}
