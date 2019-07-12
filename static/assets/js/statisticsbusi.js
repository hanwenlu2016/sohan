ss.imports(['dataTable'], function(exports) {
	var commonUrl = ss.options['commonUrl'];
	//数据表格
	ss.dataTable({
		appendTo: $('#dataCon')[0], //追加元素
		//数据选项
		dataOption: {
			listUrl: commonUrl + '/admin/calllog/getCallInfoListAVG.action', //请求Url
			type: 'post', //默认post请求
			dataType: 'json'
			//data:JSON.stringify({uuid:'',applyName:'',status:'',createTime:''}),
			//pageSize:5,//没值时，则默认是根据屏幕高度判断，保证一页
		},
		//搜索栏选项
		searchOption: [
			/*{
			        name: '号码、内容',
			        txt: 'content',
			        type: 'txt',
			        width: '150px'
			      },*/
			{
				name: '业务流程',
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
			{
				name: '开始时间',
				txt: 'startTime',
				type: 'date',
				width: '120px',
				isLine: true
			},
			{
				name: '结束时间',
				txt: 'endTime',
				type: 'date',
				width: '120px'
			},
		],
		//搜索栏额外按钮
		searchBtn: {
			//默认
		},
		//表格内容
		table: {
			//各选项
			options: {
				dpWPer: '120%',
				dpWith: {
				},
				isChangeTime: ['create_time'], //是否进行时间戳转时间
				shim: {},
			},
			tlName: ['业务流程','拨打总数','接通数','接通率%','未接通数','通话总时长','平均通话时长', '平均交互次数', '无法识别率%', '会话超时率%', '会话重复率%',], //表头名字
			tlTxt: ['flowName','callCount','conncall','connrate','noConncall','totaltime', 'callTimeSumAvg', 'callCountAvg', 'unrecognizedRate', 'overtimeRate', 'repeatRate', ], //表头字段
			//操作项
			operation: [
				{
					name:'标签',
					colType:'opt1',
					cbFn:function(curData,self){
						viewObj['orderViewFn'](curData,self);
					}
				},
//				{
//					name: '详情',
//					colType: 'opt2',
//					cbFn: function(curData, self) {
//						ss.dataTable({
//							appendTo: $('#dataCon2')[0], //追加元素
//							name: 'two',
//							dataOption: {
//								listUrl: commonUrl + '/admin/calllog/findLogDetailById.action', //请求Url
//								type: 'post', //默认post请求
//								dataType: 'json',
//								data: {
//									callUuid: curData.callUuid
//								},
//								digitalModelFn: {
//									data: {
//										location: ['data', 'data']
//									},
//								}
//							},
//							table: {
//								options: {
//									isChangeTime: ['createTime'], //是否进行时间戳转时间
//									showTitle: ['callVoice', 'recordContent'],
//									dpWith: {
//										createTime: 4
//									},
//									cbFn: function(self) {
//										$('#dataCon2')[0].style.top = '100px';
//										$('#dataCon2')[0].style.width = $('#dataCon')[0].offsetWidth + 'px';
//										self['domWrap']['dtcWrap'].style.paddingTop = '40px';
//										ss.crtDom('div', '', '', $('#dataCon2')[0], {
//												cn: ['width', 'position', 'top'],
//												cv: ['100%', 'absolute', '10px']
//											})
//											.appendDom(function(dom) {
//												ss.crtDom('div', '', '返回', dom, {
//													cn: ['width', 'height', 'lineHeight', 'textAlign', 'backgroundColor', 'color', 'margin', 'borderRadius', 'cursor'],
//													cv: ['50px', '30px', '30px', 'center', 'rgb(41, 103, 153)', '#fff', '0 auto', '5px', 'pointer']
//												}, [
//													'click',
//													function(dom) {
//														$('#dataCon2')[0].innerHTML = '';
//														$('#dataCon2')[0].style.top = '-99999px';
//													}
//												])
//											});
//									},
//									shim: {
//										logType: {
//											'1': '对方应答',
//											'2': '我方应答',
//											'3': '通话状态'
//										}
//									}
//								},
//
//								tlName: ['时间', '类型', '对方应答', '我方应答', '标签', '备注'], //表头名字
//								tlTxt: ['createTime', 'logType', 'callVoice', 'recordContent', 'flowLabel', 'remark'], //表头字段
//								operation: [ //编辑和删除为默认，其它按钮需txt
//									{
//										name: '编辑',
//										url: commonUrl + '/admin/calllog/updateDetail.action',
//										data: {
//											uuid: ''
//										},
//										dataType: 'json',
//										items: {
//											callVoice: {
//												name: '对方应答',
//												type: 'txt',
//												verify: true
//											},
//											flowLabel: {
//												name: '标签',
//												type: 'mulSelect',
//												verify: true,
//												data: {
//													url: commonUrl + '/admin/label/getFlowLabelList.action',
//													dataType: 'json',
//													data: {},
//													rely: {
//														name: 'labelName',
//														code: 'labelNum'
//													},
//													digitalModel: {
//														data: {
//															location: ['data']
//														}
//													}
//												}
//											},
//											remark: {
//												name: '备注',
//												type: 'textarea',
//												verify: true
//											},
//										}
//									}
//								]
//							},
//							//分页
//							pageOption: {
//								//各选项
//							}
//						});
//					}
//				}
			]
		},
		//分页
		pageOption: {
			//各选项
		}
	})
	
		//弹窗对象
	var viewObj = {
		//dom存储
		domWrap:{

		},
		//订单跟踪弹窗_渲染
		orderViewFn:function(curData,self){
			var viewObjThis = this;
			this['domWrap']['orderViewFn'] = {};
			var viewContainer = document.createDocumentFragment();
			//遮罩层
			var shadow = ss.crtDom('div','view_shade','',viewContainer,{
				cn:['width','height','position','top','left','backgroundColor','opacity','zIndex','display'],
				cv:[ss.paraWrap.clwx,ss.paraWrap.clhx,'fixed','0px','0px','#000',.3,1300,'block']
			});
			//内容
			var content = ss.crtDom('div','view_con','',viewContainer,{
				cn:['width','position','top','left','backgroundColor','borderRadius','zIndex','display','overflow'],
				cv:[ss.paraWrap.clw*.5+'px','fixed',ss.paraWrap.clh *.1+'px',ss.paraWrap.clw*.25+'px','#fff','5px',1301,'block','hidden']
			})
				.appendDom(function(dom){
					//内容标题
					ss.crtDom('div','viewC_tit','',dom,{
						cn:['height','position','lineHeight','textAlign','color','backgroundColor','padding'],
						cv:['48px','relative','48px','left','#333','#296799','0% 5%'],
					})
						.appendDom(function(dom){
							//文字
							ss.crtDom('span','titleName','查看标签',dom,{
								cn:['color','fontSize'],
								cv:['#fff','18px']
							});
							//svg
							var widthP = 22;
							ss.crtDom('div','titleClose',ss.svgRepository.close(widthP,'#fff'),dom,{
									cn:['width','height','position','top','right'],
									cv:[widthP+'px',widthP+'px','absolute','14px','25px']
								},
								[
									'click',function(dom){
									var doms = viewObjThis['domWrap']['orderViewFn'];
									for(var d in doms){
										doms[d].parentNode.removeChild(doms[d]);
									};
								}
								]);
						})
					//内容容器
					ss.crtDom('div','viewC_Con','',dom,{
						cn:['height','position','lineHeight','textAlign','color','backgroundColor','padding','overflowX','overflowY'],
						cv:[65*6+'px','relative','48px','left','#333','#fff','0% 5%','hidden','auto'],
					})
						.appendDom(function(dom){
								
														
							ss.dataTable({
								appendTo: dom, //追加元素
								//数据选项
								dataOption: {
									listUrl: commonUrl + '/admin/calllog/getCallInfoListAVGForId.action', //请求Url
									type: 'post', //默认post请求
									dataType: 'json',
									data:{flowUuid:curData['flowUuid']}
								},
								//表格内容
								table: {
									tlName: ['标签名', '出现次数'], //表头名字
									tlTxt: ['flowLabel', 'flowLabelCount'], //表头字段

								},

							})
	
								
								
								self.eAjax({
									url:commonUrl+'/admin/calllog/getCallInfoListAVGForId.action',
									type:'post',
									dataType:'json',
									data:{
										"flowUuid":curData['flow_uuid'],
									}
								}, {
									success:function(data) {
										
										
										
										
									},
									isJson:true
								});
								
								///admin/calllog/getCallInfoListAVGForId.action
							
							
						})
				});
			this['domWrap']['orderViewFn']['shadow'] = shadow;
			this['domWrap']['orderViewFn']['content'] = content;
			ss.getDom('body').appendChild(viewContainer);
		},
		//备注保存事件
		remarkSaveFn:function(curData,remake,dom){
			var viewObjThis = this;
			self.eAjax({
				url:commonUrl+'/TOrderTrack/saveTOrderTrack.json',
				type:'post',
				dataType:'json',
				data:{
					"orderId":curData.uuid,
					"state":curData.state,
					"remake":remake
				}
			}, {
				success:function(data) {
					ss.layer.msg('订单状态备注添加成功！')
					var doms = viewObjThis['domWrap']['remarkViewFn'];
					for(var d in doms){
						doms[d].parentNode.removeChild(doms[d]);
					};
				},
				isJson:true
			});
		},

	};
	
	
})