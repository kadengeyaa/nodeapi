import { injectable } from 'inversify';
import { UserModel } from '../model';
import { pickBy } from 'lodash';

@injectable()
export class UserService {
  async update(
    userId: string,
    update: {
      firstName: string;
      lastName: string;
      username: string;
    },
  ): Promise<User> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: pickBy(update) },
      { new: true, runValidators: true },
    );

    if (!user) throw new Error('User not found');

    return user;
  }

  async findById(userId: string): Promise<User> {
    const user = await UserModel.findById(userId);

    if (!user) throw new Error('User not found');

    return user;
  }
}
