import { Container } from 'inversify';
import { AuthService } from '../service/auth';

const _container = new Container();

export function initInjection(): void {
  _container.bind<AuthService>(AuthService);
}

export const container = _container;
