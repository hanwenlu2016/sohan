ss.define(function(exports){
    //ajaxHtml
    var ajaxHtml = function(htmlName,callback){
        var xhr=new XMLHttpRequest();
        xhr.open("GET",ss.options.htmlSrc+htmlName+'.html',true);
        xhr.send();
        xhr.onreadystatechange=function(){
            xhr.status==200 && xhr.readyState==4 && callback(xhr.responseText,htmlName);
        }
    };
    //disposeJs
    var disposeJs = function(htmlName){
        ss.imports(htmlName,'jsModules');
    };
    function ss_router(obj){
        var hashStr;
        var tempFn = function(){
            if(location.hash){
                //存在hash值
                var tempStr = location.hash.slice(1);
                ss.options['clickTxts'].indexOf(tempStr)!=-1 ? (hashStr = tempStr) : (hashStr = 'home');
                //调试
                if(tempStr=='Option01_1'){
                    ss.options['clickTxts'].indexOf(tempStr)!=-1 ? (hashStr = tempStr) : (hashStr = 'home');
                }
            }
            else{
                hashStr = 'home';
            }
            ajaxHtml(hashStr,function(htmlTxt,htmlName){
                //html页面追加完成->进行该页面对应的js加载
                ss.domWrap['ly_ssView'].innerHTML = htmlTxt;
                disposeJs(htmlName);
            });
        }
        tempFn();
        document.body.onhashchange =function(){
            tempFn();
        };
    };
    exports('router',function(obj){
        return ss_router(obj);
    })
})



















