import { JwtAuthGuard } from "./../auth/guards/jwt-auth.guard";
import {
  Body,
  Controller,
  Get,
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
    const userSpaces = await this.spacesService.getUserSpace(req.user.id);
    return userSpaces;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createSpace(
    @Request() req: any,
    @Body() createSpaceDto: CreateSpaceDto
  ) {
    const createdSpace = await this.spacesService.createSpace(
      req.user.userId,
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
