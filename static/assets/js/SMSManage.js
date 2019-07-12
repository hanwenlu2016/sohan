ss.imports(['dataTable'], function(exports) {
	var commonUrl = ss.options['commonUrl'];
	//数据表格
	ss.dataTable({
		appendTo: $('#dataCon')[0], //追加元素
		//数据选项
		dataOption: {
			listUrl: commonUrl + '/admin/TSmsManege/queryByPageInfo.action', //请求Url 
			type: 'post', //默认post请求
			dataType: 'json'
			//data:JSON.stringify({uuid:'',applyName:'',status:'',createTime:''}),
			//pageSize:5,//没值时，则默认是根据屏幕高度判断，保证一页
		},
		//搜索栏选项
		searchOption: [{
				name: '模板名称',
				txt: 'templateName',
				type: 'txt',
				width: '150px'
			},
			{
				name: '全部',
				txt: 'flowUuid',
				code: 0,
				type: 'select',
				width: '120px',
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
			add: {
				name: '添加+',
				dataType: 'json',
				colType: 'add',
				url: commonUrl + '/admin/TSmsManege/addEntity.action',
				items: {
					templateName: {
						name: '模板名称',
						type: 'txt',
						verify: true
					},
					flowUuid: {
						name: '流程名称',
						type: 'select',
						verify: true,
						data: {
							url: commonUrl + '/admin/flow/getFlowNameList.action',
							dataType: 'json',
							data: {},
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
					smsContent: {
						name: '短信内容',
						type: 'area',
						verify: true
					},
					status: {
						name: '可用状态',
						type: 'select',
						verify: true,
						data: [{
							name: "可用",
							code: '1'
						}, {
							name: "不可用",
							code: '0'
						}]
					},
					remarks: {
						name: '备注',
						type: 'area'
					}
					//callTime:{name:'拨打时间', type:'time', verify:true}
				}
			}
		},
		//表格内容
		table: {
			//各选项
			options: {
				dpWith: {
					templateName: 6,
					flowUuid: 8,
					createAuthor: 4,
					smsContent :6,
					status : 3,
				},
				
				showCon:['smsContent','remarks'],
				showTitle:['smsContent','remarks'],
				isChangeTime: ['creatTime', 'updateTime'], //是否进行时间戳转时间
				shim: {
					status: {
						'0': '不可用',
						'1': '可用'
					}
				},
				urlData: {
					flowUuid: {
						url: commonUrl + '/admin/flow/getFlowNameList.action',
						dataType: 'json',
						data: {},
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
					createAuthor: {
						name: '创建人',
						url: commonUrl + '/admin/user/findUserByCondition.action',
						data: {},
						dataType: 'json',
						rely: {
							name: 'loginNickName',
							code: 'uuid'
						},
						digitalModel: {
							data: {
								location: ['data']
							}
						}
					},
				},
			},
			tlName: ['模板名称', '流程名称', '短信内容', '状态', '创建人', '创建时间', '更新时间', '备注'], //表头名字
			tlTxt: ['templateName', 'flowUuid', 'smsContent', 'status', 'createAuthor', 'creatTime', 'updateTime', 'remarks'], //表头字段
			//操作项
			operation: [
				//编辑和删除为默认，其它按钮需txt
				{
					name: '编辑',
					url: commonUrl + '/admin/TSmsManege/editEntity.action',
					dataType: 'json',
					items: {
						templateName: {
							name: '模板名称',
							type: 'txt',
							verify: true
						},
						flowUuid: {
							name: '流程名称',
							type: 'select',
							verify: true,
							data: {
								url: commonUrl + '/admin/flow/getFlowNameList.action',
								dataType: 'json',
								data: {},
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
						smsContent: {
							name: '短信内容',
							type: 'textarea',
							verify: true
						},
						status: {
						name: '可用状态',
						type: 'select',
						verify: true,
						data: [{
							name: "可用",
							code: '1'
						}, {
							name: "不可用",
							code: '0'
						}]
					},
						remark: {
							name: '备注',
							type: 'textarea',
						},
					},
					data: {
						uuid: ''
					},
				},
				{
					name: '删除',
					colType: 'del',
					url: commonUrl + '/admin/TSmsManege/deleteEnttiybyUuid.action',
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({
						uuid: ''
					}),
				}
			]
		},
		//分页
		pageOption: {
			//各选项
		}
	})

})