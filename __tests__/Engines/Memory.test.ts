import { MemoryEngine } from '../../Engines/Memory';

describe('Check', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('Memory engine ttl', async () => {
    jest.useFakeTimers();
    const service = new MemoryEngine<string>();
    const key = await service.set('testString', 5);
    console.log('before', service['_storage']);
    expect(service['_storage'].has(key)).toBe(true);
    jest.runAllTimers();
    console.log('after', service['_storage']);
    expect(service['_storage'].has(key)).toBe(false);
  });
  test('Memory engine set/get', async () => {
    jest.useFakeTimers();
    const service = new MemoryEngine<object>();
    const cacheObj = {
      name: 'Niki',
      family: 'Blynsky',
    };
    const key = await service.set(cacheObj, 5);
    console.log('data', service['_storage']);
    const data = await service.get(key);
    expect(cacheObj).toEqual(data);
  });
  test('Memory engine set/del', async () => {
    jest.useFakeTimers();
    const service = new MemoryEngine<object>();
    const cacheObj = {
      name: 'Niki',
      family: 'Blynsky',
    };
    const key = await service.set(cacheObj, 5);
    await service.del(key);
    console.log('data', service['_storage']);
    const data = await service.get(key);
    expect(data).toEqual(undefined);
  });

  test('Memory engine: create autoupdate cache', async () => {
    jest.useFakeTimers();
    const service = new MemoryEngine<object>();
    const fn = jest.fn();
    fn.mockResolvedValueOnce('refresh1');
    fn.mockResolvedValueOnce('refresh2');

    const key = await service.setAutoUpdateCache(fn, 1);
    expect(await service.get(key)).toEqual('refresh1');
    jest.runAllTimers();
    await new Promise(resolve => {
      jest.useRealTimers();
      setTimeout(() => {
        resolve();
      }, 10);
    });
    jest.clearAllTimers();
    expect(await service.get(key)).toEqual('refresh2');
  });
});
