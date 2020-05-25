import { EventEmitter } from 'events';
import { injectable } from 'inversify';
import { User, UserDocument } from '../../model/user/user';
import { logger } from '../../loader/logger';

type UserEvent =
  | 'user_register'
  | 'user_register_verify'
  | 'user_login'
  | 'user_login_verify'
  | 'user_delete'
  | 'user_update'
  | 'user_password_set'
  | 'user_password_change';

export interface UserEventEmitter {
  on(event: UserEvent, listener: (user: UserDocument) => void): this;
  emit(event: UserEvent, user: User): boolean;
}

@injectable()
export class UserEventEmitter extends EventEmitter {
  constructor() {
    super();

    this.on('user_register', (user) => {
      logger.info('user_register %o', user.phoneNumber);
    });

    this.on('user_register_verify', (user) => {
      logger.info('user_register_verify %o', user.phoneNumber);
    });

    this.on('user_login', (user) => {
      logger.info('user_login %o', user.phoneNumber);
    });

    this.on('user_login_verify', (user) => {
      logger.info('user_login_verify %o', user.phoneNumber);
    });

    this.on('user_delete', (user) => {
      logger.info('user_delete %o', user.phoneNumber);
    });

    this.on('user_update', (user) => {
      logger.info('user_update %o', user.phoneNumber);
    });

    this.on('user_password_set', (user) => {
      logger.info('user_password_set %o', user.phoneNumber);
    });

    this.on('user_password_change', (user) => {
      logger.info('user_password_change %o', user.phoneNumber);
    });
  }
}
