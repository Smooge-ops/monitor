function getData(table_name, callback) {
	$.ajax({
		type: "GET", // 请求的方式
		url: "http://127.0.0.1/api/get", // 请求的 URL 地址
		data: { table_name: table_name }, // 这次请求要携带的数据
		success: function (res) {
			// 请求成功之后的回调函数
			// console.log(table_name, res);
			callback(res);
		}
	});

	/* return axios
		.get("http://127.0.0.1:3000/get", { table_name: table_name })
		.then(function (res) {
			return new Promise((resolve, reject) => resolve(res));
		}); */
}

/* getData("resource_loading", res => {
	console.log("resource_loading", res.data);
});

getData("normal_jserror", res => {
	console.log("normal_jserror", res.data);
});

getData("promise_error", res => {
	console.log("promise_error", res.data);
});

getData("blank", res => {
	console.log("blank", res.data);
});

getData("xhr", res => {
	console.log("xhr", res.data);
});
getData("pv", res => {
	console.log("pv", res.data);
});
getData("staytime", res => {
	console.log("staytime", res.data);
});
getData("timing", res => {
	console.log("timing", res.data);
});
getData("paint", res => {
	console.log("paint", res.data);
});
 */
