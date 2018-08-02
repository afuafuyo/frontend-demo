/**
 * waterfall
 *
 * @author afu
 */
function WaterFall() {
    this.doc = document;
    
    this.colElementClass = 'x-wf-col';
    this.wrapperWidth = 1200;
    this.colWidth = 224;
    this.colGapVertical = 30;
    
    this.batchFalls = 0;
    this.callback = null;
    this.colLength = Math.floor(this.wrapperWidth / this.colWidth);
    this.colGapHorizontal = Math.floor(this.wrapperWidth % this.colWidth / (this.colLength - 1));
    this.heightArr = this.fillZero(this.colLength);
}
WaterFall.prototype = {
    constructor: WaterFall,
    // 查找类名为指定值的父元素
    findParent: function(obj, className) {
        var ret = obj.parentNode;
        if(className !== ret.className) {
            ret = this.findParent(ret, className);
        }
        
        return ret;
    },
    // 生成一个全是零的数组
    fillZero: function(num) {
        var ret = new Array(num);
        for(var i=0; i<num; i++) {
            ret[i] = 0;
        }
        
        return ret;
    },
    // 数组中的最小值的索引
    minIndex: function() {
        var min = Math.min.apply(null, this.heightArr);
        var idx = -1;
        
        for(var i=0,len=this.heightArr.length; i<len; i++) {
            if(min === this.heightArr[i]) {
                idx = i;
                break;
            }
        }
    
        return idx;
    },
    // 布局
    imgLoaded: function(element, isColElement) {
        var colElement = isColElement
            ? element
            : this.findParent(element, this.colElementClass);
        var minIndex = this.minIndex();
        
        // 放到一行中最低的地方
        colElement.style.cssText = 'top:'+ this.heightArr[minIndex] +
            'px; left:'+ (this.colWidth*minIndex + this.colGapHorizontal*minIndex) +'px;';
        
        // 当前元素的高度存入数组
        this.heightArr[minIndex] = this.heightArr[minIndex] +
            colElement.offsetHeight + this.colGapVertical;
        
        this.batchFalls--;
        if(this.batchFalls <= 0) {
            'function' === typeof this.callback && this.callback();
        }
    },
    
    /**
     * 布局方法
     *
     * @param String colElementClass 需要布局的元素
     * @param Function callback 回调
     */
    fall: function(colElementClass, colImageSelector, callback) {
        var _self = this;
        var colElements = this.doc.querySelectorAll('.' + colElementClass);
        
        this.colElementClass = colElementClass;
        this.batchFalls = colElements.length;
        this.callback = callback;
        
        var img = null;
        for(var i=0; i<this.batchFalls; i++) {
            if(null !== (img = colElements[i].querySelector(colImageSelector))) {
                if(img.complete) {
                    this.imgLoaded(img, false);
                    
                } else {
                    img.onload = function(e){
                        _self.imgLoaded(this, false);
                    };
                }
                
                continue;
            }
            
            this.imgLoaded(colElements[i], true);
        }
        img = null;
    }
};
