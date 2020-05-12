##Library for caching data with many engines(memory,redis,etc...). Every instance typed from your data. If you want create custom engine, please use EngineAbstract<T>.

### Exapmles:   
```typescript
import { TypedCache,MemoryEngine } from './index';

// create service for typed cache
const service = await TypedCache.getInstance<string>({
  ttl: 60000, // in ms
  engine: new MemoryEngine<string>(),
});
// set key
const key1 = await service.set('myCacheString1');
// set auto update key data with ttl
const key2 = await service.setAutoUpdateCache(async () => {
  return 'myCacheString2';
});
// get data from key
const res1 = await service.get(key1);
// get data from multi keys
const mget = await service.mget([key1, key2]);
// delete key
await service.del(key1);
```
