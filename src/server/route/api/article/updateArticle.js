module.exports = function (path, router, db) {
	router.put(path, (ctx, next) => {
		const tab = db.selectTab("article");
		const data = ctx.request.body;
		const id = +data.id;
		if (tab[id]) {
			Object
				.keys(data)
				.forEach(key => {
					tab[id][key] = data[key];
				});
			db.modifyTab(tab, "article");
			ctx.status = 200;
			ctx.body = {
				code: 0,
				msg: "编辑文章成功",
			}
		} else {
			ctx.status = 404;
			ctx.body = {
				code: 1,
				msg: "编辑的文章不存在",
			}
		}
	});
};