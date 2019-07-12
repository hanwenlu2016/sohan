ss.define(function(exports){
    var c3Loading = {
        show:function(){
            this.shade();
            this.con();
        },
        hidden:function(){
            var shadeDom = document.querySelector('.c3Loading_shade');
            var conDom = document.querySelector('.sk-circle');
            shadeDom.parentNode.removeChild(shadeDom);
            conDom.parentNode.removeChild(conDom);
        },
        //遮罩层dom
        shade:function(){
            //bodyDom
            var bodyDom = document.getElementsByTagName('body')[0];
            //屏幕长宽
            var clientW = document.documentElement.clientWidth,
                clientH = document.documentElement.clientHeight;
            //创建dom
            var shadeDom = document.createElement('div'),
                shadeDomCss = {
                    cssName:['width','height','position','top','left','opacity','zIndex','display'],
                    cssValue:[clientW+'px',clientH+'px','fixed','0px','0px',.3,1303,'block']
                };
            shadeDom.className = 'c3Loading_shade';
            this.modifyCss(shadeDom,shadeDomCss);
            bodyDom.appendChild(shadeDom);
        },
        //缓冲的内容
        con:function(){
            this.createDom('div','sk-circle','',document.getElementsByTagName('body')[0],{
                cssName:['zIndex'],
                cssValue:[13004]
            }).appendDom([
                this.createDom('div','sk-circle1 sk-child','','',{}),
                this.createDom('div','sk-circle2 sk-child','','',{}),
                this.createDom('div','sk-circle3 sk-child','','',{}),
                this.createDom('div','sk-circle4 sk-child','','',{}),
                this.createDom('div','sk-circle5 sk-child','','',{}),
                this.createDom('div','sk-circle6 sk-child','','',{}),
                this.createDom('div','sk-circle7 sk-child','','',{}),
                this.createDom('div','sk-circle8 sk-child','','',{}),
                this.createDom('div','sk-circle9 sk-child','','',{}),
                this.createDom('div','sk-circle10 sk-child','','',{}),
                this.createDom('div','sk-circle11 sk-child','','',{}),
                this.createDom('div','sk-circle12 sk-child','','',{}),
            ])
        },
        //commonTool->创建元素
        createDom: function (domName, className, txt, fatherDom, cssObj, arr) {
            var tempDom = document.createElement(domName);
            if (className) {
                tempDom.className = className;
            }
            if (txt) {
                tempDom.innerHTML = txt;
            }
            if (cssObj) {
                this.modifyCss(tempDom, cssObj);
            }
            if (fatherDom) {
                fatherDom.appendChild(tempDom);
            }
            if(arr){
                tempDom.addEventListener(arr[0], function(){
                    arr[1](tempDom);
                });
                if(arr[2]){
                    tempDom.addEventListener(arr[2], function(){
                        arr[3](tempDom);
                    });
                }
                if(arr[4]){
                    tempDom.addEventListener(arr[4], function(){
                        arr[5](tempDom);
                    });
                }

            }
            tempDom.appendDom = function () {
                arguments[0].forEach(function (v) {
                    tempDom.appendChild(v);
                })
                return tempDom;
            };
            return tempDom;
        },
        //commonTool->处理dom伪数组
        modifyCss : function(dom,cssObj){
            if(cssObj.cssName){
                cssObj.cssName.forEach(function(v,i){
                    dom.style[v] = cssObj.cssValue[i];
                });
            }
            if(cssObj.scssName){
                cssObj.scssName.forEach(function(v,i){
                    dom.setAttribute(v,cssObj.scssValue[i]);
                });
            }
        },

    }

    exports('c3Loading',c3Loading);
})