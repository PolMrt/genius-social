import { CreateConnectedAccountDto } from "./dto/create-connected-account.dto";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConnectedAccount } from "./entities/connected-accounts.entity";

@Injectable()
export class ConnectedAccountsService {
  constructor(
    @InjectRepository(ConnectedAccount)
    private readonly connectedAccountRepository: Repository<ConnectedAccount>
  ) {}

  async createConnectedAccount(
    createConnectedAccountDto: CreateConnectedAccountDto
  ) {
    const newCA = this.connectedAccountRepository.create(
      createConnectedAccountDto
    );
    return this.connectedAccountRepository.save(newCA);
  }
}
