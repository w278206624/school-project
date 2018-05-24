module.exports = function (path, router, db) {
	router.get(path, (ctx, next) => {
		const query = ctx.request.query;
		const tab = filter(
			db
				.selectTab("article")
				.filter(data => data && Object.keys(data).length)
				.sort((a, b) => b.date - a.date),
			query,
		);
		const offset = +query.offset || 0;
		const limit = +query.limit || tab.length;
		const len = offset + limit;
		const data = tab.slice(offset, len);
		ctx.status = 200;
		ctx.body = {
			code: 0,
			data,
			count: tab.length,
			msg: "获取成功",
		};
		return next();
	});
};

function filter (arr, query) {
	let {selects, filters, sort, ids, topLevel} = query;
	selects = selects && JSON.parse(selects);
	filters = filters && JSON.parse(filters);
	ids = ids && JSON.parse(ids);
	let result = arr.filter(data => {
		return (selects ? selects.every(select => select ? data[select] : true) : true)
			&& (filters ? filters.every(filter => filter ? !data[filter] : true) : true)
			&& (ids ? ids.some(id => data.areaId === id) : true)
			&& (typeof topLevel !== "undefined" ? data.topLevel === +topLevel : true);
	});

	if (sort === "top") {
		result.sort((a, b) => b.topLevel - a.topLevel);
	}

	return result;
}