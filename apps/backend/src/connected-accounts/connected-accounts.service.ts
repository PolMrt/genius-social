import { CreateConnectedAccountDto } from "./dto/create-connected-account.dto";
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConnectedAccount } from "./entities/connected-accounts.entity";
import { SpacesService } from "../spaces/spaces.service";
import { FacebookGraphService } from "../facebook-graph/facebook-graph.service";
import dayjs from "dayjs";
import { GetAccountInsightsDto } from "./dto/get-account-insights.dto";

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
    const ca = await this.connectedAccountRepository.findOne({
      where: {
        plateformId: createConnectedAccountDto.plateformId,
        space: createConnectedAccountDto.space,
      },
    });
    if (ca) {
      throw new HttpException(
        "This account is already connected with this space",
        HttpStatus.CONFLICT
      );
    }
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
      connectedAccount,
      spaceSlug
    );

    const fbInfos = await this.fbServive.getInstagramBusinessAccountInfos(
      connectAccountWithToken.token,
      connectedAccount.plateformId
    );

    return fbInfos;
  }

  async getAccountAudience(id: number, spaceSlug: string, userId: number) {
    const connectedAccount = await this.getConnectedAccount(
      id,
      spaceSlug,
      userId
    );
    const connectAccountWithToken = await this.getConnectedAccountWithToken(
      connectedAccount,
      spaceSlug
    );

    const audience = await this.fbServive.getGeneralIGAudienceData(
      connectAccountWithToken.token,
      connectedAccount.plateformId
    );

    return audience;
  }

  async getAccountInsights(
    id: number,
    spaceSlug: string,
    userId: number,
    getAccountInsightsDto: GetAccountInsightsDto
  ) {
    const from = dayjs(getAccountInsightsDto.from);
    const until = dayjs(getAccountInsightsDto.until);

    if (from.isAfter(until)) {
      throw new HttpException(
        "From can not be after until",
        HttpStatus.BAD_REQUEST
      );
    }

    const connectedAccount = await this.getConnectedAccount(
      id,
      spaceSlug,
      userId
    );
    const connectAccountWithToken = await this.getConnectedAccountWithToken(
      connectedAccount,
      spaceSlug
    );

    const nowMinus28 = dayjs().subtract(28, "days");

    const insights = await this.fbServive.getGeneralIGInsights(
      connectAccountWithToken.token,
      connectedAccount.plateformId,
      from.unix(),
      until.unix()
    );

    return { ...insights, paging: undefined };
  }

  async getConnectedAccountWithToken(
    connectedAccount: ConnectedAccount,
    spaceSlug: string
  ) {
    const accountWithToken = await this.connectedAccountRepository.findOne({
      where: { id: connectedAccount.id },
      select: ["id", "token"],
    });
    if (!accountWithToken) {
      throw new NotFoundException();
    }

    const rawToken = this.fbServive.decryptToken(accountWithToken.token);

    if (spaceSlug !== rawToken.spaceSlug) {
      throw new Error("An error occured");
    }

    return { ...connectedAccount, token: rawToken.accessToken };
  }
}
