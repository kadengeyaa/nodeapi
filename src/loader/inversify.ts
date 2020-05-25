import { Container } from 'inversify';
import { AuthService } from '../service/auth';
import { UserEventEmitter } from '../event';
import { UserService } from '../service/user';
import { AccessControlService, AccessInfoService } from '../service/access';
import { AuthMiddleware } from '../api/middleware/auth';

export function getContainer(): Container {
  const container = new Container({ skipBaseClassChecks: true });
  container.bind<AuthService>(AuthService).to(AuthService);
  container.bind<UserEventEmitter>(UserEventEmitter).to(UserEventEmitter);
  container.bind<UserService>(UserService).to(UserService);
  container.bind<AccessInfoService>(AccessInfoService).to(AccessInfoService);
  container.bind<AccessControlService>(AccessControlService).to(AccessControlService);
  container.bind<AuthMiddleware>(AuthMiddleware).to(AuthMiddleware);

  return container;
}
