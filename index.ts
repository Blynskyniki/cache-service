import { MemoryEngine } from './Engines/Memory';
import { IEngine, IOptions } from './Interfaces';

/**
 * ttl in seconds
 */
export class CacheService<T = any> {
  private static _instance: CacheService | null;
  private _data: T | null;
  private _engine: IEngine<T>;
  private _ttl: number;
  private set data(value: T | null) {
    this._data = value;
  }
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

  public async set(data: T, ttl): Promise<string> {
    return this._engine.set(data, ttl);
  }
  public async get(key: string): Promise<T | null> {
    return this._engine.get(key);
  }
  public async del(key: string): Promise<void> {
    return this._engine.del(key);
  }
}
