# Библиотека для работы с кэшем

```typescript
import { CacheService } from './index';
const service = await CacheService.getInstance<string>({
  ttl: 0,
});
```
