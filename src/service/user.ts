import { injectable } from 'inversify';
import { UserModel } from '../model';
import { pickBy } from 'lodash';

@injectable()
export class UserService {
  async update(
    id: string,
    update: {
      firstName: string;
      lastName: string;
      username: string;
    },
  ): Promise<User> {
    const user = await UserModel.findByIdAndUpdate(id, { $set: pickBy(update) }, { new: true, runValidators: true });

    if (!user) throw new Error('User not found');

    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await UserModel.findById(id);

    if (!user) throw new Error('User not found');

    return user;
  }
}
