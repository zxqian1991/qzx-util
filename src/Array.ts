export interface IArrayDiff<T> {
  deleted: T[];
  added: T[];
  keep: T[];
}
/**
 * 比较两个数组的异同
 * @param oData 对比的数组(旧的，基数)
 * @param nData 对比的数组
 * @param getValue 获取数组的key
 * @returns
 */
export function findArrayDiff<T, K>(
  oData: T[],
  nData: T[],
  getValue: (v: T) => K = (v) => v as any
) {
  const oMap = new Map<K, T>();
  oData.forEach((d) => oMap.set(getValue(d), d));
  const result: IArrayDiff<T> = {
    deleted: [],
    added: [],
    keep: [],
  };
  nData.forEach((d) => {
    const v = getValue(d);
    if (!oMap.has(v)) {
      result.added.push(d);
    } else {
      result.keep.push(d);
    }
    oMap.delete(v);
  });
  oMap.forEach((d) => result.deleted.push(d));
  return result;
}

/**
 * 自动生成数组成
 * @param size 数组的大小
 * @param gene 生成数组的逻辑
 * @returns
 */
export function generateArray<T>(size: number, gene: (index: number) => T) {
  const arr: T[] = [];
  for (let i = 0; i < size; i++) {
    arr.push(gene(i));
  }
  return arr;
}

/**
 * 将一堆数组转换成有关系的树
 * @param nodes 所有的节点
 * @param param1 生成树的逻辑
 * @returns
 */
export function generateTreeByArray<T, K = T>(
  nodes: T[],
  {
    id = "id",
    children = "children",
    parent = "parent_id",
  }: { children?: string; id?: string; parent?: string }
): K[] {
  const res: K[] = [];
  const map = new Map<any, any>();
  const cache = new Map<any, any[]>();
  for (let i in nodes) {
    const node: any = nodes[i];
    // 这表示 之前有人用到我了
    if (cache.has(node[id])) {
      node[children] = cache.get(node[id]);
      // 可以删掉了 不需要了
      cache.delete(node[id]);
    }
    // 不存在父节点
    const parentId = node[parent];
    if (!parentId) {
      res.push(node);
    } else {
      // 存在父节点，我要找到它的父节点
      if (map.has(parentId)) {
        const parentNode = map.get(parentId);
        if (!parentNode[children]) {
          parentNode[children] = [];
        }
        parentNode[children].push(node);
      } else {
        // 糟了，map里面还没有这个父节点，那么我存储下
        if (!cache.has(parentId)) {
          cache.set(parentId, []);
        }
        // 推进去
        cache.get(parentId)?.push(node);
      }
    }
    map.set(node[id], node);
  }
  return res;
}

/**
 * 将一个数组转换成一个map
 * @param arr 数组
 * @param getKey 每个item的key值获取逻辑
 * @returns
 */
export function toMap<T, K>(arr: T[], getKey: (i: T) => K) {
  const map = new Map<K, T>();
  arr.forEach((i) => {
    const key = getKey(i);
    map.set(key, i);
  });
  return map;
}