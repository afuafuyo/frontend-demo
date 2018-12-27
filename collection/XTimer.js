/**
 * 倒计时
 */
function XTimer() {
    this.days = 0;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;

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
     * @param {Number} endTimestamp
     * @param {Number} nowServerTimestamp
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
        this.seconds = Math.round( x / 1000);
    }
};
