import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { BackendModule } from "./backend.module";
import helmet from "helmet";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(BackendModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // transform json to DTO instance. Will also work for @Param() xx: number, normaly will always be a string, but will try to convert to appropriate type (here, number)
      //forbidNonWhitelisted: true : will throw an error if a non whitelisted (by DTO) params is passed
    })
  );
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.enableCors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  });
  app.use(helmet());
  await app.listen(3002);
}
bootstrap();
