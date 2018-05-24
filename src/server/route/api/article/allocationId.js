module.exports = function (path, router, db) {
	router.get(path, (ctx, next) => {
		const tab = db.selectTab("article");
		const id = tab.push({}) - 1;
		db.modifyTab(tab, "article");
		ctx.body = {
			code: 0,
			data: id,
			msg: "分配id成功",
		};
		return next();
	});
};