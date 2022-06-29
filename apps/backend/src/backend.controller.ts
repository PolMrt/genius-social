import { ConfigService } from "@nestjs/config";
import { Controller } from "@nestjs/common";
@Controller()
export class BackendController {
  constructor(private readonly configService: ConfigService) {}
}
