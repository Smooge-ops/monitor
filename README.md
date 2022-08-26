# 运行

1. 进入 web 目录，node app.js

2. 在需要测试的html文件头部，导入以下代码。注：上下顺序不可颠倒；根目录下的index.html为测试用例。

   ```html
   <script src="https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js"></script>
   <script src = "./monitor.js"></script>
   ```
 
3. 刷新 http://www.front-end-monitor.cn/ 页面，查看错误信息

# demo使用方法

1. 进入 http://116.205.163.117/ 页面，点击右上角的"下载监测文件"，下载 monitor.js 文件

2. 在需要测试的html文件头部，导入以下代码。注：上下顺序不可颠倒

   ```html
   <script src="https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js"></script>
   <script src = "./monitor.js"></script>
   ```

3. 刷新 http://www.front-end-monitor.cn/ 页面，查看错误信息



# 整体框架

通过无痕埋点的方式向监控对象植入前端代码，并通过ajax传送到服务器端

服务器由express框架暂时搭建于本地

服务器端将接受到的数据存入云服务器上的mysql数据库

可视化界面将实时向服务器端请求数据并展示于界面上



# 环境

- 前端：html+css+javascript+ajax

- 后端：node.js
- 数据库：mysql
- 可视化界面：echarts



# 监测

异常监控，包括:JS异常、接口异常、白屏异常、资源异常等

关键性能数据监控，如:FP、FCP、DOM Ready、DNS等

用户行为数据，如:PV、UV、页面停留时间等

HTTP请求监控，包括:请求链路、成功率、返回信息等

## 异常监测

### Js异常

#### 资源加载

```javascript
{
    title: document.title, //页面标题

    url: location.href, //页面url

    timestamp: Date.now(), //时间戳

    kind: "stability", // 监控指标的大类，稳定性

    type: "resourceError", // 小类型，这是一个资源错误

    message: event.message, // 报错信息

    filename: event.target.src||event.target.href, // 哪个文件报错了

    position: `${event.lineno}:${event.colno}`, // 报错的行列位置

    tagName: event.target.tagName,// 报错的标签，要么是link要么是script

    selector: getSelector(event.target), // 代表最后一个操作的元素
}
```

#### 普通JS异常

```
{
    title: document.title, //页面标题

    url: location.href, //页面url

    timestamp: Date.now(), //时间戳

    kind: "stability", // 监控指标的大类，稳定性

    type: "jsError", // 

    message: event.message, // 报错信息

    filename: event.filename, // 哪个文件报错了

    position: `${event.lineno}:${event.colno}`, // 报错的行列位置

    stack: getLines(event.error.stack),

    selector: lastEvent ? getSelector(lastEvent.path) : "", // 代表最后一个操作的元素
}
```

### promise

```javascript
{
  	title: document.title, //页面标题

    	url: location.href, //页面url

    	timestamp: Date.now(), //时间戳

        kind: "stability", // 监控指标的大类，稳定性

        type: "promiseError", // 小类型，这是一个错误

        message, // 报错信息

        filename, // 哪个文件报错了

        position: `${line}:${column}`, // 报错的行列位置

        stack

        selector: lastEvent ? getSelector(lastEvent.path) : "", // 代表最后一个操作的元素
}
```

### 白屏异常

```javascript
{
        title: document.title, //页面标题

    	url: location.href, //页面url

    	timestamp: Date.now(), //时间戳

        kind: "stability",

        type: "blank",

        emptyPoints: emptyPoints + "",//空点（在屏幕上采样，点的总数不多）

        screen: window.screen.width + "X" + window.screen.height,//屏幕大小

        viewPoint: window.innerWidth + "X" + window.innerHeight,//视口大小

        selector: getSelector(centerElements[0]),// 屏幕中间点的元素
}
```

### 接口异常

```
{
        title: document.title, //页面标题

    	url: location.href, //页面url

    	timestamp: Date.now(), //时间戳

        kind: "stability",

        type: "xhr",

        eventType: type,

        pathname: this.logData.url,

        status: status + "-" + statusText, // 状态码

        duration,

        response: this.response ? JSON.stringify(this.response) : "", // 响应体

        params: body || "", // 入参
}
```

## 行为数据

### pv&uv

只要知道目前访问者的IP，对于UV和PV的区分可以在可视化前端做

```javascript
{
        title: document.title, //页面标题

    	url: location.href, //页面url

    	timestamp: Date.now(), //时间戳

        kind: "business",

        type: "pv",

	effectiveType: connection.effectiveType, //网络环境

    	rtt: connection.rtt, //往返时间

   	screen: `${window.screen.width}x${window.screen.height}`, //设备分辨率
}
```

### staytime

```javascript
{
        title: document.title, //页面标题

    	url: location.href, //页面url

    	timestamp: Date.now(), //时间戳

        kind: "business",

        type: "staytime",

        stayTime,
}
```

## 性能指标

性能指标的单位都是时间ms

### 加载时间指标

```javascript
{
	title: document.title, //页面标题

    	url: location.href, //页面url

    	timestamp: Date.now(), //时间戳

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
}
```

### 绘制性能指标

```javascript
{
	title: document.title, //页面标题

    	url: location.href, //页面url

    	timestamp: Date.now(), //时间戳

				kind: "performance",
				type: "paint",
				firstPaint: FP ? formatTime(FP.startTime) : 0,
				firstContentPaint: FCP ? formatTime(FCP.startTime) : 0,
				firstMeaningfulPaint: FMP ? formatTime(FMP.startTime) : 0,
				largestContentfulPaint: LCP ? formatTime(LCP.renderTime || LCP.loadTime) : 0
}
```



# 数据发送

## 方法1

采集到数据后，需要将其传递给可视化界面做呈现，传递地点可以选择阿里云的日志服务（先登录阿里云，获取一个地址），则可视化的部分由阿里云集成好

## 方法2（采用）

使用express搭建服务器，监听前端发出的post（数据采集）和get（数据获取）请求，并分别从数据库中存入取出数据
