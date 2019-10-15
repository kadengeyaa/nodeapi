import { injectable } from 'inversify';
import { randomBytes } from 'crypto';
import argon2 from 'argon2';
import { UserModel } from '../model';

@injectable()
export class AuthService {
  async signUp(userSignUp: UserSignUp): Promise<User> {
    let user = await UserModel.findOne({ username: userSignUp.username });

    if (user) throw new Error('User already registered');

    let salt: Buffer | string = randomBytes(32);

    const password = await argon2.hash(userSignUp.password, { salt });

    salt = salt.toString('hex');

    user = await new UserModel({
      ...userSignUp,
      ...{
        password,
        salt,
      },
    }).save();

    return user;
  }

  async signIn(userSignIn: UserSignIn): Promise<User> {
    const user = await UserModel.findOne({ username: userSignIn.username });

    if (!user) throw new Error('User not registered');

    const correct = await argon2.verify(user.password, userSignIn.password, {
      salt: Buffer.from(user.salt, 'hex'),
    });

    if (!correct) throw new Error('Password incorrect');

    return user;
  }
}
