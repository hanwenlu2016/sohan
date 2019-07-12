ss.imports(['dataTable'],function(exports) {
    var commonUrl = ss.options['commonUrl'];
    //数据表格
    ss.dataTable({
        appendTo:$('#dataCon')[0],//追加元素
        //数据选项
        dataOption:{
            listUrl:commonUrl +'/admin/calllog/statisticsCallByPage.action', //请求Url
            type:'post',//默认post请求
            dataType:'json'
            //data:JSON.stringify({uuid:'',applyName:'',status:'',createTime:''}),
            //pageSize:5,//没值时，则默认是根据屏幕高度判断，保证一页
        },
        //搜索栏选项
    searchOption: [
    {
        name: '开始时间',
        txt: 'startTime',
        type: 'date',
        width: '120px',
        isLine: true,
        value : ss.dpDate.getDay(-30) 
      },
      {
        name: '结束时间',
        txt: 'endTime',
        type: 'date',
        width: '120px',
        value : ss.dpDate.getDay(0) 
      },
    ],
        //搜索栏额外按钮
        searchBtn:{
            //默认
        },
        //表格内容
        table:{
            //各选项
            options:{
				cbFn:function(self){
					var curTbCWrapDom = self['domWrap']['tbCWrap'];

					//console.log(self);					
				}
            },
			      tlName: ['日期', '呼叫总数', '接通数', '接通率%', '通话总时长/s', '扣费时长/s', '平均通话时长/s'], //表头名字
			      tlTxt: ['groupdate', 'totalcall', 'conncall', 'connrate', 'totaltime', 'feetotoaltime', 'avgtotalcall'], //表头字段
            //操作项
            operation:[
                //编辑和删除为默认，其它按钮需txt       
                
            ]
        },
       //分页
        pageOption:{
            //各选项
        }
    })
    
	

})