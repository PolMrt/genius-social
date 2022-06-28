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

    const sharedOptions = {
      expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // 24h
      domain: this.configService.get<string>("FRONTEND_DOMAIN"),
      secure: true,
    };

    res.cookie("ACCESS-TOKEN", tokenData.access_token, {
      ...sharedOptions,
      sameSite: "strict",
      httpOnly: true,
    });

    res.cookie("XSRF-TOKEN", tokenData.xsrfToken, {
      ...sharedOptions,
    });

    return { user: tokenData.user };
  }

  @UseGuards(JwtAuthGuard)
  @Post("auth/logout")
  async test(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("ACCESS-TOKEN");
    res.clearCookie("XSRF-TOKEN");
    return { success: true };
  }
}
