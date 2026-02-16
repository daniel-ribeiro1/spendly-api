import { compare, genSalt, hash } from 'bcrypt';

async function encrypt(value: string): Promise<string> {
  const salt = await genSalt(10);
  return hash(value, salt);
}

function compareEncryptedValue(hash: string, value: string): Promise<boolean> {
  return compare(hash, value);
}

export const EncryptionUtil = {
  encrypt,
  compare: compareEncryptedValue,
};
