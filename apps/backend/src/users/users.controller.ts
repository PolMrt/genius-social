import { JwtAuthGuard } from "./../auth/guards/jwt-auth.guard";
import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { Throttle } from "@nestjs/throttler";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
}
