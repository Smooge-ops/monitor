const mysql = require("mysql");

// 连接数据库
const db = mysql.createConnection({
	host: "116.205.163.117", //服务器地址，连接本机可以使用localhost或者127.0.0.1
	user: "root", //连接数据库的用户名
	password: "root", //连接数据库的密码
	database: "front_data", //数据库的名称
	port: 3306 //数据库端口号，默认3306，可以省略不写
});

module.exports = db;
