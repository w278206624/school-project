module.exports = function (path, router, db) {
	router.get(path, (ctx, next) => {
		const query = ctx.request.query;
		const tab = db.selectTab("nav");
		let data = tab;
		if (query.id) {
			data = findDataById(tab, query.id);
		}
		if (data) {
			ctx.status = 200;
			ctx.body = {
				code: 0,
				data,
				msg: "获取成功",
			};
		} else {
			ctx.status = 404;
			ctx.body = {
				code: 1,
				data: null,
				msg: "数据不存在",
			};
		}
		return next();
	});
};

function findDataById (dataList, id) {
	for (let i = 0, len = dataList.length; i < len; i++) {
		let data = dataList[i];
		if (data.id === id) {
			return data;
		} else {
			data = findDataById(data.children, id);
			if (data) {
				return data;
			}
		}
	}
}