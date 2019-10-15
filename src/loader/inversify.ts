import { Container } from 'inversify';
import { AuthService } from '../service/auth';

const _container = new Container();

export function initDI(): void {
  _container.bind<AuthService>(AuthService).to(AuthService);
}

export const container = _container;
