import { AddUserDto } from "./dto/add-user.dto";
import { JwtAuthGuard } from "./../auth/guards/jwt-auth.guard";
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { CreateSpaceDto } from "./dto/create-space.dto";
import { SpacesService } from "./spaces.service";
import { UserInSpaceWithRoleGuard } from "./guard/user-space-role.guard";
import { Role } from "./decorator/role.decorator";
import { Throttle } from "@nestjs/throttler";

@Controller("spaces")
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserSpace(@Request() req: any) {
    const userSpaces = await this.spacesService.getUserSpaces(req.user.id);
    return userSpaces;
  }

  @UseGuards(JwtAuthGuard)
  @Get(":slug")
  async getSpace(@Param("slug") slug: string, @Request() req: any) {
    const thisSpace = await this.spacesService.getUserSpace(req.user.id, slug);
    const role = await this.spacesService.getRoleInSpace(req.user.id, slug);

    return { ...thisSpace, role: role };
  }

  @Throttle(5, 60 * 60 * 6)
  @UseGuards(JwtAuthGuard)
  @Post()
  async createSpace(
    @Request() req: any,
    @Body() createSpaceDto: CreateSpaceDto
  ) {
    const createdSpace = await this.spacesService.createSpace(
      req.user.id,
      createSpaceDto
    );

    return createdSpace;
  }

  @Role("admin")
  @UseGuards(UserInSpaceWithRoleGuard)
  @UseGuards(JwtAuthGuard)
  @Get(":slug/users")
  async getSpaceUsers(@Param("slug") slug: string, @Request() req: any) {
    const thisSpace = await this.spacesService.getUserSpace(req.user.id, slug);
    const users = await this.spacesService.getSpaceUsers(thisSpace);

    return users;
  }

  @Throttle(10, 60 * 30)
  @Role("admin")
  @UseGuards(UserInSpaceWithRoleGuard)
  @UseGuards(JwtAuthGuard)
  @Post(":slug/users")
  async addUserToSpace(
    @Param("slug") slug: string,
    @Request() req: any,
    @Body() addUserDto: AddUserDto
  ) {
    const addedUser = await this.spacesService.addUser(
      req.user.id,
      slug,
      addUserDto
    );

    return addedUser;
  }
}
