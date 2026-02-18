import { TransactionFolderEntity } from '@/modules/transaction-folder/entities/transaction-folder.entity';
import { PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateTransactionFolderDto extends PickType(
  TransactionFolderEntity,
  ['name', 'description', 'image'],
) {}

export class CreateTransactionFolderResponseDto implements Omit<
  TransactionFolderEntity,
  'isActive' | 'userId'
> {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string | null;

  @Expose()
  image: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
