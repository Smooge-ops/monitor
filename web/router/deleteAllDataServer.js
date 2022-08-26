const express = require("express");
const router = express.Router();
const dbOperation = require("../db/operation");

router.post("/deleteAll", (req, res) => {
	// 调用 res.send() 方法，向客户端响应处理的结果
	const tabel_name = [
		"resource_loading",
		"normal_jserror",
		"promise_error",
		"blank",
		"xhr_suc",
		"xhr_err",
		"pv",
		"staytime",
		"timing",
		"paint"
	];
	dbOperation.deleteAllData("xhr_err");
	// for (let value of tabel_name) dbOperation.deleteAllData(value);
	res.send({
		status: 0, // 0 表示处理成功，1 表示处理失败
		msg: "DELETE 请求成功!" // 状态的描述
	});
});

module.exports = router;
