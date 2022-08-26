const express = require("express");
const router = express.Router();
const dbOperation = require("../db/operation");

router.post("/post", (req, res) => {
	const body = req.body;
	dbOperation.addData(body);

	// 调用 res.send() 方法，向客户端响应处理的结果
	res.send({
		status: 0, // 0 表示处理成功，1 表示处理失败
		msg: "POST 请求成功!", // 状态的描述
		data: body // 需要相应给客户端的数据
	});
});

module.exports = router;
