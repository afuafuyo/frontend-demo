/**
 * js loader
 *
 * @author yu
 *
 * loader.config({
 *     baseUrl: 'http://xxx.com/js',
 *     debug: false
 * });
 *
 * define('lib/a', ['lib/b'], function(){
 *     return {a: 111};
 * })
 *
 * define('lib/c', [], function(){
 *     return {c: 333};
 * })
 *
 * define('lib/b', ['lib/c'], function(){
 *     return {b: 222};
 * })
 *
 * using(['lib/a'], function(a){
 *     console.log(a)
 * })
 *
 */
(function(global) {
    'use strict';
    
    /**
     * loader 辅助层
     */
    var loader = {
        uuid: 0
        ,debug: false
        ,baseUrl: ''
        ,aliases: {
            '@sys': (function(){
                var scripts = global.document.getElementsByTagName('script');
                var sysScript = scripts[scripts.length - 1];
                var src = sysScript.src;
                
                return src.substring(0, src.lastIndexOf('/'));
            })()
        }
        ,handlers: { /* eventName: [...] ... */ }
        
        // event
        ,on: function(eventName, handler) {
            if(undefined === loader.handlers[eventName]) {
                loader.handlers[eventName] = [];
            }
            
            loader.handlers[eventName].push(handler);
        }
        ,off: function(eventName, handler) {
            if(undefined !== loader.handlers[eventName]) {
                if(undefined === handler) {
                    delete loader.handlers[eventName];
                    
                } else {
                    for(var i=0,len=loader.handlers[eventName].length; i<len; i++) {
                        if(handler === loader.handlers[eventName][i]) {
                            loader.handlers[eventName].splice(i, 1);
                        }
                    }
                }
            }
        }
        ,trigger: function(eventName, param) {
            if(undefined !== loader.handlers[eventName]) {
                for(var i=0,len=loader.handlers[eventName].length; i<len; i++) {
                    loader.handlers[eventName][i](param);
                }
            }
        }
        ,noop: function() {
            return null;
        }
        
        // util
        ,util: {
            string: {
                rTrimChar: function(str, character) {
                    if(character === str.charAt(str.length - 1)) {
                        str = str.substring(0, str.length - 1);
                    }
                    
                    return str;
                }
            }
        }
        
        ,config: function(config) {
            if(undefined !== config.alias) {
                for(var k in config.alias) {
                    loader.setAlias(k, config.alias[k]);
                }
            }
            
            if(undefined !== config.baseUrl) {
                loader.baseUrl = loader.util.string.rTrimChar(config.baseUrl, '/');
            }
            
            if(undefined !== config.debug) {
                loader.debug = config.debug;
            }
        }
        ,getAlias: function(alias) {
            if('@' !== alias.charAt(0)) {
                return alias;
            }

            // 截取开头作为别名
            var pos = alias.indexOf('/');
            var root = -1 === pos ? alias : alias.substring(0, pos);
            if(undefined !== loader.aliases[root]) {
                return -1 === pos
                    ? loader.aliases[root]
                    : loader.aliases[root] + alias.substring(pos);
            }

            return '';
        }
        ,setAlias: function(alias, path) {
            if('@' !== alias.charAt(0)) {
                alias = '@' + alias;
            }

            if(null === path) {
                delete loader.aliases[alias];
                
                return;
            }
            
            loader.aliases[alias] = loader.util.string.rTrimChar(path, '/');
        }
        ,log: function(msg) {
            if(loader.debug) {
                console.log(msg);
            }
        }
        ,using: function(depends, procedure) {
            var unNamedId = 'unNamedModule' + loader.uuid++;
            
            var module = loader.define(unNamedId, depends, procedure);
            module.execute();
        }
        ,define: function(id, depends, procedure) {
            // 已经存在模块不再重新定义
            if(Module.exists(id)) {
                return;
            }
            
            if('string' !== typeof id) {
                throw new TypeError('The id must be String');
            }
            if(null !== depends && '[object Array]' !== Object.prototype.toString.call(depends)) {
                throw new TypeError('The depends of module '+ id +' must be null or Array');
            }
            if('function' !== typeof procedure) {
                throw new TypeError('The procedure of module '+ id +' must be Function');
            }
            
            var module = new Module(id, depends, procedure);
            Module.save(id, module);
            
            return module;
        }
    };
    
    /**
     * Module
     */
    var Module = function(id, depends, procedure) {
        this.id = id;
        this.depends = null === depends ? [] : depends;
        this.procedure = procedure;
        
        // 父节点 可能有多个
        this.parentModules = [];
        this.result = null;
        this.compiled = false;
        
        this.buildedDepends = null;
    };
    Module.cachedModules = { /* id: module */ };
    Module.save = function(id, module) {
        Module.cachedModules[id] = module;
    };
    Module.get = function(id) {
        return Module.cachedModules[id];
    };
    Module.exists = function(id) {
        return undefined !== Module.cachedModules[id] ? true : false;
    };
    Module.prototype = {
        constructor: Module
        ,rebuildDepends: function() {
            var i = 0;
            var len = this.depends.length;
            
            this.buildedDepends = new Array(len);
            
            /**
             * [ {id: id, truePath: truePath} ... ]
             */
            for(var tmp=null; i<len; i++) {
                tmp = loader.getAlias('@' + this.depends[i]);
                
                // 详细数据
                this.buildedDepends[i] = {
                    'id': this.depends[i],
                    'truePath': '' === tmp
                        ? loader.baseUrl + '/' + this.depends[i]
                        : tmp
                };
                
                // js 文件需要加后缀
                if(-1 === this.depends[i].indexOf('.css') &&
                    -1 === this.depends[i].indexOf('.js')) {
                    this.buildedDepends[i]['truePath'] += '.js';
                }
            }
        }
        ,fetchModulesFromCache: function() {
            var x = 0;
            while(x < this.depends.length) {
                if(Module.exists(this.depends[x])) {
                    loader.log(this.depends[x] + ' load from cache');
                    
                    Module.get(this.depends[x]).parentModules.push(this);
                    
                    Module.get(this.depends[x]).execute();
                }
                x++;
            }
        }
        ,fetchModulesFromRemote: function() {
            var _self = this;
            // 需要从远程获取的资源 包括 js css
            var ret = {length: 0};
            
            if(null === this.buildedDepends) {
                this.rebuildDepends();
            }
            
            // 远程只获取没有缓存的模块
            for(var i=0,len=this.depends.length; i<len; i++) {
                if(!Module.exists(this.depends[i])) {
                    ret[this.depends[i]] = this.buildedDepends[i].truePath;
                    ret.length++;
                }
            }
            
            if(0 === ret.length) {
                return;
            }
            
            delete ret.length;
            
            new Remote(ret, function(eventType, id, isCss, resource){
                loader.log(resource + ' load from remote: ' + eventType);
                
                if(isCss) {
                    Module.save(id, new Module(id, null, loader.noop));
                }
                
                var m = Module.get(id);
                m.parentModules.push(_self);
                m.execute();
                
            }).fetch();
        }
        ,canCompile: function() {
            var ret = true;
            var len = this.depends.length;
            
            // 没有依赖 直接可以编译
            if(0 === len) {
                return true;
            }
            
            // 依赖还未加载或还未编译 模块就不能编译
            for(var i=0; i<len; i++) {
                if(!Module.exists(this.depends[i]) ||
                    !Module.get(this.depends[i]).compiled) {
                
                    ret = false;
                    
                    break;
                }
            }
            
            return ret;
        }
        ,compile: function() {
            var ret = null;
            var len = this.depends.length;
            var args = null;
            
            if(!this.compiled) {
                if(0 === len) {
                    ret = this.procedure();
                
                } else {
                    args = new Array(len);
                    for(var i=0; i<len; i++) {
                        args[i] = Module.get(this.depends[i]).result;
                    }
                    
                    ret = this.procedure.apply(null, args);
                }
                
                // 缓存模块
                this.result = ret;
                this.compiled = true;
                
                loader.log('Module ' + this.id + ' compiled');
            }
            
            // 有父节点
            if(0 !== (len = this.parentModules.length)) {
                for(var i=0; i<len; i++) {
                    this.parentModules[i].canCompile() && this.parentModules[i].compile();
                }
            }
        }
        ,execute: function() {
            if(this.canCompile()) {
                this.compile();
                
                return;
            }
            
            this.fetchModulesFromCache();
            this.fetchModulesFromRemote();
        }
    };
    
    /**
     * Remote
     */
    var Remote = function(depends, callback) {
        this.doc = document;
        this.READY_STATE_REG = /loaded|complete|undefined/;
        
        this.head = this.doc.getElementsByTagName('head')[0];
        // ref: #185 & http://dev.jquery.com/ticket/2709
        this.baseElement = this.head.getElementsByTagName('base')[0];
        
        this.depends = depends;
        this.callback = callback;
        this.dependIdAttribute = 'data-dep';
    };
    Remote.prototype = {
        constructor : Remote
        ,listen : function(node) {
            var _self = this;
            
            node.onload = node.onerror = node.onreadystatechange = function(e) {
                undefined === e && (e = global.event);
                
                var isCss = 'LINK' === this.nodeName.toUpperCase();
                
                if('load' === e.type || 'error' === e.type || _self.READY_STATE_REG.test(this.readyState)) {
                    // ensure only run once and handle memory leak in IE
                    this.onload = this.onerror = this.onreadystatechange = null;
                    
                    // remove the script to reduce memory leak
                    if(!isCss) {
                        _self.head.removeChild(this);
                    }
                    
                    // callback
                    _self.callback(e.type,
                        this.getAttribute(_self.dependIdAttribute),
                        isCss,
                        this.getAttribute('data-uri'));
                    
                    _self = null;
                }
            };
            
            node = null;
        }
        ,fetch : function() {
            var isCss = false;
            var node = null;
            
            for(var id in this.depends) {
                isCss = id.indexOf('.css') > 0;
                node = this.doc.createElement(isCss ? 'link' : 'script');
                node.setAttribute(this.dependIdAttribute, id);
                
                if(isCss) {
                    node.rel = 'stylesheet';
                    node.href = this.depends[id];
                    
                } else {                    
                    node.async = true;
                    node.src = this.depends[id];
                }
                
                node.setAttribute('data-uri', this.depends[id]);
                
                this.listen(node);
                
                loader.trigger('nodeCreate', node);
                
                undefined !== this.baseElement ?
                    this.head.insertBefore(node, this.baseElement) :
                    this.head.appendChild(node);
            }
            
            node = null;
        }
    };

    // 分发
    global.loader = loader;
    
    // 兼容
    if(undefined === global.define) {
        global.define = loader.define;
        global.define.amd = true;
        global.using = loader.using;
    }
    
})(window);

