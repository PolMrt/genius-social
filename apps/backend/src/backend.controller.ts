import { ConfigService } from "@nestjs/config";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { LocalAuthGuard } from "./auth/guards/local-auth.guard";
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { BackendService } from "./backend.service";
import { AuthService } from "./auth/auth.service";
import { Response } from "express";

@Controller()
export class BackendController {
  constructor(
    private readonly configService: ConfigService,
    private readonly backendService: BackendService,
    private readonly authService: AuthService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post("auth/login")
  async login(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    const tokenData = await this.authService.login(req.user);

    res.cookie("ACCESS-TOKEN", tokenData.access_token, {
      expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // 24h
      maxAge: 60 * 60 * 24,
      sameSite: "strict",
      httpOnly: true,
      domain: this.configService.get<string>("FRONTEND_DOMAIN"),
      secure: true,
    });

    res.cookie("XSRF-TOKEN", tokenData.xsrfToken);

    return { user: tokenData.user };
  }

  @UseGuards(JwtAuthGuard)
  @Post("auth/test")
  async test(@Request() req: any) {
    return req.user;
  }
}
