import { Test, TestingModule } from '@nestjs/testing';
import { FacebookGraphService } from './facebook-graph.service';

describe('FacebookGraphService', () => {
  let service: FacebookGraphService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FacebookGraphService],
    }).compile();

    service = module.get<FacebookGraphService>(FacebookGraphService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
