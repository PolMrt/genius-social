import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module, forwardRef } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { UsersController } from "./users.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    ConfigModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
