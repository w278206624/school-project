module.exports = function (path, router, db) {
	router.get(path, (ctx, next) => {
		const tab = db.selectTab("article");
		const query = ctx.request.query;
		const data = tab[+query.id];
		if (data) {
			ctx.set("Content-Type", "application/json");
			ctx.status = 200;
			ctx.body = {
				data,
				code: 0,
				msg: "获取文章成功",
			};
		} else {
			ctx.set("Content-Type", "text/plain");
			ctx.status = 404;
			ctx.body = {
				code: 1,
				data: null,
				msg: "文章不存在",
			};
		}
		return next();
	})
};