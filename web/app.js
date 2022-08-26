// 导入 express 模块
const express = require("express");
// 创建 express 的服务器实例
const router = express();

//修改限制大小
var bodyParser = require("body-parser");
router.use(bodyParser.json({ limit: "5000mb" }));
router.use(bodyParser.urlencoded({ limit: "5000mb", extended: true }));

// 配置解析表单数据的中间件
router.use(express.urlencoded({ extended: false }));

// 一定要在路由之前，配置 cors 这个中间件，从而解决接口跨域的问题
const cors = require("cors");
router.use(cors());

router.use(express.static("visual"));
router.use(express.static("public"));
// 加载页面
router.get("/", (req, res) => {
	res.sendFile(__dirname + "/" + "visual/visual.html"); //设置/ 下访问文件位置
});

// 导入路由模块
const addDtaa = require("./router/addDataServer");
// http://127.0.0.1/api/post
router.use("/api", addDtaa);

const getData = require("./router/getDataServer");
// http://127.0.0.1/api/get
router.use("/api", getData);

const deleteAll = require("./router/deleteAllDataServer");
// http://127.0.0.1/api/deleteAll
router.use("/api", deleteAll);

const download = require("./router/download");
// http://127.0.0.1/api/dow
router.use("/api", download);

router.get("/error", function (req, res) {
	res.sendStatus(500);
});

// 调用 app.listen 方法，指定端口号并启动web服务器
router.listen(80, function () {
	console.log("Express server running at http://127.0.0.1");
});
