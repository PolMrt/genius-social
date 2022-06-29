import { JwtAuthGuard } from "./../auth/guards/jwt-auth.guard";
import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
  Res,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { Throttle } from "@nestjs/throttler";
import { LocalAuthGuard } from "../auth/guards/local-auth.guard";
import { AuthService } from "../auth/auth.service";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getMe(@Request() req: any) {
    const user = await this.usersService.findById(req.user.id);
    return user;
  }

  @Throttle(10, 60 * 60 * 24)
  @Post("register")
  async register(@Body() registerUserDto: RegisterUserDto) {
    const newUser = await this.usersService.registerUser(registerUserDto);
    return newUser;
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
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
  @Post("logout")
  async test(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("ACCESS-TOKEN");
    res.clearCookie("XSRF-TOKEN");
    return { success: true };
  }
}
