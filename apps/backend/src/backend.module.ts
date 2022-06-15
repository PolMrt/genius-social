import { Module } from "@nestjs/common";
import { BackendController } from "./backend.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BackendService } from "./backend.service";
import { ConfigModule } from "@nestjs/config";
import { CoffeesModule } from "./coffees/coffees.module";
import * as Joi from "@hapi/joi";

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_USER: Joi.required(),
        DATABASE_PASSWORD: Joi.required(),
        DATABASE_NAME: Joi.required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DATABASE_HOST,
      port: +(process.env.DATABASE_PORT || 0),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true, // models will be loaded automatically
      synchronize: true, // TODO: your entities will be synced with the database(**recommended: disable in prod**)
    }),
    CoffeesModule,
  ],
  controllers: [BackendController],
  providers: [BackendService],
})
export class BackendModule {}
