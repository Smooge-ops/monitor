const mysql = require("mysql");

// 连接数据库
const db = mysql.createConnection({
	host: "127.0.0.1", //服务器地址，连接本机可以使用localhost或者127.0.0.1
	user: "root", //连接数据库的用户名
	password: "root", //连接数据库的密码
	database: "front_data", //数据库的名称
	port: 3306, //数据库端口号，默认3306，可以省略不写
	useConnectionPooling: true
});

const commonSql = `kind varchar(255) CHARACTER SET utf8mb4 NOT NULL,
type varchar(255) CHARACTER SET utf8mb4 NOT NULL,
title varchar(255) CHARACTER SET utf8mb4,
url longtext CHARACTER SET utf8mb4,
timestamp varchar(255) CHARACTER SET utf8mb4,`;

let createTodos = `CREATE TABLE IF NOT EXISTS blank  (
  ${commonSql}
  emptyPoints varchar(255) CHARACTER SET utf8mb4,
  screen varchar(255) CHARACTER SET utf8mb4,
  viewPoint varchar(255) CHARACTER SET utf8mb4,
  selector varchar(255) CHARACTER SET utf8mb4
)`;
sqlQuery(createTodos);

createTodos = `CREATE TABLE IF NOT EXISTS normal_jserror  (
  ${commonSql}
  message longtext CHARACTER SET utf8mb4,
  filename longtext CHARACTER SET utf8mb4,
  position varchar(255) CHARACTER SET utf8mb4,
  stack longtext CHARACTER SET utf8mb4,
  selector varchar(255) CHARACTER SET utf8mb4
)ENGINE=InnoDB DEFAULT CHARSET=utf8;`;
sqlQuery(createTodos);

createTodos = `CREATE TABLE IF NOT EXISTS paint  (
  ${commonSql}
  firstPaint varchar(255) CHARACTER SET utf8mb4,
  firstContentPaint varchar(255) CHARACTER SET utf8mb4,
  firstMeaningfulPaint varchar(255) CHARACTER SET utf8mb4,
  largestContentfulPaint varchar(255) CHARACTER SET utf8mb4
)ENGINE=InnoDB DEFAULT CHARSET=utf8;`;
sqlQuery(createTodos);

createTodos = `CREATE TABLE IF NOT EXISTS promise_error  (
  ${commonSql}
  message longtext CHARACTER SET utf8mb4,
  filename longtext CHARACTER SET utf8mb4,
  position varchar(255) CHARACTER SET utf8mb4,
  stack longtext CHARACTER SET utf8mb4,
  selector varchar(255) CHARACTER SET utf8mb4
)ENGINE=InnoDB DEFAULT CHARSET=utf8;`;
sqlQuery(createTodos);

createTodos = `CREATE TABLE IF NOT EXISTS pv  (
  ${commonSql}
  rtt varchar(255) CHARACTER SET utf8mb4,
  effectiveType longtext CHARACTER SET utf8mb4,
  screen varchar(255) CHARACTER SET utf8mb4
)ENGINE=InnoDB DEFAULT CHARSET=utf8;`;
sqlQuery(createTodos);

createTodos = `CREATE TABLE IF NOT EXISTS resource_loading  (
  ${commonSql}
  message longtext CHARACTER SET utf8mb4,
  filename longtext CHARACTER SET utf8mb4,
  position varchar(255) CHARACTER SET utf8mb4,
  tagName varchar(255) CHARACTER SET utf8mb4,
  selector varchar(255) CHARACTER SET utf8mb4
)ENGINE=InnoDB DEFAULT CHARSET=utf8;`;
sqlQuery(createTodos);

createTodos = `CREATE TABLE IF NOT EXISTS staytime  (
  ${commonSql}
  stayTime varchar(255) CHARACTER SET utf8mb4
)ENGINE=InnoDB DEFAULT CHARSET=utf8;`;
sqlQuery(createTodos);

createTodos = `CREATE TABLE IF NOT EXISTS timing  (
  ${commonSql}
  dnsTime varchar(255) CHARACTER SET utf8mb4,
  connectTime varchar(255) CHARACTER SET utf8mb4,
  ttfbTime varchar(255) CHARACTER SET utf8mb4,
  responseTime varchar(255) CHARACTER SET utf8mb4,
  domTime varchar(255) CHARACTER SET utf8mb4,
  dclTime varchar(255) CHARACTER SET utf8mb4,
  domReadyTime varchar(255) CHARACTER SET utf8mb4,
  timeToInteractive varchar(255) CHARACTER SET utf8mb4,
  loadTime varchar(255) CHARACTER SET utf8mb4
)ENGINE=InnoDB DEFAULT CHARSET=utf8;`;
sqlQuery(createTodos);

// TODO:
createTodos = `CREATE TABLE IF NOT EXISTS xhr_suc  (
  ${commonSql}
  eventType varchar(255) CHARACTER SET utf8mb4,
  pathname longtext CHARACTER SET utf8mb4,
  status varchar(255) CHARACTER SET utf8mb4,
  duration varchar(255) CHARACTER SET utf8mb4,
  response longtext CHARACTER SET utf8mb4,
  params varchar(765) CHARACTER SET utf8mb4 PRIMARY KEY NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8;`;
sqlQuery(createTodos);

createTodos = `CREATE TABLE IF NOT EXISTS xhr_err  (
  ${commonSql}
  eventType varchar(255) CHARACTER SET utf8mb4,
  pathname longtext CHARACTER SET utf8mb4,
  status varchar(255) CHARACTER SET utf8mb4,
  duration varchar(255) CHARACTER SET utf8mb4,
  response longtext CHARACTER SET utf8mb4,
  params longtext CHARACTER SET utf8mb4
)ENGINE=InnoDB DEFAULT CHARSET=utf8;`;
sqlQuery(createTodos);

function sqlQuery(data) {
	db.query(data, err => {
		if (err) {
			console.log(data, err.message);
		}
	});
}

module.exports = db;
