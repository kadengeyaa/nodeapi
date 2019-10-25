import { injectable, inject } from 'inversify';
import argon2 from 'argon2';
import { UserModel } from '../model';
import { UserEventEmitter } from '../event';

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

    user = user.toObject();

    delete user.password;

    this.userEventEmitter.emit('sign_up', user);

    return user;
  }

  async signIn(userSignIn: UserSignIn): Promise<User> {
    const { username, password } = userSignIn;

    let user = await UserModel.findOne({ username });

    if (!user) throw new Error('User not registered');

    const correct = await argon2.verify(user.password, password);

    if (!correct) throw new Error('Password incorrect');

    user = user.toObject();

    delete user.password;

    this.userEventEmitter.emit('sign_in', user);

    return user;
  }
}
