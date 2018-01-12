/**
 * YTouch
 * @author yulipu
 *
 * 用法
 *
 *  var eleObj = document.getElementById('ele');
 *  var t = new YTouch(eleObj);
 *
 *  //eleObj.addEventListener('goingright', function(){console.log('right');}, false);
 *  //eleObj.addEventListener('goingleft', function(){console.log('left');}, false);
 *  eleObj.addEventListener('goingup', function(){console.log('up');}, false);
 *  eleObj.addEventListener('goingdown', function(){console.log('down');}, false);
 *
 */
function YTouch(element, listenDirection) {
	this.element = element;
	// 监听方向 1 上下 2 左右
	this.listenDirection = undefined === listenDirection ? 1 : 2;
	
	this.goingUpEvent = null;
	this.goingDownEvent = null;
	this.goingRightEvent = null;
	this.goingLeftEvent = null;
	
	this.directions = {"UP":"up", "RIGHT":"right", "LEFT":"left", "DOWN":"down"};
	this.direction = '';
	this.originX = 0;
	this.originY = 0;
	
	this.init();
}
YTouch.prototype.init = function() {
	this.element.addEventListener('touchstart', this, false);
	this.element.addEventListener('touchmove', this, false);
	this.element.addEventListener('touchend', this, false);
	this.element.addEventListener('touchcancel', this, false);
	
	this.goingUpEvent = this.createEvent('goingup');
	this.goingDownEvent = this.createEvent('goingdown');
	this.goingRightEvent = this.createEvent('goingright');
	this.goingLeftEvent = this.createEvent('goingleft');
};
/*
 * 实现 EventListener 接口的 handleEvent 方法
 * https://developer.mozilla.org/en-US/docs/Web/API/EventListener
 */
YTouch.prototype.handleEvent = function(e) {
	switch(e.type) {
		case 'touchstart' : this.start(e); break;
		case 'touchmove' : this.move(e); break;
		case 'touchend' : this.end(e); break;
		case 'touchcancel' : this.cancel(e); break;
	}
};
YTouch.prototype.createEvent = function(name) {
	var evt = new CustomEvent(name, {
		bubbles: true,
		cancelable: true
	});
	
	return evt;
};
YTouch.prototype.start = function(e){
	this.touchEventOccured = true;
	this.originX = e.touches[0].clientX;
	this.originY = e.touches[0].clientY;
};
YTouch.prototype.move = function(e){
	e.preventDefault();
	
	// https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/dispatchEvent
	var cancelled = false;
	
	// 移动 6px 开始算
	if(1 === this.listenDirection) {
		if(e.touches[0].clientY - this.originY < -6) {
			this.direction = this.directions.UP;
			
			// 触发事件
			cancelled = !e.target.dispatchEvent(this.goingUpEvent);
			
		} else if(e.touches[0].clientY - this.originY > 6) {
			this.direction = this.directions.DOWN;
			
			// 触发事件
			cancelled = !e.target.dispatchEvent(this.goingDownEvent);
			
		} else {}
	
	} else {
		if(e.touches[0].clientX - this.originX > 6) {
			this.direction = this.directions.RIGHT;
			
			// 触发事件
			cancelled = !e.target.dispatchEvent(this.goingRightEvent);
			
		} else if(e.touches[0].clientX - this.originX < -6) {
			this.direction = this.directions.LEFT;
			
			// 触发事件
			cancelled = !e.target.dispatchEvent(this.goingLeftEvent);
			
		} else {}
	}
	
	cancelled && e.preventDefault();
};
YTouch.prototype.end = function(e){
	e.preventDefault();
	e.stopPropagation();
	
	/*
	if(this.direction === this.directions.RIGHT) {
		
	} else if(this.direction === this.directions.LEFT) {
		
	} else if(this.direction === this.directions.UP) {
		
	} else if(this.direction === this.directions.DOWN) {
		
	} else {}
	*/
	
};
YTouch.prototype.cancel = function(e){
	this.direction = '';
	this.originX = 0;
	this.originY = 0;
};
YTouch.prototype.off = function(e){
	var ele = this.element;
	ele.removeEventListener('touchstart', this, false);
	ele.removeEventListener('touchmove', this, false);
	ele.removeEventListener('touchend', this, false);
	ele.removeEventListener('touchcancel', this, false);
	
	this.element = null;
};
