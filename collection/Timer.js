/**
 * 倒计时
 */
function Timer() {
    this.days = 0;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;

    this.staticTime = 0;
}
Timer.prototype = {
    constructor : Timer
    ,setStaticTime: function(timestamp) {
        this.staticTime = timestamp;
    }
    ,diff : function() {
        var t = new Date().getTime();
        var x = this.staticTime - t;
         
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
