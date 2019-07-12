ss.imports(['dataTable'],function(exports) {
    var commonUrl = ss.options['commonUrl'];
    //数据表格
    ss.dataTable({
        appendTo:$('#dataCon')[0],//追加元素
        //数据选项
        dataOption:{
            listUrl:commonUrl+'/admin/user/queryLoginInfoByPage.action',//请求Url
            dataType:"json",
            contentType:"application/json",
            //pageSize:5,//没值时，则默认是根据屏幕高度判断，保证一页
        },
        //搜索栏选项
        searchOption:[
            {name:'登陆名',txt:'loginName',type:'txt',width:'120px'},
            {name:'用户名称',txt:'loginNickName',type:'txt',width:'120px'},
            //{name:'操作人',txt:'operator',type:'txt',width:'120px'},
        ],
        //搜索栏额外按钮
        searchBtn:{
            //默认
            add:{
                name:'添加用户+',
                colType:'add',
                url:commonUrl+'/admin/user/addLoginInfo.action',
                dataType:"json",
                contentType:"application/json",
                items:{
                    loginName:{name:'登陆名', type:'txt',verify:true},
                    loginNickName:{name:'用户名称', type:'txt', verify:true},
                    loginCode:{name:'用户编码', type:'txt', verify:true},
                    remark:{name:'描述',type:'txt'},
                    loginPass:{name:'密码', type:'txt', verify:true},
                }
            }
        },
        //表格内容
        table:{
            //各选项
            options:{
                closeInterlace:true,
                dpWPer:'100%',
                showTitle:['loginName','loginNickName','remark'],
                isChangeTime:['createAt'],//是否进行时间戳转时间
            },
            tlName:['用户ID','登陆名','用户名称','描述','创建人','创建时间'],//表头名字
            tlTxt:['uuid','loginName','loginNickName','remark','createName','createAt'],//表头字段
            //操作项
            operation:[
                //编辑和删除为默认，其它按钮需txt
                {
                    name:'编辑',
                    url:commonUrl+'/admin/user/updateLoginInfo.action',
                    dataType:"json",
                    contentType:"application/json",
                    data:JSON.stringify({uuid:''}),
                    items:{
                        loginName:{name:'登陆名', type:'txt',verify:true},
                        loginNickName:{name:'用户名称', type:'txt', verify:true},
                        loginCode:{name:'用户编码', type:'txt', verify:true},
                        remark:{name:'描述',type:'txt'}
                    }
                },
                {
                    name:'删除',
                    colType:'del',
                    url:commonUrl+'/admin/user/delLoginInfoById.action',
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