import * as crypto from 'crypto';

export class StringUtils {
  static randomAlpha(length = 8): string {
    return Math.random().toString(36).slice(2, 2 + length);
  }

  static randomEmail(domain = 'test.com'): string {
    return `test_${this.randomAlpha(6)}@${domain}`;
  }

  static randomInt(min = 1, max = 1000): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static uuid(): string {
    return crypto.randomUUID();
  }

  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  static toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  static maskSensitive(value: string, visibleChars = 4): string {
    if (value.length <= visibleChars) return '*'.repeat(value.length);
    return '*'.repeat(value.length - visibleChars) + value.slice(-visibleChars);
  }
}

export class DateUtils {
  static today(): string {
    return new Date().toISOString().split('T')[0];
  }

  static addDays(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  }

  static format(date: Date, format = 'YYYY-MM-DD'): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return format.replace('YYYY', String(y)).replace('MM', m).replace('DD', d);
  }

  static nowMs(): number {
    return Date.now();
  }
}
