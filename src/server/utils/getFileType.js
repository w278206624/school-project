const readChunk = require("read-chunk");
const fileType = require("file-type");

module.exports = function (filePath) {
	const buffer = readChunk.sync(filePath, 0, 4100);
	return fileType(buffer);
};
