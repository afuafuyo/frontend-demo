/**
 * YSerialize
 * 表单序列化
 * @author yulipu
 *
 * 用法
 *	var f = new YSerialize(['username', 'password']);
 *	var data = f.serialize();  // username=xxx&password=xxx
 */
function YSerialize(fields, valiFields) {
	this.doc = document;
	this.fields = undefined === fields ? [] : fields;  //["nickname", "email"];  // 会被程序组织成 nickname=xxx&emil=xxx...
	this.valiFields = undefined === valiFields ? [] : valiFields;  //需要验证的字段
	this.data = "";
	
	if(this.valiFields.length > 0) {
		this.validate();
	}
}
YSerialize.prototype.initFields = function() {
	this.data = '';
	for(var i=0,len=this.fields.length; i<len; i++) {
		this[this.fields[i]] = this.getData(this.fields[i]);  // 保存单个字段 用于验证使用
		//this.data += this.fields[i] + "=" + this.getData(this.fields[i]) + "&";  // 用于提交
		this.data += this.fields[i] + "=" + this[this.fields[i]] + "&";
	}
	this.data = this.data.substring(0, this.data.lastIndexOf("&"));
}
YSerialize.prototype.validate = function() {
	var _this = this;
	var obj = null;
	for(var i=0,len=this.valiFields.length; i<len; i++) {
		obj = this.doc.getElementById(this.valiFields[i]);
		obj.onblur = function(){
			for(var j=0,length=_this.valiFields.length; j<length; j++) {
				if(this === _this.doc.getElementById(_this.valiFields[j])) {
					_this.redAlertBg(_this.valiFields[j]);
				}
			}
		};
		obj = null;
	}
};
YSerialize.prototype.redAlertBg = function(id) {
	var t = this.doc.getElementById(id);
	if(t.value === '') {
		t.style.backgroundColor = "#EA8948";
	} else {
		t.style.backgroundColor = "";
	}
};
YSerialize.prototype.trim = function(str) {
	if("string" === typeof str){
		return str.replace(/^\s+|\s+$/g,"");
	}
	return str;
};
YSerialize.prototype.nl2br = function(str) {
	return (str + "").replace(/(\015\012)|(\012\015)|(\015)|(\012)/g, "<br />");
};
YSerialize.prototype.getData = function(id) {	
	//return this.trim(this.nl2br(this.doc.getElementById(id).value));
	return this.trim(this.doc.getElementById(id).value);
};
YSerialize.prototype.serialize = function() {
	this.initFields();
	return this.data;
};
