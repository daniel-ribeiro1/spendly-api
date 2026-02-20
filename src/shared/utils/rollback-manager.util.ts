import {
  RollbackCallbackFn,
  RollbackExecuteParams,
} from '@/shared/types/rollback.type';

export class RollbackManager {
  private readonly rollbacks: RollbackCallbackFn<unknown>[] = [];

  async try<T>({
    execute: run,
    rollback,
  }: RollbackExecuteParams<T>): Promise<T> {
    try {
      const result = await run();

      if (rollback) this.rollbacks.push(rollback);

      return result;
    } catch (error) {
      if (rollback) await rollback();

      for (const rollback of this.rollbacks.reverse()) {
        await rollback();
      }

      throw error;
    }
  }

  async forceRollback(): Promise<void> {
    for (const rollback of this.rollbacks.reverse()) {
      await rollback();
    }
  }
}
