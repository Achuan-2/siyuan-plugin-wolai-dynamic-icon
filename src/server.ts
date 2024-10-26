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
                const url = new URL(req.url, `http://localhost${this.port}`);
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

    private getDateInfo(dateStr: string | null, locale: string): { month: string, day: number, weekday: string } {
        const date = dateStr ? new Date(dateStr) : new Date();

        if (locale === 'en') {
            const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
                'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
                'Thursday', 'Friday', 'Saturday'];
            return {
                month: monthNames[date.getMonth()],
                day: date.getDate(),
                weekday: weekdayNames[date.getDay()]
            };
        } else {
            return {
                month: date.toLocaleString('zh-CN', { month: 'long' }),
                day: date.getDate(),
                weekday: date.toLocaleString('zh-CN', { weekday: 'long' })
            };
        }
    }

    private generateCalendarSVG(params: { color: string, date: string | null, locale: string, type: string }): string {
        const type = params.type || '1';

        switch (type) {
            case '3':
                return this.generateTypeThreeSVG(params);
            case '4':
                return this.generateTypeFourSVG(params);
            case '5':
                return this.generateTypeFiveSVG(params);
            case '6':
                return this.generateTypeSixSVG(params);
            case '7':
                return this.generateTypeSevenSVG(params);
            case '8':
                return this.generateTypeEightSVG(params);
            case '9':
                return this.generateTypeNineSVG(params);
            case '10':
                return this.generateTypeTenSVG(params);
            default:
                return this.generateTypeOneSVG(params);
        }
    }
    // Type 1: 显示年月日，年在上面
    private generateTypeOneSVG(params: { color: string, date: string | null, locale: string }): string {
        const colorScheme = this.colorSchemes[params.color.toLowerCase()] || this.colorSchemes.red;
        const dateInfo = this.getDateInfo(params.date, params.locale);

        return `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                aria-label="Calendar" role="img" viewBox="0 0 512 512" width="100%" height="100%">
                <path d="m512,455c0,32 -25,57 -57,57l-398,0c-32,0 -57,-25 -57,-57l0,-327c0,-31 25,-57 57,-57l398,0c32,0 57,26 57,57l0,327z" 
                    fill="#efefef"/>
                <path d="m484,0l-47,0l-409,0c-15,0 -28,13 -28,28l0,157l512,0l0,-157c0,-15 -13,-28 -28,-28z" 
                    fill="${colorScheme.primary}"/>
                <g fill="${colorScheme.secondary}">
                    <circle cx="462" cy="136" r="14"/>
                    <circle cx="462" cy="94" r="14"/>
                    <circle cx="419" cy="136" r="14"/>
                    <circle cx="419" cy="94" r="14"/>
                    <circle cx="376" cy="136" r="14"/>
                    <circle cx="376" cy="94" r="14"/>
                </g>
                <text id="month" x="32" y="142" fill="#fff" 
                    font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei'" 
                    font-size="100px" style="text-anchor: left">${dateInfo.month}</text>
                <text id="day" x="256" y="400" fill="#66757f" 
                    font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei'" 
                    font-size="256px" style="text-anchor: middle">${dateInfo.day}</text>
                <text id="weekday" x="256" y="480" fill="#66757f" 
                    font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei'" 
                    font-size="64px" style="text-anchor: middle">${dateInfo.weekday}</text>
            </svg>`;
    }
    // Type 3: 显示年月日，年在下面
    private generateTypeThreeSVG(params: { color: string, date: string | null, locale: string }): string {
        const colorScheme = this.colorSchemes[params.color.toLowerCase()] || this.colorSchemes.red;
        const targetDate = params.date ? new Date(params.date) : new Date();

        const dateInfo = this.getDateInfo(params.date, params.locale);

        const day = targetDate.getDate();
        const year = targetDate.getFullYear();

        return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
            <path d="M512,455c0,32 -25,57 -57,57H57c-32,0 -57,-25 -57,-57V128c0,-31 25,-57 57,-57h398c32,0 57,26 57,57v327z" fill="#efefef"/>
            <path d="M484,0h-47H28c-15,0 -28,13 -28,28v157h512V28c0,-15 -13,-28 -28,-28z" fill="${colorScheme.primary}"/>
            <g fill="${colorScheme.secondary}">
                <circle cx="462" cy="136" r="14"/>
                <circle cx="462" cy="94" r="14"/>
                <circle cx="419" cy="136" r="14"/>
                <circle cx="419" cy="94" r="14"/>
                <circle cx="376" cy="136" r="14"/>
                <circle cx="376" cy="94" r="14"/>
            </g>
            <text id="month" x="32" y="142" fill="#fff" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="100px" style="text-anchor: left">${dateInfo.month}</text>
            <text id="day" x="256" y="400" fill="#66757f" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="256px" style="text-anchor: middle">${day}</text>
            
            <text id="weekday" x="256" y="480" fill="#66757f" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="64px" style="text-anchor: middle">${year}</text>
        </svg>`;
    }

    // Type 4: 仅显示年月
    private generateTypeFourSVG(params: { color: string, date: string | null, locale: string }): string {
        const colorScheme = this.colorSchemes[params.color.toLowerCase()] || this.colorSchemes.red;
        const targetDate = params.date ? new Date(params.date) : new Date();
        const dateInfo = this.getDateInfo(params.date, params.locale);

        const year = targetDate.getFullYear();

        return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
            <path d="M512,455c0,32 -25,57 -57,57H57c-32,0 -57,-25 -57,-57V128c0,-31 25,-57 57,-57h398c32,0 57,26 57,57v327z" fill="#efefef"/>
            <path d="M484,0h-47H28c-15,0 -28,13 -28,28v157h512V28c0,-15 -13,-28 -28,-28z" fill="${colorScheme.primary}"/>
            <g fill="${colorScheme.secondary}">
                <circle cx="462" cy="136" r="14"/>
                <circle cx="462" cy="94" r="14"/>
                <circle cx="419" cy="136" r="14"/>
                <circle cx="419" cy="94" r="14"/>
                <circle cx="376" cy="136" r="14"/>
                <circle cx="376" cy="94" r="14"/>
            </g>
            <text id="month" x="32" y="150" fill="#fff" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="120px" style="text-anchor: left">${year}</text>
            <text id="day" x="256" y="400" fill="#66757f" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="180px" style="text-anchor: middle">${dateInfo.month}</text>
            <text id="weekday" x="256" y="480" fill="#66757f" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="64px" style="text-anchor: middle"></text>
        </svg>`;
    }

    // Type 5: 仅显示年
    private generateTypeFiveSVG(params: { color: string, date: string | null, locale: string }): string {
        const colorScheme = this.colorSchemes[params.color.toLowerCase()] || this.colorSchemes.red;
        const targetDate = params.date ? new Date(params.date) : new Date();
        const year = targetDate.getFullYear();

        return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
            <path d="M512,455c0,32 -25,57 -57,57H57c-32,0 -57,-25 -57,-57V128c0,-31 25,-57 57,-57h398c32,0 57,26 57,57v327z" fill="#efefef"/>
            <path d="M484,0h-47H28c-15,0 -28,13 -28,28v157h512V28c0,-15 -13,-28 -28,-28z" fill="${colorScheme.primary}"/>
            <g fill="${colorScheme.secondary}">
                <circle cx="462" cy="136" r="14"/>
                <circle cx="462" cy="94" r="14"/>
                <circle cx="419" cy="136" r="14"/>
                <circle cx="419" cy="94" r="14"/>
                <circle cx="376" cy="136" r="14"/>
                <circle cx="376" cy="94" r="14"/>
            </g>
            <text id="month" x="32" y="150" fill="#fff" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="122px" style="text-anchor: left"></text>
            <text id="day" x="256" y="400" fill="#66757f" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="200px" style="text-anchor: middle">${year}</text>
            <text id="weekday" x="256" y="480" fill="#66757f" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="64px" style="text-anchor: middle"></text>
        </svg>`;
    }
    // Type 6: 倒数日
    private generateTypeSixSVG(params: { color: string, date: string | null, locale: string }): string {
        const colorScheme = this.colorSchemes[params.color.toLowerCase()] || this.colorSchemes.red;
        const targetDate = params.date ? new Date(params.date) : new Date();
        const currentDate = new Date();

        targetDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        const diffTime = targetDate.getTime() - currentDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let displayText = '';
        let daysText = '';
        let daysColor = '#66757F';

        if (diffDays === 0) {
            displayText = params.locale === 'en' ? 'Today' : '今天';
            daysText = '--';
            daysColor = '#96a5af';
        } else if (diffDays > 0) {
            displayText = params.locale === 'en' ? 'Left' : '还有';
            daysText = diffDays.toString();
        } else {
            displayText = params.locale === 'en' ? 'Past' : '已过';
            daysText = Math.abs(diffDays).toString();
        }

        // 根据倒数天数长度调整字体大小
        let fontSize;
        if (daysText.length >= 6) {
            fontSize = 130;
        } else if (daysText.length == 5) {
            fontSize = 140;
        } else if (daysText.length === 4) {
            fontSize = 190;
        } else  {
            fontSize = 240;
        }
        let dayStr;
        dayStr = params.locale === 'en' ? 'days' : '天';

        return `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
            aria-label="Calendar" role="img" viewBox="0 0 512 512" width="100%" height="100%">
            <path d="M512,454.847248 C512,486.933004 487,512 455,512 L57,512 C25,512 0,486.933004 0,454.847248 L0,126.970934 C0,95.8878582 25,69.8181818 57,69.8181818 L455,69.8181818 C487,69.8181818 512,95.8878582 512,126.970934 L512,454.847248 Z" 
                fill="#EFEFEF" fill-rule="nonzero"/>
            <path d="M484,0 L437,0 L28,0 C13,0 0,13.0830467 0,28.1788698 L0,186.181818 L512,186.181818 L512,28.1788698 C512,13.0830467 499,0 484,0 Z" 
                fill="${colorScheme.primary}" fill-rule="nonzero"/>
            <text id="day" x="256" y="400" fill="${daysColor}" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="${fontSize}" style="text-anchor: middle">${daysText}</text>
            <text id="weekday\" x="256" y="480" fill="#66757f" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="64px" style="text-anchor: middle">${dayStr}</text>
            <text id="year" 
                fill="#FFFFFF" 
                font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei'" 
                font-size="62" 
                font-weight="normal">
                <tspan x="54.3" y="81.5">${targetDate.getFullYear()}</tspan>
            </text>
            <text id="month-day" 
                font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei'" 
                font-size="77.6" 
                font-weight="normal" 
                fill="#FFFFFF">
                <tspan x="54.3" y="159.6">${(targetDate.getMonth() + 1).toString().padStart(2, '0')}-${targetDate.getDate().toString().padStart(2, '0')}</tspan>
            </text>
            <text id="desc" 
                font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei'" 
                font-size="62" 
                font-weight="normal" 
                fill="#FFFFFF">
                <tspan x="333.6" y="153.1">${displayText}</tspan>
            </text>
        </svg>`;
    }

    // Type 7: 百分比
    private generateTypeSevenSVG(params: { color: string, date: string | null, locale: string }): string {
        const colorScheme = this.colorSchemes[params.color.toLowerCase()] || this.colorSchemes.red;
        let content = params.content || '';
        let fontSize;
        if (content.length >= 3) {
            fontSize = 180;
        } else {
            fontSize = 230;
        }
        if (content.length > 0 ){
            content = content + '%';
        }
        return `

        <svg width="100%" height="100%" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="🍊正文区1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="icon/状态/日历/purple" transform="translate(0.000000, 2.000000)">
                <path d="M504,448.085714 C504,479.47619 479.390625,504 447.890625,504 L56.109375,504 C24.609375,504 0,479.47619 0,448.085714 L0,127.314286 C0,107.04127 0,87.9365079 0,70 L504,70 C504,87.9365079 504,107.04127 504,127.314286 L504,448.085714 Z" id="路径" fill="#EFEFEF" fill-rule="nonzero"></path>
                    <text id="0%" fill-rule="nonzero" font-family="SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace, -apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="${fontSize}" font-weight="400"  x="256" y="370.428571" line-spacing="237.714286" fill="#66757F" style="text-anchor: middle">
                    ${content}
                    </text>
                    <path d="M476.4375,0 L430.171875,0 L27.5625,0 C12.796875,0 0,11.8976351 0,25.6256757 L0,75 L504,75 L504,25.6256757 C504,11.8976351 491.203125,0 476.4375,0 Z" id="路径" fill="${colorScheme.primary}" fill-rule="nonzero"></path>
                    
                </g>
            </g>
        </svg>
        `;
    }

    private generateTypeEightSVG(params: { color: string, date: string | null, locale: string }): string {
        const colorScheme = this.colorSchemes[params.color.toLowerCase()] || this.colorSchemes.red;
        let content = params.content || '';
        let fontSize;
        let yPosition;
        // 根据长度调整字体大小
        switch (content.length) {
            case 1:
                fontSize = 315.857143;
                yPosition = 400.714286;
                break;
            case 2:
                fontSize = 267.857143;
                yPosition = 385.714286;
                break;
            case 3:
                fontSize = 206.857143;
                yPosition = 360.714286;
                break;
            case 4:
                fontSize = 190.857143;
                yPosition = 345.714286;
                break;
            case 5:
                fontSize = 146.857143;
                yPosition = 330.714286;
                break;
            default:
                fontSize = 130;
                PositionyPosition = 315.714286;
        }
        return `
            <svg width="100%" height="100%" viewBox="0 0 508 506" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <defs>

                </defs>
                <g id="🍊正文区1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="icon/状态/日历/purple" transform="translate(0.000000, 2.000000)">
                    <path d="M504,448.085714 C504,479.47619 479.390625,504 447.890625,504 L56.109375,504 C24.609375,504 0,479.47619 0,448.085714 L0,127.314286 C0,107.04127 0,87.9365079 0,70 L504,70 C504,87.9365079 504,107.04127 504,127.314286 L504,448.085714 Z" id="路径" fill="#EFEFEF" fill-rule="nonzero"></path>
                        <text id="0%" fill-rule="nonzero" font-family="SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace, -apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="${fontSize}" font-weight="400"  x="256" y="${yPosition}" line-spacing="237.714286" fill="#66757F" style="text-anchor: middle">
                        ${content}
                        </text>
                        <path d="M476.4375,0 L430.171875,0 L27.5625,0 C12.796875,0 0,11.8976351 0,25.6256757 L0,75 L504,75 L504,25.6256757 C504,11.8976351 491.203125,0 476.4375,0 Z" id="路径" fill="${colorScheme.primary}" fill-rule="nonzero"></path>

                    </g>
                </g>
            </svg>
        `;
    }

    private generateTypeNineSVG(params: { color: string, date: string | null, locale: string }): string {
        const colorScheme = this.colorSchemes[params.color.toLowerCase()] || this.colorSchemes.red;
        let content = params.content || '';
        let fontSize;
        let yPosition;
        // 根据长度调整字体大小
        switch (content.length) {
            case 1:
                fontSize = 250.142857;
                yPosition = 380.428571;
                break;
            case 2:
                fontSize = 220.142857;
                yPosition = 360.428571;
                break;
            case 3:
                fontSize = 150.857143;
                yPosition = 340.714286;
                break;
            default:
                fontSize = 100.142857;
                yPosition = 320.428571;
        }
        return `
            <svg width="100%" height="100%" viewBox="0 0 508 506" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g id="🍊正文区1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="icon/状态/日历/purple" transform="translate(0.000000, 2.000000)">
                    <path d="M504,448.085714 C504,479.47619 479.390625,504 447.890625,504 L56.109375,504 C24.609375,504 0,479.47619 0,448.085714 L0,127.314286 C0,107.04127 0,87.9365079 0,70 L504,70 C504,87.9365079 504,107.04127 504,127.314286 L504,448.085714 Z" id="路径" fill="#EFEFEF" fill-rule="nonzero"></path>
                        <text id="0%" fill-rule="nonzero" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="${fontSize}" font-weight="206.857143"  x="256" y="${yPosition}" line-spacing="237.714286" fill="#66757F" style="text-anchor: middle">
                        ${content}
                        </text>
                        <path d="M476.4375,0 L430.171875,0 L27.5625,0 C12.796875,0 0,11.8976351 0,25.6256757 L0,75 L504,75 L504,25.6256757 C504,11.8976351 491.203125,0 476.4375,0 Z" id="路径" fill="${colorScheme.primary}" fill-rule="nonzero"></path>

                    </g>
                </g>
            </svg>
        `;
    }

    // Type 10: 当前周数
    private generateTypeTenSVG(params: { color: string, date: string | null, locale: string }): string {
        const colorScheme = this.colorSchemes[params.color.toLowerCase()] || this.colorSchemes.red;
        // 获取日期的年份和周数
        const targetDate = params.date ? new Date(params.date) : new Date();
        const year = targetDate.getFullYear();
        // 计算是今年的第几周
        function getWeekNumber(d: Date): number {
            // 复制日期，因为不想修改原始日期
            d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
            // 设置为当年1月1日
            const yearStart = new Date(Date.UTC(d.getFullYear(), 0, 1));
            // 计算从年初到目标日期的天数
            const daysPassed = Math.floor((d.getTime() - yearStart.getTime()) / 86400000);
            // 计算周数并返回
            return Math.ceil((daysPassed + yearStart.getDay() + 1) / 7);
        }

        const weekNumber = getWeekNumber(targetDate);
        const weekStr =  params.locale === 'en' ? 'W' : '周';
        return `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-label="Calendar" role="img" viewBox="0 0 512 512" width="100%" height="100%" style="cursor: default">
            null
            <path d="m512,455c0,32 -25,57 -57,57l-398,0c-32,0 -57,-25 -57,-57l0,-327c0,-31 25,-57 57,-57l398,0c32,0 57,26 57,57l0,327z" fill="#efefef"/>
            <path d="m484,0l-47,0l-409,0c-15,0 -28,13 -28,28l0,157l512,0l0,-157c0,-15 -13,-28 -28,-28z" fill="${colorScheme.primary}"/>
            <g fill="${colorScheme.secondary}">
                <circle cx="462" cy="136" r="14"/>
                <circle cx="462" cy="94" r="14"/>
                <circle cx="419" cy="136" r="14"/>
                <circle cx="419" cy="94" r="14"/>
                <circle cx="376" cy="136" r="14"/>
                <circle cx="376" cy="94" r="14"/>
            </g>
            <text id="month" x="32" y="150" fill="#fff" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="122px" style="text-anchor: left">${year}</text>
            <text id="day" x="256" y="400" fill="#66757f" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="184px" style="text-anchor: middle">${weekNumber}${weekStr}</text>

            <text id="weekday" x="256" y="480" fill="#66757f" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="64px" style="text-anchor: middle"></text>
            null
        </svg>
        `;
    }
}
