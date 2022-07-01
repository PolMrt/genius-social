import { GetAccountInsightsDto } from "./dto/get-account-insights.dto";
import { JwtAuthGuard } from "./../auth/guards/jwt-auth.guard";
import { ConnectedAccountsService } from "./connected-accounts.service";
import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";

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

  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  async findOne(
    @Param("id") id: number,
    @Request() req: any,
    @Param("spaceSlug") spaceSlug: string
  ) {
    const connectedAccounts =
      await this.connectedAccountsService.getConnectedAccount(
        id,
        spaceSlug,
        req.userId
      );
    return connectedAccounts;
  }

  @UseGuards(JwtAuthGuard)
  @Get("/:id/account-informations")
  async accountInformations(
    @Param("id") id: number,
    @Request() req: any,
    @Param("spaceSlug") spaceSlug: string
  ) {
    const infos = await this.connectedAccountsService.getAccountInformations(
      id,
      spaceSlug,
      req.userId
    );
    return infos;
  }

  @UseGuards(JwtAuthGuard)
  @Get("/:id/account-audience")
  async accountAudience(
    @Param("id") id: number,
    @Request() req: any,
    @Param("spaceSlug") spaceSlug: string
  ) {
    const audience = await this.connectedAccountsService.getAccountAudience(
      id,
      spaceSlug,
      req.userId
    );
    return audience;
  }

  @UseGuards(JwtAuthGuard)
  @Get("/:id/account-insights")
  async accountInsights(
    @Param("id") id: number,
    @Request() req: any,
    @Param("spaceSlug") spaceSlug: string,
    @Query() getAccountInsightsDto: GetAccountInsightsDto
  ) {
    const insights = await this.connectedAccountsService.getAccountInsights(
      id,
      spaceSlug,
      req.userId,
      getAccountInsightsDto
    );
    return insights;
  }
}
