export type RollbackExecuteParams<T = void> = {
  execute: RollbackCallbackFn<T>;
  rollback?: RollbackCallbackFn;
};

export type RollbackCallbackFn<T = void> = () => T | Promise<T>;
