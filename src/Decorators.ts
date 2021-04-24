import { XPromise, Throttle, Debounce } from "./Async";
/**
 * @author [qianzhixiang]
 * @email [zxqian1991@163.com]
 * @create date 2019-12-12 10:04:00
 * @modify date 2019-12-12 10:04:00
 * @desc [自动绑定this]
 */

export function autobind(
  target: (...args: any[]) => any,
  key: string,
  { configurable, enumerable, set, value }: PropertyDescriptor
) {
  return {
    configurable,
    enumerable,
    // value, 这个值设置后不能设置get set
    set,
    get() {
      return value.bind(this);
    },
  };
}

export function DecoretorOfPendding() {
  return (target: object, property: string, descriptor: PropertyDescriptor) => {
    const map = new Map<any, XPromise>();
    const value = descriptor.value;
    descriptor.value = function () {
      if (map.has(this)) {
        return map.get(this)?.wait();
      }
      const promise = new XPromise();
      map.set(this, promise);
      promise.wait().then(() => map.delete(this));
      return promise.resolve?.(value.apply(this, arguments));
    };
  };
}

export function DecoratorOfThrottle(timeout = 300) {
  return (target: object, property: string, descriptor: PropertyDescriptor) => {
    const value = descriptor.value;
    const map = new Map<any, Throttle>();
    descriptor.value = function () {
      if (map.has(this)) {
        return map.get(this)?.wait();
      }
      const throttle = new Throttle(timeout);
      map.set(this, throttle);
      throttle.wait().then(() => map.delete(this));
      return throttle.execute(() => value.apply(this, arguments));
    };
  };
}

export function DecoratorOfDebounce(timeout = 300) {
  return (target: object, property: string, descriptor: PropertyDescriptor) => {
    const value = descriptor.value;
    const map = new Map<any, Debounce>();
    descriptor.value = function () {
      if (map.has(this)) {
        return map.get(this)?.wait();
      }
      const debounce = new Debounce(timeout);
      map.set(this, debounce);
      debounce.wait().then(() => map.delete(this));
      return debounce.execute(() => value.apply(this, arguments));
    };
  };
}
