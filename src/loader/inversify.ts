import { Container } from 'inversify';
import { AuthService } from '../service/auth/auth';
import { UserService } from '../service/user/user';
import { AccessControlService, AccessInfoService } from '../service/access/access';
import { Auth0Middleware, Auth2Middleware } from '../api/middleware/auth';
import { UserEventEmitter } from '../event/user/user';
import { PermitAdminMiddleware } from '../api/middleware/permission';
import { UploadCheckerMiddleware } from '../api/middleware/upload';
import { TokenService } from '../service/token/token';
import { SmsService } from '../service/sms/sms';

export function getContainer(): Container {
  const container = new Container({ skipBaseClassChecks: true });
  container.bind<AuthService>(AuthService).to(AuthService);
  container.bind<UserEventEmitter>(UserEventEmitter).to(UserEventEmitter);
  container.bind<UserService>(UserService).to(UserService);
  container.bind<AccessInfoService>(AccessInfoService).to(AccessInfoService);
  container.bind<AccessControlService>(AccessControlService).to(AccessControlService);
  container.bind<Auth0Middleware>(Auth0Middleware).to(Auth0Middleware);
  container.bind<Auth2Middleware>(Auth2Middleware).to(Auth2Middleware);
  container.bind<PermitAdminMiddleware>(PermitAdminMiddleware).to(PermitAdminMiddleware);
  container.bind<UploadCheckerMiddleware>(UploadCheckerMiddleware).to(UploadCheckerMiddleware);
  container.bind<TokenService>(TokenService).to(TokenService);
  container.bind<SmsService>(SmsService).to(SmsService);

  return container;
}
