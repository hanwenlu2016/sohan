/*!
 @Title: ss_ui
 @Author: 赵观喜
 @License：MIT
 */
;!function(win){
    function ss(){
        this.version = '1.0.0';//版本号
        this.init();//初始化
    };
    ss.prototype = {
        constructor:ss,
        //<--- | 逻辑 | --->
        //初始化
        init : function(){
            this.saveDovSrc();
            this.bodyClickObj.executeFn(this);//body点击
        },
        //<--- | 模块加载器(简易版) | --->
        //选项
        options:{
            privatePriMo:[
                'login','layout','pm_layout','menu',
                'pm_menu','router','dataTable','c3Loading'
            ],//私有模块名称
            privatePriMoSrc:'',//私有模块路径
            htmlSrc:'',//html地址存储
            jsSrc:'',//js地址存储
            mdStatus:{},//各模块状态
        },
        //配置
        config : function(obj){
            var self = this;
            obj.__proto__.constructor.toString().indexOf('Obj')!==-1 && (
                function(){
                    for(var x in obj){
                        self.options[x] = obj[x];
                    }
                }()
            )
        },
        //定义模块
        define : function(para,callback){
            var self = this;
            arguments.length===1
                ?
                (
                    callback = para,
                    callback(function(mdName,mdCode){
                        self[mdName] = mdCode;
                        self['options']['mdStatus'][mdName] = true;
                    })
                )
                :
                this.imports(typeof para==='string' ? [para] : para,callback)
        },
        //引入模块
        imports : function(para,callback){
            var self = this,para = typeof para==='string'?[para]:para;
            function onLoadMd(para,callback){
                //未加载
                if(!self['options']['mdStatus'][para[0]]){
                    //获得当前加载文件的url
                    var url =
                    self['options']['privatePriMo'].indexOf(para[0])!==-1
                        ?
                    //私有模块
                    self['options']['privatePriMoSrc']+para[0]+'.js'
                        :
                        (
                            //js文件，各路由的js,clickTxts在layout布局中存储
                            self['options']['clickTxts']
                            ?
                                (
                                    self['options']['clickTxts'].indexOf(para[0])!=-1
                                        ?
                                    self['options']['jsSrc']+para[0]+'.js'
                                        :
                                        (
                                            self['options']['path']
                                                ?
                                                (
                                                    self['options']['path'][para[0]]
                                                        ?
                                                        //引进模块
                                                        self['options']['path'][para[0]]
                                                        :
                                                        self.error(para[0]+'文件找不到！')
                                                )
                                                :
                                                self.error(para[0]+'文件找不到！')
                                        )
                                )
                            :
                            (
                                self['options']['path']
                                    ?
                                    (
                                        self['options']['path'][para[0]]
                                            ?
                                            //引进模块
                                            self['options']['path'][para[0]]
                                            :
                                            self.error(para[0]+'文件找不到！')
                                    )
                                    :
                                    self.error(para[0]+'文件找不到！')
                            )

                        );
                    //创建script标签
                    var head = document.querySelector('head');
                    var node = self.crtDom('script','','',head,{
                        an:['async','charset','src'],
                        av:[true,'utf-8',url]
                    });
                    //监听load事件
                    node.addEventListener('load', function(e){
                        //e.type === 'load' || (/^(complete|loaded)
                        if (e.type === 'load' || (/^(complete|loaded)$/.test((e.currentTarget || e.srcElement).readyState))) {
                            head.removeChild(node);
                            //判断是否为jsModules,直接return处理
                            if(callback=='jsModules'){
                                return;
                            };
                            //判断是否为非标准的模块
                            self['options']['shim'] && self['options']['shim'][para[0]] && (
                                self[self['options']['shim'][para[0]]['exports']] = window[para[0]],
                                self['options']['mdStatus'][para[0]] = true
                            );
                            //判断参数长度
                            para.length>1
                                ?
                            onLoadMd(para.slice(1),callback)
                                :
                            callback(function(mdName,mdCode){
                                self[mdName] = mdCode;
                                self['options']['mdStatus'][mdName] = true;
                            })
                        }
                    }, false);
                }
                //已加载
                else{
                    para.length>1
                        ?
                    onLoadMd(para.slice(1),callback)
                        :
                    callback(function(mdName,mdCode){
                        self[mdName] = mdCode;
                        self['options']['mdStatus'][mdName] = true;
                    })
                }
            };
            arguments.length===1 ? para(): onLoadMd(para,callback);
        },
        //获取当前文档src
        getCurDocSrc : function(){
            var doc = window.document,a = {},expose = +new Date(),
                rExtractUri = /((?:http|https|file):\/\/.*?\/[^:]+)(?::\d+)?:\d+/,
                isLtIE8 = ('' + doc.querySelector).indexOf('[native code]') === -1;
            // FF,Chrome
            if (doc.currentScript){
                return doc.currentScript.src;
            }
            var stack;
            try{
                a.b();
            }
            catch(e){
                stack = e.fileName || e.sourceURL || e.stack || e.stacktrace;
            }
            // IE10
            if (stack){
                var absPath = rExtractUri.exec(stack)[1];
                if (absPath){
                    return absPath;
                }
            }
            // IE5-9
            for(var scripts = doc.scripts,
                    i = scripts.length - 1,
                    script; script = scripts[i--];){
                if (script.className !== expose && script.readyState === 'interactive'){
                    script.className = expose;
                    // if less than ie 8, must get abs path by getAttribute(src, 4)
                    return isLtIE8 ? script.getAttribute('src', 4) : script.src;
                }
            }
        },
        //各地址存储
        saveDovSrc : function(){
            //文件地址存储
            var curPath = this.getCurDocSrc();
            this.options['privatePriMoSrc']=curPath.slice(0, curPath.indexOf('ssui.js'))+'private/'; //私有模块地址存储
            this.options['htmlSrc']=curPath.slice(0, curPath.indexOf('modules'))+'assets/view/'; //html地址存储
            this.options['jsSrc']=curPath.slice(0, curPath.indexOf('modules'))+'assets/js/'; //js地址存储
        },
        //<--- | 操作 | --->
        //容器
        paraWrap:{
            //文档大小
            clw:document.documentElement.clientWidth,
            clh:document.documentElement.clientHeight,
            clwx:document.documentElement.clientWidth+'px',
            clhx:document.documentElement.clientHeight+'px',
        },
        //存储布局模块的dom元素
        domWrap:{},
        //存储布局_方法/实例_容器
        layoutFnWrap:{},
        //控制台异常提示
        error : function(msg){
            win.console && console.error && console.error('ss_ui hint: ' + msg);
        },
        //修正dom->样式属性
        mdfCssAttr : function(dom,obj){
            obj.cn && obj.cv && (
                obj.cn.forEach(function(item,index){
                    dom.style[item] = obj.cv[index];
                })
            )
            obj.an && obj.av && (
                obj.an.forEach(function(item,index){
                    dom.setAttribute(item,obj.av[index])
                })
            )
        },
        //修正dom->样式
        mdfCss : function(dom,cssArr){
            cssArr.length!==0 && (
                cssArr.forEach(function(item,index){
                    (index%2 === 0) && (
                        dom.style[item] = cssArr[index+1]
                    )
                })
            );
        },
        //修正dom->属性
        mdfAttr : function(dom,attrArr){
            attrArr.length!==0 && (
                attrArr.forEach(function(item,index){
                    (index%2 === 0) && (
                        dom.setAttribute(item,attrArr[index+1])
                    )
                })
            );

        },
        //创建元素
        crtDom : function (domName, className, txt, fatherDom, cssAtrrObj, eventArr) {
            var tempDom = document.createElement(domName);
            className && (tempDom.className = className);
            txt && (tempDom.innerHTML = txt);
            cssAtrrObj && (this.mdfCssAttr(tempDom, cssAtrrObj));
            fatherDom  && (fatherDom.appendChild(tempDom));
            //事件
            eventArr && eventArr.length!==0 && (
                eventArr.forEach(function(item,index){
                    (index%2 === 0) && (
                        tempDom.addEventListener(item, function(e){
                            eventArr[index+1](tempDom,e);
                        },false)
                    )
                })
            );
            //元素嵌套
            tempDom['appendDom'] = function () {
                 arguments.length===1 && (
                     arguments[0].__proto__.constructor.toString().indexOf('Arr')!==-1
                     ?
                     arguments[0].forEach(function (v) {
                         tempDom.appendChild(v);
                     })
                     :
                     arguments[0](tempDom)
                 )
                 return tempDom;
            };
            return tempDom;
        },
        //获取dom
        getDom : function(str,context){
            return (context || document).querySelector(str);
        },
        //获取domAll
        getDomAll : function(str,context){
            return (context || document).querySelectorAll(str);
        },
        //判断对象为Array类型
        judgeArr:function(obj){
            if(obj.__proto__.constructor.toString().indexOf('Arr')!==-1){
                return true;
            }
            return false;
        },
        //判断对象为Object类型
        judgeObj:function(obj){
            if(obj.__proto__.constructor.toString().indexOf('Obj')!==-1){
                return true;
            }
            return false;
        },
        //获得Object对象的长度
        getObjleg:function(obj){
            var count = 0;
            for(var x in obj){
                count = count + 1;
            }
            return count;
        },
        //赋值dom元素的文本节点
        setDomTxt:function(dom,str){
            for(var a=0; a<dom.childNodes.length; a++){
                if(dom.childNodes[a].nodeName=='#text' && dom.childNodes[a].nodeType==3){
                    dom.childNodes[a].nodeValue=str;
                    break;
                }
            }
        },
        //获取dom元素的文本节点
        getDomTxt:function(dom){
            for(var a=0; a<dom.childNodes.length; a++){
                if(dom.childNodes[a].nodeName=='#text' && dom.childNodes[a].nodeType==3){
                    return dom.childNodes[a].nodeValue;
                }
            }
        },
        //body点击对象
        bodyClickObj:{
            //订阅者的event集合
            listeners:{},
            //发布者能力
            trigger:function(){
                //当前hash值
                var curHash = location.hash.slice(1);
                if(this.listeners[curHash]){
                    for(var a=0; a<this.listeners[curHash].length; a++){
                        this.listeners[curHash][a]();
                    }
                }
            },
            //发布者执行
            executeFn:function(self){
                var self = self,
                    bodyObj = this;
                try{
                    self.getDom('body').onclick = function(e){
                        bodyObj.trigger();
                        // e.stopPropagation();
                    }
                }
                catch(err){
                    console.error('ss_ui.js引用要放在body内！')
                }
            }
        },
        //处理时间
        dpDate:{
            //时间戳转正常时间
            normal:function(timeStr){
                //判断是否为一位数，是则前面带0
                var judgeLen = function(val){
                    return String(val).length == 1 ? '0'+String(val) :  String(val);
                };
                var timer = new Date(timeStr),endStr = '';
                //对获取年-月-日  时-分-秒 函数进行遍历
                ['getFullYear','getMonth','getDate','getHours','getMinutes','getSeconds'].forEach(function(v){
                    endStr = endStr + (v=='getMonth' ? judgeLen(timer[v]()+1) : judgeLen(timer[v]())) + (v=='getDate' ? ' ' : (v=='getSeconds'?'':((v=='getHours'||v=='getMinutes')?':':'-')));
                });
                return  endStr;
            },
            //当天/T-n
            getDay:function(count){
                var now = new Date();
                var year = now.getFullYear();       //年
                var month = now.getMonth() + 1;     //月
                var day = now.getDate();            //日
                var d = new Date(year, month, 0).getDate();//当月的天数
                var preD = new Date(year, now.getMonth(), 0).getDate();//上个月的天数
                var disposeData = function(tempVal){
                    var endStrat;
                    var tempNumber = tempVal;
                    //判断天数
                    //少于当天
                    if(tempNumber<0){
                        var endCount = Math.abs(tempVal);
                        //是否需要返回到上一月
                        var dass = day-endCount;
                        var isPreTF = dass<=0;
                        endStrat
                            =
                            ((isPreTF&&month==1&&day==1) ?  year-1 : year)
                            +
                            '-'
                            +
                            (isPreTF ? ( isPreTF&&month==1?'12': (month-1<10?'0'+(month-1):month-1) ) : (month<10?'0'+month:month))
                            +
                            '-'
                            +
                            ( (isPreTF&&dass==0) ? preD : (isPreTF&&dass<0 ? (preD + dass < 10 ? '0' + (preD + dass) : preD + dass) : (dass < 10 ? ('0' + dass) : dass)));
                    }
                    //当天
                    else if(tempNumber==0){
                        endStrat = year + '-' + (month<10?'0'+month:month)  + '-' + (day<10?'0'+day:day);
                    }
                    //大于当天
                    else{
                        var isNextTF = tempNumber+day > d;//是否需要跳转到下一月
                        endStrat
                            =
                            ((isNextTF&&month==12&&day==d) ?  year+1 : year)
                            +
                            '-'
                            +
                            (isNextTF ? ( isNextTF&&month==12? '1' : (month+1<10?'0'+(month+1):month+1) ) : (month<10?'0'+month:month))
                            +
                            '-'
                            +
                            ( isNextTF ? ((tempNumber+day-d)<10?'0'+(tempNumber+day-d):tempNumber+day-d) : (day+tempNumber<10?('0'+(day+tempNumber)): (day+tempNumber)) );
                    }
                    return endStrat;
                };
                return disposeData(count);
            },
            //当天对象年月日
            getCurDateObj:function(){
                var now = new Date();
                var year = now.getFullYear();       //年
                var month = now.getMonth() + 1;     //月
                var day = now.getDate();            //日
                var d = new Date(year, month, 0).getDate();//当月的天数
                var preD = new Date(year, now.getMonth(), 0).getDate();//上个月的天数
                return {
                    year:year,
                    month:month,
                    day:day,
                    d:d,
                    preD:preD
                }
                
            }
        },
        //简单拖拽
        drag:function(bar, target, callback){
            var params = {
                left: 0,
                top: 0,
                currentX: 0,
                currentY: 0,
                flag: false
            };
            var getCss = function(o,key){
                return window.getComputedStyle(o,false)[key];
            };
            var startDrag = function(bar, target, callback){
                if(getCss(target, "left") !== "auto"){
                    params.left = getCss(target, "left");
                }
                if(getCss(target, "top") !== "auto"){
                    params.top = getCss(target, "top");
                }
                bar.onmousedown = function(event){
                    params.flag = true;
                    if(!event){
                        event = window.event;
                        bar.onselectstart = function(){
                            return false;
                        }
                    }
                    var e = event;
                    params.currentX = e.clientX;
                    params.currentY = e.clientY;
                };
                document.onmouseup = function(){
                    params.flag = false;
                    if(getCss(target, "left") !== "auto"){
                        params.left = getCss(target, "left");
                    }
                    if(getCss(target, "top") !== "auto"){
                        params.top = getCss(target, "top");
                    }
                };
                document.onmousemove = function(event){
                    var e = event ? event: window.event;
                    if(params.flag){
                        var nowX = e.clientX, nowY = e.clientY;
                        var disX = nowX - params.currentX, disY = nowY - params.currentY;
                        target.style.left = parseInt(params.left) + disX + "px";
                        target.style.top = parseInt(params.top) + disY + "px";
                        if (event.preventDefault) {
                            event.preventDefault();
                        }
                        return false;
                    }
                    if (typeof callback == "function") {
                        callback(parseInt(params.left) + disX, parseInt(params.top) + disY);
                    }
                };
            };
            startDrag(bar, target, callback);
        },

        //获得数字数组中位数
        getMedian:function(numArr){
            var numArr = numArr.sort(function(a,b){return a-b})
            var leg = numArr.length;
            var val = leg%2===0 ? leg/2 : Math.ceil(leg/2);
            return leg%2===0 ? Math.ceil((numArr[val-1]+numArr[val])/2) : numArr[val-1];
        },
        //<--- | svg库 | --->
        svgRepository : {
            //menu_三角(菜单组件)
            arrow_down:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg viewBox="0 0 1024 1024" style="cursor: pointer;position:absolute;top:0px;left:0px" width='+count+' height='+count+'>' +
                    '<path style="cursor: pointer" d="M511.8994502398008 775.4403199658041l-437.3914568656238-439.4024520696043 71.28977998108681-70.88758094029075 365.5989280835421 367.3082740069254 363.88958216015976-370.82751561388994 71.69197902188273 70.38483213929587z" fill='+colorVal+' >' +
                    '</path>' +
                    '</svg>';
                return tempStr;
            },
            //menu_图表
            chart:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg t="1509341422785"  style="cursor: pointer;position:absolute;top:0px;left:0px" viewBox="0 0 1024 1024"  width='+count+' height='+count+'>' +
                    '<path style="cursor: pointer" d="M532.679995 492.073158V64.47443c227.436966 19.150152 408.426063 200.302979 426.845575 427.598728H532.679995zM495.67622 102.607936h-2.001587v428.424536h429.060009v-2.00261c0 0.660032 0.116657 1.320065 0.116657 2.00261-0.022513 236.646722-192.128809 428.494121-429.176666 428.494121S64.47443 767.67817 64.47443 531.031449c0-236.671281 192.153368-428.542216 429.201226-428.542217 0.659009 0 1.295506 0.118704 2.000564 0.118704z" fill='+colorVal+'>' +
                    '</path>' +
                    '</svg>';
                return tempStr;
            },
            //menu_三竖(伸缩条)
            three:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;position:absolute;top:0px;left:0px" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                        '<path style="cursor: pointer" d="M203.009 859.615c-21.321 0-38.623-20.085-38.623-43.49v-608.248c0-23.947 17.921-43.49 38.623-43.49 21.321 0 38.623 20.085 38.623 43.49v608.248c0 23.947-17.921 43.49-38.623 43.49zM512 859.615c-21.321 0-38.623-20.085-38.623-43.49v-608.248c0-23.947 17.921-43.49 38.623-43.49 21.321 0 38.623 20.085 38.623 43.49v608.248c0 23.947-17.921 43.49-38.623 43.49zM820.991 859.615c-21.321 0-38.623-20.085-38.623-43.49v-608.248c0-23.947 17.921-43.49 38.623-43.49 21.321 0 38.623 20.085 38.623 43.49v608.248c0 23.947-17.921 43.49-38.623 43.49z" fill='+colorVal+'>' +
                        '</path>' +
                    '</svg>';
                return tempStr;
            },
            //sjUp
            sjUp:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;position:absolute;top:4px;left:0px" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                    '<path d="M288.864 636.032 511.968 405.312 735.136 636Z"  fill='+colorVal+'>' +
                    '</path>' +
                    '</svg>';
                return tempStr;
            },
            //sjUp2
            sjUp2:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;position:absolute;top:-4px;left:0px" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                    '<path d="M288.864 636.032 511.968 405.312 735.136 636Z"  fill='+colorVal+'>' +
                    '</path>' +
                    '</svg>';
                return tempStr;
            },
            //sjDown
            sjDown:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;position:absolute;top:-4px;left:0px" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                    '<path d="M735.136 405.28 512 636 288.864 405.28Z"  fill='+colorVal+'>' +
                    '</path>' +
                    '</svg>';
                return tempStr;
            },
            //tabTitle_首页
            home:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                        '<path d="M829.824 869.824c0 21.44-16.192 38.784-36.032 38.784H632.128c-19.84 0-36.032-17.344-36.032-38.784v-80.512h-0.384a79.488 79.488 0 0 0-78.912-74.432h-9.408a79.36 79.36 0 0 0-78.912 74.432h-0.512v80.512c0 21.44-16.064 38.784-35.904 38.784H230.272c-19.84 0-35.904-17.344-35.904-38.784V538.176h-37.376v331.648c0 42.048 32.896 76.224 73.28 76.224h161.792c40.384 0 73.28-34.176 73.28-76.224v-75.456a42.24 42.24 0 0 1 42.048-42.048h9.344a42.24 42.24 0 0 1 42.048 42.048v75.456c0 42.048 32.832 76.224 73.344 76.224h161.664c40.448 0 73.344-34.176 73.344-76.224V538.176h-37.312v331.648z" fill='+colorVal+'>' +
                        '</path>' +
                        '<path d="M932.736 457.088L567.68 118.656c-14.272-16.384-34.56-25.728-55.616-25.728s-41.408 9.344-55.68 25.792L91.328 457.088c-24.768 28.352-17.28 53.632-12.992 63.232 4.352 9.536 18.56 31.808 56.128 31.808h42.368v-39.36h-42.304c-21.696 0-27.776-13.376-13.504-29.696L486.144 144.64c7.168-8.192 16.576-12.224 25.984-12.224s18.816 4.032 25.984 12.224l365.12 338.432c14.272 16.32 8.192 29.696-13.504 29.696h-42.368v39.36h42.24c37.632 0 51.84-22.208 56.192-31.808 4.288-9.6 11.776-34.88-13.056-63.232z" fill='+colorVal+'>' +
                        '</path>' +
                        '<path d="M869.44 532.352a19.84 19.84 0 0 1-19.968 19.776 19.84 19.84 0 0 1 0-39.68 19.968 19.968 0 0 1 19.968 19.904zM194.368 532.352a19.84 19.84 0 1 1-39.744 0 19.904 19.904 0 0 1 39.744 0z" fill='+colorVal+'>' +
                        '</path>'+
                    '</svg>';
                return tempStr;
            },
            //tabTitle_向左(圆圈)
            arrow_Rleft:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                        '<path d="M691.2 486.4H419.84l104.96-104.96c10.24-10.24 10.24-25.6 0-35.84-10.24-10.24-25.6-10.24-35.84 0l-145.92 145.92c-5.12 5.12-7.68 15.36-7.68 23.04-2.56 7.68 0 15.36 7.68 23.04l145.92 145.92c10.24 10.24 25.6 10.24 35.84 0 10.24-10.24 10.24-25.6 0-35.84L419.84 537.6H691.2c15.36 0 25.6-10.24 25.6-25.6 0-12.8-10.24-25.6-25.6-25.6zM512 102.4C286.72 102.4 102.4 286.72 102.4 512s184.32 409.6 409.6 409.6 409.6-184.32 409.6-409.6S737.28 102.4 512 102.4z m0 768c-197.12 0-358.4-161.28-358.4-358.4S314.88 153.6 512 153.6s358.4 161.28 358.4 358.4-161.28 358.4-358.4 358.4z" fill='+colorVal+'>' +
                        '</path>'+
                    '</svg>';
                return tempStr;
            },
            //tabTitle_向右
            arrow_RRight:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                        '<path d="M678.4 488.96l-145.92-145.92c-10.24-10.24-25.6-10.24-35.84 0-10.24 10.24-10.24 25.6 0 35.84l104.96 104.96H332.8c-15.36 0-25.6 10.24-25.6 25.6s10.24 25.6 25.6 25.6h271.36L499.2 640c-10.24 10.24-10.24 25.6 0 35.84 10.24 10.24 25.6 10.24 35.84 0l145.92-145.92c5.12-5.12 7.68-15.36 7.68-23.04-2.56-2.56-2.56-10.24-10.24-17.92zM512 102.4C286.72 102.4 102.4 286.72 102.4 512s184.32 409.6 409.6 409.6 409.6-184.32 409.6-409.6S737.28 102.4 512 102.4z m0 768c-197.12 0-358.4-161.28-358.4-358.4S314.88 153.6 512 153.6s358.4 161.28 358.4 358.4-161.28 358.4-358.4 358.4z" fill='+colorVal+'>' +
                        '</path>'+
                    '</svg>';
                return tempStr;
            },
            //tabTitle_三角
            arrow_down2:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg viewBox="0 0 1024 1024" style="cursor: pointer;" width='+count+' height='+count+'>' +
                        '<path style="cursor: pointer" d="M511.8994502398008 775.4403199658041l-437.3914568656238-439.4024520696043 71.28977998108681-70.88758094029075 365.5989280835421 367.3082740069254 363.88958216015976-370.82751561388994 71.69197902188273 70.38483213929587z" fill='+colorVal+'>' +
                        '</path>' +
                    '</svg>';
                return tempStr;
            },
            //tabTitle_叉
            close:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;position:absolute;top:0px;left:0px" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                        '<path d="M837.802667 846.336a8.533333 8.533333 0 0 1-5.973334-2.56L512 524.117333 192.170667 843.946667a8.533333 8.533333 0 0 1-12.117334-12.117334L499.882667 512 180.053333 192.170667a8.533333 8.533333 0 1 1 12.117334-12.117334L512 499.882667l319.829333-319.829334a8.533333 8.533333 0 0 1 5.973334-2.56 8.533333 8.533333 0 0 1 5.973333 14.506667L524.117333 512l319.829334 319.829333a8.533333 8.533333 0 0 1-5.973334 14.506667z" fill='+colorVal+'>' +
                        '</path>' +
                        '<path d="M186.197333 186.197333l313.685334 313.685334 12.117333 12.117333 12.117333-12.117333 313.685334-313.685334-313.685334 313.685334L512 512l12.117333 12.117333 313.685334 313.685334-313.685334-313.685334L512 512l-12.117333 12.117333-313.685334 313.685334 313.685334-313.685334L512 512l-12.117333-12.117333-313.685334-313.685334m651.605334-17.066666a17.066667 17.066667 0 0 0-12.117334 4.949333L512 487.936 198.314667 174.08a17.066667 17.066667 0 1 0-24.064 24.064L487.936 512 174.08 825.685333a17.066667 17.066667 0 0 0 24.064 24.064L512 536.064 825.685333 849.92a17.066667 17.066667 0 0 0 24.064-24.064L536.064 512 849.92 198.314667a17.066667 17.066667 0 0 0-12.117333-29.184z" fill='+colorVal+'>' +
                        '</path>'+
                    '</svg>';
                return tempStr;
            },
            //tabTitle_圆圈叉
            close2:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                        '<path d="M709.492364 742.4 742.4 709.492364 544.907636 512 742.4 314.507636 709.492364 281.6 512 479.092364 314.507636 281.6 281.6 314.507636 479.092364 512 281.6 709.492364 314.507636 742.4 512 544.907636Z" fill='+colorVal+'>' +
                        '</path>' +
                        '<path d="M1024 512c0-282.763636-229.236364-512-512-512C229.236364 0 0 229.236364 0 512c0 282.763636 229.236364 512 512 512C794.763636 1024 1024 794.763636 1024 512zM46.545455 512C46.545455 254.929455 254.929455 46.545455 512 46.545455s465.454545 208.384 465.454545 465.454545-208.384 465.454545-465.454545 465.454545S46.545455 769.070545 46.545455 512z" fill='+colorVal+'>' +
                        '</path>'+
                    '</svg>';
                return tempStr;
            },
            //日期icon
            date:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                    '<path d="M723.491349 573.839073h-67.77356v-69.493701h67.77356v69.493701m102.348396-69.321687h-67.77356v69.493701h67.77356v-69.493701m102.692424 0h-67.945574v69.493701h67.945574v-69.493701m-205.04082 101.316311h-67.77356v69.493701h67.77356v-69.493701m102.348396 0h-67.77356v69.493701h67.77356v-69.493701m102.692424 0h-67.945574v69.493701h67.945574v-69.493701m25.286074-241.679825c0 11.868974-9.288762 21.501764-20.985722 21.501764-11.69696-0.172014-20.985721-9.804804-20.985721-21.501764v-54.012431c0-11.868974 9.288762-21.32975 20.985721-21.329749 11.524945 0 20.985721 9.63279 20.985722 21.329749v54.012431M670.855031 310.141441c0-11.868974-9.288762-21.32975-20.985721-21.329749-11.524945 0-20.985721 9.63279-20.985722 21.329749v54.012431c0 11.868974 9.288762 21.501764 20.985722 21.501764 11.524945 0 20.985721-9.63279 20.985721-21.501764v-54.012431m308.077272 31.306568v22.017807c0 26.146145-20.813707 47.30388-46.271796 47.30388-25.458088 0-46.271796-21.157736-46.271795-47.30388v-22.017807H696.313119v21.845792c0 26.146145-20.813707 47.30388-46.271795 47.303881-25.458088 0-46.271796-21.32975-46.271796-47.303881v-21.845792h-50.22812v423.326726h474.586931V341.448009h-49.196036m3.096254 376.19486H599.641189V455.321351h382.387368v262.321518m0 0" fill='+colorVal+'>' +
                    '</path>'+
                    '</svg>';
                return tempStr;
            },
            //下拉框三角icon
            sl_ad:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;position:absolute;top:0px;left:0px;" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                        '<path d="M895.168 327.911l-0.002-0.004c5.79-7.081 9.267-16.128 9.267-25.988 0-22.689-18.393-41.084-41.082-41.087l-0.084-0.177-703.881 0.182c-22.618 0.086-40.928 18.445-40.928 41.083 0 10.762 4.142 20.553 10.913 27.878l350.235 411.693c7.507 9.838 19.348 16.192 32.678 16.192 12.943 0 24.481-5.991 32.013-15.344h0.011l350.566-414.081c0.075-0.090 0.151-0.177 0.226-0.267l0.067-0.079z" p-id="2405" fill='+colorVal+'>' +
                        '</path>'+
                    '</svg>';
                return tempStr;
            },
            //下拉框三角icon2，position
            sl_ad2:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                        '<path d="M895.168 327.911l-0.002-0.004c5.79-7.081 9.267-16.128 9.267-25.988 0-22.689-18.393-41.084-41.082-41.087l-0.084-0.177-703.881 0.182c-22.618 0.086-40.928 18.445-40.928 41.083 0 10.762 4.142 20.553 10.913 27.878l350.235 411.693c7.507 9.838 19.348 16.192 32.678 16.192 12.943 0 24.481-5.991 32.013-15.344h0.011l350.566-414.081c0.075-0.090 0.151-0.177 0.226-0.267l0.067-0.079z" p-id="2405" fill='+colorVal+'>' +
                        '</path>'+
                    '</svg>';
                return tempStr;
            },
            //刷新
            f5:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                        '<path d="M907.462482 834.333101A508.834229 508.834229 0 0 1 7.312938 585.035044h146.258761a364.403703 364.403703 0 0 0 649.827675 145.308078L658.164424 585.035044h365.646902v365.646902zM511.905663 146.258761a363.672409 363.672409 0 0 0-291.639969 147.136313L365.646902 438.776283H0V73.12938l116.275715 116.275715A508.907359 508.907359 0 0 1 1016.498388 438.776283h-146.258761A365.646902 365.646902 0 0 0 511.905663 146.258761z" fill='+colorVal+'>' +
                        '</path>'+
                    '</svg>';
                return tempStr;
            },
            //未勾选
            uncheckboxIcon:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                //fill='+colorVal+'>' +
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;position:absolute;top:0px;left:0px;" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                    '<path d="M196.923077 78.769231a118.153846 118.153846 0 0 0-118.153846 118.153846v630.153846a118.153846 118.153846 0 0 0 118.153846 118.153846h630.153846a118.153846 118.153846 0 0 0 118.153846-118.153846V196.923077a118.153846 118.153846 0 0 0-118.153846-118.153846H196.923077z m0-78.769231h630.153846a196.923077 196.923077 0 0 1 196.923077 196.923077v630.153846a196.923077 196.923077 0 0 1-196.923077 196.923077H196.923077a196.923077 196.923077 0 0 1-196.923077-196.923077V196.923077a196.923077 196.923077 0 0 1 196.923077-196.923077z" fill='+colorVal+'>' +
                    '</path>'+
                    '</svg>';
                return tempStr;
            },
            //勾选
            checkboxIcon:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                //fill='+colorVal+'>' +
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;position:absolute;top:0px;left:0px;" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                    '<path d="M196.923077 0h630.153846a196.923077 196.923077 0 0 1 196.923077 196.923077v630.153846a196.923077 196.923077 0 0 1-196.923077 196.923077H196.923077a196.923077 196.923077 0 0 1-196.923077-196.923077V196.923077a196.923077 196.923077 0 0 1 196.923077-196.923077z m0 78.769231a118.153846 118.153846 0 0 0-118.153846 118.153846v630.153846a118.153846 118.153846 0 0 0 118.153846 118.153846h630.153846a118.153846 118.153846 0 0 0 118.153846-118.153846V196.923077a118.153846 118.153846 0 0 0-118.153846-118.153846H196.923077z m584.900923 258.205538a36.509538 36.509538 0 0 1 1.260308 51.633231l-299.480616 313.107692c-0.118154 0.157538-0.393846 0.236308-0.630154 0.472616l-0.393846 0.551384c-2.166154 2.126769-4.726154 3.229538-7.207384 4.726154-1.575385 0.866462-2.796308 2.166154-4.411077 2.835692a35.800615 35.800615 0 0 1-27.490462 0.07877c-1.260308-0.512-2.284308-1.614769-3.544615-2.284308-2.756923-1.457231-5.592615-2.835692-8.034462-5.12-0.196923-0.157538-0.275692-0.433231-0.512-0.669538-0.196923-0.118154-0.393846-0.196923-0.551384-0.354462l-150.843077-156.593231a36.430769 36.430769 0 0 1 0.945231-51.633231 36.391385 36.391385 0 0 1 51.63323 0.945231l124.455385 129.102769 273.092923-285.61723a36.548923 36.548923 0 0 1 51.712-1.181539z" fill='+colorVal+'>' +
                    '</path>'+
                    '</svg>';
                return tempStr;
            },
            //加号➕
            add:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;position:absolute;top:0px;left:0px" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                        '<path d="M960.621531 575.791885 571.769268 575.791885l0 382.755404-120.688733 0L451.080535 575.791885 64.875566 575.791885 64.875566 448.207092l386.204969 0L451.080535 65.451688l120.688733 0 0 382.755404 388.853285 0L960.622554 575.791885z" fill='+colorVal+'>' +
                        '</path>'+
                    '</svg>';
                return tempStr;
            },
            //减号-
            minus:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                        '<path d="M128.036583 448.384124l766.998695 0 0 126.889969-766.998695 0 0-126.889969Z" fill='+colorVal+'>' +
                        '</path>'+
                    '</svg>';
                return tempStr;
            },
            //带框加号(权限)
            frameAdd:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;position:absolute;top:0px;left:0px;" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                    '<path d="M851.2 64H166.4C115.2 64 64 108.8 64 166.4v684.8C64 908.8 115.2 960 166.4 960h684.8c57.6 0 102.4-44.8 102.4-102.4V166.4C960 108.8 908.8 64 851.2 64zM800 544H544v256c0 19.2-12.8 32-32 32s-32-12.8-32-32V544H224c-19.2 0-32-12.8-32-32s12.8-32 32-32h256V224c0-19.2 12.8-32 32-32s32 12.8 32 32v256h256c19.2 0 32 12.8 32 32s-12.8 32-32 32z" fill='+colorVal+'>' +
                    '</path>'+
                    '</svg>';
                return tempStr;
            },
            //带框减号(权限)
            frameMinus:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;position:absolute;top:0px;left:0px;" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                    '<path d="M857.6 70.4H172.8c-57.6 0-102.4 44.8-102.4 102.4v684.8c0 57.6 44.8 102.4 102.4 102.4h684.8c57.6 0 102.4-44.8 102.4-102.4V172.8c-6.4-57.6-51.2-102.4-102.4-102.4z m-51.2 480h-576c-19.2 0-32-12.8-32-32s12.8-32 32-32h576c19.2 0 32 12.8 32 32 0 12.8-19.2 32-32 32z" fill='+colorVal+'>' +
                    '</path>'+
                    '</svg>';
                return tempStr;
            },
            //圆圈加号(权限添加)
            circleAdd:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;position:absolute;top:0px;left:0px;" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                    '<path d="M874.971429 149.942857C776.228571 54.857143 648.228571 0 512.914286 0S245.942857 54.857143 150.857143 149.942857c-201.142857 201.142857-201.142857 522.971429 0 724.114286C245.942857 969.142857 377.6 1024 512.914286 1024s266.971429-54.857143 362.057143-149.942857c201.142857-201.142857 201.142857-522.971429 0-724.114286m-51.2 672.914286C739.657143 906.971429 629.942857 950.857143 512.914286 950.857143s-226.742857-43.885714-310.857143-128c-171.885714-171.885714-171.885714-449.828571 0-621.714286C286.171429 117.028571 395.885714 73.142857 512.914286 73.142857s226.742857 43.885714 310.857143 128c171.885714 171.885714 171.885714 449.828571 0 621.714286" fill='+colorVal+'>' +
                    '</path>' +
                    '<path d="M549.485714 475.428571V288.914286c0-21.942857-14.628571-36.571429-36.571428-36.571429s-36.571429 14.628571-36.571429 36.571429V475.428571H289.828571c-21.942857 0-36.571429 14.628571-36.571428 36.571429 0 10.971429 3.657143 18.285714 10.971428 25.6s14.628571 10.971429 25.6 10.971429H476.342857v186.514285c0 10.971429 3.657143 18.285714 10.971429 25.6 7.314286 7.314286 14.628571 10.971429 25.6 10.971429 21.942857 0 36.571429-14.628571 36.571428-36.571429V548.571429h186.514286c21.942857 0 36.571429-14.628571 36.571429-36.571429s-14.628571-36.571429-36.571429-36.571429H549.485714z" fill='+colorVal+'>' +
                    '</path>'+
                    '</svg>';
                return tempStr;
            },
            //下一步_右(权限配置)
            nextArrows_r:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;position:absolute;top:0px;left:0px;" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                    '<path d="M 223.361 656.774 H 501.401 V 368.029 H 223.361 v 288.745 Z M 3.3391 394.331 v 231.082 c 0 37.8764 25.5309 31.3608 25.5309 31.3608 h 122.984 V 368.029 H 24.7458 s -21.4067 -0.678536 -21.4067 26.3028 Z m 1007.51 90.0756 c -35.2839 -34.4771 -377.398 -287.565 -377.398 -287.565 s -39.4069 -38.9818 -39.4069 19.456 v 151.729 h -0.414226 v 288.746 h 0.055993 v 161.675 c 0 47.9112 38.0065 6.25133 38.0065 6.25133 l 376.25 -291.311 c -0.000602 0.001204 28.6214 -23.9553 2.90681 -48.9811 Z m 0 0" fill='+colorVal+'>' +
                    '</path>'+
                    '</svg>';
                return tempStr;
            },
            //下一步_左(权限配置)
            nextArrows_l:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;position:absolute;top:0px;left:0px;" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                    '<path d="M 801.547 368.827 H 523.507 v 288.746 h 278.039 V 368.827 Z m 220.022 262.442 v -231.082 c 0 -37.8764 -25.5309 -31.3608 -25.5309 -31.3608 H 873.054 v 288.746 h 127.107 s 21.4073 0.678536 21.4073 -26.3034 Z M 14.0608 541.194 c 35.2839 34.4771 377.398 287.564 377.398 287.564 s 39.4069 38.9818 39.4069 -19.4554 v -151.73 h 0.414226 V 368.827 h -0.055993 v -161.675 c 0 -47.9112 -38.0065 -6.25133 -38.0065 -6.25133 L 16.9682 492.212 s -28.622 23.9559 -2.90741 48.9823 Z m 0 0" fill='+colorVal+'>' +
                    '</path>'+
                    '</svg>';
                return tempStr;
            },
            //圆圈选中(靓号规则)
            circleSel:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;position:absolute;top:0px;left:0px;" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                        '<path d="M725.725 527.476c0 122.054-98.994 221.050-221.050 221.050-122.054 0-220.941-98.994-220.941-221.050 0-122.054 98.887-221.050 220.941-221.050 122.054 0 221.050 98.994 221.050 221.050z" fill='+colorVal+'>' +
                        '</path>' +
                        '<path d="M504.721 121.757c-223.731 0-405.74 182.009-405.74 405.74s182.009 405.74 405.74 405.74c223.731 0 405.74-182.009 405.74-405.74 0-223.731-182.009-405.74-405.74-405.74M504.721 993.296c-98.243 0-189.516-30.567-264.807-82.8-85.909-59.525-150.903-147.259-181.579-249.793-12.656-42.257-19.412-86.981-19.412-133.206 0-78.403 19.412-152.3 53.733-217.187 34.428-64.887 83.658-120.767 143.184-163.025 75.935-53.948 168.816-85.589 268.884-85.589 83.013 0 161.095 21.772 228.665 60.062 85.482 48.37 154.337 123.019 195.309 212.897 26.919 58.775 41.828 124.094 41.828 192.839 0 91.595-26.599 177.183-72.503 249.363-42.686 67.141-102.107 122.591-172.247 160.558-65.853 35.609-141.145 55.879-221.050 55.879z" fill='+colorVal+'>' +
                        '</path>'+
                    '</svg>';
                return tempStr;
            },
            //圆圈未选中(靓号规则)
            circleUnSel:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;position:absolute;top:0px;left:0px;" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                        '<path d="M512.249 73.692c-241.757 0-437.695 195.938-437.695 437.695 0 241.759 195.938 437.695 437.695 437.695 241.759 0 437.695-195.938 437.695-437.695 0-241.756-195.938-437.695-437.695-437.695zM512.249 914.068c-222.027 0-402.68-180.653-402.68-402.682 0-222.027 180.653-402.68 402.68-402.68s402.68 180.653 402.68 402.68c0 222.031-180.653 402.682-402.68 402.682z" fill='+colorVal+'>' +
                        '</path>'+
                    '</svg>';
                return tempStr;
            },
            //问号(靓号规则)
            question:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;position:absolute;top:0px;left:0px;" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                        '<path d="M463.99957 784.352211c0 26.509985 21.490445 48.00043 48.00043 48.00043s48.00043-21.490445 48.00043-48.00043c0-26.509985-21.490445-48.00043-48.00043-48.00043S463.99957 757.842226 463.99957 784.352211z" fill='+colorVal+'>' +
                        '</path>' +
                        '<path d="M512 960c-247.039484 0-448-200.960516-448-448S264.960516 64 512 64 960 264.960516 960 512 759.039484 960 512 960zM512 128.287273c-211.584464 0-383.712727 172.128262-383.712727 383.712727 0 211.551781 172.128262 383.712727 383.712727 383.712727 211.551781 0 383.712727-172.159226 383.712727-383.712727C895.712727 300.415536 723.551781 128.287273 512 128.287273z" fill='+colorVal+'>' +
                        '</path>' +
                        '<path d="M512 673.695256c-17.664722 0-32.00086-14.336138-32.00086-31.99914l0-54.112297c0-52.352533 39.999785-92.352318 75.32751-127.647359 25.887273-25.919957 52.67249-52.67249 52.67249-74.016718 0-53.343368-43.07206-96.735385-95.99914-96.735385-53.823303 0-95.99914 41.535923-95.99914 94.559333 0 17.664722-14.336138 31.99914-32.00086 31.99914s-32.00086-14.336138-32.00086-31.99914c0-87.423948 71.775299-158.559333 160.00086-158.559333s160.00086 72.095256 160.00086 160.735385c0 47.904099-36.32028 84.191695-71.424378 119.295794-27.839699 27.776052-56.575622 56.511974-56.575622 82.3356l0 54.112297C544.00086 659.328155 529.664722 673.695256 512 673.695256z" fill='+colorVal+'>' +
                        '</path>'+
                    '</svg>';
                return tempStr;
            },
            //svg模板
            template:function(count,colorVal){
                var colorVal = colorVal || '#bdbdbd';
                //fill='+colorVal+'>' +
                var tempStr = '<svg t="1509434054366" style="cursor: pointer;position:absolute;top:0px;left:0px;" viewBox="0 0 1024 1024" width='+count+' height='+count+'>' +
                    ''+
                    '</svg>';
                return tempStr;
            },
        }
    };
    win.ss = new ss();
}(window);