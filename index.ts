import { EngineAbstract } from './Engines/Abstract';
import { MemoryEngine } from './Engines/Memory';
import {  IOptions } from './Interfaces';

/**
 * ttl in seconds
 */
export class CacheService<T = any> {
  private static _instance: CacheService | null;
  private _engine: EngineAbstract<T>;
  private _ttl: number;

  private constructor(opts: IOptions) {
    this._ttl = opts.ttl;
    this._engine = opts.engine || new MemoryEngine();
  }

  public static async getInstance<T>(opts: IOptions<T>): Promise<CacheService<T>> {
    if (!this._instance) {
      this._instance = new CacheService<T>(opts);
    }
    return this._instance;
  }

  public async set(data: T, ttl?: number): Promise<string> {
    return this._engine.set(data, ttl || this._ttl);
  }
  public async get(key: string): Promise<T | undefined> {
    return this._engine.get(key);
  }
  public async del(key: string): Promise<void> {
    return this._engine.del(key);
  }
  public async setAutoUpdateCache(fn: () => Promise<T>, refreshTtl?: number): Promise<string> {
    return this._engine.setAutoUpdateCache(fn, refreshTtl || this._ttl);
  }
  public async mget(keys: string[]): Promise<Array<T | undefined>> {
    return this._engine.mget(keys);
  }
}
