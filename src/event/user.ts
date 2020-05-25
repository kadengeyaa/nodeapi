import { EventEmitter } from 'events';
import { injectable } from 'inversify';
import { logger } from '../loader/logger';

type USER_EVENT = 'sign_in' | 'sign_up';

export interface UserEventEmitter {
  on(event: USER_EVENT, listener: (user: User) => void): this;
  emit(event: USER_EVENT, user: User): boolean;
}

@injectable()
export class UserEventEmitter extends EventEmitter {
  constructor() {
    super();

    this.on('sign_up', (user) => {
      logger.info('sign-up %o', user);
    });

    this.on('sign_in', (user) => {
      logger.info('sign-in %o', user);
    });
  }
}
