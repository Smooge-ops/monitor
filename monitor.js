function sendData(data = {}) {
	let extraData = {
		title: document.title,
		url: decodeURI(location.href),
		timestamp: Date.now()
	};
	let log = { ...data, ...extraData };

	// console.log("log", log);
	$.ajax({
		type: "POST",
		url: "http://127.0.0.1/api/post",
		data: log,
		success: function (res) {
			console.log(res);
		}
	});
}

function formatTime(times) {
	let ss = Math.floor(times / 1000);
	let min = Math.floor(ss / 60);
	let hh = Math.floor(min / 60);
	let ms = times - ss * 1000;
	ms = `${ms}ms`;
	ss = ss > 0 ? `${ss}s` : "";
	min = min > 0 ? `${min}min` : "";
	hh = hh > 0 ? `${hh}h` : "";
	const result = `${hh}${min}${ss}${ms}`;
	return result;
}

function getLastEvent() {
	let lastEvent;
	["click", "touchstart", "mousedown", "keydown", "mouseover"].forEach(
		eventType => {
			document.addEventListener(
				eventType,
				event => {
					lastEvent = event;
				},
				{
					capture: true, // 是在捕获阶段还是冒泡阶段执行
					passive: true // 默认不阻止默认事件
				}
			);
		}
	);
	return lastEvent;
}

function getselectors(path) {
	// 反转 + 过滤 + 映射 + 拼接
	return path
		.reverse()
		.filter(element => {
			return element !== document && element !== window;
		})
		.map(element => {
			// console.log("element", element.nodeName);
			let selector = "";
			if (element.id) {
				return `${element.nodeName.toLowerCase()}#${element.id}`;
			} else if (element.className && typeof element.className === "string") {
				return `${element.nodeName.toLowerCase()}.${element.className}`;
			} else {
				selector = element.nodeName.toLowerCase();
			}
			return selector;
		})
		.join(" ");
}

function getSelector(pathsOrTarget) {
	if (Array.isArray(pathsOrTarget)) {
		return getselectors(pathsOrTarget);
	} else {
		let path = [];
		while (pathsOrTarget) {
			path.push(pathsOrTarget);
			pathsOrTarget = pathsOrTarget.parentNode;
		}
		return getselectors(path);
	}
}

function onload(callback) {
	if (document.readyState === "complete") {
		callback();
	} else {
		window.addEventListener("load", callback);
	}
}

function getLines(stack) {
	return stack
		.split("\n")
		.slice(1)
		.map(item => item.replace(/^\s+at\s+/g, ""))
		.join("^");
}

// element: 要设置为 FMP 的元素
/* function setFMP(element) {
	element.setAttribute("elementtiming", "meaningful");
} */

class monitor {
	injectJsError() {
		// 监听全局未捕获的错误
		window.addEventListener(
			"error",
			event => {
				console.log("error+++++++++++", event);
				let lastEvent = getLastEvent(); // 获取到最后一个交互事件
				// 脚本加载错误
				if (event.target && (event.target.src || event.target.href)) {
					sendData({
						kind: "stability", // 监控指标的大类，稳定性
						type: "resourceError", // 小类型
						message: event.message, // 报错信息
						filename: event.target.src || event.target.href, // 哪个资源文件报错了
						position: `${event.lineno}:${event.colno}`,
						tagName: event.target.tagName,
						selector: getSelector(event.target) // 代表最后一个操作的元素
					});
				} else {
					sendData({
						kind: "stability", // 监控指标的大类，稳定性
						type: "jsError", // 小类型，这是一个错误
						message: event.message, // 报错信息
						filename: event.filename, // 哪个文件报错了
						position: `${event.lineno}:${event.colno}`, // 报错的行列位置
						stack: getLines(event.error.stack),
						selector: lastEvent ? getSelector(lastEvent.path) : "" // 代表最后一个操作的元素
					});
				}
			},
			true
		);

		window.addEventListener(
			"unhandledrejection",
			event => {
				console.log("unhandledrejection-------- ", event);
				let lastEvent = getLastEvent(); // 获取到最后一个交互事件
				let message;
				let filename;
				let line = 0;
				let column = 0;
				let stack = "";
				let reason = event.reason;
				if (typeof reason === "string") {
					message = reason;
				} else if (typeof reason === "object") {
					message = reason.message;
					if (reason.stack) {
						let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
						filename = matchResult[1];
						line = matchResult[2];
						column = matchResult[3];
					}
					stack = getLines(reason.stack);
				}
				sendData({
					kind: "stability", // 监控指标的大类，稳定性
					type: "promiseError", // 小类型，这是一个错误
					message, // 报错信息
					filename, // 哪个文件报错了
					position: `${line}:${column}`, // 报错的行列位置
					stack,
					selector: lastEvent ? getSelector(lastEvent.path) : "" // 代表最后一个操作的元素
				});
			},
			true
		);
	}

	blankScreen() {
		let wrapperElements = ["html", "body"];
		function getSelector(element) {
			const { id, className, nodeName } = element;
			if (id) {
				return "#" + id;
			} else if (className) {
				// className = "header title name"
				return (
					"." +
					className
						.split(" ") // 分割, 数组[header, title, name]
						.filter(item => !!item) // 过滤多个空格
						// let a = "header    title name";
						// let b = a.split(" ");
						// console.log(b); // ['header', '', '', '', 'title', 'name']
						.join(".") // 连接 .header.title.name
				);
			} else {
				return nodeName.toLowerCase(); // 节点名字
			}
		}
		let emptyPoints = 0;
		function isWrapper(element) {
			let selector = getSelector(element);
			// selector 与 wrapperElements 匹配上了，说明当前点是空白点
			if (wrapperElements.indexOf(selector) !== -1) {
				emptyPoints++;
			}
		}
		// 刚开始页面内容为空，等页面渲染完成，再去做判断
		onload(function () {
			let xElements, yElements, diagonal1, diagonal2;
			for (let i = 1; i <= 9; i++) {
				// elementsFromPoint方法可以获取到当前视口内指定坐标处，由里到外排列的所有元素。如果所有元素都是 document/body，意味着当前白屏
				xElements = document.elementsFromPoint(
					(window.innerWidth * i) / 10,
					window.innerHeight / 2
				);
				yElements = document.elementsFromPoint(
					window.innerWidth / 2,
					(window.innerHeight * i) / 10
				);
				// 左上角到右下角
				diagonal1 = document.elementsFromPoint(
					(window.innerWidth * i) / 10,
					(window.innerHeight * i) / 10
				);
				// 右上角到左下角
				diagonal2 = document.elementsFromPoint(
					(window.innerWidth * (10 - i)) / 10,
					(window.innerHeight * i) / 10
				);
				// isWrapper自定义函数 是否有包裹元素
				isWrapper(xElements[0]);
				isWrapper(yElements[0]);
				isWrapper(diagonal1[0]);
				isWrapper(diagonal2[0]);
			}
			// 白屏
			if (emptyPoints >= 36) {
				// centerElements 中心点选择器
				const centerElements = document.elementsFromPoint(
					window.innerWidth / 2,
					window.innerHeight / 2
				);
				console.log(
					"emptyPoints++++++++++++++",
					getSelector(centerElements[0])
				);
				sendData({
					kind: "stability",
					type: "blank",
					emptyPoints: emptyPoints + "",
					screen: window.screen.width + "X" + window.screen.height, // 分辨率
					viewPoint: window.innerWidth + "X" + window.innerHeight, // 布局视口大小
					selector: getSelector(centerElements[0])
				});
			}
		});
	}

	pv() {
		var connection = navigator.connection;
		sendData({
			kind: "business",
			type: "pv",
			effectiveType: connection.effectiveType, //网络环境
			rtt: connection.rtt, //往返时间
			screen: `${window.screen.width}x${window.screen.height}` //设备分辨率
		});
		let startTime = Date.now();
		window.addEventListener(
			"unload",
			() => {
				// let stayTime = Date.now() - startTime;
				let stayTime = formatTime(Date.now() - startTime);
				sendData({
					kind: "business",
					type: "stayTime",
					stayTime
				});
			},
			false
		);
	}

	performance() {
		let FMP, LCP;
		// 增加一个性能条目的观察者。观察到一个现象或条目，就进行回调。entryList: 观察到的条目, observer: 观察者
		// FMP: 页面有意义的内容渲染的时间。需要手动设置哪个是有意义的内容，挂载自定义属性
		new PerformanceObserver((entryList, observer) => {
			const perfEntries = entryList.getEntries();
			FMP = perfEntries[0].startTime; // startTime 2000以后
			observer.disconnect(); // 不再观察了
		}).observe({ entryTypes: ["element"] }); // 观察页面中有意义的元素。entryTypes: 条目类型

		// LCP: 代表在viewport中最大的页面元素加载的时间，浏览器会自动判断
		new PerformanceObserver((entryList, observer) => {
			const perfEntries = entryList.getEntries();
			const lastEntry = perfEntries[perfEntries.length - 1];
			LCP = lastEntry.startTime;
			observer.disconnect(); // 不再观察了
		}).observe({ entryTypes: ["largest-contentful-paint"] }); // 观察页面中最大的元素

		onload(function () {
			// 延迟3s，更加准确
			setTimeout(() => {
				// const {} = window.performance.getEntriesByType("resource")[0];
				const {
					fetchStart,
					domainLookupStart,
					domainLookupEnd,
					connectStart,
					connectEnd,
					requestStart,
					responseStart,
					responseEnd,
					domInteractive,
					domContentLoadedEventStart,
					domContentLoadedEventEnd,
					loadEventStart,
					loadEventEnd
				} = window.performance.getEntriesByType("navigation")[0];
				// 发送各个时间指标
				sendData({
					kind: "performance", // 用户体验指标/性能指标
					type: "timing", // 统计每个阶段的时间
					dnsTime: domainLookupEnd - domainLookupStart, // DNS域名解析耗时
					connectTime: connectEnd - connectStart, // TCP连接耗时
					ttfbTime: responseStart - requestStart, // 首字节到达时间,网络请求耗时
					responseTime: responseEnd - responseStart, // response响应耗时
					domTime: domInteractive - responseEnd, // DOM解析耗时
					dclTime: domContentLoadedEventEnd - domContentLoadedEventStart, // DOMContentLoaded事件回调耗时
					domReadyTime: domContentLoadedEventEnd - fetchStart, // DOM阶段渲染耗时
					timeToInteractive: domInteractive - fetchStart, // 首次可交互时间
					loadTime: loadEventEnd - loadEventStart // 完整的加载时间
				});

				// 发送性能指标
				let FP = window.performance.getEntriesByName("first-paint", "paint")[0];
				let FCP = window.performance.getEntriesByName(
					"first-contentful-paint",
					"paint"
				)[0];
				sendData({
					kind: "performance", // 用户体验指标/性能指标
					type: "paint",
					firstPaint: FP ? formatTime(FP.startTime) : 0,
					firstContentPaint: FCP ? formatTime(FCP.startTime) : 0,
					firstMeaningfulPaint: FMP ? formatTime(FMP.startTime) : 0,
					largestContentfulPaint: LCP
						? formatTime(LCP.renderTime || LCP.loadTime)
						: 0
				});
			}, 1000);
		});
	}

	injectXHR() {
		let XMLHttpRequest = window.XMLHttpRequest;
		let oldOpen = XMLHttpRequest.prototype.open;
		// open 方法拦截获取 xhr, 获取 logData
		XMLHttpRequest.prototype.open = function (method, url, async) {
			// 把上报接口 阿里云日志、webpack 过滤掉
			/* if (!url.match(/logstores/) && !url.match(/sockjs/)) {
				this.logData = { method, url, async };
      } */
			this.logData = { method, url, async };
			return oldOpen.apply(this, arguments);
		};

		let oldSend = XMLHttpRequest.prototype.send;
		XMLHttpRequest.prototype.send = function (body) {
			// 如果 logData 有值，说明拦截成功
			if (this.logData) {
				let startTime = Date.now();
				// habdler 执行完毕后，返回新的函数 event => {}
				let handler = type => event => {
					// 持续时间
					let duration = Date.now() - startTime;
					let status = this.status;
					let statusText = this.statusText;
					sendData({
						kind: "stability",
						type: "xhr",
						eventType: type,
						pathname: this.logData.url,
						status: status + "-" + statusText, // 状态码
						duration,
						response: this.response
							? JSON.parse(JSON.stringify(this.response))
							: "", // 响应体 JSON.stringify(this.response)
						params: decodeURI(body.split("&").slice(0, 5).join("&")) || "" // 入参.'kind=stability&type=xhr&eventType=load&pathname=...t&status=200-OK'
					});
				};
				// 'XMLHttpRequest readyState 0 1 2 3 4。readyState = 4, 触发 load 事件
				this.addEventListener("load", handler("load"), false); // 请求返回成功，包括返回500失败
				this.addEventListener("error", handler, false); // 请求返回失败
				this.addEventListener("abort", handler, false); // 放弃
			}
			return oldSend.apply(this, arguments);
		};
	}
}

let Monitor = new monitor();
Monitor.injectJsError();
Monitor.blankScreen();
Monitor.pv();
Monitor.performance();
Monitor.injectXHR();
