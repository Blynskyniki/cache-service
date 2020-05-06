import { EventEmitter } from 'events';
import { EngineAbstract } from './Abstract';
import * as uuid from 'uuid';
import Timeout = NodeJS.Timeout;
export class MemoryEngine<T> extends EngineAbstract<T> {
  private _events = new EventEmitter();
  private _storage = new Map<string, T>();
  private _timeoutStorage = new Map<string, Timeout>();

  constructor() {
    super();
    this._events.on('expire', key => {
      this._storage.delete(key);
    });
    this._events.on('refresh', async (key, fn, refreshTtl) => {
      const data = await fn();

      this._storage.set(key, data);

      const tId = setTimeout(() => {
        this._events.emit('refresh', key, fn, refreshTtl);
      }, refreshTtl * 1000);
      this._timeoutStorage.set(key, tId);
    });
  }

  public async del(key: string): Promise<void> {
    if (this._timeoutStorage.has(key)) {
      const interval = this._timeoutStorage.get(key);
      clearTimeout(<any>interval);
    }
    this._storage.delete(key);
  }

  public async get(key: string): Promise<T | undefined> {
    return this._storage.get(key);
  }

  public async set(data: T, ttl: number): Promise<string> {
    const key = uuid.v4();
    this._storage.set(key, data);
    const tId = setTimeout(() => {
      this._events.emit('expire', key);
    }, ttl * 1000);
    this._timeoutStorage.set(key, tId);
    return key;
  }

  public async setAutoUpdateCache(fn: () => Promise<T>, refreshTtl: number): Promise<string> {
    const key = uuid.v4();
    const data = await fn();
    this._storage.set(key, data);

    const tId = setTimeout(async () => {
      this._events.emit('refresh', key, fn, refreshTtl);
    }, refreshTtl * 1000);

    this._timeoutStorage.set(key, tId);

    return key;
  }

  mget(keys: string[]): Promise<Array<T | undefined>> {
    return Promise.all(keys.map(key => this._storage.get(key)));
  }
}
