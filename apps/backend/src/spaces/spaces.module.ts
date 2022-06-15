import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { SpacesService } from "./spaces.service";
import { Space } from "./entities/space.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Space])],
  providers: [SpacesService],
})
export class SpacesModule {}
