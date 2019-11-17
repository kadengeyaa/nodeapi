import { Container } from 'inversify';
import { AuthService } from '../service/auth';
import { UserEventEmitter } from '../event';
import { UserService } from '../service/user';
import { AccessControlService, AccessInfoService } from '../service/access';

const _container = new Container();

export function initDI(): void {
  _container.bind<AuthService>(AuthService).to(AuthService);
  _container.bind<UserEventEmitter>(UserEventEmitter).to(UserEventEmitter);
  _container.bind<UserService>(UserService).to(UserService);
  _container.bind<AccessInfoService>(AccessInfoService).to(AccessInfoService);
  _container.bind<AccessControlService>(AccessControlService).to(AccessControlService);
}

export const container = _container;
