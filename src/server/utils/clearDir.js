const fs = require("fs");
const walkDir = require("./walkDir");

module.exports = function (path, filter = () => true, sync = false) {
	if (fs.existsSync(path)) {
		walkDir(path, (filePath) => {
			if (filter(filePath) === true) {
				if (sync) {
					fs.unlinkSync(filePath);
				} else {
					fs.unlink(filePath, (err) => {
						if (err) {
							console.log(err);
						}
					});
				}
			}
		});
	}
};



