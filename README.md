# 环境

- 前端：html+css+javascript+ajax
- 后端：node.js
- 数据库：mysql
- 可视化界面：echarts



# 本地使用

1. 初始化与运行

   ```bash
   $ npm i
   $ cd web
   # 增加node服务器内存限制
   $ npm run fix-memory-limit
   $ node app.js
   ```

2. 在需要测试的 html 文件头部(比如根目录下的 index.html)，导入以下代码。注：上下顺序不可颠倒。

   ```html
   <script src="https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js"></script>
   <script src="./monitor.js"></script>
   ```

3. 启动本地 mysql，创建 "front_data-data" 数据库，打开 web/db/index.js，修改数据库配置信息。

4. 打开 http://127.0.0.1/ 查看错误信息

5. http://127.0.0.1/ 点击左上角，清空数据库 front_data 中的所有数据；点击右上角下载 SDK 探针文件



# 整体框架

通过无痕埋点的方式向监控对象植入前端代码，并通过 ajax 传送到服务器端

服务器由 express 框架暂时搭建于本地

服务器端将接受到的数据存入本地的 mysql 数据库

可视化界面将实时向服务器端请求数据并展示于界面上



# 目录结构

```
|-- monitor  前端监控项目
    |-- .gitignore  git忽略文件
    |-- index.html  测试文件
    |-- monitor.js  SDK探针
    |-- package-lock.json  配置文件
    |-- package.json  配置文件
    |-- README.md  说明文档
    |-- visual  可视化界面
    |   |-- visual.html  可视化界面
    |   |-- visual.js  数据获取方法
    |   |-- css  css样式
    |   |   |-- icon.css
    |   |   |-- index.css
    |   |   |-- public.css
    |   |-- fonts  字体样式
    |   |   |-- DIN-Bold.otf
    |   |   |-- DIN-Light.otf
    |   |   |-- DIN-Medium.otf
    |   |-- images  图片
    |   |   |-- bg2.jpg
    |   |   |-- border_bg.jpg
    |   |   |-- title_border_bg.png
    |   |   |-- title_left_bg.png
    |   |   |-- title_right_bg.png
    |   |-- js  js工具文档
    |       |-- echarts.all.js
    |       |-- echarts.min.js
    |       |-- jquery-1.11.0.min.js
    |       |-- jquery.numscroll.js
    |-- web  后端搭建
        |-- app.js  入口文件
        |-- monitor.js  SDK探针，用于可视化界面中的下载功能
        |-- db  数据库
        |   |-- index.js  连接，建表
        |   |-- operation.js  sql语句
        |-- router  路由
            |-- addDataServer.js  向数据库增加数据
            |-- deleteAllDataServer.js 清空数据库里的数据
            |-- download.js  下载文件
            |-- getDataServer.js  获取数据库里的数据

```



# 监测

异常监控，包括:JS 异常、接口异常、白屏异常、资源异常等

关键性能数据监控，如:FP、FCP、DOM Ready、DNS 等

用户行为数据，如:PV、UV、页面停留时间等

HTTP 请求监控，包括:请求链路、成功率、返回信息等

## 异常监测

### Js 异常

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

#### 普通 JS 异常

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

- elementsFromPoint 方法可以获取到当前视口内指定坐标处，由里到外排列的所有元素
- 根据 elementsFromPoint api，获取屏幕水平中线和竖直中线所在的元素

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

- 拦截重写 xhr 的 open、send 方法
- 监听 load、error、abort 事件

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

只要知道目前访问者的 IP，对于 UV 和 PV 的区分可以在可视化前端做

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

性能指标的单位都是时间 ms

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

