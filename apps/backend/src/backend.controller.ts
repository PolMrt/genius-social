import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { LocalAuthGuard } from "./auth/guards/local-auth.guard";
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { BackendService } from "./backend.service";
import { AuthService } from "./auth/auth.service";

@Controller()
export class BackendController {
  constructor(
    private readonly backendService: BackendService,
    private readonly authService: AuthService
  ) {}

  @Get()
  getHello(): string {
    return this.backendService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post("auth/login")
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post("auth/test")
  async test(@Request() req: any) {
    return req.user;
  }
}
