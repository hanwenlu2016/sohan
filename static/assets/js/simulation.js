ss.imports(['dataTable'], function(exports) {

	var commonUrl = ss.options['commonUrl'];
	//数据表格
	ss.dataTable({
		appendTo: $('#dataCon')[0], //追加元素
		//数据选项
		dataOption: {
			listUrl: commonUrl + '/admin/question/querySimulation.action', //请求Url 
			type: 'post', //默认post请求
			dataType: 'json',
			//data:JSON.stringify({uuid:'',applyName:'',status:'',createTime:''}),
			//pageSize:5,//没值时，则默认是根据屏幕高度判断，保证一页
		},
		//搜索栏选项
		searchOption: [{
				name: '对方提问、回答内容',
				txt: 'perAnswer',
				type: 'txt',
				width: '300px'
			},
			{
				name: '全部',
				txt: 'flowUuid',
				code: 0,
				type: 'select',
				width: '200px',
				data: {
					url: commonUrl + '/admin/flow/getFlowNameList.action',
					data: {},
					dataType: 'json',
					rely: {
						name: 'flowName',
						code: 'flowUuid'
					},
					digitalModel: {
						data: {
							location: ['data']
						}
					}
				}
			},
		],
		//搜索栏额外按钮
		searchBtn: { //默认
//			add: {
//				name: '添加+',
//				dataType: 'json',
//				colType: 'add',
//				url: commonUrl + '/admin/question/addQuestion.action',
//				items: {
//					flowUuid: {
//						name: '流程名称',
//						type: 'select',
//						data: {
//							url: commonUrl + '/admin/flow/getFlowNameList.action',
//							dataType: 'json',
//							data: {},
//							rely: {
//								name: 'flowName',
//								code: 'flowUuid'
//							},
//							digitalModel: {
//								data: {
//									location: ['data']
//								}
//							}
//						}
//					},
//					perAnswer: {
//						name: '对方提问',
//						type: 'area',
//						verify: true
//					},
//					recordContent: {
//						name: '回答内容',
//						type: 'area',
//						verify: true
//					},
//					recordPath: {
//						name: '录音路径',
//						type: '_upload',
//						verify: true
//					}
//					//callTime:{name:'拨打时间', type:'time', verify:true}
//				}
//			}
		},
		//表格内容
		table: {
			//各选项
			options: {
				urlData: {
					flowUuid: {
						url: commonUrl + '/admin/flow/getFlowNameList.action',
						dataType: 'json',
						data: {
							pageSize: 1000000,
						},
						rely: {
							name: 'flowName',
							code: 'flowUuid'
						},
						digitalModel: {
							data: {
								location: ['data']
							}
						}
					},
				},
				dpWith: {
					flowUuid: 6,

				},
//				showTitle: ['perAnswer', 'recordContent'],
//				//isChangeTime:['startDate','endDate','createDate'],//是否进行时间戳转时间
//				isChangeTime: ['createTime'], //是否进行时间戳转时间
			},
			tlName: ['流程名称', '提问', '回答内容'], //表头名字
			tlTxt: ['flowUuid', 'perAnswer', 'recordContent'], //表头字段
			//操作项
			operation: [
//				//编辑和删除为默认，其它按钮需txt
//				{
//					name: '编辑',
//					url: commonUrl + '/admin/question/updateQuestion.action',
//					dataType: 'json',
//					items: {
//						flowUuid: {
//							name: '流程名称',
//							type: 'select',
//							data: {
//								url: commonUrl + '/admin/flow/getFlowNameList.action',
//								dataType: 'json',
//								data: {},
//								rely: {
//									name: 'flowName',
//									code: 'flowUuid'
//								},
//								digitalModel: {
//									data: {
//										location: ['data']
//									}
//								}
//							}
//						},
//						perAnswer: {
//							name: '对方提问',
//							type: 'textarea',
//							verify: true
//						},
//						recordContent: {
//							name: '回答内容',
//							type: 'textarea',
//							verify: true
//						},
//						recordPath: {
//							name: '录音路径',
//							type: '_upload',
//							verify: true
//						},
//					},
//					data: {
//						uuid: '',
//						recordUuid: ''
//					},
//				},
//				{
//					name: '删除',
//					colType: 'del',
//					url: commonUrl + '/admin/question/deleteQuestion.action',
//					dataType: "json",
//					contentType: "application/json",
//					data: JSON.stringify({
//						uuid: ''
//					}),
//				}
			]
		},
		//分页
		pageOption: {
			//各选项
		}
	})

})