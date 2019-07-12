ss.define(function(exports){

    function ss_layout(obj){
        this.sourceObj = obj;
        this.init();//初始化
    };
    ss_layout.prototype = {
        constructor:ss_layout,
        //初始化
        init:function(){
            this.rd_layoutFn();//布局
            this.lg_saveTxtFn();//点击字段存储
            this.theEndFn();
        },
        //theEnd
        theEndFn:function(){
            var bodyDom = ss.getDom('body');
            //处理body样式
            ss.mdfCssAttr(bodyDom,{
                cn:['width','height','overflow'],
                cv:['100%','hidden']
            });
            bodyDom.appendChild(this.domWrap.ly_Containter);//追加到文档
            ss.layoutFnWrap['lg_clearStatuFn'] = this.lg_clearStatuFn;
            ss.layoutFnWrap['lg_shwoTtFn'] = this.lg_shwoTtFn;
            ss.layoutFnWrap['self'] = this;
        },
        domWrap:{},//layout容器
        tabTitleWrap:[],//tab标题存储
        tabDomWrap:{},//tabDom存储
        //布局
        rd_layoutFn:function(){
            var self = this,
                obj = self.sourceObj,
                tempContainer = document.createDocumentFragment();
            //样式控制
            var lw = obj.ctlCss ? (obj.ctlCss.lw||250) : 250,
                th = obj.ctlCss ? (obj.ctlCss.th || 60) : 60,
                openItemH = obj.ctlCss ? (obj.ctlCss.openItemH||70) : 70;
            var ly_Containter = ss.crtDom('div','ly_Containter','',tempContainer,{
                cn:['width','height','paddingLeft','position'],
                cv:['100%','100%',lw+'px','relative']
            })
                .appendDom([
                    //左侧
                    ss.crtDom('div','','','',{
                        cn:['width','height','backgroundColor','position','top','left'],
                        cv:[lw+'px',ss.paraWrap.clhx,'#fff','absolute','0px','0px']
                    })
                        .appendDom([
                            ss.crtDom('div','','','',{
                                cn:['height','lineHeight','backgroundColor'],
                                cv:[th+'px',th+'px','#4877e8']
                            }).appendDom([
                                    ss.crtDom('img','','','',{
                                        cn:['width','height','marginTop','marginLeft'],
                                        cv:['40px','40px','10px','20px'],
                                        an:['src'],
                                        av:['../assets/images/ss_login.png']
                                    })
                                    ,
                                    ss.crtDom('img','','','',{
                                        cn:['width','height','verticalAlign','marginLeft','marginTop'],
                                        cv:['20px','20px','middle','150px','-30px'],
                                        an:['src'],
                                        av:['/static/assets/images/shrinkIcon.png']
                                    })
                                ])
                            ,
                            ss.crtDom('div','','','',{
                                cn:['border','borderTop','borderLeft','height','position'],
                                cv:['1px solid #dee4f1','none','none',openItemH+'px','relative']
                            })
                                .appendDom([
                                    ss.crtDom('img','','','',{
                                        cn:['width','height','marginTop','marginLeft','borderRadius'],
                                        cv:['50px','50px','10px','20px','25px'],
                                        an:['src'],
                                        av:['/static/assets/images/pic.jpg']
                                    })
                                    ,
                                    ss.crtDom('div','','','',{
                                        cn:['position','width','height','top','right','paddingTop'],
                                        cv:['absolute','160px','100%','0px','0px','15px']
                                    })
                                        .appendDom([
                                            ss.crtDom('p','','星爷','',{
                                                cn:['color','fontSize'],
                                                cv:['#545b6d','16px']
                                            })
                                            ,
                                            ss.crtDom('p','','超级管理员','',{
                                                cn:['color','fontSize'],
                                                cv:['#545b6d','13px']
                                            })
                                        ])

                                    ])
                            ,
                            ss.crtDom('div','ly_menu','','',{
                                cn:['width','height'],
                                cv:['100%',ss.paraWrap.clh-th-openItemH+'px']
                            })
                        ])
                    ,
                    //内容
                    ss.crtDom('div','ly_content','','',{
                        cn:['height','width'],
                        cv:[ss.paraWrap.clhx,'100%']
                    })
                        .appendDom([
                            //内容_header头部
                            ss.crtDom('div','ly_header','','',{
                                cn:['width','height','textAlign','padding','lineHeight','backgroundColor'],
                                cv:['100%',th+'px','right','0px 15px',th+'px','#5a8bff']
                            })
                                .appendDom(function(dom){
                                    ss.crtDom('div','','硕软公共管理平台',dom,{
                                        cn:['width','display','verticalAlign','textAlign','paddingLeft','fontSize','color'],
                                        cv:['50%','inline-block','top','left','15px','16px','#fff']
                                    }),
                                    ss.crtDom('div','','退出',dom,{
                                        cn:['fontSize','color','cursor','display','width','verticalAlign'],
                                        cv:['14px','#fff','pointer','inline-block','50%','top']
                                    })
                                }),
                            //内容_tab标题
                            ss.crtDom('div','ly_tabTitle','','',{
                                cn:['height','backgroundColor','borderBottom','position','zIndex','paddingLeft'],
                                cv:[openItemH+'px','#fff','none','relative',999,'80px']
                            })
                                .appendDom([
                                    ss.crtDom('span','curOption','首页','',{
                                        cn:['fontSize','position','bottom','left','color'],
                                        cv:['16px','absolute','-35px','20px','#222']
                                    })
                                ]),
                            //内容_ssView
                            ss.crtDom('div','ly_ssView','','',{
                                cn:['height','backgroundColor','padding','overflowX','overflowY'],
                                cv:[ss.paraWrap.clh-th-openItemH+'px','#f0f3fa','50px 20px 20px 20px','hidden','auto']
                            })
                        ])
                ]);
            //dom存储
            self.domWrap['ly_Containter'] = ly_Containter;
            self.domWrap['ly_menu'] = ss.getDom('.ly_menu',ly_Containter);
            ss.domWrap['ly_menu'] = ss.getDom('.ly_menu',ly_Containter);
            self.domWrap['ly_content'] = ss.getDom('.ly_content',ly_Containter);
            self.domWrap['ly_header'] = ss.getDom('.ly_header',ly_Containter);
            self.domWrap['ly_tabTitle'] = ss.getDom('.ly_tabTitle',ly_Containter);
            self.domWrap['ly_ssView'] = ss.getDom('.ly_ssView',ly_Containter);
            ss.domWrap['ly_ssView'] = ss.getDom('.ly_ssView',ly_Containter);
        },

        //点击字段存储
        lg_saveTxtFn:function(){
            var menuData = ss.options.menuData || ss.error('未配置菜单数据！'),
                tempData = [];
            var recursionParaFn = function(menuData){
                if(menuData.length!=0){
                    for(var a=0; a<menuData.length; a++){
                        tempData.push(menuData[a].txt);
                    }
                }
            };
            recursionParaFn(menuData);
            ss.options['clickTxts'] = tempData.concat('home');
        },

    };

    exports('pm_layout',function(obj){
        return new ss_layout(obj);
    });
})