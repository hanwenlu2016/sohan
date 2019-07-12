ss.imports(['dataTable'], function(exports) {
	var commonUrl = ss.options['commonUrl'];
	//数据表格
	ss.dataTable({
		appendTo: $('#dataCon')[0], //追加元素
		//数据选项
		dataOption: {
			listUrl: commonUrl + '/admin/trans/queryByPage.action', //请求Url
			type: 'post', //默认post请求
			dataType: 'json',
			//pageSize:5,//没值时，则默认是根据屏幕高度判断，保证一页
		},
		//搜索栏选项
		searchOption: [{
				name: '转写名称',
				txt: 'transferName',
				type: 'txt',
				width: '120px'
			},
			{
				name: '机器人',
				txt: 'robotUuid',
				type: 'select',
				width: '120px',
				data: {
					url: commonUrl + '/admin/org/queryRobotByPage.action',
					dataType: 'json',
					data: {
						pageSize: 1000000,
					},
					rely: {
						name: 'robotName',
						code: 'uuid'
					},
					digitalModel: {
						data: {
							location: ['data', 'data']
						}
					}
				}
			},
		],
		//搜索栏额外按钮
		searchBtn: {
			//默认
			add: {
				name: '添加转写应用+',
				colType: 'add',
				dataType: 'json',
				url: commonUrl + '/admin/trans/addTrans.action',
				items: {
					transferName: {
						name: '转写名称',
						type: 'txt',
						verify: true
					},
					callId: {
						name: '线路',
						type: 'txt',
						verify: true
					},
					robotUuid: {
						name: '机器人',
						type: 'select',
						data: {
							url: commonUrl + '/admin//org/queryRobotByPage.action',
							dataType: 'json',
							data: {
								pageSize: 1000000,
							},
							rely: {
								name: 'robotName',
								code: 'uuid'
							},
							digitalModel: {
								data: {
									location: ['data', 'data']
								}
							}
						}
					},
					type: {
						name: '来源',
						type: 'select',
						verify: true,
						data: [{
								name: '百度',
								code: 1
							},
							{
								name: '讯飞',
								code: 2
							},
							{
								name: '本地',
								code: 3
							},
						],
					},
					status: {
						name: '是否可用',
						type: 'select',
						verify: true,
						data: [{
								name: '可用',
								code: 1
							},
							{
								name: '不可用',
								code: 0
							},
						],
					},
					remark: {
						name: '备注',
						type: 'txt',
					},
				}
			}
		},
		//表格内容
		table: {
			//各选项
			options: {
				dpWith: {
					callId: 2,
					robotUuid: 10,
					createTime: 8,
					updateTime: 8,
					createAuthor: 5
				},
				isChangeTime: ['createTime', 'updateTime'], //是否进行时间戳转时间
				urlData: {
					robotUuid: {
						url: commonUrl + '/admin//org/queryRobotByPage.action',
						dataType: 'json',
						data: {
							pageSize: 1000000,
						},
						rely: {
							name: 'robotName',
							code: 'uuid'
						},
						digitalModel: {
							data: {
								location: ['data', 'data']
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
				shim: {
					status: {
						'1': '可用',
						'0': '不可用'
					},
					type: {
						'1': '百度',
						'2': '讯飞',
						'3': '本地',
					}
				},
			},
			tlName: ['转写名称', '线路', '机器人', '状态', '来源', '创建时间', '更新时间', '创建人', '备注'], //表头名字
			tlTxt: ['transferName', 'callId', 'robotUuid', 'status', 'type', 'createTime', 'updateTime', 'createAuthor', 'remark'], //表头字段
			//操作项
			operation: [
				//编辑和删除为默认，其它按钮需txt
				{
					name: '编辑',
					url: commonUrl + '/admin/trans/update.action',
					dataType: 'json',
					items: {
						transferName: {
							name: '转写名称',
							type: 'txt',
							verify: true
						},
						callId: {
							name: '线路',
							type: 'txt',
							verify: true
						},
						robotUuid: {
							name: '机器人',
							type: 'select',
							verify: true,
							data: {
								url: commonUrl + '/admin//org/queryRobotByPage.action',
								dataType: 'json',
								data: {
									pageSize: 1000000,
								},
								rely: {
									name: 'robotName',
									code: 'uuid'
								},
								digitalModel: {
									data: {
										location: ['data', 'data']
									}
								}
							}
						},
						status: {
							name: '是否可用',
							type: 'select',
							verify: true,
							data: [{
									name: '可用',
									code: 1
								},
								{
									name: '不可用',
									code: 0
								},
							],
						},
						type: {
							name: '来源',
							type: 'select',
							verify: true,
							data: [{
									name: '百度',
									code: 1
								},
								{
									name: '讯飞',
									code: 2
								},
								{
									name: '本地',
									code: 3
								},
							],
						},
						remark: {
							name: '备注',
							type: 'txt'
						}
					},
					data: {
						uuid: ''
					},
				},
				{
					name: '删除',
					colType: 'del',
					dataType: 'json',
					url: commonUrl + '/admin/trans/delete.action',
					data: {
						uuid: ''
					}
				}
			]
		},
		//分页
		pageOption: {
			//各选项
		}
	})

})