(function(global){
'use strict';

var XUI = {};
global.XUI = XUI;

XUI.setStyle = function(element, styles) {
    for(var s in styles) {
        element.style[s] = styles[s];
    }
};

/**
 * 通用遮罩层
 */
XUI.lock = function() {
    var XLock = function() {
        this.doc = document;

        this.zIndex = 1100;
        this.mask = null;
        this.id = 'x-mask';

        this.init();
    };
    XLock.prototype = {
        constructor : XLock
        ,init : function() {
            this.mask = this.doc.createElement('div');
            this.mask.setAttribute('id', this.id);

            XUI.setStyle(this.mask, {
                position: 'fixed',
                zIndex: this.zIndex,
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                backgroundColor: 'rgba(0, 0, 0, .5)'
            });
        }

        // api
        ,unLock : function() {
            if(null !== this.doc.getElementById(this.id)) {
                this.doc.body.removeChild(this.mask);
            }
        }
        ,lock : function() {
            if(null === this.doc.getElementById(this.id)) {
                this.doc.body.appendChild(this.mask);
            }
        }
    };

    return new XLock();
}();

/**
 * toast
 */
XUI.toast = function() {
    var XToast = function() {
        this.doc = document;
        this.wrapper = null;
        this.callback = null;
        this.duration = 2000;
        this.timer = 0;
        this.zIndex = 1120;
        this.id = 'x-toast';

        this.successIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAw1BMVEUAAAAAgAAAgAAAgQAAgQAAggAAgwAAgwAAgAAAgQAAgQAAfQAAgAAAgAAAgAAAfwAAgAAAgAAAfwAAhAAAgAAAggAAgQAAgAAAgQAAgQAAhwAAhAAAgQAAhAAAgAAAeQAAgAAAiAAAgQAAgAAAfwAAgQAAfwAAiQAAggAAgQAAeAAAgAAAgAAAiwAAggAAfwAAbQAAgAAAgQAAgQAAcgAAhQAAnwAAgwAAgAAAgQAAggAAgwAAhwAAgAAAgQAAeAAAcQBFMucVAAAAPXRSTlMA89rVXyMLB+7gdVVI++nkxby2l4+AcWpkW0Q4KRnr5NHArJ1tZz8uIBL59s66pJaVlIeDYl9dV09LMygPVrIRnQAAASBJREFUOMut0tdugzAUgOEfwgjZu9lJs9O990n7/k9VNwQHML2o1O8C+ehHIFvmT7xVr1NwStvfemlu50WsYNbzs7IzlqO2kUc5SbAGyT4Qw0Oi78Tw9RT7/plk6RM5zco7mUS9qIaUct2K7aUmhgVN9cyH5/Fu9g5eRZRnFL9j9AKEx3LtAsN5up9AI1zluoAzNfvdYZlvA4tgvxwuy7o7ejMtoGuLUoVt7WfzDpREu0WN9f2yBjzupAjDY7fugU0rHGwP1qr7E9HsLsryMAXqDeXyU7SmizKKxuoHcBM/9yJ7Df3LDQWJGRPqS6Q6S53owZVkyhHxK5LlDc09z+ivxLiW0V9I8FLXLnBJW+X0ZZRKjyzrVuPCtqf1Zp//9A2DiIFyOD5rwwAAAABJRU5ErkJggg==';
        this.errorIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAqFBMVEUAAADrSjbtSDLqSjbqSjXrSjXrSDTsSTXtRzPuRTTvRzDrSzXrSjbrSTbqSjbqSjbqSTXqSTXrSTTrSTXtRjXsSjTtQy/qSjbpTTrpSzXpSTjuRzXrSTbpSjjtQzDsUjnvTC3zOCftRy7yNSjySjLnVT7pSTXsRzPqSjbqSDftSTbwNyzrSTXrSTXuPy3xPCrvSDXsSjXtPSrqSjbqSzbqTDfoTDbnUjysLlcVAAAAM3RSTlMAthmjgKt4VE5IFwPh3M3CpJSMh1k5D/z59eimlpBgRD8xLwsJ8OvbvZ6bhXBvZ08kHxPRbI1sAAAA+0lEQVQ4y63SV3aDMBAF0BdCdwEbcIlLXNJ7MhLZ/86SgxASQvrz/dOZpzrCZY2q6P2trO4cZc/PlvRvOfW/bbN3pNmezXo1pp6bQ79+W5OhjvX6kTMaOGr735PFegRp220wjeKMWuxZ1lPqBMBMjTwIPnWugGs1mov6YuIKjMWbJuQKUNIEPrgzEMojuAJFEwiZcQvzlHuutSDPtaYwX/SBkx2jUlzzkTsCDz9ovP6S9OR5gUq8yK+kVsiBuVrhC62NalYcZ9qdpfOK0VC9QOdgOSFLoCkHX4rv0ZOseW/+6hOGdKOvEXgYOu3ajzGZnWCXRmFRhFGKi/oDHrFntVRaXOIAAAAASUVORK5CYII=';
    };
    XToast.prototype = {
        constructor: XToast,
        init : function() {
            if(null === this.wrapper) {
                this.wrapper = this.doc.createElement('div');
                this.wrapper.setAttribute('id', this.id);
            }

            XUI.setStyle(this.wrapper, {
                position: 'fixed',
                zIndex: this.zIndex,
                top: '20%',
                minWidth: '180px',
                padding: '46px 10px 20px 10px',
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center',
                borderRadius: '4px',
                transition: 'top .2s linear'
            });
        },
        resetPosition: function() {
            var _self = this;
            var width = this.wrapper.clientWidth;
            var winWidth = this.doc.body.clientWidth;

            this.wrapper.style.left = Math.floor((winWidth - width) / 2) + 'px';

            setTimeout(function(){
                _self.wrapper.style.top = '22%';

                _self = null;
            }, 10);
        },
        render: function() {
            var _self = this;

            if(null === this.doc.getElementById(this.id)) {
                this.doc.body.appendChild(this.wrapper);
            }

            clearTimeout(this.timer);
            this.timer = setTimeout(function(){
                _self.close();

                if(null !== _self.callback) {
                    _self.callback();
                }

            }, this.duration);
        },
        close: function() {
            if(null !== this.doc.getElementById(this.id)) {
                this.doc.body.removeChild(this.wrapper);
            }

            this.wrapper = null;

            // XUI.lock.unLock();
        },
        success: function(msg, callback, duration) {
            if(undefined !== callback) {
                this.callback = callback;
            }
            if(undefined !== duration) {
                this.duration = duration;
            }

            this.init();
            XUI.setStyle(this.wrapper, {
                color: 'green',
                background: '#edffe9 url('+ this.successIcon +') no-repeat center 6px',
                borderStyle: 'solid',
                borderWidth: '3px 1px 1px 1px',
                borderColor: 'green #dcf9d6 #dcf9d6 #dcf9d6'
            });
            this.wrapper.innerHTML = msg;
            this.render();
            this.resetPosition();
        },
        error: function(msg, callback, duration) {
            if(undefined !== callback) {
                this.callback = callback;
            }
            if(undefined !== duration) {
                this.duration = duration;
            }

            this.init();
            XUI.setStyle(this.wrapper, {
                color: '#ea4a36',
                background: '#fff2f2 url('+ this.errorIcon +') no-repeat center 6px',
                borderStyle: 'solid',
                borderWidth: '3px 1px 1px 1px',
                borderColor: '#ea4a36 #ffe3e0 #ffe3e0 #ffe3e0'
            });
            this.wrapper.innerHTML = msg;
            this.render();
            this.resetPosition();
        }
    };

    return new XToast();
}();

/**
 * dialog
 */
XUI.dialog = function() {
    var XDialog = function() {
        this.doc = document;

        this.id = 'xui-dialog';
        this.zIndex = 1120;

        this.wrapper = null;
        this.content = null;
        this.footer = null;
        this.cancelButton = null;
        this.okButton = null;
        this.closeButton = null;

        this.callback = null;
        this.onContentClick = null;

        this.defaultConfigs = {
            okButtonText: '确定',
            cancelButtonText: '取消'
        };
    };
    XDialog.BTN_NONE = 0;
    XDialog.BTN_OK = 1;
    XDialog.BTN_CANCEL = 2;
    XDialog.prototype = {
        constructor: XDialog,
        init: function(msg, type, configs) {
            var conf = this.defaultConfigs;

            if(undefined !== configs) {
                for(var k in configs) {
                    conf[k] = configs[k];
                }
            }

            // wrapper
            this.wrapper = this.doc.createElement('div');
            this.wrapper.setAttribute('id', this.id);
            XUI.setStyle(this.wrapper, {
                position: 'fixed',
                zIndex: this.zIndex,
                top: '10%',
                minWidth: '220px',
                fontSize: '14px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                transition: 'top .2s linear'
            });

            // close
            this.closeButton = this.doc.createElement('span');
            this.closeButton.setAttribute('data-role', 'close');
            XUI.setStyle(this.closeButton, {
                position: 'absolute',
                width: '16px',
                height: '16px',
                lineHeight: '16px',
                top: '6px',
                right: '6px',
                textAlign: 'center',
                fontSize: '16px',
                cursor: 'pointer'
            });
            this.closeButton.innerHTML = '&times;';

            // content
            this.content = this.doc.createElement('div');
            XUI.setStyle(this.content, {
                padding: '40px 20px 20px 20px',
                textAlign: 'left',
                wordBreak: 'break-all'
            });
            this.content.innerHTML = msg;

            // footer
            this.footer = this.doc.createElement('div');
            XUI.setStyle(this.footer, {
                padding: '5px 10px',
                textAlign: 'right',
                borderTop: '1px solid #f5f5f5'
            });

            // button
            this.cancelButton = this.doc.createElement('span');
            this.okButton = this.doc.createElement('span');

            this.cancelButton.innerHTML = conf.cancelButtonText;
            this.cancelButton.setAttribute('data-role', 'cancel');
            this.okButton.innerHTML = conf.okButtonText;
            this.okButton.setAttribute('data-role', 'ok');

            var style = {
                display: 'inline-block',
                height: '30px',
                lineHeight: '30px',
                padding: '0 12px',
                textAlign: 'center',
                marginLeft: '10px',
                cursor: 'pointer',
                borderRadius: '4px'
            };
            XUI.setStyle(this.cancelButton, style);
            XUI.setStyle(this.okButton, style);
            XUI.setStyle(this.cancelButton, {
                color: '#888',
                border: '1px solid #e5e9ef',
                backgroundColor: '#e5e9ef'
            });
            XUI.setStyle(this.okButton, {
                color: '#fff',
                border: '1px solid #00a1d6',
                backgroundColor: '#00a1d6'
            });

            // structure
            if(XDialog.BTN_CANCEL === type || (XDialog.BTN_CANCEL | XDialog.BTN_OK) === type) {
                this.footer.appendChild(this.cancelButton);
            }
            if(XDialog.BTN_OK === type || (XDialog.BTN_CANCEL | XDialog.BTN_OK) === type) {
                this.footer.appendChild(this.okButton);
            }

            this.wrapper.appendChild(this.closeButton);
            this.wrapper.appendChild(this.content);

            if(XDialog.BTN_NONE !== type) {
                this.wrapper.appendChild(this.footer);
            }
        },
        setCallback: function(callback) {
            this.callback = undefined !== callback ? callback : null;
        },
        resetPosition: function() {
            var _self = this;
            var width = this.wrapper.clientWidth;
            var winWidth = this.doc.body.clientWidth;

            this.wrapper.style.left = Math.floor((winWidth - width) / 2) + 'px';

            setTimeout(function(){
                var doc = _self.doc;
                var wrapper = _self.wrapper;
                var totalHeight = doc.defaultView.innerHeight || doc.documentElement.clientHeight;

                wrapper.style.top = Math.round(
                    (totalHeight - wrapper.clientHeight) * 0.5 * 0.6) + 'px';

                wrapper = null;
                doc = null;
                _self = null;
            }, 10);
        },
        render: function() {
            XUI.lock.lock();

            if(null === this.doc.getElementById(this.id)) {
                this.doc.body.appendChild(this.wrapper);
            }
        },
        bindEvent: function() {
            var _self = this;
            this.wrapper.onclick = function(e) {
                var target = e.target;

                if('ok' === target.getAttribute('data-role')) {
                    // 回调返回 false 不关闭弹窗
                    if(null === _self.callback || false !== _self.callback(1)) {
                        _self.close();
                    }

                    return;
                }

                if('cancel' === target.getAttribute('data-role')) {
                    if(null === _self.callback || false !== _self.callback(0)) {
                        _self.close();
                    }

                    return;
                }

                if('close' === target.getAttribute('data-role')) {
                    _self.close();

                    return;
                }

                // handler click
                if(null !== _self.onContentClick) {
                    _self.onContentClick(e);
                }
            };
        },
        unBindEvent: function() {
            this.wrapper.onclick = null;
        },

        // api
        alert: function(msg, callback) {
            this.setCallback(callback);

            this.init(msg, XDialog.BTN_OK);

            this.render();
            this.resetPosition();
            this.bindEvent();
        },
        confirm: function(msg, callback) {
            this.setCallback(callback);

            this.init(msg, XDialog.BTN_OK | XDialog.BTN_CANCEL);

            this.render();
            this.resetPosition();
            this.bindEvent();
        },
        show: function(content, configs) {
            this.init(content, XDialog.BTN_NONE, configs);

            this.render();
            this.resetPosition();
            this.bindEvent();
        },
        showWithBtn: function(content, btn, configs, callback) {
            this.setCallback(callback);

            this.init(content, btn, configs);

            this.render();
            this.resetPosition();
            this.bindEvent();
        },
        close: function() {
            var wrapper = this.doc.getElementById(this.id);
            if(null !== wrapper) {
                this.doc.body.removeChild(wrapper);
            }

            this.unBindEvent();

            this.wrapper = null;
            this.content = null;
            this.footer = null;
            this.cancelButton = null;
            this.okButton = null;
            this.closeButton = null;

            XUI.lock.unLock();
        }
    };

    XUI.BTN_OK = XDialog.BTN_OK;
    XUI.BTN_CANCEL = XDialog.BTN_CANCEL;
    XUI.BTN_NONE = XDialog.BTN_NONE;

    return new XDialog();
}();

})(window);
