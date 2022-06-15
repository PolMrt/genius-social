import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { SpacesService } from "./spaces.service";
import { Space } from "./entities/space.entity";
import { SpacesController } from "./spaces.controller";
import { User } from "../users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Space, User])],
  providers: [SpacesService],
  controllers: [SpacesController],
})
export class SpacesModule {}
