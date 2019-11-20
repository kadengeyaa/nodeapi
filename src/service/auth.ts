import { injectable, inject } from 'inversify';
import argon2 from 'argon2';
import { UserModel } from '../model';
import { UserEventEmitter } from '../event';
import { JWT_SECRET } from '../config/jwt';
import { sign, verify } from 'jsonwebtoken';

@injectable()
export class AuthService {
  @inject(UserEventEmitter)
  private userEventEmitter: UserEventEmitter;

  async signUp(userSignUp: UserSignUp): Promise<User> {
    const { username, firstName, lastName, password } = userSignUp;

    let user = await UserModel.findOne({ username });

    if (user) throw new Error('User already registered');

    const hash = await argon2.hash(password);

    user = await new UserModel({
      username,
      firstName,
      lastName,
      password: hash,
    }).save();

    this.userEventEmitter.emit('sign_up', user);

    return user.toJSON();
  }

  async signIn(userSignIn: UserSignIn): Promise<User> {
    const { username, password } = userSignIn;

    const user = await UserModel.findOne({ username });

    if (!user) throw new Error('User not registered');

    const correct = await argon2.verify(user.password, password);

    if (!correct) throw new Error('Password incorrect');

    this.userEventEmitter.emit('sign_in', user);

    return user.toJSON();
  }

  encode(payload: User): string {
    return sign(payload, JWT_SECRET, { expiresIn: '10m' });
  }

  async decode(token: string): Promise<User> {
    return (await verify(token, JWT_SECRET)) as User;
  }
}
