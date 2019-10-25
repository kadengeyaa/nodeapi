import { EventEmitter } from 'events';
import { logger } from '../loader';
import { injectable, decorate } from 'inversify';

decorate(injectable(), EventEmitter);

type USER_EVENT = 'sign_in' | 'sign_up';

export interface UserEventEmitter {
  on(event: USER_EVENT, listener: (user: User) => void): this;
  emit(event: USER_EVENT, user: User): boolean;
}

@injectable()
export class UserEventEmitter extends EventEmitter {
  constructor() {
    super();

    this.on('sign_up', user => {
      logger.info('EVENT_SIGN_UP %o', user);
    });

    this.on('sign_in', user => {
      logger.info('EVENT_SIGN_IN %o', user);
    });
  }
}
