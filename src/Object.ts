export function getValue<K = any, T = any>(
  v: T,
  ...args: (string | string[])[]
): K | undefined | null {
  // 没有任何传参 原路返回
  if (!args || args.length === 0) return v as any;
  const type = typeof v;
  if (v === null || type === "undefined") return v as any;
  if (args.length === 1 && typeof args[0] === "string") {
    return (v as any)[args[0] as string] as K;
  }
  let temp: any = v;
  for (let i = 0; i < args.length; i++) {
    const value = args[i];
    temp = Array.isArray(value)
      ? getValue<T, K>(temp, ...value)
      : getValue<T, K>(temp, value);
    if (temp === null || temp === undefined) return temp as K;
  }
  return temp as K;
}
