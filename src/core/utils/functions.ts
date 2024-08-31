import { cpus } from 'node:os';
import { FastifyRequest } from 'fastify';
import { IncomingMessage } from 'http';
import { createHash } from 'crypto';
import { v7 as uuidv7 } from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { Duration } from 'luxon';
import { ToHumanDurationOptions } from 'luxon/src/duration';
import crypto from 'node:crypto';
import { Paginator } from 'src/core/repository/paginator';

export const ip = (request: FastifyRequest | IncomingMessage) => {
  const rec = request as any;

  let ip: string =
    rec.headers['x-real-ip'] ||
    rec.headers['x-forwarded-for'] ||
    rec.ip ||
    rec.raw.connection.remoteAddress ||
    rec.raw.socket.remoteAddress ||
    undefined;
  if (ip && ip.split(',').length > 0) {
    ip = ip.split(',')[0];
  }
  return ip;
};

export const hash = (guid: string, algorithm: string = 'sha256'): string => {
  return createHash(algorithm).update(guid).digest('hex');
};

export const random = (size: number = 32): string => {
  return crypto.randomBytes(size).toString('hex');
};

export const uuid7 = () => uuidv7();
export const uuid4 = () => uuidv4();

export const safeJSONParse = (p: any) => {
  try {
    return JSON.parse(p);
  } catch {
    return null;
  }
};

export async function concurrency<T = any>(
  tasks: ((...args: unknown[]) => T)[],
  concurrency: number | null = null,
): Promise<T[]> {
  concurrency = concurrency > 0 ? concurrency : tasks.length;
  const executing = new Set<Promise<any>>();
  async function consume() {
    const [promise, value] = await Promise.race(executing);
    executing.delete(promise);
    return value;
  }
  const results = [];
  for (const task of tasks) {
    const promise = (async () => await task())().then((value) => [
      promise,
      value,
    ]);
    executing.add(promise);
    if (executing.size >= concurrency) {
      results.push(await consume());
    }
  }
  while (executing.size) {
    results.push(await consume());
  }
  return results;
}

export async function asyncPool<T = any>(
  iterable: T[],
  iteratorFn: (item: T, arr: T[]) => any,
  concurrency: number | null = null,
): Promise<T[]> {
  concurrency = concurrency || cpus().length || 2;
  const executing = new Set<Promise<any>>();
  async function consume() {
    const [promise, value] = await Promise.race(executing);
    executing.delete(promise);
    return value;
  }
  const results = [];
  for (const item of iterable) {
    const promise = (async () => await iteratorFn(item, iterable))().then(
      (value) => [promise, value],
    );
    executing.add(promise);
    if (executing.size >= concurrency) {
      results.push(await consume());
    }
  }
  while (executing.size) {
    results.push(await consume());
  }

  return results;
}

export const camelcaseKey = (key: string) =>
  key.replace(/_(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));

export const camelcaseKeys = (obj: any) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(camelcaseKeys);
  }
  const n: any = {};
  Object.keys(obj).forEach((k) => {
    n[camelcaseKey(k)] = camelcaseKeys(obj[k]);
  });
  return n;
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const safePath = (base: string, target: string) => {
  const targetPath = '.' + path.posix.normalize('/' + target);
  return path.join(base, targetPath);
};

export const convertHRToMilliseconds = (
  hrData: number[],
  round: boolean = false,
): number => {
  const [seconds, nanoseconds] = hrData;
  const milliseconds = seconds * 1e3 + nanoseconds * 1e-6;
  if (round) {
    return Number(milliseconds.toFixed(3));
  }
  return Number(milliseconds);
};

export const durationToHuman = (
  elapsedTimeMillis: number,
  opts?: ToHumanDurationOptions,
) => {
  return Duration.fromMillis(elapsedTimeMillis).toHuman(
    Object.assign(
      {
        unitDisplay: 'short',
        maximumFractionDigits: 0,
      },
      opts,
    ),
  );
};

export const arrayWrap = <T>(value: T | T[]): T[] => {
  return Array.isArray(value) ? value : [value];
};

export const arrayIntersection = <T>(a: T[], b: T[]): T[] => {
  const setA = new Set(a);
  return b.filter((value) => setA.has(value));
};

export const arrayDifferenceLeft = <T>(a: T[], b: T[]): T[] => {
  const setB = new Set(b);
  return a.filter((value) => !setB.has(value));
};

export const removePropsObj = <T, K extends keyof T>(
  obj: T,
  props: K[],
): Omit<T, K> => {
  const rest = { ...obj };
  props.forEach((prop) => {
    delete rest[prop];
  });

  return rest;
};

export const isPaginator = (obj: any): obj is Paginator<any> => {
  return !!(obj && obj.meta);
};
