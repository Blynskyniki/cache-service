import { EngineAbstract } from '../Engines/Abstract';

export interface IOptions<T = any> {
  engine?: EngineAbstract<T>;
  ttl: number;
}
