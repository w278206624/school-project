module.exports = function (path, router, db) {
	router.get(path, (ctx, next) => {
		const tab = db.selectTab("article");
		const id = ctx.request.query.id;
		ctx.status = 200;
		ctx.body = {
			data: tab.filter(item => !!item && item.areaId === id),
			msg: "获取成功",
		};
		return next();
	});
};