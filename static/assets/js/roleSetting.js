ss.imports(['dataTable'],function(exports) {
    var commonUrl = ss.options['commonUrl'];
    //数据表格
    ss.dataTable({
        appendTo:$('#dataCon')[0],//追加元素
        //数据选项
        dataOption:{
            listUrl:commonUrl+'/admin/role/queryRoleByPage.action',//请求Url
            dataType:"json",
            contentType:"application/json",
            //pageSize:5,//没值时，则默认是根据屏幕高度判断，保证一页
        },
        //搜索栏选项
        searchOption:[
            {name:'角色名称',txt:'roleName',type:'txt',width:'120px'},
            {name:'描述',txt:'remark',type:'txt',width:'180px'},
            //{name:'操作人',txt:'operator',type:'txt',width:'120px'},
        ],
        //搜索栏额外按钮
        searchBtn:{
            //默认
            add:{
                name:'添加角色+',
                colType:'add',
                url:commonUrl+'/admin/role/addRole.action',
                dataType:"json",
                contentType:"application/json",
                items:{
                    roleName:{name:'角色名称', type:'txt',verify:true},
                    roleCode:{name:'角色编码', type:'txt', verify:true},
                    remark:{name:'描述',type:'txt'}
                }
            }
        },
        //表格内容
        table:{
            //各选项
            options:{
                closeInterlace:true,
                dpWPer:'100%',
                showTitle:['roleName','roleCode','remark'],
                isChangeTime:['createAt'],//是否进行时间戳转时间
            },
            tlName:['角色名称','角色编码','角色拼音','描述','创建人','创建时间'],//表头名字
            tlTxt:['roleName','roleCode','rolePinyin','remark','createName','createAt'],//表头字段
            //操作项
            operation:[
                //编辑和删除为默认，其它按钮需txt
                {
                    name:'编辑',
                    url:commonUrl+'/admin/role/updateRole.action',
                    dataType:"json",
                    contentType:"application/json",
                    data:JSON.stringify({uuid:''}),
                    items:{
                        roleName:{name:'角色名称', type:'txt',verify:true},
                        roleCode:{name:'角色编码', type:'txt', verify:true},
                        remark:{name:'描述',type:'txt'}
                    }
                },
                {
                    name:'删除',
                    colType:'del',
                    url:commonUrl+'/admin/role/delRoleById.action',
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