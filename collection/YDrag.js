/**
 * js拖动类 
 * 一个对象只能够使一个容器得到拖动
 * @author yulipu
 *
 * 用法1 普通div
 *	<div id="outer">
 *		这里是内容
 *	</div>
 *	var drag = new YDrag();
 *	drag.drag({
 *		targetDragObj : document.getElementById('outer'),  //必须项 要拖动的目标对象
 *		dragX : false,  //不允许横向拖动
 *		dragY : true
 *	});
 *
 * 用法2 模拟对话框
 *	<div id="outer">
 *		<div id="title">这里是标题</div>
 *		<div>这里是内容</div>
 *	</div>
 *	var drag = new YDrag();
 *	drag.drag({
 *		targetDragObj : document.getElementById('outer'),  //必须项 要拖动的目标对象
 *		srcDragObj : document.getElementById('title'),  //非必须项 指定标题部分div
 *		dragX:false,  //不允许横向拖动
 *		callback : function(){
 *			//alert(this.x);  // x坐标
 *			//alert(this.y);  // y坐标
 *		}  //指定一个回调函数 这个函数可以得到当前容器坐标位置
 *	});
 */
function YDrag() {
	this.doc = document;
	this.win = window;
	
	this.diffX = 0; // 当前鼠标和容器 left 距离的差  当前位置 - 这个差值就是容器的 left 值
	this.diffY = 0;
	this.options = {
		dragable : true,
		targetDragObj : null,
		srcDragObj : null,
		dragX : true, // 横向拖动
		dragY : true, // 纵向拖动
		callback : null
	};
}
YDrag.prototype = {
	constructor : YDrag
	,extend : function(src, target) {
		for(var key in target) {
			for(var k in src) {
				if(k === key) {
					src[k] = target[k];
				}
			}
		}
	}
	,_mousedown : function(e) {
		var _this = this;
		e = e || _this.win.event;
		_this.options.targetDragObj.style.position = 'absolute';

		_this.diffX = e.clientX - _this.options.targetDragObj.offsetLeft;  // 初始化差值
		_this.diffY = e.clientY - _this.options.targetDragObj.offsetTop;
		
		_this.doc.onmousemove = function(e){ _this._mousemove(e); };
		_this.doc.onmouseup = function(e){ _this._mouseup(e); };
	}
	,_mousemove : function(e) {
		e = e || this.win.event;
		if (this.options.dragable) {
			this.options.dragX && (this.options.targetDragObj.style.left = e.clientX - this.diffX + 'px');
			this.options.dragY && (this.options.targetDragObj.style.top = e.clientY - this.diffY + 'px');
			
			if (this.options.callback) {
				//this.options.callback.call(this);
			}
		}
	}
	,_mouseup : function(e) {
		this.doc.onmousemove = null;
	}
	,drag : function(opt) {
		var _this = this;
		_this.extend(_this.options, opt);
		
		null === _this.options.srcDragObj ?
			_this.options.targetDragObj.onmousedown = function(e){
				_this._mousedown(e);
			} : _this.options.srcDragObj.onmousedown = function(e){
				_this._mousedown(e);
			};
	}
};
