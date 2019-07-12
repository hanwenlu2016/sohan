ss.imports(['dataTable'],function(exports) {
    var commonUrl = ss.options['commonUrl'];
    //数据表格
    ss.dataTable({
        appendTo:$('#dataCon')[0],//追加元素
        //数据选项
        dataOption:{
            listUrl:commonUrl+'/admin/permission/queryPermissionDataByPage.action',//请求Url
            dataType:"json",
            contentType:"application/json",
            //pageSize:5,//没值时，则默认是根据屏幕高度判断，保证一页
        },
        //搜索栏选项
        searchOption:[
            {name:'权限名称',txt:'permissionName',type:'txt',width:'120px'},
            {name:'权限描述',txt:'remark',type:'txt',width:'180px'},
            //{name:'操作人',txt:'operator',type:'txt',width:'120px'},
        ],
        //搜索栏额外按钮
        searchBtn:{
            //默认
            add:{
                name:'添加权限+',
                colType:'add',
                url:commonUrl+'/admin/permission/addPermission.action',
                dataType:"json",
                contentType:"application/json",
                items:{
                    permissionName:{name:'权限名称', type:'txt',verify:true},
                    permissionCode:{name:'权限编码', type:'txt', verify:true},
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
                showTitle:['permissionName','permissionCode','remark'],
                isChangeTime:['createAt'],//是否进行时间戳转时间
            },
            tlName:['权限名称','权限编码','权限拼音','描述','创建人','创建时间'],//表头名字
            tlTxt:['permissionName','permissionCode','permissionPinyin','remark','createName','createAt'],//表头字段
            //操作项
            operation:[
                //编辑和删除为默认，其它按钮需txt
                {
                    name:'编辑',
                    url:commonUrl+'/admin/permission/updatePermission.action',
                    dataType:"json",
                    contentType:"application/json",
                    data:JSON.stringify({uuid:''}),
                    items:{
                        permissionName:{name:'权限名称', type:'txt',verify:true},
                        permissionCode:{name:'权限编码', type:'txt', verify:true},
                        remark:{name:'描述',type:'txt'}
                    }
                },
                {
                    name:'删除',
                    colType:'del',
                    url:commonUrl+'/admin/permission/delPermissionById.action',
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