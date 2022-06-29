import { Module } from "@nestjs/common";
import { BackendController } from "./backend.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BackendService } from "./backend.service";
import { ConfigModule } from "@nestjs/config";
import { CoffeesModule } from "./coffees/coffees.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { SpacesModule } from "./spaces/spaces.module";
import { ConnectedAccountsModule } from "./connected-accounts/connected-accounts.module";
import { FacebookGraphModule } from "./facebook-graph/facebook-graph.module";
import { InvitationsModule } from "./invitations/invitations.module";
import * as Joi from "@hapi/joi";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

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
        FB_APP_ID: Joi.string().required(),
        FB_APP_SECRET: Joi.string().required(),
        FB_V: Joi.string().required(),
        ENCRYPT_KEY_SPACE: Joi.string().required(),
        ENCRYPT_KEY_TOKEN: Joi.string().required(),
        COOKIE_SECRET: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
        FRONTEND_DOMAIN: Joi.string().required(),
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
      synchronize: process.env.NODE_ENV === "development", // TODO: your entities will be synced with the database(**recommended: disable in prod**)
    }),
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 15,
    }),
    CoffeesModule,
    AuthModule,
    UsersModule,
    SpacesModule,
    ConnectedAccountsModule,
    FacebookGraphModule,
    InvitationsModule,
  ],
  controllers: [BackendController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    BackendService,
  ],
})
export class BackendModule {}
