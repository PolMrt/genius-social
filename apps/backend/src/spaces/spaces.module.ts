import { UsersModule } from "./../users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { SpacesService } from "./spaces.service";
import { Space } from "./entities/space.entity";
import { SpacesController } from "./spaces.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Space]), UsersModule],
  providers: [SpacesService],
  controllers: [SpacesController],
  exports: [SpacesService],
})
export class SpacesModule {}
