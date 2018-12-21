/**
 * XForm
 *
 * @author afu
 *
 * 说明
 *      需要定义以下 css 样式
 *      .xform-style-normal-field  -- 表示 focus 时 input 样式
 *      .xform-style-normal-tip  -- 表示 focus 时 tip 样式
 *      .xform-style-success-field  -- 表示验证成功的 input 样式
 *      .xform-style-success-tip  -- 表示验证成功的 tip 样式
 *      .xform-style-error-field  -- 表示验证失败的 input 样式
 *      .xform-style-error-tip  -- 表示验证失败的 tip 样式
 *
 *  api:
 *
 *  var f = new XForm();
 *  f.focusBlurFeedback = false;  // 启用焦点反馈
 *
 *  f.checkAccount(inputId, {callback: function(){
 *      // todo
 *      // ...
 *
 *      // return false 表示有错误 只支持同步返回
 *      return false;
 }  });
 *  f.checkEmail(inputId);
 *  f.checkMobile(inputId);
 *  f.checkVerifyCode(inputId);
 *  f.checkOther(inputId, {
 *      regular : null,  // 可以定义正则表达式
 *      minLength : 4,  // 可以定义输入最短
 *      infoText : '最少4位',  // focus 提示
 *      errorText : '输入错误了',  // 错误提示
 *      successText : '输入正确',  // 正确提示
 *      callback : null  // 定义回调函数
 *  });
 *
 *  f.validate();  // 验证表单 返回 true 表示没错误 false 表示有错误
 */
function XForm() {
    this.doc = document;
    
    this.validateFields = [];
    this.focusBlurFeedback = true;
    
    // 样式配置
    this.stylesConfig = {
        normal : {
            field : 'xform-style-normal-field',
            tip : 'xform-style-normal-tip'
        },
        success : {
            field : 'xform-style-success-field',
            tip : 'xform-style-success-tip'
        },
        error : {
            field : 'xform-style-error-field',
            tip : 'xform-style-error-tip'
        }
    };
    
    // 规则配置
    this.rulesConfig = {
        standard : {
            regular : null,
            minLength : 0,
            infoText : '',
            errorText : '',
            successText : '',
            callback : null
        }
        ,account : {
            regular : /^[_A-Za-z0-9\-\u4e00-\u9fa5]{4,15}$/,
            minLength : 4,
            infoText : '4-15 位字母、数字或汉字组成',
            errorText : '您输入的账号有错误',
            successText : '',
            callback : null
        }
        ,email : {
            regular : /^[a-zA-Z0-9_\.\-]+\@([a-zA-Z0-9\-]+\.)+[a-zA-Z0-9]{2,4}$/,
            minLength : 0,
            infoText : '邮箱可用于登录和找回密码',
            errorText : '您输入的邮箱有错误',
            successText : '',
            callback : null
        }
        ,verifyCode : {
            regular : null,
            minLength : 1,
            infoText : '请输入验证码，不区分大小写',
            errorText : '您输入的验证码有误',
            successText : ''
        }
        ,mobile : {
            regular : /^1[34578]\d{9}$|^0\d{2,3}\d{7,8}?$/,
            minLength : 0,
            infoText : '手机号用于找回密码，接收短信',
            errorText : '您输入的手机有错误',
            successText : '',
            callback : null
        }
    };
}
XForm.prototype = {
    constructor: XForm
    ,extend: function(src, target) {
        for(var key in target) {
            src[key] = target[key];
        }
    }
    
    /**
     * 保存旧样式
     *
     * @param {Element} obj
     * @param {String} str
     */
    ,saveOldStyle: function(obj, str) {
        if(null === obj.getAttribute('data-oldstyle')) {
            obj.setAttribute('data-oldstyle', str);
        }
    }
    
    /**
     * 获取旧样式
     *
     * @param {Element} obj
     */
    ,getOldStyle: function(obj) {
        var v = obj.getAttribute('data-oldstyle');
        
        return (null === v || '' === v) ? '' : v;
    }
    
    /**
     * 聚焦检测
     *
     * @param {String} id
     * @param {Object} config
     */
    ,focusField: function(id, config) {
        var field = this.doc.getElementById(id);
        var tip = this.getTipElement(id);
        
        // 处理 input
        field.className = this.getOldStyle(field) + ' ' + this.stylesConfig.normal.field;
        // 处理 tip
        tip.className = this.getOldStyle(tip) + ' ' + this.stylesConfig.normal.tip;
        
        tip.innerHTML = config.infoText;
    }
    
    /**
     * 失焦检测
     *
     * @param {String} id
     * @param {Object} config
     */
    ,blurField: function(id, config) {
        var hasError = false;
        var minLength = config.minLength;
        
        var field = this.doc.getElementById(id);
        var tip = this.getTipElement(id);
        var value = field.value;
        
        // 长度检测
        if(minLength > 0 && value.length < minLength) {
            hasError = true;
        }
        
        // 如果已经错误 就没必要再验证其他条件了
        if(!hasError && null !== config.regular) {
            if( !config.regular.test(value) ) {
                hasError = true;
            }
        }
        
        if(hasError) {
            field.className = this.getOldStyle(field) + ' ' + this.stylesConfig.error.field;
            tip.className = this.getOldStyle(tip) + ' ' + this.stylesConfig.error.tip;
            
            tip.innerHTML = config.errorText;
            
        } else {
            field.className = this.getOldStyle(field) + ' ' + this.stylesConfig.success.field;
            tip.className = this.getOldStyle(tip) + ' ' + this.stylesConfig.success.tip;
            
            tip.innerHTML = config.successText;
        }
        
        // 回调
        if('function' === typeof config.callback) {
            // 回调返回 false 表示有错误
            if(false === config.callback()) {
                hasError = true;
            }
        }
        
        return hasError;
    }
    
    /**
     * 组件检测初始化
     *
     * @param {String} id
     * @param {Object} config
     */
    ,confirm: function(id, config) {
        var _self = this;
        
        var field = this.doc.getElementById(id);
        var tip = this.getTipElement(id);

        // 保存控件原有的样式
        this.saveOldStyle(field, field.className);
        this.saveOldStyle(tip, tip.className);
        
        if(this.focusBlurFeedback) {
            field.onfocus = function() {
                _self.focusField(id, config);
            };
            field.onblur = function() {
                _self.blurField(id, config);
            };
        }
        
        field = null;
        tip = null;
    }
    
    /**
     * 获取提示控件
     *
     * @param {String} id
     */
    ,getTipElement: function(id) {
        return this.doc.getElementById(id + 'tip');
    }

    /**
     * 检查账号输入
     *
     * @param {String} id
     * @param {Object} options
     */
    ,checkAccount: function(id, options) {
        if(undefined !== options) {
            this.extend(this.rulesConfig.account, options);
        }
        
        this.confirm(id, this.rulesConfig.account);
        this.validateFields.push([id, this.rulesConfig.account]);
        
        return this;
    }
    
    /**
     * 检查邮箱
     *
     * @param {String} id
     * @param {Object} options
     */
    ,checkEmail: function(id, options) {
        if(undefined !== options) {
            this.extend(this.rulesConfig.email, options);
        }
        
        this.confirm(id, this.rulesConfig.email);
        this.validateFields.push([id, this.rulesConfig.email]);
        
        return this;
    }
    
    /**
     * 检查手机
     *
     * @param {String} id
     * @param {Object} options
     */
    ,checkMobile: function(id, options) {
        if(undefined !== options) {
            this.extend(this.rulesConfig.mobile, options);
        }
        
        this.confirm(id, this.rulesConfig.mobile);
        this.validateFields.push([id, this.rulesConfig.mobile]);
        
        return this;
    }
    
    /**
     * 检查验证码
     *
     * @param {String} id
     * @param {Object} options
     */
    ,checkVerifyCode: function(id, options) {
        if(undefined !== options) {
            this.extend(this.rulesConfig.verifyCode, options);
        }
        
        this.confirm(id, this.rulesConfig.verifyCode);
        this.validateFields.push([id, this.rulesConfig.verifyCode]);
        
        return this;
    }
    
    /**
     * 其他验证
     *
     * @param {String} id
     * @param {Object} options
     */
    ,checkOther: function(id, options) {
        var conf = {};
        
        this.extend(conf, this.rulesConfig.standard);
        if(undefined !== options) {
            this.extend(conf, options);
        }
        
        this.confirm(id, conf);
        this.validateFields.push([id, conf]);
        
        return this;
    }
    
    /**
     * 自动验证
     */
    ,validate: function() {
        var flag = false;
        
        for(var i=0,len=this.validateFields.length; i<len; i++) {
            if( this.blurField(this.validateFields[i][0], this.validateFields[i][1]) ) {
                flag = true;
            }
        }
        
        return !flag;
    }
    
    /**
     * 手动设置提示信息
     *
     * @param {String} id
     * @param {String} msg
     */
    ,setTipMessage: function(id, msg) {
        var tip = this.getTipElement(id);
        
        this.saveOldStyle(tip, tip.className);
        tip.className = this.getOldStyle(tip) + ' ' + this.stylesConfig.error.tip;
        
        tip.innerHTML = msg;
    }
};
