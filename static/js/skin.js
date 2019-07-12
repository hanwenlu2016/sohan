
/**
 * JS实现换肤功能
 */
// Google Chrome只支持在线网站的cookie的读写操作，对本地html的cookie操作是禁止的。
// name1=value1;name2=value2;name3=value3;name4=value4
 function Skin(options) {
 
	this.config = {
		targetElem                :  '.targetElem',
		link                      :  '#link'
	};
	this.cache = {
		defaultList        : ['black','darkblue','darkgrey','green','lightblue','lightgreen','orange','red']
	};

	this.init(options);
 }

 Skin.prototype = {
	
	constructor: Skin,
	init: function(options) {
		this.config = $.extend(this.config,options || {});
		var self = this,
			_config = self.config;
		
		$(_config.targetElem).each(function(index,item) {
			
			$(item).unbind('click');
			$(item).bind('click',function(){
				var attr = $(this).attr('data-value');
				self._doSthing(attr);
			});
		});
		// 判断是否是谷歌游览器 谷歌游览器因为不支持cookie在本地上存储 所以引入了HTML5
		if(window.navigator.userAgent.indexOf("Chrome") !== -1) {
			var tempCookeie = self._loadStorage("skinName"),
				t;
			if(tempCookeie != "null") {
				t = tempCookeie;
			}else {
				t = 'green';
			}
			self._setSkin(t);

		}else {
			var tempCookeie = self._getCookie("skinName");
			self._setSkin(tempCookeie);
		}
		
	},
	/*
	 * 进行判断 来设置css样式
	 */
	_doSthing: function(attr) {
		var self = this,
			_config = self.config,
			_cache = self.cache;
		if(window.navigator.userAgent.indexOf("Chrome") !== -1) {
			self._doStorage(attr);
			var istrue = localStorage.getItem(attr);
			self._setSkin(attr);
		}else {
			var istrue = self._getCookie(attr);
			if(istrue) {
				for(var i = 0; i < _cache.defaultList.length; i++) {
					if(istrue == _cache.defaultList[i]) {
						self._setSkin(_cache.defaultList[i]);
					}
				}
			}
		}
		
	},
	/*
	 * 改变样式
	 */
	_setSkin: function(skinValue){
		
		var self = this,
			_config = self.config;
		
		if(skinValue) {
			$(_config.link).attr('href',"css/style/"+skinValue+".css");
		}
		if(window.navigator.userAgent.indexOf("Chrome") !== -1) {
			self._saveStorage(skinValue);
		}else {
			self._setCookie("skinName",skinValue,7);
		}
		
	},
	/*
	 * 重新
	 */
	_doStorage: function(attr) {
		var self = this;
		self._saveStorage(attr);
	},
	/*
	 * html5获取本地存储
	 */
	_loadStorage: function(attr) {
		var str = localStorage.getItem(attr);
		return str;
	},
	/*
	 * HTML5本地存储 
	 */
	_saveStorage:function(skinValue) {
		var self = this;
		localStorage.setItem("skinName",skinValue);
	},
	/*
	 * getCookie
	 */
	_getCookie: function(name) {
		var self = this,
			_config = self.config;
		var arr = document.cookie.split("; ");
		for(var i = 0; i < arr.length; i+=1) {
			var prefix = arr[i].split('=');
			if(prefix[0] == name) {
				return prefix[1];
			}
		}
		return name;
	},
	/*
	 * _setCookie
	 */
	_setCookie: function(name,value,days) {
		var self = this;

		if (days){
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}else {
			var expires = "";
		}
		document.cookie = name+"="+value+expires+"; path=/";
	},
	/*
	 * removeCookie
	 */
	_removeCookie: function(name) {
		var self = this;

		//调用_setCookie()函数,设置为1天过期,计算机自动删除过期cookie
		self._setCookie(name,1,1);
	}
 };

// 初始化
$(function(){
	new Skin({});
});
 