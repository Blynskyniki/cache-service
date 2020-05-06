export abstract class EngineAbstract<T> {
  public abstract set(data: T, ttl: number): Promise<string>;
  public abstract get(key: string): Promise<T | undefined>;
  public abstract del(key: string): Promise<void>;
  public abstract setAutoUpdateCache(fn: () => Promise<T>, refreshTtl: number): Promise<string>;
  public abstract mget(keys: string[]): Promise<Array<T | undefined>>;
}
