import { CreateConnectedAccountDto } from "./dto/create-connected-account.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConnectedAccount } from "./entities/connected-accounts.entity";
import { SpacesService } from "../spaces/spaces.service";
import { FacebookGraphService } from "../facebook-graph/facebook-graph.service";

@Injectable()
export class ConnectedAccountsService {
  constructor(
    @InjectRepository(ConnectedAccount)
    private readonly connectedAccountRepository: Repository<ConnectedAccount>,
    private readonly spacesService: SpacesService,
    private readonly fbServive: FacebookGraphService
  ) {}

  async getConnectedAccounts(
    spaceSlug: string,
    userId: number
  ): Promise<ConnectedAccount[]> {
    const userSpace = await this.spacesService.getUserSpace(userId, spaceSlug);
    const connectedAccounts = await this.connectedAccountRepository.find({
      where: { space: userSpace },
    });

    return connectedAccounts;
  }

  async getConnectedAccount(
    id: number,
    spaceSlug: string,
    userId: number
  ): Promise<ConnectedAccount> {
    const userSpace = await this.spacesService.getUserSpace(userId, spaceSlug);
    const connectedAccount = await this.connectedAccountRepository.findOne({
      where: { space: userSpace, id },
    });

    if (!connectedAccount) {
      throw new NotFoundException();
    }

    return connectedAccount;
  }

  async createConnectedAccount(
    createConnectedAccountDto: CreateConnectedAccountDto
  ) {
    const newCA = this.connectedAccountRepository.create(
      createConnectedAccountDto
    );
    return this.connectedAccountRepository.save(newCA);
  }

  async getAccountInformations(id: number, spaceSlug: string, userId: number) {
    const connectedAccount = await this.getConnectedAccount(
      id,
      spaceSlug,
      userId
    );
    const connectAccountWithToken = await this.getConnectedAccountWithToken(
      connectedAccount
    );

    const rawToken = this.fbServive.decryptToken(connectAccountWithToken.token);

    if (spaceSlug !== rawToken.spaceSlug) {
      throw new Error("An error occured");
    }

    const fbInfos = await this.fbServive.getInstagramBusinessAccountInfos(
      rawToken.accessToken,
      connectedAccount.plateformId
    );

    const insights = await this.fbServive.getGeneralIGInsights(
      rawToken.accessToken,
      connectedAccount.plateformId
    );

    return { infos: fbInfos, insights };
  }

  async getConnectedAccountWithToken(connectedAccount: ConnectedAccount) {
    const accountWithToken = await this.connectedAccountRepository.findOne({
      where: { id: connectedAccount.id },
      select: ["id", "token"],
    });
    if (!accountWithToken) {
      throw new NotFoundException();
    }
    return { ...connectedAccount, token: accountWithToken.token };
  }
}
