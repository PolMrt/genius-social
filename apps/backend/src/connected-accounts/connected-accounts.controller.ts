import { ConnectedAccountsService } from "./connected-accounts.service";
import { Controller } from "@nestjs/common";

@Controller("space/:spaceSlug/connected-accounts")
export class ConnectedAccountsController {
  constructor(
    private readonly connectedAccountsService: ConnectedAccountsService
  ) {}
}
