/**
 * 获取数组指定层数
 * @param {any[]} arrLike 任意类数组
 * @param {number[]} path: 如[0, 1, 1];
 * @param {string} property 指定层级所在属性
 * @returns {any}
 *
 * e.g:
 *  let arr = [0, [1, [2]]];
 *  getLayer(arr, [1, 1]); // output: 2
 *  arr = [
 *  {
 *    title: "测试",
 *    children: [
 *    {
 *    title: "子项"
 *    }
 *    ]
 *  }
 *  ];
 *  getLayer(arr, [0, 0]) // output: undefined
 *  getLayer(arr, [0, 0], "children") //output : {title: 子项 }
 */

export function getLayer<T = any> (arrLike: T[], path: number[], property?: string): T {
	let data = arrLike[path[0]];
	for (let i = 1, len = path.length; i < len; i++) {
		if (property) {
			data = data[property][path[i]];
		} else {
			data = data[path[i]];
		}
	}
	return data;
}