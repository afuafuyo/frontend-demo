/**
 * YForm
 * 表单校验类
 * @author yulipu
 *
 * 说明
 *      你需要定义以下 css 样式
 *      .y-info-input  -- 表示 focus 时 input 样式
 *      .y-info-tip  -- 表示 focus 时 tip 样式
 *      .y-success-input  -- 表示验证成功的 input 样式
 *      .y-success-tip  -- 表示验证成功的 tip 样式
 *      .y-error-input  -- 表示验证失败的 input 样式
 *      .y-error-tip  -- 表示验证失败的 tip 样式
 *
 *  api:
 *
 *  var f = new YForm();
 *  f.fbfeedback = false;  // 启用焦点反馈
 *
 *  f.checkAccount(inputId, {callback:function(){...}});  // 这里通过 option 参数修改了默认的 conf 配置
 *  f.checkEmail(inputId);
 *  f.checkMobile(inputId);
 *  f.checkVerifyCode(inputId);
 *  f.checkOther(inputId, {
 *      regular : [],  // 可以定义正则表达式
 *      minlength : 4,  // 可以定义输入最短
 *      info : '最少4位',  // focus 提示
 *      error : '输入错误了',  // 错误提示
 *      success : '输入正确',  // 正确提示
 *      callback : null  // 定义回调函数
 *  });
 *
 *  f.validate();  // 验证表单 返回 true 表示没错误 false 表示有错误
 */
function YForm() {
    this.doc = document;
    this.fbfeedback = true;  // focus blur feedback
    this.validateFields = [];
    // 提示颜色 css class
    this.classSet = {
        // onfocus input 和 tip 样式
        info : {
            input : 'y-info-input',
            tip : 'y-info-tip'
        },
        // 验证正确时 input 和 tip 样式
        success : {
            input : 'y-success-input',
            tip : 'y-success-tip'
        },
        // 验证失败时 input 和 tip 样式
        error : {
            input : 'y-error-input',
            tip : 'y-error-tip'
        }
    };
    // 默认配置
    this.conf = {
        // 标注配置
        standard : {
            regular : [],
            minlength : 0,
            info : '',
            error : '',
            success : '',
            callback : null
        }
        ,account : {
            regular : [/^[\u4e00-\u9fa5|_a-zA-Z0-9]{4,20}$/, /[\u4e00-\u9fa5a-zA-Z_]+/],
            minlength : 4,
            info : '4-20位，可由汉字、数字、字母和“_“组成，禁止纯数字哦~',
            error : '您输入的账号有错误',
            success : '',
            callback : null
        }
        ,email : {
            regular : [/^[a-zA-Z0-9_\.\-]+\@([a-zA-Z0-9\-]+\.)+[a-zA-Z0-9]{2,4}$/],
            minlength : 0,
            info : '请输入有效的电子邮箱，可用于登录和找回密码',
            error : '您输入的邮箱有错误',
            success : '',
            callback : null
        }
        ,verifyCode : {
            regular : [/^[A-Za-z0-9]{4}$/],
            minlength : 0,
            info : '请输入验证码，不区分大小写',
            error : '您输入的验证码有误',
            success : ''
        }
        ,mobile : {
            regular : [/^1[34578]\d{9}$|^0\d{2,3}\d{7,8}?$/],
            minlength : 0,
            info : '手机号用于找回密码，接收短信',
            error : '您输入的手机有错误',
            success : '',
            callback : null
        }
    };
}
YForm.prototype = {
    constructor: YForm
    ,extend: function(src, target) {
        for(var key in target) {
            src[key] = target[key];
        }
    }
    ,saveOldStyle: function(obj, str) {
        if(null === obj.getAttribute("data-oldstyle")) {
            obj.setAttribute("data-oldstyle", str);
        }
    }
    ,getOldStyle: function(obj) {
        var v = obj.getAttribute("data-oldstyle");
        return (null === v || "" === v) ? "" : v + " ";  // 加一个空格
    }
    ,focusField: function(id, conf) {
        var fieldObj = this.doc.getElementById(id);
        var tipObj = this.getTipObj(id);
        
        // 处理 input
        fieldObj.className = this.getOldStyle(fieldObj) + this.classSet.info.input;
        // 处理 tip
        tipObj.className = this.getOldStyle(tipObj) + this.classSet.info.tip;
        tipObj.innerHTML = conf.info;
    }
    ,blurField: function(id, conf) {
        var fieldObj = this.doc.getElementById(id);
        var tipObj = this.getTipObj(id);
        var nowError = false;  // 标示当前有误错误 默认没有错误
        var regLen = conf.regular.length;  // 正则列表
        var minLen = conf.minlength || 0;  // 最小长度
        var val = fieldObj.value;  // input 值
        
        if(minLen > 0) {
            if(val.length < minLen)
                nowError = true;  // 当前发生错误
        }
        if(!nowError && regLen > 0) {  // 如果条件已经是假 就没必要再验证其他了
            for(var i=0; i<regLen; i++) {
                if(!conf.regular[i].test(val)) {
                    nowError = true;
                    break;
                }
            }
        }
        
        if(nowError) {
            // 有错误
            // 处理 input
            fieldObj.className = this.getOldStyle(fieldObj) + this.classSet.error.input;
            // 处理 tip
            tipObj.className = this.getOldStyle(tipObj) + this.classSet.error.tip;
            tipObj.innerHTML = conf.error;
            
        } else {
            // 没有错误
            // 处理 input
            fieldObj.className = this.getOldStyle(fieldObj) + this.classSet.success.input;
            // 处理 tip
            tipObj.className = this.getOldStyle(tipObj) + this.classSet.success.tip;
            tipObj.innerHTML = conf.success;
        }
        
        // 回调
        if("function" === typeof conf.callback) {
            if(false === conf.callback()) {
                nowError = true;
            }
        }
        
        return nowError;
    }
    ,confirm: function(id, conf) {
        var _self = this;
        var fieldObj = this.doc.getElementById(id);
        var tipObj = this.getTipObj(id);

        // 保存原有的 css
        this.saveOldStyle(fieldObj, fieldObj.className);
        this.saveOldStyle(tipObj, tipObj.className);
        
        if(this.fbfeedback) {
            fieldObj.onfocus = function() {
                _self.focusField(id, conf);
            };
            fieldObj.onblur = function() {
                _self.blurField(id, conf);
            };
        }
        
        fieldObj = null;
    }
    ,getTipObj: function(id) {
        return this.doc.getElementById(id + "Tip");
    }

    /**
     * 用户接口
     */
    ,checkAccount: function(id, opt) {
        if(undefined !== opt) {
            this.extend(this.conf.account, opt);
        }
        this.confirm(id, this.conf.account);
        this.validateFields.push([id, this.conf.account]);
        
        return this;
    }
    ,checkEmail: function(id, opt) {
        if(undefined !== opt) {
            this.extend(this.conf.email, opt);
        }
        this.confirm(id, this.conf.email);
        this.validateFields.push([id, this.conf.email]);
        
        return this;
    }
    ,checkMobile: function(id, opt) {
        if(undefined !== opt) {
            this.extend(this.conf.mobile, opt);
        }
        this.confirm(id, this.conf.mobile);
        this.validateFields.push([id, this.conf.mobile]);
        
        return this;
    }
    ,checkVerifyCode: function(id, opt) {
        if(undefined !== opt) {
            this.extend(this.conf.verifyCode, opt);
        }
        this.confirm(id, this.conf.verifyCode);
        this.validateFields.push([id, this.conf.verifyCode]);
        
        return this;
    }
    ,checkOther: function(id, opt) {
        var conf = {};
        this.extend(conf, this.conf.standard);
        if(undefined !== opt) {
            this.extend(conf, opt);
        }
        this.confirm(id, conf);
        this.validateFields.push([id, conf]);
        
        return this;
    }
    ,validate: function() {
        var flag = false;
        for(var i=0,len=this.validateFields.length; i<len; i++) {
            var hasError = this.blurField(this.validateFields[i][0], this.validateFields[i][1]);
            if(hasError) {
                flag = hasError;
            }
        }
        
        return !flag;
    }
    // 手动设置错误信息
    ,setError: function(id, msg) {
        var tipObj = this.getTipObj(id);
        
        this.saveOldStyle(tipObj, tipObj.className);
        tipObj.className = this.getOldStyle(tipObj) + this.classSet.error.tip;
        tipObj.innerHTML = msg;
    }
};
