import { EventEmitter } from 'events';
import { logger } from '../loader';

type USER_EVENT = 'sign_in' | 'sign_up';

interface UserEventEmitter {
  on(event: USER_EVENT, listener: (user: User) => void): this;
  emit(event: USER_EVENT, user: User): boolean;
}

class UserEventEmitter extends EventEmitter {}

const eventEmitter = new UserEventEmitter();

eventEmitter.on('sign_up', user => {
  logger.info('EVENT_SIGN_UP %o', user);
});

eventEmitter.on('sign_in', user => {
  logger.info('EVENT_SIGN_IN %o', user);
});

export const userEventEmitter = eventEmitter;
