module.exports = function (path, router, db) {
	router.get(path, (ctx, next) => {
		ctx.set("Content-Type", "application/json");
		ctx.status = 200;
		ctx.body = {
			code: 0,
			msg: "获取轮播图成功",
			data: db.selectTab("carousel"),
		};
		return next();
	});
};