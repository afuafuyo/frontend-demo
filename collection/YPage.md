```javascript
/**
 * 前端分页类
 *
 * @param int totalRecords 记录总数
 * @param int pageSize 分页大小
 *
 * var page = new YPage(12, 10);
 * page.setConfig('showTotal', true);
 * page.onChange = function(currentPage) {
 *      console.log(currentPage);
 *      page.render(document.getElementById(mountNode));
 * };
 * page.render(document.getElementById(mountNode));
 *
.y-page {
    font-size: 14px;
}
.y-page span, .y-page a {
    display: inline-block;
    padding: 6px 12px;
    margin-left: 12px;
    text-decoration: none;
    color: #23527c;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
}
.y-page .active {
    color: #fff;
    cursor: default;
    background-color: #337ab7;
    border-color: #337ab7;
}
.y-page .y-page-total {
    padding-left: 0;
    margin-left: 0;
}
.y-page span {
    border: 0;
}
.y-page a:hover {
    background-color: #eee;
    text-decoration: none;
}
 */
function YPage(totalRecords, pageSize) {
    this.totalRecords = totalRecords;
    this.pageSize = pageSize;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    
    this.mountNode = null;
    this.currentPage = 1;
    this.onChange = null;
    this.config = {
        linkItemNumber: 7,
        
        showTotal: true,
        showHome: true,
        showPrevious: true,
        showItem: true,
        showNext: true,
        showLast: true
    };
}
YPage.prototype = {
    constructor: YPage,
    setConfig: function(key, value) {
        this.config[key] = value;
    },
    getSegment: function(flag) {
        var str = '';
        switch(flag) {
            case 1:
                str = this.config.showTotal ? '<span class="y-page-total">总共' + this.totalPages + '页</span>' : '';
                break;
            case 2:
                str = this.config.showHome ? '<a data-page="1" href="javascript:;">首页</a>' : '';
                break;
            case 3:
                str = this.config.showPrevious ? '<a data-page="'+ (this.currentPage-1) +'" href="javascript:;">上一页</a>' : '';
                break;
            case 4:
                var half = Math.floor(this.config.linkItemNumber / 2);
                var counter = 0, tmp = '';
                for(var i=this.currentPage-half; i<this.currentPage; i++) {
                    i > 0 && (tmp += '<a data-page="'+i+'" href="javascript:;">'+i+'</a>', counter++);
                }
                tmp += '<span class="active">'+ this.currentPage +'</span>';;
                for(var i=this.currentPage+1; i<=this.currentPage+half+half-counter; i++) {
                    i <= this.totalPages && (tmp += '<a data-page="'+i+'" href="javascript:;">'+i+'</a>');
                }
            
                str = this.config.showItem ? tmp : '';
                break;
            case 5:
                str = this.config.showNext ? '<a data-page="'+ (this.currentPage+1) +'" href="javascript:;">下一页</a>' : '';
                break;
            case 6:
                str = this.config.showLast ? '<a data-page="'+ this.totalPages +'" href="javascript:;">尾页</a>' : '';
                break;
            default:
                break;
        }
        
        return str;
    },
    initPageEvent: function() {
        var _self = this;
        this.mountNode.onclick = function(e) {
            var src = e.target || e.srcElement;
            if(1 === src.nodeType && 'A' === src.tagName.toUpperCase()) {
                _self.currentPage = parseInt(src.getAttribute('data-page'));
                _self.currentPage > _self.totalPages && (_self.currentPage = _self.totalPages);
                _self.currentPage < 1 && (_self.currentPage = 1);
                if(null !== _self.onChange) {
                    _self.onChange(_self.currentPage);
                }
            }
        };
    },
    getPageString: function(){
        return '<div class="y-page">' +
            this.getSegment(1) +
            this.getSegment(2) +
            this.getSegment(3) +
            this.getSegment(4) +
            this.getSegment(5) +
            this.getSegment(6) +
            '</div>';
    },
    render: function(mountNode) {
        this.mountNode = mountNode;
        var str = this.getPageString();
        mountNode.innerHTML = str;
        
        this.initPageEvent();
    }
};
```