import { CreateConnectedAccountDto } from "./dto/create-connected-account.dto";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConnectedAccount } from "./entities/connected-accounts.entity";
import { SpacesService } from "../spaces/spaces.service";

@Injectable()
export class ConnectedAccountsService {
  constructor(
    @InjectRepository(ConnectedAccount)
    private readonly connectedAccountRepository: Repository<ConnectedAccount>,
    private readonly spacesService: SpacesService
  ) {}

  async getConnectedAccounts(spaceSlug: string, userId: number) {
    const userSpace = await this.spacesService.getUserSpace(userId, spaceSlug);
    const connectedAccounts = await this.connectedAccountRepository.find({
      where: { space: userSpace },
    });
    return connectedAccounts;
  }

  async createConnectedAccount(
    createConnectedAccountDto: CreateConnectedAccountDto
  ) {
    const newCA = this.connectedAccountRepository.create(
      createConnectedAccountDto
    );
    return this.connectedAccountRepository.save(newCA);
  }
}
