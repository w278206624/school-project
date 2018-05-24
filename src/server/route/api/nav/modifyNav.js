module.exports = function (path, router, db) {
	router.post(path, async (ctx, next) => {
		ctx.set("Content-Type", "application/json");
		db.modifyTab(ctx.request.body, "nav");
		ctx.status = 200;
		ctx.body = {
			code: 0,
			msg: "保存成功",
		};
		return next();
	});
};