ss.imports(['dataTable'],function(exports) {
    var commonUrl = ss.options['commonUrl'];
    //数据表格
    ss.dataTable({
        appendTo:$('#dataCon')[0],//追加元素
        //数据选项
        dataOption:{
            listUrl:commonUrl+'/admin/source/querySourceDataByPage.action',//请求Url
            dataType:"json",
            contentType:"application/json",
            //pageSize:5,//没值时，则默认是根据屏幕高度判断，保证一页
        },
        //搜索栏选项
        searchOption:[
            {name:'资源名称',txt:'sourceName',type:'txt',width:'120px'},
            {name:'资源路径',txt:'sourcePath',type:'txt',width:'180px'},
            {name:'资源描述',txt:'remark',type:'txt',width:'180px'},
            //{name:'操作人',txt:'operator',type:'txt',width:'120px'},
        ],
        //搜索栏额外按钮
        searchBtn:{
            //默认
            add:{
                name:'添加资源+',
                colType:'add',
                url:commonUrl+'/admin/source/addSource.action',
                dataType:"json",
                contentType:"application/json",
                items:{
                    sourceName:{name:'资源名称', type:'txt',verify:true},
                    sourcePath:{name:'资源路径', type:'txt', verify:true},
                    sourceCode:{name:'资源编码', type:'txt', verify:true},
                    remark:{name:'描述',type:'txt'}
                }
            }
        },
        //表格内容
        table:{
            //各选项
            options:{
                closeInterlace:true,
                dpWith:{sourceName:5,sourcePath:25,sourceCode:5,sourcePinyin:5,remark:10,createName:5,createAt:5},
                dpWPer:'120%',
                showTitle:['sourceName','sourcePath','sourceCode','remark'],
                isChangeTime:['createAt'],//是否进行时间戳转时间
            },
            tlName:['资源名称','资源路径','资源编码','资源拼音','描述','创建人','创建时间'],//表头名字
            tlTxt:['sourceName','sourcePath','sourceCode','sourcePinyin','remark','createName','createAt'],//表头字段
            //操作项
            operation:[
                //编辑和删除为默认，其它按钮需txt
                {
                    name:'编辑',
                    url:commonUrl+'/admin/source/updateSource.action',
                    dataType:"json",
                    contentType:"application/json",
                    data:JSON.stringify({uuid:''}),
                    items:{
                        sourceName:{name:'资源名称', type:'txt',verify:true},
                        sourcePath:{name:'资源路径', type:'txt', verify:true},
                        sourceCode:{name:'资源编码', type:'txt', verify:true},
                        remark:{name:'描述',type:'txt'}
                    }
                },
                {
                    name:'删除',
                    colType:'del',
                    url:commonUrl+'/admin/source/delSourceById.action',
                    dataType:"json",
                    contentType:"application/json",
                    data:JSON.stringify({uuid:''}),
                }
            ]
        },
        //分页
        pageOption:{
            //各选项
        }
    })

})