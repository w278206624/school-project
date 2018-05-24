module.exports = function (path, router) {
	router.get(path, (ctx, next) => {
		ctx.status = 200;
		ctx.body = {
			data: ctx.request,
		};
		return next();
	});
};