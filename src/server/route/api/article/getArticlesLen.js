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
		ctx.status = 200;
		ctx.body = {
			code: 0,
			data: tab.length,
			msg: "获取成功",
		};
		return next();
	});
};

function filter (arr, query) {
	let {state, filter, id} = query;
	let result = arr.filter(data => {
		return (state ? data[state] : true)
			&& (filter ? !data[filter] : true)
			&& (id ? data.areaId === id : true);
	});
	return result;
}