import { injectable } from 'inversify';
import { pickBy } from 'lodash';
import { User, UserModel, UserDocument } from '../../model/user/user';
import { PageOptions, PageResult, Query } from '../../plugin/types';

@injectable()
export class UserService {
  async update(
    userId: string,
    update: {
      username?: User['username'];
      firstName?: User['firstName'];
      lastName?: User['lastName'];
      phoneNumber?: User['phoneNumber'];
      email?: User['email'];
      role?: User['role'];
      status?: User['status'];
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

  async findById(userId: string): Promise<UserDocument> {
    const user = await UserModel.findById(userId);

    if (!user) throw new Error('User not found');

    return user;
  }

  async delete(userId: string): Promise<User> {
    const user = await UserModel.findById(userId);

    if (!user) throw new Error('User not found');

    await user.remove();

    return user;
  }

  async page(query: Query, pageOptions: PageOptions): Promise<PageResult<User>> {
    let page: PageResult<User>;

    const { q } = query;

    if (q) {
      const docs = await UserModel.look(q);

      page = { docs, limit: docs.length, total: docs.length, sort: q, page: 1, pages: 1 };
    } else {
      page = await UserModel.page(pickBy(query), pageOptions);
    }

    return page;
  }
}
