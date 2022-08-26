const express = require("express");
const router = express.Router();
const dbOperation = require("../db/operation");

router.get("/get", (req, res) => {
	const query = req.query;
	dbOperation.getData(req.query.table_name, results => {
		res.send({
			status: 0, // 0 表示处理成功，1 表示处理失败
			msg: "GET 请求成功!",
			data: results
		});
	});
});

module.exports = router;
