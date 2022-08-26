const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/dow", (req, res) => {
	try {
		//filePath是要下载的文件的路径，fileName是要下载的文件的名字
		let filePath = path.resolve(__dirname, "../monitor.js");
		let fileName = path.basename(filePath);
		res.download(filePath, fileName);
	} catch (error) {
		return res.status(500).send({
			result: "error",
			message: `Failed to download file: ${error.message}`
		});
	}
});

module.exports = router;
