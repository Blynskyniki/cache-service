import { EngineAbstract } from '../Engines/Abstract';

export interface IEngine<T = any> {
  set: (data: T, ttl: number) => Promise<string>;
  get: (key: string) => Promise<T | null>;
  del: (key: string) => Promise<void>;
}
export interface IOptions<T = any> {
  engine?: EngineAbstract<T>;
  ttl: number;
  refreshFn?: () => Promise<T>;
}
