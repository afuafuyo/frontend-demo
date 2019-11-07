/**
 * 倒计时
 *
 * var timer = new XTimer();
 * timer.setStaticTime(endTimestamp, nowServerTimestamp);
 * timer.onTick = function() {
 *      console.log(timer.days + '天' + timer.hours + '小时' + timer.minutes + '分');
 * };
 * timer.onEnd = function() {
 *
 * };
 *
 * timer.tick();
 *
 */
function XTimer() {
    this.days = 0;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;

    this.timerHandler = 0;
    this.onTick = null;
    this.onEnd = null;
    // 结束时间
    this.endTimestamp = 0;
    // 当前服务器时间和客户端时间差
    this.serverClientTimeDiff = 0;
}
XTimer.prototype = {
    constructor : XTimer

    /**
     * 设置毫秒时间戳
     *
     * @param {Number} endTimestamp 结束时间
     * @param {Number} nowServerTimestamp 当前服务器时间 可选
     */
    ,setStaticTime: function(endTimestamp, nowServerTimestamp) {
        this.endTimestamp = endTimestamp;

        if(undefined !== nowServerTimestamp) {
            this.serverClientTimeDiff = new Date().getTime() - nowServerTimestamp;
        }
    }

    ,diff : function() {
        var t = new Date().getTime();
        var x = this.endTimestamp - t + this.serverClientTimeDiff;

        //计算出相差天数
        this.days = Math.floor( x / (1000 * 3600 * 24));

        // 计算小时
        x = x % (1000 * 3600 * 24);
        this.hours = Math.floor(x / (1000 * 3600));

        // 计算分
        x = x % (1000 * 3600);
        this.minutes = Math.floor(x / (1000 * 60));

        // 计算秒
        x = x % (1000 * 60);
        this.seconds = Math.floor( x / 1000);
    }

    ,tick: function() {
        var _self = this;

        this.diff();

        // fix
        this.days < 0 && (this.days = 0);
        this.hours < 0 && (this.hours = 0);
        this.minutes < 0 && (this.minutes = 0);
        this.seconds < 0 && (this.seconds = 0);

        this.onTick && this.onTick();

        if(this.days <= 0
            && this.hours <= 0
            && this.minutes <= 0
            && this.seconds <= 0) {

            this.onEnd();

            return;
        }

        this.timerHandler = window.setTimeout(function(){
            _self.tick();
        }, 1000);
    }

    ,stop: function() {
        window.clearTimeout(this.timerHandler);
    }
};
