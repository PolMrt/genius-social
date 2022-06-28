import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { BackendModule } from "./backend.module";
import { ConfigService } from "@nestjs/config";
import helmet from "helmet";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(BackendModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // transform json to DTO instance. Will also work for @Param() xx: number, normaly will always be a string, but will try to convert to appropriate type (here, number)
      //forbidNonWhitelisted: true : will throw an error if a non whitelisted (by DTO) params is passed
    })
  );

  app.use(cookieParser(configService.get<string>("COOKIE_SECRET")));
  app.enableCors({
    credentials: true,
    origin: configService.get<string>("FRONTEND_URL"),
  });
  app.use(helmet());
  await app.listen(3002);
}
bootstrap();
