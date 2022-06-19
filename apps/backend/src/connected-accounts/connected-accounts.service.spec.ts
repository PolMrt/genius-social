import { Test, TestingModule } from '@nestjs/testing';
import { ConnectedAccountsService } from './connected-accounts.service';

describe('ConnectedAccountsService', () => {
  let service: ConnectedAccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectedAccountsService],
    }).compile();

    service = module.get<ConnectedAccountsService>(ConnectedAccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
