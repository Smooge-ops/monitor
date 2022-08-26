// 导入数据库操作模块
const db = require("./index");

var map = new Map();
map.set(1, "resource_loading");
map.set(2, "normal_jserror");
map.set(3, "promise_error");
map.set(4, "blank");
map.set(5, "xhr");
map.set(6, "pv");
map.set(7, "stayTime");
map.set(8, "timing");
map.set(9, "paint");

// 添加数据
function addData(datas) {
	let index = 0;
	if (datas.kind == "stability" && datas.type == "resourceError") index = 1;
	else if (datas.kind == "stability" && datas.type == "jsError") index = 2;
	else if (datas.kind == "stability" && datas.type == "promiseError") index = 3;
	else if (datas.kind == "stability" && datas.type == "blank") index = 4;
	else if (datas.kind == "stability" && datas.type == "xhr") index = 5;
	else if (datas.kind == "business" && datas.type == "pv") index = 6;
	else if (datas.kind == "business" && datas.type == "stayTime") index = 7;
	else if (datas.kind == "performance" && datas.type == "timing") index = 8;
	else if (datas.kind == "performance" && datas.type == "paint") index = 9;

	const sqlStr = "insert into " + map.get(index) + " set ?";
	// 执行插入操作
	db.query(sqlStr, datas, (err, results) => {
		if (err) return console.log("插入失败", err.message);
		if (results.affectedRows === 1) {
			console.log("插入数据成功", datas.type);
		}
	});
}

function getData(table_name, callback) {
	// 编写sql语句
	let sql = "select * from " + table_name;
	// 执行sql，并处理执行的结果，查询的结果在results变量中，results其实是一个数组
	db.query(sql, function (error, results, fields) {
		if (error) throw error;
		callback(results);
	});
}

module.exports = {
	addData,
	getData
};
