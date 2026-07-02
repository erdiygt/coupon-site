const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

interface AttemptRecord {
  count: number;
  lockedUntil: number;
}

declare global {
  var __adminLoginAttempts: Map<string, AttemptRecord> | undefined;
}

function getAttemptStore(): Map<string, AttemptRecord> {
  if (!global.__adminLoginAttempts) {
    global.__adminLoginAttempts = new Map();
  }

  return global.__adminLoginAttempts;
}

export function isLoginLocked(ip: string): boolean {
  const record = getAttemptStore().get(ip);

  if (!record) {
    return false;
  }

  if (record.lockedUntil > Date.now()) {
    return true;
  }

  if (record.lockedUntil > 0 && record.lockedUntil <= Date.now()) {
    getAttemptStore().delete(ip);
  }

  return false;
}

export function getLockoutRemainingSeconds(ip: string): number {
  const record = getAttemptStore().get(ip);

  if (!record || record.lockedUntil <= Date.now()) {
    return 0;
  }

  return Math.ceil((record.lockedUntil - Date.now()) / 1000);
}

export function registerFailedLogin(ip: string): void {
  const store = getAttemptStore();
  const current = store.get(ip) ?? { count: 0, lockedUntil: 0 };
  const nextCount = current.count + 1;

  store.set(ip, {
    count: nextCount,
    lockedUntil: nextCount >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : 0,
  });
}

export function clearFailedLogins(ip: string): void {
  getAttemptStore().delete(ip);
}

export function getRemainingAttempts(ip: string): number {
  const record = getAttemptStore().get(ip);

  if (!record) {
    return MAX_ATTEMPTS;
  }

  return Math.max(0, MAX_ATTEMPTS - record.count);
}
