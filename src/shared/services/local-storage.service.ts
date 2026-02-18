import { ClsService } from 'nestjs-cls';

import { ILocalStorageStore } from '@/shared/interfaces/local-storage.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalStorageService extends ClsService<ILocalStorageStore> {}
