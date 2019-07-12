ss.imports(['dataTable'], function(exports) {
	var commonUrl = ss.options['commonUrl'];
	//数据表格
	ss.dataTable({
		appendTo: $('#dataCon')[0], //追加元素
		//数据选项
		dataOption: {
			listUrl: commonUrl + '/admin/org/queryRobotByPage.action', //请求Url
			type: 'post', //默认post请求
			dataType: 'json',
			//pageSize:5,//没值时，则默认是根据屏幕高度判断，保证一页
		},
		//搜索栏选项
		searchOption: [
			//			{
			//				name: '供应商',
			//				txt: 'userId',
			//				type: 'select',
			//				width: '120px',
			//				data:{
			//					url:commonUrl+'/admin/org/queryRobotByPage.action',
			//	                dataType:'json',
			//	                rely:{name:'userName',code:'userId'},
			//           		digitalModel:{
			//           			data:{
			//           				location:['data']
			//           			}
			//           		}
			//				}
			//			},
			{
				name: '机器人名',
				txt: 'robotName',
				type: 'txt',
				width: '120px'
			},
		],
		//搜索栏额外按钮
		searchBtn: {
			//默认
			add: {
				name: '添加机器人+',
				colType: 'add',
				dataType: 'json',
				url: commonUrl + '/admin/org/addRobot.action',
				items: {
					robotName: {
						name: '机器人名',
						type: 'txt',
						verify: true
					},
					userId: {
						name: '用户',
						type: 'select',
						data: {
							url: commonUrl + '/admin/user/findUserByCondition.action',
							dataType: 'json',
							data: {},
							rely: {
								name: 'loginNickName',
								code: 'uuid'
							},
							digitalModel: {
								data: {
									location: ['data']
								}
							}
						}
					},
					ipAddress: {
						name: 'ip地址',
						type: 'txt',
						verify: true
					},
					port: {
						name: '端口',
						type: 'txt',
						verify: true
					},
					line: {
						name: '线路总数',
						type: 'txt',
						verify: true
					},
					robotStauts: {
						name: '运行状况',
						type: 'select',
						data: [{
                            name: "不可用",
                            code: '0'
                        }, {
                            name: "可用",
                            code: '1'
                        }, {
                        	name: "维护",
                            code: '2'
                        }]
					},
					describe: {
						name: '描述',
						type: 'txt'
					}
				}
			}
		},



		//表格内容
		table: {
			//各选项
			options: {
				//dpWith:{createTime:10,accountId:8},
				isChangeTime: ['createTime'], //是否进行时间戳转时间
				  shim: {
                    robotStauts: {
                        '0': '不可用',
                        '1': '可用',
                        '2': '维护'
                    }
                },
				urlData:{
					userId: {
						name: '用户',
						url: commonUrl + '/admin/user/findUserByCondition.action',
						dataType: 'json',
						data: {},
						rely: {
							name: 'loginNickName',
							code: 'uuid'
						},
						digitalModel: {
							data: {
								location: ['data']
							}
						}
					}
				},
			},
			tlName: ['机器人名', '用户', 'ip地址', '端口号', '线路总数', '占用总数', '线路剩余数', '运行状况', '描述'], //表头名字
			tlTxt: ['robotName', 'userId', 'ipAddress', 'port', 'line', 'lineBusy', 'lineFree', 'robotStauts', 'describe'], //表头字段
			//操作项
			operation: [
				//编辑和删除为默认，其它按钮需txt
				{
					name: '编辑',
					url: commonUrl + '/admin/org/updateRobot.action',
					dataType: 'json',
					items: {
						robotName: {
							name: '机器人名',
							type: 'txt',
							verify: true
						},
						userId: {
							name: '用户',
							type: 'select',
							verify: true,
							data: {
								url: commonUrl + '/admin/user/findUserByCondition.action',
								dataType: 'json',
								data: {},
								rely: {
									name: 'loginNickName',
									code: 'uuid'
								},
								digitalModel: {
									data: {
										location: ['data']
									}
								}
							}
						},
						ipAddress: {
							name: 'ip地址',
							type: 'txt',
							verify: true
						},
						port: {
							name: '端口',
							type: 'txt',
							verify: true
						},
						line: {
							name: '线路总数',
							type: 'txt',
							verify: true
						},
						// lineFree: {
						// 	name: '占用总数',
						// 	type: 'txt',
						// 	verify: true
						// },
						// lineBusy: {
						// 	name: '线路剩余数',
						// 	type: 'txt',
						// 	verify: true
						// },
						robotStauts: {
							name: '运行状况',
							type: 'select',
							data: [{
                            	name: "不可用",
                            	code: '0'
                        		}, {
                            	name: "可用",
                            	code: '1'
                        		}, {
                        		name: "维护",
                            	code: '2'
                        	}]
						},
						describe: {
							name: '描述',
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
					url: commonUrl + '/admin/org/delRobotByUUID.action',
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