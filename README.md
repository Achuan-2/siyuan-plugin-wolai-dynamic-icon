# 思源笔记实现wolai的动态图标

## 相关帖子

[插件开发 idea 丨模仿 wolai 的动态日历图标 - 链滴](https://ld246.com/article/1729867070815)

[插件开发求助丨安卓端如何通过本地 URL 返回动态 svg - 链滴](https://ld246.com/article/1729935510467)

## 开发背景

wolai 的动态图标文档：[https://www.wolai.com/wolai/2tkzTE5w7invgSTqKjSwL7](https://ld246.com/forward?goto=https%3A%2F%2Fwww.wolai.com%2Fwolai%2F2tkzTE5w7invgSTqKjSwL7)

![image](https://github.com/user-attachments/assets/c192f6b7-862b-4f17-9220-d0daedc7ea85)
​

一直很馋 wolai 的动态日历图标。

可以直接调用 api 显示 svg

```md
![image](https://api.wolai.com/v1/icon?type=1&locale=en&pro=0&color=red "英文动态日历")
```

但是由于不确定哪天 wolai 就关闭这个服务了，也不太敢用。

今天突然发现 wolai 的动态日历图标实现原理其实挺简单的，就只是替换 svg 的几个内容就好了

```html
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-label="Calendar" role="img" viewBox="0 0 512 512" width="100%" height="100%" style="cursor: default">
      null
      <path d="m512,455c0,32 -25,57 -57,57l-398,0c-32,0 -57,-25 -57,-57l0,-327c0,-31 25,-57 57,-57l398,0c32,0 57,26 57,57l0,327z" fill="#efefef"/>
      <path d="m484,0l-47,0l-409,0c-15,0 -28,13 -28,28l0,157l512,0l0,-157c0,-15 -13,-28 -28,-28z" fill="#cf5659"/>
      <g fill="#f3aab9">
        <circle cx="462" cy="136" r="14"/>
        <circle cx="462" cy="94" r="14"/>
        <circle cx="419" cy="136" r="14"/>
        <circle cx="419" cy="94" r="14"/>
        <circle cx="376" cy="136" r="14"/>
        <circle cx="376" cy="94" r="14"/>
      </g>
      <text id="month" x="32" y="142" fill="#fff" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="100px" style="text-anchor: left">十月</text>
      <text id="day" x="256" y="400" fill="#66757f" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="256px" style="text-anchor: middle">25</text>
  
      <text id="weekday" x="256" y="480" fill="#66757f" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="64px" style="text-anchor: middle">星期五</text>
      null
```

替换 text 节点的内容，就实现了更新日期和内容  
修改配色则是修改 `<path d="m484,0l-47,0l-409,0c-15,0 -28,13 -28,28l0,157l512,0l0,-157c0,-15 -13,-28 -28,-28z" fill="#cf5659"/>`​ 和 `<g fill="#f3aab9">`​

但是我不知道如何输入一个地址，返回 svg，

‍

## 开发笔记

### 尝试1：开发挂件

只记得这个挂件 [Zuoqiu-Yingyi/widget-url-scheme: 一个可将 URL Scheme 转换为 HTTP 302 重定向地址的挂件 | A widget that converts the URL Scheme to HTTP 302 redirection.](https://ld246.com/forward?goto=https%3A%2F%2Fgithub.com%2FZuoqiu-Yingyi%2Fwidget-url-scheme)可以输入挂件地址打开文档

于是就拿这个代码问 ai 改。

挂件的 index.html 内容改为这样

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>动态日历</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: transparent;
        }


    </style>
</head>

<body>
    <div id="calendar-container"></div>
    <a id="download-link" download="calendar.svg"></a>

    <script type="module">
        (() => {
            const CONSTANTS = {
                SEARCH_PARAM_COLOR: 'color',
                SEARCH_PARAM_LANG: 'lang',
                SEARCH_PARAM_DATE: 'date',
                DEFAULT_COLOR: '#cf5659',
                DEFAULT_LANG: 'zh-CN'
            };

            function getUrlParams() {
                try {
                    const url = new URL(window.location.href);
                    return {
                        color: url.searchParams.get(CONSTANTS.SEARCH_PARAM_COLOR) || CONSTANTS.DEFAULT_COLOR,
                        lang: url.searchParams.get(CONSTANTS.SEARCH_PARAM_LANG) || CONSTANTS.DEFAULT_LANG,
                        dateParam: url.searchParams.get(CONSTANTS.SEARCH_PARAM_DATE)
                    };
                } catch (error) {
                    console.error('Error parsing URL parameters:', error);
                    return {
                        color: CONSTANTS.DEFAULT_COLOR,
                        lang: CONSTANTS.DEFAULT_LANG,
                        dateParam: null
                    };
                }
            }

            function generateCalendarSVG(month, date, weekday, color) {
                return `<?xml version="1.0" encoding="UTF-8"?>
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                    aria-label="Calendar" role="img" viewBox="0 0 512 512" width="512" height="512">
                    <title>Calendar - ${month} ${date}</title>
                    <path d="m512,455c0,32 -25,57 -57,57l-398,0c-32,0 -57,-25 -57,-57l0,-327c0,-31 25,-57 57,-57l398,0c32,0 57,26 57,57l0,327z" fill="#efefef"/>
                    <path d="m484,0l-47,0l-409,0c-15,0 -28,13 -28,28l0,157l512,0l0,-157c0,-15 -13,-28 -28,-28z" fill="${color}"/>
                    <g fill="#f3aab9">
                        <circle cx="462" cy="136" r="14"/>
                        <circle cx="462" cy="94" r="14"/>
                        <circle cx="419" cy="136" r="14"/>
                        <circle cx="419" cy="94" r="14"/>
                        <circle cx="376" cy="136" r="14"/>
                        <circle cx="376" cy="94" r="14"/>
                    </g>
                    <text id="month" x="32" y="142" fill="#fff" font-family="system-ui, -apple-system, sans-serif" font-size="100px" style="text-anchor: left">${month}</text>
                    <text id="day" x="256" y="400" fill="#66757f" font-family="system-ui, -apple-system, sans-serif" font-size="256px" style="text-anchor: middle">${date}</text>
                    <text id="weekday" x="256" y="480" fill="#66757f" font-family="system-ui, -apple-system, sans-serif" font-size="64px" style="text-anchor: middle">${weekday}</text>
                </svg>`;
            }


            function updateCalendar() {
                const { color, lang, dateParam } = getUrlParams();
                let now;

                try {
                    now = dateParam ? new Date(dateParam) : new Date();
                    if (dateParam && isNaN(now.getTime())) {
                        throw new Error('Invalid date parameter');
                    }
                } catch (error) {
                    console.error(error);
                    now = new Date();
                }

                const month = now.toLocaleString(lang, { month: 'long' });
                const date = now.getDate();
                const weekday = now.toLocaleString(lang, { weekday: 'long' });

                const svg = generateCalendarSVG(month, date, weekday, color);
                document.getElementById('calendar-container').innerHTML = svg;

            }

            // 初始更新日历
            updateCalendar();
        })();
    </script>
</body>

</html>


作者：Achuan-2
链接：https://ld246.com/article/1729867070815
来源：链滴
协议：CC BY-SA 4.0 https://creativecommons.org/licenses/by-sa/4.0/
```

效果就是输入 `http://localhost:6806/widgets/dynamicCalendar/?date=2024-10-21`​，真的能渲染日历图标

![image](https://github.com/user-attachments/assets/90de4a51-4fce-40e5-9877-e8d6d163637c)
​

但是这个打开的不是 svg，依然是 html

### 尝试2：开发插件

看到这个插件 [taotaochen86/siyuan-plugin-jsrunner: Run jscode from post request and return the result to the client-side](https://ld246.com/forward?goto=https%3A%2F%2Fgithub.com%2Ftaotaochen86%2Fsiyuan-plugin-jsrunner)，是写了一个http服务器，可以接受思源发过来的js代码

就让ai参考，写了，竟然成功了

```js
const http = globalThis.require("http");
// src/server.ts


interface ColorScheme {
    primary: string;
    secondary: string;
}

export class CalendarServer {
    private server: any;
    private port: number;
    private colorSchemes: { [key: string]: ColorScheme } = {
        red: { primary: "#cf5659", secondary: "#f3aab9" },
        blue: { primary: "#5AA9E6", secondary: "#3A79B6" },
        yellow: { primary: "#DBAD6A", secondary: "#AB7D3A" },
        green: { primary: "#5FBB97", secondary: "#2F8867" },
        purple: { primary: "#E099FF", secondary: "#BE66CF" },
        pink: { primary: "#EA5D97", secondary: "#CA3D77" },
        fuchsia: { primary: "#93627F", secondary: "#633241" },
        grey: { primary: "#565557", secondary: "#767577" }
    };

    constructor(port: number) {
        this.port = port;
    }

    public start(): void {
        if (!this.server) {
            this.server = http.createServer((req: any, res: any) => {
                const url = new URL(req.url, `http://localhost:${this.port}`);
                const params = {
                    color: url.searchParams.get('color') || 'red',
                    date: url.searchParams.get('date'),
                    locale: url.searchParams.get('locale') || 'cn',
                    type: url.searchParams.get('type') || '1',
                    content: url.searchParams.get('content') || ''
                };

                const svg = this.generateCalendarSVG(params);
                res.writeHead(200, {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                });
                res.end(svg);
            });

            this.server.listen(this.port);
            console.log(`Calendar SVG server started on port ${this.port}`);
        }
    }

    public stop(): void {
        if (this.server) {
            this.server.close();
            this.server = null;
            console.log(`Calendar SVG server stopped`);
        }
    }
}


```

但是有一个问题，不知道能不能用于安卓。

## 参数

* ​`type`​：图标类型，默认为1

  1. ​`type=1`​：显示月日星期
  2. ​`type=3`​ **：** 显示年月日
  3. ​`type=4`​ **：** 仅显示年月
  4. ​`type=5`​ **：** 仅显示年
  5. ​`type=6`​：倒数日
  6. ​`type=7`​：百分比图标
  7. ​`type=8`​：字母数字图标
  8. ​`type=9`​：汉字图标
  9. ​`type=10`​：当前周数
* ​`locale`​：中英文切换，默认为cn，仅在type=1、3、4、6、10时有效

  * ​`locale=cn`​：显示中文
  * ​`locale=en`​：显示英文
* ​`color`​：设置配色，一共八种配色

  ![PixPin_2024-10-27_10-34-41](https://github.com/user-attachments/assets/02dab222-8304-4b4e-8fb2-cdeb59676226)
​

  * ​`color=red`​
  * ​`color=blue`​
  * ​`color=yellow`​
  * ​`color=green`​
  * ​`color=purple`​
  * ​`color=pink`​
  * ​`color=fuchsia`​
  * ​`color=grey`​
* ​`date`​: 设置日期，默认为当前日期，日期设置格式为`yyyy-mm-dd`​，仅在type=1、3、4、5、6、10时有效
* ​`content`​：设置文字图标的内容，默认为空，仅在type=7、8、9时有效

## 示例

### type=1：显示月日星期

默认显示今天的日期。

可通过`date=2024-10-26`​指定显示的日期

![PixPin_2024-10-27_10-35-03](https://github.com/user-attachments/assets/8f8c9d29-c0fa-468d-bd0f-caf4d43b458a)
​

```markdown
http://localhost:45678/?color=red&locale=cn
http://localhost:45678/?color=red&locale=en
```

### **type=3**：显示年月日

![PixPin_2024-10-27_10-35-18](https://github.com/user-attachments/assets/641d3409-d117-4662-b013-03623c833014)
​

```markdown
http://localhost:45678/?type=3&date=2021-01-01&color=red&locale=cn
http://localhost:45678/?type=3&date=2021-01-01&color=red&locale=en
```

### **type=4**：仅显示年月

![PixPin_2024-10-27_10-35-27](https://github.com/user-attachments/assets/e2db118a-7e46-428a-8dc3-567dcc0d16e6)
​

```markdown
http://localhost:45678/?type=4&date=2021-01-01&color=red&locale=cn
http://localhost:45678/?type=4&date=2021-01-01&color=red&locale=en

```

### **type=5**：仅显示年

![PixPin_2024-10-27_10-35-40](https://github.com/user-attachments/assets/82ca79d5-ff75-4b53-8d03-99c1e8b63df9)

```markdown
http://localhost:45678/?type=5&date=2021-01-01&color=red
```

### type=6：倒数日

该图标会显示当前日期与指定日期之间的天数。

支持 `locale=en`​ 修改为英文：

* ​`已过`​ 用 `Past`​ 表示。
* ​`还有`​ 用 `Left`​ 表示。

‍

![PixPin_2024-10-27_10-35-49](https://github.com/user-attachments/assets/f18a15c6-d3fd-40d9-be6a-e72c00bc54c0)
​

```markdown
http://localhost:45678/?color=red&date=2024-10-22&type=6&locale=cn
http://localhost:45678/?color=red&date=2024-10-22&type=6&locale=en
```

![PixPin_2024-10-27_10-36-00](https://github.com/user-attachments/assets/f46015ad-8562-4850-b10a-2acf3c1a540d)
​

```markdown
http://localhost:45678/?color=red&type=6&locale=cn
http://localhost:45678/?color=red&type=6&locale=en
```

![PixPin_2024-10-27_10-36-09](https://github.com/user-attachments/assets/5837b337-8582-4c94-8a11-52a616644811)
​

```markdown
http://localhost:45678/?color=red&date=2025-10-25&type=6&locale=cn
http://localhost:45678/?color=red&date=2025-10-25&type=6&locale=en
```

### type=7：百分比图标

该图标可以显示一个指定的百分比（0-100）。

![image](https://github.com/user-attachments/assets/1dcfc1d0-81be-4edb-a499-54eb1043846c)
​

```markdown
http://localhost:45678/?type=7&content=100&color=red
```

### type=8：字母数字图标

该图标可以显示一个指定的字母数字组合（1-6个字符）。

![image](https://github.com/user-attachments/assets/bf1af73c-0246-4565-a006-4bb8518757ef)
​

```markdown
http://localhost:45678/?type=8&content=Great&color=red
```

### type=9：汉字图标

该图标可以显示一个指定的汉字（1-3个字）

![image](https://github.com/user-attachments/assets/4042dbf9-4c11-4435-a17e-1c966fde9712)
​

```markdown
http://localhost:45678/?type=9&content=我爱你&color=red
```

### type=10：当前周数

![PixPin_2024-10-27_10-36-41](https://github.com/user-attachments/assets/15a33f1d-b4d6-4941-818c-e1facdd24917)
​

```markdown
http://localhost:45678/?type=10&date=2024-10-26&locale=cn
http://localhost:45678/?type=10&date=2024-10-26&locale=en
```
