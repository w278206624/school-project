module.exports = function (path, router, db) {
	router.post(path, (ctx, next) => {
		const data = ctx.request.body;
		const tab = db.selectTab("article");
		tab[+data.id] = {
			...data,
			date: Date.now(),
		};
		db.modifyTab(tab, "article");
		ctx.status = 200;
		ctx.body = {
			code: 0,
			msg: "添加成功",
		};
		return next();
	});
};