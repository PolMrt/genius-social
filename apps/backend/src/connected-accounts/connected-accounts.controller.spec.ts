import { Test, TestingModule } from '@nestjs/testing';
import { ConnectedAccountsController } from './connected-accounts.controller';

describe('ConnectedAccountsController', () => {
  let controller: ConnectedAccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConnectedAccountsController],
    }).compile();

    controller = module.get<ConnectedAccountsController>(ConnectedAccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
