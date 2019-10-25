import { Container } from 'inversify';
import { AuthService } from '../service/auth';
import { UserEventEmitter } from '../event';

const _container = new Container();

export function initDI(): void {
  _container.bind<AuthService>(AuthService).to(AuthService);
  _container.bind<UserEventEmitter>(UserEventEmitter).to(UserEventEmitter);
}

export const container = _container;
