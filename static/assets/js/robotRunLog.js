ss.imports(['dataTable'], function(exports) {
	var commonUrl = ss.options['commonUrl'];
	//数据表格
	ss.dataTable({
		appendTo: $('#dataCon')[0], //追加元素
		//数据选项
		dataOption: {
			listUrl: commonUrl + '/admin/robotRunLog/queryByPage.action', //请求Url
			type: 'post', //默认post请求
			dataType: 'json',
			//pageSize:5,//没值时，则默认是根据屏幕高度判断，保证一页
		},
		//搜索栏选项
		searchOption: [{
				name: '状态',
				txt: 'status',
				type: 'select',
				width: '120px',
				value: '3',
				data: [{
						name: '启动',
						code: 1
					},
					{
						name: '死机',
						code: 2
					},
					{
						name: '激活',
						code: 3
					},
					{
						name: '运行',
						code: 4
					},
				],
			},
			{
				name: '设备',
				txt: 'equipmentUuid',
				type: 'select',
				width: '160px',
				data: {
					url: commonUrl + '/admin/robotSip/queryAll.action',
					dataType: 'json',
					data: {
					},
					rely: {
						name: 'clientName',
						code: 'uuid'
					},
					digitalModel: {
						data: {
							location: ['data']
						}
					}
				}
			},
			{
				name: '备注（模糊查询）',
				txt: 'remark',
				type: 'txt',
				width: '200px'
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
			//			add: {
			//				name: '添加机器人+',
			//				colType: 'add',
			//				dataType: 'json',
			//				url: commonUrl + '/admin/org/addRobot.action',
			//				items: {
			//					robotName: {
			//						name: '机器人名',
			//						type: 'txt',
			//						verify: true
			//					},
			//					userId: {
			//						name: '用户',
			//						type: 'select',
			//						data: {
			//							url: commonUrl + '/admin/user/findUserByCondition.action',
			//							dataType: 'json',
			//							data: {},
			//							rely: {
			//								name: 'loginNickName',
			//								code: 'uuid'
			//							},
			//							digitalModel: {
			//								data: {
			//									location: ['data']
			//								}
			//							}
			//						}
			//					},
			//					ipAddress: {
			//						name: 'ip地址',
			//						type: 'txt',
			//						verify: true
			//					},
			//					port: {
			//						name: '端口',
			//						type: 'txt',
			//						verify: true
			//					},
			//					describe: {
			//						name: '描述',
			//						type: 'txt'
			//					}
			//				}
			//			}
		},
		//表格内容
		table: {
			//各选项
			options: {
				dpWith:{robotUuid:6,equipmentName:8,createTime:6},
				isChangeTime: ['createTime'], //是否进行时间戳转时间
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
				},
				shim: {
					status: {
						'1': '启动',
						'2': '死机',
						'3': '激活',
						'4': '运行',
					},
					source: {
						'0': '手动',
						'1': '自动',
					}
				},
				cbFn: function(self) {
					//当前页数据
					var curPageData = self['tableData']['data'];
					console.log(curPageData);
					var uls;
					var timer = window.setInterval(function() {
						//当前ul
						uls = ss.getDom('.tbCWrap').querySelectorAll('ul');
						if(uls.length != 0) {
							window.clearInterval(timer);
							rendEndFn();
						}

					}, 4)

					function rendEndFn() {
						for(var r = 0; r < uls.length; r++) {
							//client_name transfer_name
							if(curPageData[r].client_name) {
								uls[r].children[1].innerHTML = curPageData[r].client_name;
							} else {
								uls[r].children[1].innerHTML = curPageData[r].transfer_name;
							}
						};
					}

				}
			},
			tlName: ['机器人名', '设备', '状态', '来源', '创建时间', '备注'], //表头名字
			tlTxt: ['robotUuid', 'equipmentName', 'status', 'source', 'createTime', 'remark'], //表头字段
			//操作项
			operation: [

			]
		},
		//分页
		pageOption: {
			//各选项
		}
	})

})