import { CacheService } from '../index';

describe('Check', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('Instance', async () => {
    const service = await CacheService.getInstance<string>({
      ttl: 0,
    });
    console.log(service);
    expect('_ttl' in service).toBe(true);
    expect('_engine' in service).toBe(true);
  });
});
