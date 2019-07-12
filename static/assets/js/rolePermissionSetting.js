ss.imports(['dataTable'],function(exports) {
    var commonUrl = ss.options['commonUrl'];
    //数据表格
    ss.dataTable({
        appendTo:$('#dataCon')[0],//追加元素
        //数据选项
        dataOption:{
            listUrl:commonUrl+'/admin/rolePermission/queryRolePermissionByPage.action',//请求Url
            dataType:"json",
            contentType:"application/json",
            //pageSize:5,//没值时，则默认是根据屏幕高度判断，保证一页
        },
        //搜索栏选项
        searchOption:[
            {name:'角色名称',txt:'roleName',type:'txt',width:'150px'},
            {name:'权限名称',txt:'permissionName',type:'txt',width:'150px'},
            //{name:'操作人',txt:'operator',type:'txt',width:'120px'},
        ],
        //搜索栏额外按钮
        searchBtn:{
            //默认
            add:{
                name:'添加角色与权限关系+',
                colType:'add',
                url:commonUrl+'/admin/rolePermission/addRolePermissionMap.action',
                dataType:"json",
                contentType:"application/json",
                items:{
                    roleUuid:{name:'角色名称', type:'select',verify:true,
                        data:{
                            url: commonUrl + '/admin/role/findRoleByCondition.action',
                            dataType:"json",
                            rely:{name:'roleName',code:'uuid'},
                            data:{},
                        }},
                    permissionUuid:{name:'权限名称', type:'select',verify:true,
                        data:{
                            url: commonUrl + '/admin/permission/findPermissionByCondition.action',
                            dataType:'json',
                            rely:{name:'permissionName',code:'uuid'},
                            data:{},
                        }}
                }
            }
        },
        //表格内容
        table:{
            //各选项
            options:{
                closeInterlace:true,
                dpWPer:'100%',
                showTitle:['roleName','permissionName','remark'],
                isChangeTime:['createAt'],//是否进行时间戳转时间
            },
            tlName:['角色ID','角色名称','权限ID','权限名称','创建人','创建时间'],//表头名字
            tlTxt:['roleUuid','roleName','permissionUuid','permissionName','createName','createAt'],//表头字段
            //操作项
            operation:[
                //编辑和删除为默认，其它按钮需txt
                {
                    name:'编辑',
                    url:commonUrl+'/admin/rolePermission/updateRolePermissionMap.action',
                    dataType:"json",
                    contentType:"application/json",
                    data:JSON.stringify({uuid:''}),
                    items:{
                        roleUuid:{name:'角色名称', type:'select',verify:true,
                            data:{
                                url: commonUrl + '/admin/role/findRoleByCondition.action',
                                dataType:"json",
                                rely:{name:'roleName',code:'uuid'},
                                data:{},
                            }},
                        permissionUuid:{name:'权限名称', type:'select',verify:true,
                            data:{
                                url: commonUrl + '/admin/permission/findPermissionByCondition.action',
                                dataType:'json',
                                rely:{name:'permissionName',code:'uuid'},
                                data:{},
                            }}
                    }
                },
                {
                    name:'删除',
                    colType:'del',
                    url:commonUrl+'/admin/rolePermission/delRolePermissionMapById.action',
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