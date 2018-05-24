module.exports = function (path, router, db) {
	router.post(path, (ctx, next) => {
		const {areaId, ids} = ctx.request.body;
		if (areaId && Array.isArray(ids)) {
			const tab = db.selectTab("article");
			ids.forEach(id => {
				tab[id].areaId = areaId;
			});
			ctx.status = 200;
			ctx.body = {
				msg: "连接成功",
			}
		} else {
			ctx.status = 400;
			ctx.body = {
				msg: "参数错误",
			}
		}
		return next();
	});
}