import { JwtAuthGuard } from "./../auth/guards/jwt-auth.guard";
import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
