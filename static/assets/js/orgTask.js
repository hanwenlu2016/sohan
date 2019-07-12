ss.imports(['dataTable'],function(exports) {
    var commonUrl = ss.options['commonUrl'];
    //数据表格
    ss.dataTable({
        appendTo:$('#dataCon')[0],//追加元素
        //数据选项
        dataOption:{
            listUrl:commonUrl+'/admin/org/queryTaskByPage.action',//请求Url 
            type:'post',//默认post请求
            dataType:'json'
            //data:JSON.stringify({uuid:'',applyName:'',status:'',createTime:''}),
            //pageSize:5,//没值时，则默认是根据屏幕高度判断，保证一页
        },
        //搜索栏选项
        searchOption:[
//            {
//				name: '搜索供应商',
//				txt: 'provider',
//				type: 'select',
//				width: '120px',
//				data:{
//					url:commonUrl+'/admin/org/queryTaskByPage.action',
//	                dataType:'json',
//	                rely:{name:'userName',code:'id'},
//           		digitalModel:{
//           			data:{
//           				location:['data']
//           			} 
//           		}
//				}
//			},
			{name:'任务名',txt:'taskName',type:'txt',width:'120px'}
        ],
        //搜索栏额外按钮
        searchBtn:{
            //默认
            add:{
                name:'添加任务+',
                dataType:'json',
                colType:'add',
                url:commonUrl+'/admin/org/addTask.action',
                items:{
                	taskName:{name:'任务名', type:'txt', verify:true},
                    robotUuid:{
                    	name:'机器人',
                    	type:'select',
                    	data:{
                        	url:commonUrl+ '/admin/org/getRobotList.action',
                        	dataType:'json',
                        	data:{},
                     		rely:{name:'robotName',code:'uuid'},
                     		digitalModel:{
                     			data:{
                     				location:['data']
                     			} 
                     		}
                    	}
                    },
                    flowUuid:{
                        name:'流程名称',
                        type:'select',
                        data:{
                            url:commonUrl+ '/admin/flow/getFlowNameList.action',
                            dataType:'json',
                            data:{},
                            rely:{name:'flowName',code:'flowUuid'},
                            digitalModel:{
                                data:{
                                    location:['data']
                                }
                            }
                        }
                    },
                    phone:{name:'电话号码', type:'txt', verify:true},
                    canBreak:{
                        name:'任务可打断',
                        type: 'select',
                        data: [{
                            name: "否",
                            code: '0'
                        }, {
                            name: "是",
                            code: '1'
                        }
						],
						verify:true
                    }
                    //callTime:{name:'拨打时间', type:'time', verify:true}
                }
            }
        },
        //表格内容
        table:{
            //各选项
            options:{
                dpWith:{callTime:9,phone:6,callStatus:6},
                //isChangeTime:['startDate','endDate','createDate'],//是否进行时间戳转时间
                showTitle:['robotName','taskName','flowName'],
                isChangeTime:['callTime'],//是否进行时间戳转时间
				shim: {
                    callStatus: {
                        '-1': '新建',
                        '0': '等待',
                        '1': '拨打中',
                        '2': '通话中',
                        '3': '已挂断',
                        '4': '通话挂断',
						'5': '未接通'
                    },
					canBreak: {
                        '0': '否',
                        '1': '是'
                    }
				}
            },
            tlName:['任务名','机器人','流程名称','可打断','电话号码','状态','拨打时间','拨打次数'],//表头名字
            tlTxt:['taskName','robotName','flowName','canBreak','phone','callStatus','callTime','callCount'],//表头字段
            //操作项
            operation:[
                //编辑和删除为默认，其它按钮需txt
                {
                    name:'编辑',
                    url:commonUrl+'/admin/org/updateTask.action',
                    dataType:'json',
                    items:{
	                	taskName:{name:'任务名', type:'txt', verify:true},
	                    robotUuid:{
	                    	name:'机器人',
	                    	type:'select',
	                    	data:{
	                        	url:commonUrl+ '/admin/org/getRobotList.action',
	                        	dataType:'json',
	                        	data:{},
	                     		rely:{name:'robotName',code:'uuid'},
	                     		digitalModel:{
	                     			data:{
	                     				location:['data']
	                     			}
	                     		}
	                    	}
	                    },
	                    phone:{name:'电话号码', type:'txt', verify:true},
                        flowUuid:{
                            name:'流程名称',
                            type:'select',
                            data:{
                                url:commonUrl+ '/admin/flow/getFlowNameList.action',
                                dataType:'json',
                                data:{},
                                rely:{name:'flowName',code:'flowUuid'},
                                digitalModel:{
                                    data:{
                                        location:['data']
                                    }
                                }
                            }
                        },
						canBreak:{
                        name:'任务可打断',
                        type: 'select',
                        data: [{
                            name: "否",
                            code: '0'
							}, {
								name: "是",
								code: '1'
							}
						]
						}
                    },
                  data:{uuid:''},
                },
                {
                    name:'删除',
                    colType:'del',
                    dataType:'json',
                    url:commonUrl+'/admin/org/delTaskByUUID.action',                    
                    data:{uuid:''}
                },
            	{
                    name:'拨打',
                    colType:'opt2',
                    //rely:{isExcellent:'1'},
                    cbFn:function(curData,self){
                		//curData.isExcellent =0;
                		//console.log(curData);
			            var fqObj = {
                			url:commonUrl+'/admin/org/dialing.action',
                			data:curData,
                			type:'POST',
			            };
			            self.eAjax(
			                fqObj, {
			                success:function(data){
			                	layer.msg('拨打电话已发出！', {time: 700}); 
			                },
			                isJson:true
			            });
                    }
                }    
                
                
            ]
        },
       //分页
        pageOption:{
            //各选项
        }
    })

})