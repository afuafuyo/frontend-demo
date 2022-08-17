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
        defaultStartDate: {
            type: String,
            value: ''
        },
        defaultEndDate: {
            type: String,
            value: ''
        },
        timeInterval: {
            type: Number,
            value: 60
        },
        /**
         * `[ {hour, minute} ]`
         */
        defaultStartTimeList: {
            type: Array,
            value: []
        },
        /**
         * `[ {hour, minute} ]`
         */
        defaultEndTimeList: {
            type: Array,
            value: []
        },
        // 时间列表中的下标值
        defaultTimeValues: {
            type: Array,
            value: [0, 0]
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

        // ----------------- 数据生产 ---------------------
        // 一下字段直接赋值
        //
        // 用户选择日期部分 用于产出最后结果
        // 用户选中的开始日期 00:00:00 开始
        // 初始会自动赋值为属性值或者系统默认值
        _startDate: null,
        // 用户选中的结束日期 00:00:00 结束
        _endDate: null,
        // 用户选择时间部分 用于产出最后结果
        _startTime: {
            hour: 0,
            minute: 0
        },
        _endTime: {
            hour: 0,
            minute: 0
        },
        // ----------------- 数据生产 ---------------------

        /**
         * 时间列表 `[ {hour, minute} ]`
         */
        _startTimeList: [],
        _endTimeList: [],
        _timeValues: [0, 0],

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
                    // 用户是否选中当天
                    active: false,
                    // 是否可用
                    disabled: false
                }
            ]
        }
        ```
        */
        data: [],
        /**
         * result 是为了方便页面展示
         */
        result: {
            startDateString: '',
            startTimeString: '',
            startWeek: '',
            endDateString: '',
            endTimeString: '',
            endWeek: '',
            totalDays: 0
        }
    },

    lifetimes: {
        attached() {
            this.initTime();
            this.initDate();
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        initTime() {
            let ts: any = this.data.defaultStartTimeList;
            let te: any = this.data.defaultEndTimeList;
            let tv: any = this.data.defaultTimeValues;
            if(ts.length && te.length) {
                let start = ts[ tv[0] ];
                let end = te[ tv[1] ];
                this.setData({
                    _startTimeList: ts,
                    _endTimeList: te
                });
                this.setData({
                    _timeValues: tv,
                    result: Object.assign(this.data.result, {
                        startTimeString: this.stringLPad(start.hour) + ':' + this.stringLPad(start.minute),
                        endTimeString: this.stringLPad(end.hour) + ':' + this.stringLPad(end.minute)
                    })
                });
                return;
            }

            // 系统默认时间
            let ret: any = [];
            let colValues = [0, 0];
            let interval = this.data.timeInterval;
            for(let h=0; h<24; h++) {
                for(let m=0; m<60; m=m+interval) {
                    ret.push(
                        {hour: h, minute: m}
                    );
                }
            }

            this.setData({
                _startTimeList: ret,
                _endTimeList: ret
            });
            // bug ? 不知道 反正得分开赋值
            this.setData({
                _timeValues: colValues,
                result: Object.assign(this.data.result, {
                    startTimeString: this.stringLPad(ret[ colValues[0] ].hour) + ':' + this.stringLPad(ret[ colValues[0] ].minute),
                    endTimeString: this.stringLPad(ret[ colValues[1] ].hour) + ':' + this.stringLPad(ret[ colValues[1] ].minute)
                })
            });
        },
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

            // 处理结果区
            let {start, end} = this.getUserDate();
            this.setData({
                data: ret,
                result: Object.assign(this.data.result, {
                    startDateString: this.formatDate('m月d日', start),
                    startWeek: this.getWeek(start),
                    endDateString: this.formatDate('m月d日', end),
                    endWeek: this.getWeek(end),
                    totalDays: this.getTotalDays(start, end)
                })
            })
        },
        stringLPad(str: any, pad: string = '0', length: number = 2) {
            str = String(str);
            while(str.length < length) {
                str = pad + str;
            }
    
            return str;
        },
        formatDate(formats: string, date: Date) {
            let funs: any = {
                y: () => date.getFullYear()
                ,m: () => this.stringLPad(date.getMonth() + 1)
                ,d: () => this.stringLPad(date.getDate())
                ,h: () => this.stringLPad(date.getHours())
                ,i: () => this.stringLPad(date.getMinutes())
                ,s: () => this.stringLPad(date.getSeconds())
            };
    
            return formats.replace(/(.?)/ig, (match, p) => {
                return undefined !== funs[match] ?
                    funs[match]() :
                    p;
            });
        },
        getWeek(date: Date) {
            let str = '';
            let w = date.getDay();
            switch(w) {
                case 1:
                    str = '周一';
                    break;
                case 2:
                    str = '周二';
                    break;
                case 3:
                    str = '周三';
                    break;
                case 4:
                    str = '周四';
                    break;
                case 5:
                    str = '周五';
                    break;
                case 6:
                    str = '周六';
                    break;
                case 0:
                    str = '周日';
                    break;
                default:
                    break;
            }

            return str;
        },
        getTotalDays(start: Date, end: Date) {
            return Math.ceil( (end.getTime() - start.getTime()) / 86400000);
        },
        // 生成每个月的数据
        getMonthData(year: number, month: number) {
            let week = new Date(year, month - 1, 1).getDay();
            let days = this.getDaysOfMonth(year, month);
            
            // 结构
            let oneMonth: any = {
                title: year + '年' + month + '月',
                days: []
            };

             // 补齐上个月空白
            for(let i=week; i>0; i--) {
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
                    disabled: this.isDisabled(year, month, j),

                    // 控制浅色背景
                    active: this.isDayActive(year, month, j),
                    // 控制深色背景
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
                start = this.data.defaultStartDate
                    ? new Date(this.data.defaultStartDate + ' 00:00:00')
                    : new Date(
                        this.data._year,
                        this.data._month - 1,
                        this.data._date,
                        0, 0, 0
                    );

                // 赋值
                this.data._startDate = start;
            }
            if(!end) {
                // 结束时间默认 00:00:00
                end = this.data.defaultEndDate
                    ? new Date(this.data.defaultEndDate + '00:00:00')
                    // 默认两天后的 00:00:00
                    : new Date(
                        // 1000 * 60 * 60 * 24 * 2
                        this.data._today_zero_time + 172800000
                    );

                // 赋值
                this.data._endDate = end;
            }

            return {start, end};
        },
        // 某天是否在用户选择的日期内
        isDayActive(year: number, month: number, day: number) {
            // 年月日在某范围
            let {start, end} = this.getUserDate();
            let userStartYear = start.getFullYear();
            let userStartMonth = start.getMonth();
            let userStartDate = start.getDate();
            let userEndYear = end.getFullYear();
            let userEndMonth = end.getMonth();
            let userEndDate = end.getDate();

            let userStartTime = new Date(userStartYear, userStartMonth, userStartDate).getTime();
            let userEndTime = new Date(userEndYear, userEndMonth, userEndDate).getTime();
            let tableCellTime = new Date(year, month - 1, day).getTime();

            if(tableCellTime >= userStartTime && tableCellTime <= userEndTime) {
                return true;
            }

            return false;
        },
        // 日期是否不可用
        isDisabled(year: number, month: number, day: number) {
            let tableCellTime = new Date(year, month - 1, day).getTime();

            return tableCellTime < this.data._today_zero_time;
        },
        isSelectStart(year: number, month: number, day: number) {
            // 用户时间
            let {start} = this.getUserDate();
            let userYear = start.getFullYear();
            let userMonth = start.getMonth() + 1;
            let userDate = start.getDate();

            return userYear === year && userMonth === month && userDate === day;
        },
        isSelectEnd(year: number, month: number, day: number) {
            // 用户时间
            let {end} = this.getUserDate();
            let userYear = end.getFullYear();
            let userMonth = end.getMonth() + 1;
            let userDate = end.getDate();

            // 这里判断不严谨 按理说得判断年月日 不过不影响逻辑
            return userYear === year && userMonth === month && userDate === day;
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

        // 用户点击日期
        doSelectDate(e: any) {
            let t = e.target;
            let dataset = t.dataset;
            if(!dataset) {
                return;
            }

            let {action, value, disabled} = dataset;
            if(!action || 'pick' !== action || '1' === disabled) {
                return;
            }

            this.data._click_count = this.data._click_count ^ 1;

            let data: any = this.data;
            // 选择开始时间
            if(1 === this.data._click_count) {
                data._startDate = new Date(value + ' 00:00:00');
                data._endDate = new Date(value + ' 00:00:00');

            } else {
                let userEnd = new Date(value + ' 00:00:00');

                // 如果结束时间 < 开始时间 将开始和结束时间设置为当前点击
                if(userEnd.getTime() <= data._startDate.getTime()) {
                    // 重置点击次数
                    this.data._click_count = this.data._click_count ^ 1;
                    data._startDate = userEnd;
                    data._endDate = userEnd;

                } else {
                    data._endDate = userEnd;
                }
            }

            this.initDate();
        },

        // 改变时间
        doChangeTime(e: any) {
            let value = e.detail.value;
            let {_startTimeList, _endTimeList} = this.data;

            let start: any = _startTimeList[ value[0] ];
            let end: any = _endTimeList[ value[1] ];

            if(!start || !end) {
                return;
            }

            this.data._startTime = start;
            this.data._endTime = end;
            this.setData({
                result: Object.assign(this.data.result, {
                    startTimeString: this.stringLPad(start.hour) + ':' + this.stringLPad(start.minute),
                    endTimeString: this.stringLPad(end.hour) + ':' + this.stringLPad(end.minute)
                })
            });
        },

        doConfirmRange() {
            let _startDate: any = this.data._startDate;
            let _endDate: any = this.data._endDate;
            let {_startTime, _endTime, result} = this.data;

            let startString = result.startDateString + result.startTimeString;
            let endString = result.endDateString + result.endTimeString;

            let start = new Date(_startDate.getTime() + 3600000 * _startTime.hour + 60000 * _startTime.minute);
            let end = new Date(_endDate.getTime() + 3600000 * _endTime.hour + 60000 * _endTime.minute);

            let ret = {
                start: start,
                end: end,

                startWeek: result.startWeek,
                endWeek: result.endWeek,
                startString: startString,
                endString: endString,
                totalDays: result.totalDays
            };
            
            this.triggerEvent('onPickRange', ret);
        }
    }
})
