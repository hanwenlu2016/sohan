ss.define(function(exports){
    function ss_menu(obj){
        this.sourceObj = obj;
        this.init();//初始化
    };
    ss_menu.prototype = {
        constructor: ss_menu,
        //初始化
        init: function () {
            this.rd_menuWrap();
            this.rd_menuItems();
            this.theEndFn();
            this.lg_f5Open();
            ss.relation_tabTitleFn = this.relation_tabTitleFn;
        },
        //theEnd
        theEndFn: function () {
            var self = this,
                obj = self.sourceObj;
            ss.domWrap['ly_menu'].appendChild(this.domWrap.mn_Container);//追加到文档
        },
        //<--- | 渲染 | --->
        //渲染导航条的容器
        rd_menuWrap:function(){
            var self = this,
                obj = self.sourceObj,
                tempContainer = document.createDocumentFragment();
            //整个导航条的容器
            var mn_Container = ss.crtDom('div','mn_Container','',tempContainer,{
                cn:['width','height','backgroundColor','marginTop','overflowX','overflowY','position'],
                cv:['100%','100%','#2a3f54','0px','hidden','auto','relative']
            },[
                //滚动显示自定义的滚动条
                //'mousewheel',function(dom,e){
                //    //console.log(e);
                //    //if (e.deltaY < 0) {
                //    //    //console.log(e.deltaY);
                //    //    dom.style.transform = 'translateY('+(-e.deltaY-100)+'px)';
                //    //}else{
                //    //    dom.style.transform = 'translateY('+(-e.deltaY-100)+'px)';
                //    //}
                //    //console.log(e.deltaY);
                //},
                //'mousemove',function(dom){
                //    //var wraps = ss.getDomAll('[count="0"]'),tempCount = 0;
                //    //for(var a=0; a<wraps.length; a++){
                //    //    tempCount = tempCount + Number(wraps[a].style.height.slice(0,wraps[a].style.height.indexOf('px')));
                //    //}
                //    //var endH = tempCount + 90;
                //    ////console.log(endH);
                //    //if(endH>ss.paraWrap.clh){
                //    //    ss.getDom('.ly_diyScroll',dom).style.display = 'block';
                //    //
                //    //}
                //},
                //'mouseout',function(dom){
                //    //ss.getDom('.ly_diyScroll',dom).style.display = 'none';
                //}
            ])
                .appendDom([
                    //自定义滚动条
                    ss.crtDom('div','ly_diyScroll','','',{
                        cn:['position','top','right','width','height','backgroundColor','borderRadius','zIndex','opacity','display'],
                        cv:['absolute','1px','0px','6px','150px','#f2f2f2','3px',1301,.3,'none']
                    }),
                    //系统名字
                    ss.crtDom('div','ly_munuName',obj.name,'',{
                        cn:['width','height','lineHeight','textAlign','backgroundColor','color','fontSize'],
                        cv:['100%','50px','50px','center','#2A3F54','#fff','14px']
                    }),
                    //导航伸缩条
                    ss.crtDom('div','mn_flexBox','','',{
                            cn:['width','height','backgroundColor','textAlign','cursor','paddingTop'],
                            cv:['100%','40px','rgb(41, 103, 153)','center','pointer','12px']
                        })
                        .appendDom([
                            ss.crtDom('span','',ss.svgRepository.three('16','#fff'),'',{
                                cn:['display','width','height','cursor','position'],
                                cv:['inline-block','16px','16px','pointer','relative']
                            })
                        ])
                    ,
                    //导航内容
                    ss.crtDom('div','mn_content','','')
                ]);
            self.domWrap['mn_Container'] = mn_Container;
            self.domWrap['mn_flexBox'] = ss.getDom('.mn_flexBox',mn_Container);
            self.domWrap['mn_content'] = ss.getDom('.mn_content',mn_Container);
        },
        //渲染导航条各项
        rd_menuItems:function(){
            var self = this,
                obj = self.sourceObj;
            //样式控制
            var contorlCss = ['#2a3f54','#2a3f54','#2a3f54','#2a3f54'];
            //用于递归创建的函数
            var recursionCreateFn = function(createData,createWrap,count){
                //获取对象的heeler各项值 & 装载数据的容器
                var heelerData = createData.heeler,
                    appendToWrap = createWrap;
                //判断子项数组长度是否为空，不为空才往下执行
                if(heelerData.length!==0){
                    //遍历数据各项
                    for(var a=0; a<heelerData.length; a++){
                        var itemWrap = ss.crtDom('div','wrap_'+count,'',appendToWrap,{
                            cn:['width','height','boxSizing','overflow','transition','display'],
                            cv:['100%',heelerData[a].isShow?'50px':'0px','border-box','hidden','all .3s',heelerData[a].isShow?'block':'none'],
                            an:['count',a===0&&'first'],
                            av:[count,a===0&&'true']
                        },[
                            //每一项的点击
                            'click',function(dom,e){
                                e.stopPropagation();//阻止事件冒泡
                                if(dom.children.length>1){
                                    if(dom.getAttribute('isOpen') && dom.getAttribute('isOpen')=='true'){
                                        self.lg_disposeFontIcon(dom,'true',count);//处理字体图标
                                        var itemWraps = dom.querySelectorAll('.itemWrap'),
                                            tempArr = [];
                                        [].push.apply(tempArr,itemWraps);
                                        tempArr.forEach(function(v){
                                            self.lg_disposeFontIcon(v,'true');//处理字体图标
                                        })
                                        //获得所有子项的高度
                                        var itemH = 0;
                                        for(var h=0; h<dom.children.length; h++){
                                            var curItem = dom.children[h].style.height;
                                            curItem && ( itemH = itemH + Number(curItem.slice(0,curItem.indexOf('px')))  )
                                        }
                                        //对各父盒子进行高度调整
                                        var tempDom = dom;
                                        for(var a=count; a>0; a--){
                                            tempDom = tempDom.parentNode;
                                            tempDom.style.height = tempDom.offsetHeight + 50 -itemH +'px'
                                        }
                                        //关闭
                                        dom.style.height = '50px';
                                        dom.setAttribute('isOpen','false');
                                    }
                                    else{
                                        self.lg_disposeFontIcon(dom,'false',count);//处理字体图标
                                        //获得所有子项的高度
                                        var itemH = 0;
                                        for(var h=0; h<dom.children.length; h++){
                                            var curItem = dom.children[h].style.height;
                                            curItem && ( itemH = itemH + Number(curItem.slice(0,curItem.indexOf('px')))  )
                                        }
                                        var tempDom = dom;
                                        if(count>0){
                                            for(var a=count; a>0; a--){
                                                tempDom = tempDom.parentNode;
                                                tempDom.style.height =tempDom.offsetHeight - 50 + itemH + 'px';
                                            }
                                        }
                                        //展开
                                        dom.style.height = itemH+'px';
                                        //修改展开的状态
                                        dom.setAttribute('isOpen','true');
                                    }
                                }
                            }
                        ]);//itemWrap--------
                        //leader -> 可以点击的领导项 (p元素表示)
                        //每一项容器->选项
                        var leaderDom = ss.crtDom('p','leaderWrap','',itemWrap,{
                                cn:['width','height','boxSizing','cursor','textAlign','lineHeight','paddingLeft','position','backgroundColor','margin'],
                                cv:['100%','50px','border-box','pointer','left','50px','20px','relative',contorlCss[count],'0px'],
                            },
                            [
                                'click',function(dom,e){
                                dom.getAttribute('type') && dom.getAttribute('type')=='click' && (self.lg_disposeLight(dom),e.stopPropagation());
                            }
                                ,
                                'mouseover',function(dom){
                                dom.querySelector('.txt').style.color = (dom.getAttribute('isClick')==='true'&&dom.getAttribute('type')==='click') ? '#03A9F4' :'#fff';
                            }
                                ,
                                'mouseout',function(dom){
                                (dom.getAttribute('isclick')&&dom.getAttribute('isclick')=='true')
                                    ?
                                    dom.querySelector('.txt').style.color = dom.getAttribute('type')=='click' ? '#03A9F4' :'#fff'
                                    :
                                    dom.querySelector('.txt').style.color = '#bdbdbd';
                            }
                            ])
                        //为领导第一层(需要带上图表)
                        if(heelerData[a].isFirst){
                            //图标
                            ss.crtDom('span','icon', ss.svgRepository.chart('16','#bdbdbd') ,leaderDom,{
                                cn:['display','width','height','cursor','position'],
                                cv:['inline-block','14px','14px','pointer','relative']
                            })
                            //文字
                            ss.crtDom('span','txt',heelerData[a].leader,leaderDom,{
                                cn:['color','fontSize','marginLeft','cursor','color','userSelect'],
                                cv:['#bdbdbd','14px','15px','pointer','#bdbdbd','none']
                            })
                            //三角
                            ss.crtDom('span','icon_sj',ss.svgRepository.arrow_down('14'),leaderDom,{
                                cn:['display','width','height','marginTop','position','right','top','lineHeight','cursor','transition','transformOrigin','transform'],
                                cv:['inline-block','14px','14px','3px','absolute','20px','18px','16px','pointer','all .3s','center center','rotate(0deg)']
                            })
                        }
                        //为可以点击项(有txt字段)
                        else if(heelerData[a].txt){
                            leaderDom.setAttribute('type','click');
                            leaderDom.setAttribute('txt',heelerData[a].txt);
                            //文字
                            ss.crtDom('span','txt',heelerData[a].leader,leaderDom,{
                                cn:['cursor','color','fontSize','marginLeft','userSelect'],
                                cv:['pointer','#bdbdbd','13px',30*count+'px','none']
                            })
                        }
                        //为领导第一层(不需要图表)
                        else{
                            //文字
                            ss.crtDom('span','txt',heelerData[a].leader,leaderDom,{
                                cn:['cursor','color','fontSize','marginLeft','userSelect'],
                                cv:['pointer','#bdbdbd','13px',30*count+'px','none']
                            })
                            //三角
                            ss.crtDom('span','icon_sj',ss.svgRepository.arrow_down('10'),leaderDom,{
                                cn:['display','width','height','position','right','top','lineHeight','cursor','transition','transformOrigin'],
                                cv:['inline-block','10px','10px','absolute','22px','20px','20px','pointer','all .3s','center center']
                            })
                        }
                        var newCount = count+1;
                        //创建完每项进行递归
                        recursionCreateFn(heelerData[a],itemWrap,newCount);
                    };
                }
            };
            var count = 0;
            //参数：1.含有heeler值的obj  2.用于装载各项的容器 3.判断层数的数值
            recursionCreateFn(ss.options['menuData'],self.domWrap.mn_content,count);
        },
        //<--- | 逻辑 | --->
        //刷新->展开url的hash值各项
        lg_f5Open : function(){
            var self = this,
                obj = self.sourceObj;
            //若不存在hash值，则进行默认追加
            if(location.hash && ss.options['clickTxts'].indexOf(location.hash.slice(1))!=-1){
                if(location.hash.slice(1)!='home'){
                    var tempHashStr = /\#(\S{1,})/.exec(location.hash)[1];
                    var curWrap = document.querySelector('[txt='+tempHashStr+']').parentNode;
                    //1.选中项高亮   2.该项Wrap容器的领导层高亮处理，展开   3.
                    var disposeFn = function(curWrap,curCount,flag){
                        var curDomP = curWrap.querySelector('p');
                        //1.所有的wrap容器高度展开
                        var itemH = 0;
                        for(var h=0; h<curWrap.children.length; h++){
                            var curItem = curWrap.children[h].style.height;
                            curItem && ( itemH = itemH + Number(curItem.slice(0,curItem.indexOf('px')))  )
                        }
                        curWrap.style.height = itemH+'px';
                        //2.领导项文字变白/倒三角旋转/icon变白/首项带阴影
                        var curDomP_icon = curDomP.querySelector('.icon'),
                            curDomP_iconSj = curDomP.querySelector('.icon_sj'),
                            curDomP_txt = curDomP.querySelector('.txt');
                        curDomP_icon && (
                            curDomP_icon.innerHTML = ss.svgRepository.chart('16','#fff'),
                            curDomP.style.boxShadow = curWrap.getAttribute('first') ? 'rgba(0,0,0,.25) 0 1px 0' : 'rgba(0,0,0,.25) 0 1px 0, inset rgba(255,255,255,.16) 0 1px 0',
                            curDomP.style.zIndex = 1000)
                        ;
                        curDomP_iconSj && (
                            curDomP_iconSj.innerHTML = ss.svgRepository.arrow_down(curDomP_iconSj.style.width.slice(0,curDomP_iconSj.style.width.indexOf('px')),'#fff'),
                                curDomP_iconSj.style.transform = 'rotate(180deg)'
                        );
                        curDomP_txt && (curDomP_txt.style.color = '#fff');
                        //3.选中项高亮处理/选中项修正标识属性
                        flag && (
                            curDomP.style.backgroundColor = 'rgba(255,255,255,.05)',
                                curDomP.setAttribute('isClick','true'),
                                curDomP_txt.style.color = '#03A9F4'
                        )
                        //4.各展开的项加入标识属性
                        curWrap.setAttribute('isOpen','true');
                        curDomP.setAttribute('isClick','true');
                    };
                    var curCount = Number(curWrap.getAttribute('count'));
                    for(var o=curCount; o>=0; o--){
                        o==curCount ? disposeFn(curWrap,curCount,'cur') : (curWrap = curWrap.parentNode,disposeFn(curWrap,curCount))
                    };
                    //tab标题栏添加显示项
                    ss.layoutFnWrap['lg_shwoTtFn'](document.querySelector('[txt='+tempHashStr+']').querySelector('span').innerHTML,tempHashStr,ss.layoutFnWrap['self']);
                }
                else{
                    ss.layoutFnWrap['lg_clearStatuFn']('home');
                }
            }
            else{
                //var hashStr = 'kfOpera';
                //window.location.href = window.location.origin+window.location.pathname+'#home';
                window.location.href = window.location.origin+window.location.pathname+'#home';
                ss.layoutFnWrap['lg_clearStatuFn']('home');
            }

        },
        //配合tabTitle栏的调用方法
        relation_tabTitleFn:function(str){
            //将所有的菜单状态清空
            var tempFn = function(curWrap){
                //状态
                curWrap.setAttribute('isOpen','false');
                curWrap.style.height = heelerData[a].isShow?'50px':'0px';
                //处理p->1.高度50px  2.文字/图表/三角
                var curWrap_p = curWrap.children[0];
                curWrap_p.style.backgroundColor = 'rgb(42, 63, 84)';
                ss.getDom('.txt',curWrap_p).style.color = '#bdbdbd';
                ss.getDom('.icon',curWrap_p) && (
                    curWrap_p.style.boxShadow = 'none',
                    ss.getDom('.icon',curWrap_p).innerHTML = ss.svgRepository.chart('16','#bdbdbd')
                )
                ss.getDom('.icon_sj',curWrap_p) && (
                    ss.getDom('.icon_sj',curWrap_p).innerHTML = ss.svgRepository.arrow_down(ss.getDom('.icon_sj',curWrap_p).style.width.slice(0,ss.getDom('.icon_sj',curWrap_p).style.width.indexOf('px')),'#bdbdbd'),
                    ss.getDom('.icon_sj',curWrap_p).style.transform = 'rotate(0deg)', ss.getDom('.txt',curWrap_p).setAttribute('isClick','false')
                )
                for(var i=0; i<curWrap.children.length; i++){
                    curWrap.children[i].getAttribute('count') && (
                        tempFn(curWrap.children[i])
                    )
                }
            };
            var mnConDom = ss.getDom('.mn_content');
            for(var c=0; c<mnConDom.children.length; c++){
                tempFn(mnConDom.children[c]);
            };
            if(str!='home'){
                //单独处理高亮的项
                var curWrap = document.querySelector('[txt='+str+']').parentNode;
                //1.选中项高亮   2.该项Wrap容器的领导层高亮处理，展开   3.
                var disposeFn = function(curWrap,curCount,flag){
                    var curDomP = curWrap.querySelector('p');
                    //1.所有的wrap容器高度展开
                    var itemH = 0;
                    for(var h=0; h<curWrap.children.length; h++){
                        var curItem = curWrap.children[h].style.height;
                        curItem && ( itemH = itemH + Number(curItem.slice(0,curItem.indexOf('px')))  )
                    }
                    curWrap.style.height = itemH+'px';
                    //2.领导项文字变白/倒三角旋转/icon变白/首项带阴影
                    var curDomP_icon = curDomP.querySelector('.icon'),
                        curDomP_iconSj = curDomP.querySelector('.icon_sj'),
                        curDomP_txt = curDomP.querySelector('.txt');
                    curDomP_icon && (
                        curDomP_icon.innerHTML = ss.svgRepository.chart('16','#fff'),
                            curDomP.style.boxShadow = curWrap.getAttribute('first') ? 'rgba(0,0,0,.25) 0 1px 0' : 'rgba(0,0,0,.25) 0 1px 0, inset rgba(255,255,255,.16) 0 1px 0',
                            curDomP.style.zIndex = 1000)
                    ;
                    curDomP_iconSj && (
                        curDomP_iconSj.innerHTML = ss.svgRepository.arrow_down(curDomP_iconSj.style.width.slice(0,curDomP_iconSj.style.width.indexOf('px')),'#fff'),
                            curDomP_iconSj.style.transform = 'rotate(180deg)'
                    );
                    curDomP_txt && (curDomP_txt.style.color = '#fff');
                    //3.选中项高亮处理/选中项修正标识属性
                    flag && (
                        curDomP.style.backgroundColor = 'rgba(255,255,255,.05)',
                            curDomP.setAttribute('isClick','true'),
                            curDomP_txt.style.color = '#03A9F4'
                    )
                    //4.各展开的项加入标识属性
                    curWrap.setAttribute('isOpen','true');
                    curDomP.setAttribute('isClick','true');
                };
                var curCount = Number(curWrap.getAttribute('count'));
                for(var o=curCount; o>=0; o--){
                    o==curCount ? disposeFn(curWrap,curCount,'cur') : (curWrap = curWrap.parentNode,disposeFn(curWrap,curCount))
                };
            }
        },
        //点击->处理下拉项字体颜色 & 图标
        lg_disposeFontIcon : function(dom,str,count){
            var self = this,doc0 = dom.children[0];
            var tempPDom = dom.querySelector('p'),
                tempPDom_icon = tempPDom.querySelector('.icon'),
                temp_txt = doc0.querySelector('.txt'),
                temp_icon = doc0.querySelector('.icon'),
                tempIcon_sj = doc0.querySelector('.icon_sj');
            var disposeFn = function(shadowCss,boolean,colorVal,degVal,callback){
                //打开时将已打开的合上(0项)
                if(boolean=='true' && count===0){
                    var tempWrapDom2 = ss.getDomAll('[count="0"]');
                    for(var a=0; a<tempWrapDom2.length; a++){
                        var curDomP2 = tempWrapDom2[a].querySelector('p');
                        var curDomP_icon2 = curDomP2.querySelector('.icon'),
                            curDomP_iconSj2 = curDomP2.querySelector('.icon_sj'),
                            curDomP_txt2 = curDomP2.querySelector('.txt');
                        tempWrapDom2[a].style.height = '50px';
                        tempWrapDom2[a].setAttribute('isOpen','false');
                        curDomP_icon2.innerHTML = ss.svgRepository.chart('16','#bdbdbd'),
                        curDomP2.style.boxShadow = 'none';
                        curDomP_iconSj2.style.transform = 'rotate(0deg)';
                        curDomP_txt2.style.color = '#bdbdbd';
                    }
                };
                dom.getAttribute('first') && (shadowCss='rgba(0,0,0,.25) 0 1px 0');//首项的阴影修正
                dom.setAttribute('isOpen',boolean);
                tempPDom_icon && (tempPDom.style.boxShadow = shadowCss,callback&&callback());
                tempPDom.setAttribute('isClick',boolean);
                temp_txt.style.color = colorVal;
                temp_icon && (temp_icon.innerHTML = ss.svgRepository.chart('16',colorVal));
                tempIcon_sj && (
                    tempIcon_sj.innerHTML = ss.svgRepository.arrow_down( temp_icon?'14':'10',colorVal),
                        tempIcon_sj.style.transform = degVal
                )
            };
            str==='true'
                ?
                disposeFn('none','false','#bdbdbd','rotate(0deg)')
                :
                disposeFn('rgba(0,0,0,.25) 0 1px 0, inset rgba(255,255,255,.16) 0 1px 0','true','#ffffff','rotate(180deg)',function(){
                    tempPDom.style.zIndex = 999-count;
                });
        },
        //点击->处理可点击项的高亮
        lg_disposeLight : function(dom){
            var self = this,
                obj = self.sourceObj;
            var itemsDoms = document.querySelectorAll('[type="click"]');
            for(var d=0; d<itemsDoms.length; d++){
                itemsDoms[d].querySelector('span').style.color = '#bdbdbd';
                itemsDoms[d].style.backgroundColor = 'rgb(42, 63, 84)';
                itemsDoms[d].setAttribute('isclick','false');
            }
            dom.querySelector('.txt').style.color = '#03A9F4';
            dom.style.backgroundColor = 'rgba(255,255,255,.05)';
            dom.setAttribute('isclick','true');
            //进行url地址栏hash值跳转
            window.location.href = window.location.origin+window.location.pathname+'#'+dom.getAttribute('txt');
            //点击->tab栏显示
            ss.layoutFnWrap['lg_shwoTtFn'](dom.querySelector('span').innerHTML,dom.getAttribute('txt'),ss.layoutFnWrap['self']);
        },
        //<--- | 容器 | --->
        domWrap:{},
        paraWrap:{},//菜单参数容器
    }
    exports('menu',function(obj){
        return new ss_menu(obj);
    });
})