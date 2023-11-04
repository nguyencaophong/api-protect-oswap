export function isEmail(value: string): boolean {
  return /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(value);
}

export function isPhone(value: string): boolean {
  return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value);
}

export function isStrongPassword(value): boolean {
  return /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(
    value,
  );
}

export function isPositiveInteger(num: number): boolean {
  return num >= 0 && Math.floor(num) === num;
}
