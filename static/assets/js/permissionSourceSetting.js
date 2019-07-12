ss.imports(['dataTable'],function(exports) {
    var commonUrl = ss.options['commonUrl'];
    //数据表格
    ss.dataTable({
        appendTo:$('#dataCon')[0],//追加元素
        //数据选项
        dataOption:{
            listUrl:commonUrl+'/admin/permissionSource/queryPermissionSourceByPage.action',//请求Url
            dataType:"json",
            contentType:"application/json",
            //pageSize:5,//没值时，则默认是根据屏幕高度判断，保证一页
        },
        //搜索栏选项
        searchOption:[
            {name:'权限名称',txt:'permissionName',type:'txt',width:'150px'},
            {name:'资源名称',txt:'sourceName',type:'txt',width:'150px'},
            //{name:'操作人',txt:'operator',type:'txt',width:'120px'},
        ],
        //搜索栏额外按钮
        searchBtn:{
            //默认
            add:{
                name:'添加权限与资源关系+',
                colType:'add',
                url:commonUrl+'/admin/permissionSource/addPermissionSourceMap.action',
                dataType:'json',
                contentType:"application/json",
                items:{
                    permissionUuid:{name:'权限名称', type:'select',verify:true,
                        data:{
                            url: commonUrl + '/admin/permission/findPermissionByCondition.action',
                            dataType:'json',
                            rely:{name:'permissionName',code:'uuid'},
                            data:{},
                        }},
                    sourceUuid:{name:'资源名称', type:'select', verify:true,
                        data:{
                            url: commonUrl + '/admin/source/findSourceByCondition.action',
                            dataType:"json",
                            rely:{name:'sourceName',code:'uuid'},
                            contentType:"application/json",
                            data:{},
                        }},
                }
            }
        },
        //表格内容
        table:{
            //各选项
            options:{
                closeInterlace:true,
                dpWPer:'130%',
                showTitle:['permissionName','sourceName','sourcePath','remark'],
                isChangeTime:['createAt'],//是否进行时间戳转时间
            },
            tlName:['权限ID','权限名称','资源ID','资源名称','资源路径','创建人','创建时间'],//表头名字
            tlTxt:['permissionUuid','permissionName','sourceUuid','sourceName','sourcePath','createName','createAt'],//表头字段
            //操作项
            operation:[
                //编辑和删除为默认，其它按钮需txt
                {
                    name:'编辑',
                    url:commonUrl+'/admin/permissionSource/updatePermissionSourceMap.action',
                    dataType:"json",
                    contentType:"application/json",
                    data:JSON.stringify({uuid:''}),
                    items:{
                        permissionUuid:{name:'权限名称', type:'select',verify:true,
                            data:{
                                url: commonUrl + '/admin/permission/findPermissionByCondition.action',
                                dataType:'json',
                                rely:{name:'permissionName',code:'uuid'},
                                data:{},
                            }},
                        sourceUuid:{name:'资源名称', type:'select', verify:true,
                            data:{
                                url: commonUrl + '/admin/source/findSourceByCondition.action',
                                dataType:"json",
                                rely:{name:'sourceName',code:'uuid'},
                                contentType:"application/json",
                                data:{},
                            }},
                    }
                },
                {
                    name:'删除',
                    colType:'del',
                    url:commonUrl+'/admin/permissionSource/delPermissionSourceMapById.action',
                    dataType:"json",
                    contentType:"application/json",
                    data:JSON.stringify({uuid:''}),
                },

            ]
        },
        //分页
        pageOption:{
            //各选项
        }
    })

})