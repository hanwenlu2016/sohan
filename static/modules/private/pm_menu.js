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
            this.rd_itemsFn();
            this.theEndFn();
        },
        //theEnd
        theEndFn: function () {
            var self = this,
                obj = self.sourceObj;
            ss.domWrap['ly_menu'].appendChild(this.domWrap.mn_Container);//追加到文档
        },
        //<--- | 渲染 | --->
        //渲染容器
        rd_menuWrap:function(){
            var self = this,
                obj = self.sourceObj,
                tempContainer = document.createDocumentFragment();
            //整个导航条的容器
            var mn_Container = ss.crtDom('div','mn_Container','',tempContainer,{
                cn:['width','height','backgroundColor','marginTop','overflowX','overflowY','position','paddingTop'],
                cv:['100%','100%','#fff','0px','hidden','auto','relative','5px']
            });
            self.domWrap['mn_Container'] = mn_Container;
        },
        //渲染各项
        rd_itemsFn:function(){
            var self = this,obj = this.sourceObj;
            var menuDatas = ss.options.menuData;
            //图标地址
            var iconUrls = {
                home:{
                    select:'/static/assets/images/home_select.png',unselect:'/static/assets/images/home_unselect.png'
                },
                product:{
                    select:'/static/assets/images/pm_select.png',unselect:'/static/assets/images/pm_unselect.png'
                },
                pay:{
                    select:'/static/assets/images/pay_select.png',unselect:'/static/assets/images/pay_unselect.png'
                },
                operation:{
                    select:'/static/assets/images/or_select.png',unselect:'/static/assets/images/or_unselect.png'
                },
            };
            for(var a=0; a<menuDatas.length; a++){
                ss.crtDom('div','',menuDatas[a].leader,self.domWrap['mn_Container'],{
                    cn:['height','width','backgroundColor','lineHeight','color','margin','borderRadius','paddingLeft','marginTop','fontSize','position'],
                    cv:['40px','85%','#f0f3fa','40px','#535c6c','0 auto','20px','40px','10px','14px','relative']
                })
                    .appendDom([
                        ss.crtDom('img','','','',{
                            cn:['width','position','left','top'],
                            cv:['16px','absolute','15px','13px'],
                            an:['src'],
                            av:[iconUrls[menuDatas[a].txt].unselect]
                        })
                    ])
            }
        },
        //dom存储
        domWrap:{},
    }
    exports('pm_menu',function(obj){
        return new ss_menu(obj);
    });
})