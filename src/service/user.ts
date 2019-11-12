import { injectable } from 'inversify';
import { UserModel } from '../model';

@injectable()
export class UserService {
  async update(id: string, update: { firstName: string; lastName: string }): Promise<User> {
    const user = await UserModel.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true });

    if (!user) throw new Error('User not found');

    return user;
  }
}
