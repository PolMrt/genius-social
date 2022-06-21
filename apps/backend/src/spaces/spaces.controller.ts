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

    return thisSpace;
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

    return {
      ...createdSpace,
      users: createdSpace.users.map((thisUser) => ({
        ...thisUser,
        password: undefined,
      })),
    };
  }
}
