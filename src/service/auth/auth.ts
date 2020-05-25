import { injectable, inject } from 'inversify';
import { generate } from 'randomstring';
import { TokenService } from '../token/token';
import argon2 from 'argon2';
import { UserEventEmitter } from '../../event/user/user';
import { ObjectID } from 'mongodb';
import { User, UserDocument, UserModel } from '../../model/user/user';
import { PROJECT_OTP_LENGTH, PROJECT_NAME, PROJECT_OTP_EXPIRY } from '../../config/project';
import { pickBy } from 'lodash';
import { SmsNotificationEventEmitter } from '../../event/notification/smsNotification';

interface RegistrationInput {
  firstName: User['firstName'];
  lastName: User['lastName'];
  phoneNumber: User['phoneNumber'];
  email: User['email'];
}

interface AuthResult {
  user: UserDocument;
  token: string;
}

interface LoginInput {
  identifier: User['username'] | User['phoneNumber'] | User['email'] | string;
}

@injectable()
export class AuthService {
  @inject(UserEventEmitter)
  private userEventEmitter: UserEventEmitter;

  @inject(SmsNotificationEventEmitter)
  private smsNotificationEventEmitter: SmsNotificationEventEmitter;

  @inject(TokenService)
  private tokenService: TokenService;

  async register(data: RegistrationInput, options: { password: string; verify?: boolean }): Promise<AuthResult> {
    const { password, verify } = options;

    const { email, phoneNumber } = data;

    const existingUser = await UserModel.findOne({ $or: [{ email }, { phoneNumber }] });

    if (existingUser) throw new Error('User already registered');

    const hash = await argon2.hash(password);

    const user = new UserModel({
      ...pickBy(data),
      ...{ password: hash },
    });

    await user.validate();

    let token: string;

    if (verify) {
      const code = generate({ length: PROJECT_OTP_LENGTH, charset: '0123456789' });

      this.smsNotificationEventEmitter.emit('send-sms', {
        purpose: 'register',
        to: phoneNumber,
        message: `${PROJECT_NAME}code is ${code}`,
      });

      token = this.tokenService.encode({ data, code, password }, { expiresIn: PROJECT_OTP_EXPIRY });
    } else {
      await user.save();

      token = this.tokenService.encode({ _id: user._id, verified: true });
    }

    this.userEventEmitter.emit('user_register', user);

    return { user: user, token };
  }

  async verifyRegister(data: { token: string; verificationCode: string }): Promise<AuthResult> {
    const { token, verificationCode } = data;

    const decodedToken: {
      data: RegistrationInput;
      code: string;
      password: string;
    } = await this.tokenService.decode(token);

    const { data: registrationInput, code, password } = decodedToken;

    if (code !== verificationCode) throw new Error('Verification code is incorrect');

    const result = await this.register(registrationInput, { password });

    this.userEventEmitter.emit('user_register_verify', result.user);

    return result;
  }

  async login(
    data: LoginInput,
    options: {
      password: string;
      verify?: boolean;
    },
  ): Promise<AuthResult> {
    const { identifier } = data;

    const query: { $or: { username?: string; phoneNumber?: string; email?: string; _id?: string }[] } = {
      $or: [{ username: identifier }, { phoneNumber: identifier }, { email: identifier }],
    };

    if (ObjectID.isValid(identifier)) {
      query.$or.push({ _id: identifier });
    }

    const user = await UserModel.findOne(query);

    if (!user) throw new Error('User not registered');

    const { password, verify } = options;

    const correct = await argon2.verify(user.password, password);

    if (!correct) throw new Error('Password incorrect');

    let token: string;
    // let code: string;
    const { phoneNumber } = user;

    if (verify) {
      const code = generate({ length: PROJECT_OTP_LENGTH, charset: '0123456789' });

      this.smsNotificationEventEmitter.emit('send-sms', {
        purpose: 'login',
        to: phoneNumber,
        message: `${PROJECT_NAME} code is ${code}`,
      });

      token = this.tokenService.encode({ data, code, password }, { expiresIn: PROJECT_OTP_EXPIRY });
    } else {
      token = this.tokenService.encode({ _id: user._id, verified: true });
    }

    this.userEventEmitter.emit('user_login', user);

    return { user, token };
  }

  async verifyLogin(data: { token: string; verificationCode: string }): Promise<AuthResult> {
    const { token, verificationCode } = data;

    const decodedToken: {
      data: LoginInput;
      code: string;
      password: string;
    } = await this.tokenService.decode(token);

    const { data: loginInput, code, password } = decodedToken;

    if (code !== verificationCode) throw new Error('Verification code is incorrect');

    const result = await this.login(loginInput, { password });

    this.userEventEmitter.emit('user_login_verify', result.user);

    return result;
  }

  async changePassword(
    data: { identifier: string },
    options: { currentPassword: string; newPassword: string },
  ): Promise<AuthResult> {
    const { identifier } = data;

    const query: { $or: { username?: string; phoneNumber?: string; email?: string; _id?: string }[] } = {
      $or: [{ username: identifier }, { phoneNumber: identifier }, { email: identifier }],
    };

    if (ObjectID.isValid(identifier)) {
      query.$or.push({ _id: identifier });
    }

    const user = await UserModel.findOne(query);

    if (!user) throw new Error('User not registered');

    const { currentPassword, newPassword } = options;

    const correct = await argon2.verify(user.password, currentPassword);

    if (!correct) throw new Error('Password incorrect');

    const hash = await argon2.hash(newPassword);

    user.password = hash;

    await user.save();

    const result = await this.login({ identifier }, { password: newPassword });

    this.userEventEmitter.emit('user_password_change', user);

    return result;
  }

  async setPassword(data: LoginInput, options: { password: string; verify?: boolean }): Promise<AuthResult> {
    const { identifier } = data;

    const query: { $or: { username?: string; phoneNumber?: string; email?: string; _id?: string }[] } = {
      $or: [{ username: identifier }, { phoneNumber: identifier }, { email: identifier }],
    };

    if (ObjectID.isValid(identifier)) {
      query.$or.push({ _id: identifier });
    }

    const user = await UserModel.findOne(query);

    if (!user) throw new Error('User not registered');

    const { password, verify } = options;

    const { phoneNumber } = user;

    if (verify) {
      const code = generate({ length: PROJECT_OTP_LENGTH, charset: '0123456789' });

      this.smsNotificationEventEmitter.emit('send-sms', {
        purpose: 'password-change',
        to: phoneNumber,
        message: `${PROJECT_OTP_LENGTH} code is ${code}`,
      });

      const token = this.tokenService.encode({ data, code, password }, { expiresIn: PROJECT_OTP_EXPIRY });

      return { user, token };
    }

    const hash = await argon2.hash(password);

    user.password = hash;

    await user.save();

    const result = await this.login(data, { password });

    this.userEventEmitter.emit('user_password_change', result.user);

    return result;
  }

  async verifySetPassword(data: { token: string; verificationCode: string }): Promise<AuthResult> {
    const { token, verificationCode } = data;

    const decodedToken: {
      data: LoginInput;
      code: string;
      password: string;
    } = await this.tokenService.decode(token);

    const { data: loginInput, code, password } = decodedToken;

    if (code !== verificationCode) throw new Error('Verification code is incorrect');

    const result = await this.setPassword(loginInput, { password });

    this.userEventEmitter.emit('user_login_verify', result.user);

    return result;
  }
}
