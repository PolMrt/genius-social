import { TypeOrmModule } from "@nestjs/typeorm";
import { CoffeesService } from "./coffees.service";
import { CoffeesController } from "./coffees.controller";
import { Module } from "@nestjs/common";
import { Coffee } from "./entities/coffee.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Coffee])],
  controllers: [CoffeesController],
  providers: [CoffeesService],
})
export class CoffeesModule {}
