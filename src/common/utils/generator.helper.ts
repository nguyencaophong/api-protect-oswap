import * as crypto from 'crypto';

export function genCode(length): string {
  return '0'
    .repeat(length)
    .split('')
    .map(() => Math.floor(Math.random() * 10))
    .join('');
}

export function genFlagRandom(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let flag = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    flag += characters.charAt(randomIndex);
  }
  return flag;
}

export function genQRCode(dataHash: string): string {
  return crypto
    .createHmac('sha256', 'AT_SECRET_ENTERPRISE')
    .update(dataHash)
    .digest('hex');
}

export function randomPositiveInteger(): number {
  const randomNumber = Math.random();
  const result = Math.floor(randomNumber * Number.MAX_SAFE_INTEGER) + 1;
  return result;
}
