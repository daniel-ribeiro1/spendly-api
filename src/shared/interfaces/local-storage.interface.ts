import { ClsStore } from 'nestjs-cls';

import { User } from '@prisma/client';

export interface ILocalStorageStore extends ClsStore {
  requester: Pick<User, 'id' | 'name' | 'email'>;
}
