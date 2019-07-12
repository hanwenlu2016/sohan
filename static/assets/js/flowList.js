ss.imports(['dataTable'], function(exports) {
	var commonUrl = ss.options['commonUrl'];
	//数据表格
	ss.dataTable({
		appendTo: $('#dataCon')[0], //追加元素
		//数据选项
		dataOption: {
			listUrl: commonUrl + '/admin/flow/queryByPage.action', //请求Url 
			type: 'post', //默认post请求
			dataType: 'json',
			data: {},
			//pageSize:5,//没值时，则默认是根据屏幕高度判断，保证一页
		},
		//搜索栏选项
		searchOption: [{
				name: '流程名称',
				txt: 'flowName',
				type: 'txt',
				width: '200px'
			},
			{
				name: '用户',
				txt: 'userId',
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
				},
				width: '150px'
			}
		],
		//搜索栏额外按钮
		searchBtn: {
			//默认
			add: {
				name: '添加流程+',
				dataType: 'json',
				colType: 'add',
				url: commonUrl + '/admin/flow/add.action',
				items: {
					flowName: {
						name: '流程名称',
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
					useable: {
						name: '可用状态',
						type: 'select',
						verify: true,
						data: [{
							name: "禁用",
							code: '0'
						}, {
							name: "启用",
							code: '1'
						}]
					},
					callMaxTime: {
						name: '最大通话时间',
						type: 'txt',
						verify: true
					},
				},

			}
		},
		//表格内容
		table: {
			//各选项
			options: {
				showTitle: ['flowName', 'username'],
				dpWith: {
					callMaxTime: 4,
					createTime: 5,
					updateTime: 5
				},
				isChangeTime: ['updateTime', 'createTime'], //是否进行时间戳转时间
				shim: {
					useable: {
						'0': '禁用',
						'1': '启动'
					}
				}
			},
			tlName: ['流程名称', '用户', '可用状态', '最大通话时间', '创建时间', '更新时间', '创建人'], //表头名字
			tlTxt: ['flowName', 'userName', 'useable', 'callMaxTime', 'createTime', 'updateTime', 'createAuthor'], //表头字段
			//操作项
			operation: [{
					name: '制作',
					colType: 'opt2',
					cbFn: function(curData) {
						if(typeof(Storage) !== "undefined") {
							localStorage.setItem("flowUuid", curData.uuid);
						} else {
							alert("抱歉!您的浏览器不支持 Web Storage ...")
						}
						window.location.href = '/html/layout.html#flow'
					}
				},
				{
					name: '编辑',
					url: commonUrl + '/admin/flow/update.action',
					dataType: 'json',
					items: {
						flowName: {
							name: '流程名称',
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
						useable: {
							name: '可用状态',
							type: 'select',
							data: [{
								name: "禁用",
								code: '0'
							}, {
								name: "启用",
								code: '1'
							}]
						},
						callMaxTime: {
							name: '最大通话时间',
							type: 'txt',
							verify: true
						},
					},
					data: {
						uuid: ''
					},
				},
				{
					name: '更新缓存',
					colType: 'opt1',
					cbFn: function(curData, self) {
						curData.isExcellent = 1
						self.ajax({
								url: commonUrl + '/admin/flow/createIndex.action',
								data: JSON.stringify({
									uuid: curData.uuid
								}),
								type: 'POST'
							},
							function(res) {
								self.lg_reloadFn() //表格重载
							},
							function() {},
							function(request) {
								request.setRequestHeader(
									'Content-Type',
									'application/json;charset=UTF-8'
								)
							}
						)
					}
				},
				{
					name: '删除',
					colType: 'del',
					dataType: 'json',
					url: commonUrl + '/admin/flow/delete.action',
					data: {
						uuid: ''
					}
				},
				{
					name: '复制',
					colType: 'opt3',
					cbFn: function(curData, self) {
						curData.isExcellent = 1
						self.ajax({
								url: commonUrl + '/admin/flow/copyFlow.action',
								data: JSON.stringify({
									uuid: curData.uuid
								}),
								type: 'POST'
							},
							function(res) {
								self.lg_reloadFn() //表格重载
							},
							function() {},
							function(request) {
								request.setRequestHeader(
									'Content-Type',
									'application/json;charset=UTF-8'
								)
							}
						)
					}
				},
				{
					name: 'QA导出',
					colType: 'opt2',
					cbFn: function(curData, self) {
                         self.ajax({
								url: commonUrl + '/admin/flow/export.action?uuid=' +curData.uuid,
								data: JSON.stringify({
								}),
								type: 'GET'
							},
						)
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

//发送消息
// function send() {
//     var message = document.getElementById('text').value;
//     var messageJson = JSON.stringify({ "name": message });
//     stompClient.send("/app/sendTest", {}, messageJson);
//     // setMessageInnerHTML("/app/sendTest 你发送的消息:" + message);
// }

//订阅消息
// function subscribe1() {
//     stompClient.subscribe('/topic/subscribeTest', function (response) {
//         // setMessageInnerHTML("已成功订阅/topic/subscribeTest");
//         var returnData = JSON.parse(response.body);
//         // setMessageInnerHTML("/topic/subscribeTest 你接收到的消息为:" + returnData.responseMessage);
//         console.log(returnData+'2222222222222')
//         getServiceText(returnData)
//     });
// }

//将消息显示在网页上
// function setMessageInnerHTML(innerHTML) {
//     console.log(innerHTML+"11111111111111")
// }
// 聊天窗口
// var socket 

// // 获取 STOMP 子协议的客户端对象
// var stompClient
// var doc = document;
// // 模拟一些后端传输数据
// // var serviceData = {
// //     'robot': {
// //         'name': 'robot001',
// //         'dialogue': ['模拟回复1', '模拟回复2', '模拟回复3'],
// //         'welcome': '您好，robot001为您服务'
// //     }
// // };
// // 获取dom
// var dialogueInput = doc.getElementById('dialogue_input'),
//     dialogueContain = doc.getElementById('dialogue_contain'),
//     dialogueHint = doc.getElementById('dialogue_hint'),
//     btnOpen = doc.getElementById('btn_open'),
//     btnClose = doc.getElementById('btn_close'),
//     timer,
//     timerId,
//     shiftKeyOn = false; // 辅助判断shift键是否按住
// // 对话框显示隐藏
// btnOpen.addEventListener('click', function (e) {
//    socket = new SockJS("http://127.0.0.1:8600/webSocketServer");

//     // 获取 STOMP 子协议的客户端对象
//    stompClient = Stomp.over(socket);
//     // 向服务器发起websocket连接并发送CONNECT帧
//     stompClient.connect({},
//         function connectCallback(frame) {
//             // 连接成功时（服务器响应 CONNECTED 帧）的回调方法
//             getServiceText("连接成功");
//             stompClient.subscribe('/app/subscribeTest', function (response) {
//                 var returnData = JSON.parse(response.body);
//                 getServiceText(returnData.responseMessage)
//             });
//         },
//         function errorCallBack(error) {
//             // 连接失败时（服务器响应 ERROR 帧）的回调方法
//             setMessageInnerHTML("连接失败");
//         }
//     );
//     $('.dialogue-support-btn').css({
//         'display': 'none'
//     });
//     $('.dialogue-main').css({
//         'display': 'inline-block',
//         'height': '0'
//     });
//     $('.dialogue-main').animate({
//         'height': '600px',
//         'width': '600px'
//     })

// })

// btnClose.addEventListener('click', function (e) {
//     $('.dialogue-main').animate({
//         'height': '0'
//     }, function () {
//         $('.dialogue-main').css({
//             'display': 'none'
//         });
//         $('.dialogue-support-btn').css({
//             'display': 'inline-block'
//         });
//     });
//     $('#dialogue_contain').html('')
//     stompClient.disconnect(function () {
//         alert("See you next time!");
//      });
// })
// // 监听事件
// dialogueInput.addEventListener('keydown', function (e) {
//     var e = e || window.event;
//     if (e.keyCode == 16) {
//         shiftKeyOn = true;
//     }
//     if (shiftKeyOn) {
//         return true;
//     } else if (e.keyCode == 13 && dialogueInput.value == '') {
//         // console.log('发送内容不能为空');
//         // 多次触发只执行最后一次渐隐
//         setTimeout(function () {
//             fadeIn(dialogueHint);
//             clearTimeout(timerId)
//             timer = setTimeout(function () {
//                 fadeOut(dialogueHint)
//             }, 2000);
//         }, 10);
//         timerId = timer;
//         return true;
//     } else if (e.keyCode == 13) {
//         var nodeP = doc.createElement('p'),
//             nodeSpan = doc.createElement('span');
//         nodeP.classList.add('dialogue-customer-contain');
//         nodeSpan.classList.add('dialogue-text', 'dialogue-customer-text');
//         nodeSpan.innerHTML = dialogueInput.value;
//         nodeP.appendChild(nodeSpan);
//         dialogueContain.appendChild(nodeP);
//         dialogueContain.scrollTop = dialogueContain.scrollHeight;
//         submitCustomerText(dialogueInput.value);
//     }
// });

// dialogueInput.addEventListener('keyup', function (e) {
//     var e = e || window.event;
//     if (e.keyCode == 16) {
//         shiftKeyOn = false;
//         return true;
//     }
//     if (!shiftKeyOn && e.keyCode == 13) {
//         dialogueInput.value = null;
//     }
// });
// //提交输入框信息
// function submitCustomerText(text) {
//     // code here 向后端发送text内容
//     var messageJson = JSON.stringify({
//         "name": text
//     });
//     stompClient.send("/app/sendTest", {}, messageJson);

//     stompClient.subscribe('/topic/subscribeTest', function (response) {
//         // setMessageInnerHTML("已成功订阅/topic/subscribeTest");
//         var returnData = JSON.parse(response.body);
//         // setMessageInnerHTML("/topic/subscribeTest 你接收到的消息为:" + returnData.responseMessage);
//         console.log(returnData.responseMessage)
//         getServiceText(returnData.responseMessage)
//     });
// }
// // 获取数据
// function getServiceText(data) {
//     var serviceText = data
//     var nodeP = doc.createElement('p'),
//         nodeSpan = doc.createElement('span');
//     nodeP.classList.add('dialogue-service-contain');
//     nodeSpan.classList.add('dialogue-text', 'dialogue-service-text');
//     nodeSpan.innerHTML = serviceText;
//     nodeP.appendChild(nodeSpan);
//     dialogueContain.appendChild(nodeP);
//     dialogueContain.scrollTop = dialogueContain.scrollHeight;
// }

// // 渐隐
// function fadeOut(obj) {
//     var n = 100;
//     var time = setInterval(function () {
//         if (n > 0) {
//             n -= 10;
//             obj.style.opacity = '0.' + n;
//         } else if (n <= 30) {
//             obj.style.opacity = '0';
//             clearInterval(time);
//         }
//     }, 10);
//     return true;
// }

// // 渐显
// function fadeIn(obj) {
//     var n = 30;
//     var time = setInterval(function () {
//         if (n < 90) {
//             n += 10;
//             obj.style.opacity = '0.' + n;
//         } else if (n >= 80) {

//             obj.style.opacity = '1';
//             clearInterval(time);
//         }
//     }, 100);
//     return true;
// }
// $(document).keyup(function (event) {
//     // console.log(event)
//     // switch(event.keyCode) {
//     // case 27:
//     // alert("ESC");
//     // case 96:
//     // alert("ESC");
//     // }
//     if (event.keyCode == 27) {
//         $('.dialogue-main').animate({
//             'height': '0'
//         }, function () {
//             $('.dialogue-main').css({
//                 'display': 'none'
//             });
//             $('.dialogue-support-btn').css({
//                 'display': 'inline-block'
//             });
//         });
//         $('#dialogue_contain').html('')
//     }
// });