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
}
