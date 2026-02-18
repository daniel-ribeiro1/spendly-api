import { compare, genSalt, hash } from 'bcrypt';

export const EncryptionUtil = {
  encrypt: async (value: string): Promise<string> => {
    const salt = await genSalt(10);

    return hash(value, salt);
  },
  compare: (value: string, hash: string): Promise<boolean> => {
    return compare(value, hash);
  },
};
