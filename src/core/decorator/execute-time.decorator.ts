import { durationToHuman } from 'src/core/utils';
import { Log } from 'src/core/logger/log';

export const ExecuteTime = (): MethodDecorator => {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const logger = new Log('Execute Time');
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const start = Date.now();
      const result = await originalMethod.apply(this, args);
      const end = Date.now();
      logger.log(
        `Class "${target.constructor.name}", method "${propertyKey}" execute time: ${durationToHuman(end - start)}`,
      );
      return result;
    };
    return descriptor;
  };
};
