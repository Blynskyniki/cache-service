import { MemoryEngine } from '../Engines/Memory';
import { TypedCache } from '../index';

describe('Check client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('Instance', async () => {
    const service = await TypedCache.getInstance<string>({
      ttl: 0,
    });
    expect('_ttl' in service).toBe(true);
    expect('_engine' in service).toBe(true);
  });
  test('Check base operations', async () => {
    const service = await TypedCache.getInstance<string>({
      ttl: 1,
      engine: new MemoryEngine<string>(),
    });

    const key1 = await service.set('myCacheString1');

    const key2 = await service.setAutoUpdateCache(async () => {
      return 'myCacheString2';
    }, 15);
    const res1 = await service.get(key1);

    const mget = await service.mget([key1, key2]);

    expect(res1).toEqual('myCacheString1');

    expect(mget).toEqual(['myCacheString1', 'myCacheString2']);

    await service.del(key1);
    const deletedKeyRes = await service.get(key1);
    expect(deletedKeyRes).toEqual(undefined);
  });
});
