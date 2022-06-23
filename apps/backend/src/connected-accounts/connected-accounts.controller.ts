import { JwtAuthGuard } from "./../auth/guards/jwt-auth.guard";
import { ConnectedAccountsService } from "./connected-accounts.service";
import { Controller, Get, Param, UseGuards, Request } from "@nestjs/common";

@Controller("space/:spaceSlug/connected-accounts")
export class ConnectedAccountsController {
  constructor(
    private readonly connectedAccountsService: ConnectedAccountsService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req: any, @Param("spaceSlug") spaceSlug: string) {
    const connectedAccounts =
      await this.connectedAccountsService.getConnectedAccounts(
        spaceSlug,
        req.userId
      );
    return connectedAccounts;
  }
}
