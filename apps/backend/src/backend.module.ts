import { Module } from "@nestjs/common";
import { BackendController } from "./backend.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BackendService } from "./backend.service";
import { ConfigModule } from "@nestjs/config";
import { CoffeesModule } from "./coffees/coffees.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { SpacesModule } from "./spaces/spaces.module";
import * as Joi from "@hapi/joi";
import { ConnectedAccountsModule } from "./connected-accounts/connected-accounts.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env.dev", ".env.prod"],
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid("development", "production", "test", "provision")
          .default("development"),
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_USER: Joi.required(),
        DATABASE_PASSWORD: Joi.required(),
        DATABASE_NAME: Joi.required(),
        JWT_SECRET: Joi.required(),
        HASH_SALT_ROUND: Joi.number().default(10).min(2).required(),
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
    AuthModule,
    UsersModule,
    SpacesModule,
    ConnectedAccountsModule,
  ],
  controllers: [BackendController],
  providers: [BackendService],
})
export class BackendModule {}
