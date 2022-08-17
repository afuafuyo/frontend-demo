// components/calendar/index.ts
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        /**
         * 显示几个月
         */
        monthNumber: {
            type: Number,
            value: 10
        },
        // 小程序不支持传 Date 值
        // 所以用字符串代替
        // value 需要包含时分秒
        startDate: {
            type: String,
            value: ''
        },
        endDate: {
            type: String,
            value: ''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 0 选择结束 1 选择开始
        _click_count: 0,
        _year: 0,
        _month: 0,
        _date: 0,
        _hours: 0,
        _minutes: 0,
        _seconds: 0,
        _today_zero_time: 0,

        // 用户选中的开始日期 从 00:00:01 开始
        _startDate: null,
        // 用户选中的结束日期 从 23:59:59 结束
        _endDate: null,

        /**
         * 日历数据结构
        ```
        {
            title: '2022年5月',
            days: [
                {
                    year: 2022,
                    month: 5,
                    day: 1,
                    // 是否是今天
                    is_today: false,
                    // 是否选中
                    active: false,
                    // 是否可用
                    disabled: false
                }
            ]
        }
        ```
        */
        data: []
    },

    lifetimes: {
        attached() {
            this.initDate();
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        initDate() {
            let d = new Date();
            let year = d.getFullYear();
            let month = d.getMonth() + 1;
            let date = d.getDate();
            let hours = d.getHours();
            let minutes = d.getMinutes();
            let seconds = d.getSeconds();

            this.data._year = year;
            this.data._month = month;
            this.data._date = date;
            this.data._hours = hours;
            this.data._minutes = minutes;
            this.data._seconds = seconds;
            this.data._today_zero_time = new Date(
                year, month-1, date, 0, 0, 0
            ).getTime();
            
            let max = this.data.monthNumber;
            let ret: any = [];
            for(let i=0; i<max; i++) {
                ret.push(this.getMonthData(year, month));

                if(12 === month) {
                    year++;
                    month = 1;

                } else {
                    month++;
                }
            }

            this.setData({
                data: ret
            })
        },
        // 生成每个月的数据
        getMonthData(year: number, month: number) {
            let startWeek = new Date(year, month - 1, 1).getDay();
            let days = this.getDaysOfMonth(year, month);
            
            // 结构
            let oneMonth: any = {
                title: year + '年' + month + '月',
                days: []
            };

             // 补齐上个月空白
            for(let i=startWeek; i>0; i--) {
                oneMonth.days.push({
                    year: year,
                    month: month,
                    day: 0 - i,
                    is_today: false,
                    active: false,
                    disabled: true
                });
            }

            // 本月
            for(let j=1; j<=days; j++) {
                oneMonth.days.push({
                    year: year,
                    month: month,
                    day: j,
                    is_today: month === this.data._month && j === this.data._date,
                    // 深色背景
                    active: this.isDayActive(year, month, j),
                    disabled: this.isDisabled(year, month, j),

                    // 控制浅色背景
                    is_select_start: this.isSelectStart(year, month, j),
                    is_select_end: this.isSelectEnd(year, month, j),
                });
            }

            return oneMonth;
        },
        getUserDate() {
            // 用户时间
            let start: any = this.data._startDate;
            let end: any = this.data._endDate;
            if(!start) {
                start = this.data.startDate
                    ? new Date(this.data.startDate)
                    : new Date(
                        this.data._year,
                        this.data._month - 1,
                        this.data._date,
                        0, 0, 1
                    );
            }
            if(!end) {
                end = this.data.endDate
                    ? new Date(this.data.endDate)
                    // 默认后天的 23:59:59
                    : new Date(
                        // 1000 * 60 * 60 * 24 * 3 - 1000
                        this.data._today_zero_time + 259199000
                    );
            }

            return {start, end};
        },
        // 是否选中某天
        isDayActive(year: number, month: number, day: number) {
            // 用户时间
            let {start, end} = this.getUserDate();

            let min = start.getTime();
            let max = end.getTime();
            let tableCellTime = new Date(
                year,
                month - 1,
                day,
                this.data._hours,
                this.data._minutes,
                this.data._seconds).getTime();
            
            // 如果当前时间在用户选择时间范围内 则为 active
            if(tableCellTime >= min && tableCellTime <= max) {
                return true;
            }
            
            return false;
        },
        isDisabled(year: number, month: number, day: number) {
            return year <= this.data._year && month <= this.data._month && day < this.data._date;
        },
        isSelectStart(year: number, month: number, day: number) {
            // if(1 === this.data._click_count) {
            //     return false;
            // }

            // 用户时间
            let {start} = this.getUserDate();
            let userDate = start.getDate();
            let userMonth = start.getMonth() + 1;

            // 这里判断不严谨 按理说得判断年月日 不过不影响逻辑
            return userDate === day && userMonth === month;
        },
        isSelectEnd(year: number, month: number, day: number) {
            // if(1 === this.data._click_count) {
            //     return false;
            // }
            
            // 用户时间
            let {end} = this.getUserDate();
            let userDate = end.getDate();
            let userMonth = end.getMonth() + 1;

            // 这里判断不严谨 按理说得判断年月日 不过不影响逻辑
            return userDate === day && userMonth === month;
        },
        getDaysOfMonth(year: number, month: number) {
            if(0 === month) {
                year = year - 1;
                month = 12;
            }
            if(13 === month) {
                year = year + 1;
                month = 1;
            }
    
            if(2 === month) {
                if(0 === year % 400 || (0 === year % 4 && 0 !== year % 100)) {
                    return 29;
                }
    
                return 28;
            }
    
            if(4 === month || 6 === month || 9 === month || 11 === month) {
                return 30;
            }
    
            return 31;
        },

        doSelectRange(e: any) {
            let t = e.target;
            let dataset = t.dataset;
            if(!dataset) {
                return;
            }

            let {action, value} = dataset;
            if(!action || 'pick' !== action) {
                return;
            }

            this.data._click_count = this.data._click_count ^ 1;

            let data: any = this.data;
            // 选择开始时间
            if(1 === this.data._click_count) {
                data._startDate = new Date(value + ' 00:00:01');
                data._endDate = new Date(value + ' 23:59:59');

            } else {
                // 如果结束时间 < 开始时间
                let userEnd = new Date(value + ' 23:59:59');
                if(userEnd.getTime() <= data._startDate.getTime()) {
                    // 重置点击次数 其他什么也不做
                    this.data._click_count = this.data._click_count ^ 1;
                    return;

                } else {
                    data._endDate = userEnd;
                }
            }

            this.initDate();
        }
    }
})
