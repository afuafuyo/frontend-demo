/**
 * waterfall
 *
 * @author afu
 *
 * structure 两端没有空隙
 *
 * -----------------
 * ||----|   |----||
 * ||    |   |    ||
 * ||    |   |    ||
 * ||    |   |    ||
 * ||item|   |item||
 * ||    |   |    ||
 * ||    |   |    ||
 * ||    |   |    ||
 * ||----|   |----||
 *       |gap|
 * -----------------
 *
 */
function WaterFall(options) {
    this.doc = document;
    
    this.configs = {
        itemClassName: '',
        wrapperWidth: 0,
        itemWidth: 1,
        verticalGap: 30
    };
    
    /**
     * 回调函数
     */
    this.callback = null;
    
    /**
     * 总共元素数量
     */
    this.batchFalls = 0;
    
    this.config(options);
    this.init();
}
WaterFall.prototype = {
    constructor: WaterFall,
    config: function(options) {
        for(var k in options) {
            this.configs[k] = options[k];
        }
    },
    init: function() {
        /**
         * 列数
         */
        this.columnNumber = Math.floor(this.configs.wrapperWidth / this.configs.itemWidth);
        
        /**
         * 列的左右间距
         */
        this.columnGap = Math.floor(this.configs.wrapperWidth % this.configs.itemWidth / (this.columnNumber - 1));
        
        /**
         * 每一列的高度数组
         */
        this.heightArr = this.fillZero(this.columnNumber);
    },
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
        var ret = []/* new Array(num) */;
        for(var i=0; i<num; i++) {
            // ret[i] = 0;
            ret.push(0);
        }
        
        return ret;
    },
    maxHeight: function() {
        return Math.max.apply(null, this.heightArr);
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
    imgLoaded: function(element, isItemElement) {
        var item = isItemElement
            ? element
            : this.findParent(element, this.configs.itemClassName);
        var minIndex = this.minIndex();
        
        // 放到一行中最低的地方
        item.style.cssText = 'position: absolute; top:'+ this.heightArr[minIndex]
            + 'px; left:'+ (this.configs.itemWidth * minIndex + this.columnGap * minIndex) +'px;';
        
        // 当前元素的高度存入数组
        this.heightArr[minIndex] = this.heightArr[minIndex]
            + item.offsetHeight + this.configs.verticalGap;
        
        this.batchFalls--;
        if(this.batchFalls <= 0) {
            'function' === typeof this.callback && this.callback();
        }
    },
    
    /**
     * 布局方法
     *
     * @param String itemImageSelector 每一项中的图片选择器
     * @param Function callback 回调
     */
    fall: function(itemImageSelector, callback) {
        var _self = this;
        
        var allItems = this.doc.querySelectorAll('.' + this.configs.itemClassName);
        
        this.batchFalls = allItems.length;
        this.callback = callback;
        
        var img = null;
        for(var i=0,len=this.batchFalls; i<len; i++) {
            if(null !== (img = allItems[i].querySelector(itemImageSelector))) {
                if(img.complete) {
                    this.imgLoaded(allItems[i], true);
                    
                } else {
                    img.onload = function(e){
                        _self.imgLoaded(this, false);
                    };
                }
                
                continue;
            }
            
            this.imgLoaded(allItems[i], true);
        }
        img = null;
    }
};
