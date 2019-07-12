var namess = '暂停'
ss.imports(['dataTable'], function (exports) {
  var commonUrl = ss.options['commonUrl'];
  //数据表格
  ss.dataTable({
    appendTo: $('#dataCon')[0], //追加元素
    //数据选项
    dataOption: {
      listUrl: commonUrl + '/admin/orgAutoTask/queryByPage.action', //请求Url 
      type: 'post', //默认post请求
      dataType: 'json'
      //data:JSON.stringify({uuid:'',applyName:'',status:'',createTime:''}),
      //pageSize:5,//没值时，则默认是根据屏幕高度判断，保证一页
    },
    //搜索栏选项
    searchOption: [
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
      {
        name: '任务名',
        txt: 'taskName',
        type: 'txt',
        width: '120px'
      }
    ],
    //搜索栏额外按钮
    searchBtn: {
      //默认
      add: {
        name: '添加任务+',
        dataType: 'json',
        colType: 'add',
        url: commonUrl + '/admin/orgAutoTask/add.action',
        saveCbFn:function(queryObj){
          JSON.parse(queryObj.data).phone.replace(/，/g,',')
          return queryObj
        },
        items: {
          taskName: {
            name: '任务名',
            type: 'txt',
            verify: true
          },
          callStopTime: {
            name: '任务间隔(s)',
            type: 'txt',
            verify: true
          },
          startTime: {
            name: '拨打开始时间',
            type: 'time',
            timeType: 'time',
            verify: true
          },
          endTime: {
            name: '拨打结束时间',
            type: 'time',
            timeType: 'time',
            verify: true
          },
          userId: {
            name: '用户列表',
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
          robotUuid: {
            name: '机器人',
            type: 'select',
            data: {
              url: commonUrl + '/admin/org/getRobotList.action',
              dataType: 'json',
              data: {},
              rely: {
                name: 'robotName',
                code: 'uuid'
              },
              digitalModel: {
                data: {
                  location: ['data']
                }
              }
            }
          },
          flowUuid: {
            name: '流程名称',
            type: 'select',
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
			},		  
          phone: {
            name: '电话号码',
            type: 'area',
            verify: true,
          }
        }
      }
    },
    //表格内容
    table: {
      //各选项
      options: {
        editCbFn:function(queryObj){
          var endObj = queryObj;
          var queryData =JSON.parse(queryObj.data);
          queryData.phone = queryData.phone.replace(/，/g,',');
          endObj['data'] = JSON.stringify(queryData);
          return endObj
        },
        dpWPer: '150%',
        showTitle: ['robotName', 'taskName', 'flowName','phone'],
        isChangeTime: ['createTime','callTime'], //是否进行时间戳转时间
        dpWith: {
          taskName: 7,
          taskStatus: 7,
		  flowName:9,
		  canBreak:5,
          currCall: 9,
          callTime: 10,
		  createTime: 12,
          currCallCount: 9,
          callStatus: 9,
          callCount: 7,
          startTime: 9,
          endTime: 9
        },
        shim: {
          taskStatus: {
            '0': '等待',
            '1': '运行',
            '2': '暂停',
            '3': '停止',
            '4': '结束'
          },
          callStatus: {
            '0': '无任务',
            '1': '正在拨打',
            '2': '通话中',
            '3': '挂断'

          },
          canBreak: {
            '0': '否',
            '1': '是',
          }
        }
      },
      tlName: ['任务名', '机器人', "流程名称",'可打断', '号码列表', '总号码数', '任务状态', '当前拨出号码', '当前拨出数量', '当前拨出状态',
        '当前拨打时间', '拨打开始时间', '拨打结束时间', '创建时间'
      ], //表头名字
      tlTxt: ['taskName', 'robotName', 'flowName', 'canBreak','phone', 'callCount', 'taskStatus', 'currCall', 'currCallCount', 'callStatus',
        'callTime', 'startTime', 'endTime', 'createTime'
      ], //表头字段
      //操作项
      operation: [
        //编辑和删除为默认，其它按钮需txt
        {
          name: '编辑',
          url: commonUrl + '/admin/orgAutoTask/update.action',
          dataType: 'json',
          saveCbFn:function(queryObj){
            JSON.parse(queryObj.data).phone.replace(/，/g,',')
            return queryObj
          },
          items: {
            taskName: {
              name: '任务名',
              type: 'txt',
              verify: true
            },
            callStopTime: {
              name: '任务间隔(s)',
              type: 'txt',
              verify: true
            },
            startTime: {
              name: '拨打开始时间',
              type: 'time',
              timeType: 'time',
              verify: true
            },
            endTime: {
              name: '拨打结束时间',
              type: 'time',
              timeType: 'time',
              verify: true
            },
            userId: {
              name: '用户列表',
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
            robotUuid: {
              name: '机器人',
              type: 'select',
              data: {
                url: commonUrl + '/admin/org/getRobotList.action',
                dataType: 'json',
                data: {},
                rely: {
                  name: 'robotName',
                  code: 'uuid'
                },
                digitalModel: {
                  data: {
                    location: ['data']
                  }
                }
              }
            },
            flowUuid: {
              name: '流程名称',
              type: 'select',
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
			},	
            phone: {
              name: '电话号码',
              type: 'textarea',
              verify: true
            },
          },
          data: {
            uuid: ''
          },
        },
        {
          name: '删除',
          colType: 'del',
          dataType: 'json',
          url: commonUrl + '/admin/orgAutoTask/delete.action',
          data: {
            uuid: ''
          }
        },
        {
          name: '开始',
          colType: 'opt1',
          rely: {
            taskStatus: 0
          },
          cbFn: function (curData, self) {
            self.ajax({
                url: commonUrl + '/admin/orgAutoTask/changeStatus.action',
                data: JSON.stringify({
                  uuid: curData.uuid,
                  taskStatus: 1
                }),
                type: 'POST',
              },
              function (res) {
                self.lg_reloadFn(); //表格重载
              },
              function () {},
              function (request) {
                request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
              }
            )
          }

        },
        {
          name: '开始',
          colType: 'opt1',
          rely: {
            taskStatus: 2
          },
          cbFn: function (curData, self) {
            self.ajax({
                url: commonUrl + '/admin/orgAutoTask/changeStatus.action',
                data: JSON.stringify({
                  uuid: curData.uuid,
                  taskStatus: 1
                }),
                type: 'POST',
              },
              function (res) {
                self.lg_reloadFn(); //表格重载
              },
              function () {},
              function (request) {
                request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
              }
            )
          }

        },
        {
          name: '暂停',
          colType: 'opt2',
          rely: {
            taskStatus: '1'
          },
          cbFn: function (curData, self) {
            self.ajax({
                url: commonUrl + '/admin/orgAutoTask/changeStatus.action',
                data: JSON.stringify({
                  uuid: curData.uuid,
                  taskStatus: 2
                }),
                type: 'POST',
              },
              function (res) {
                self.lg_reloadFn(); //表格重载
              },
              function () {},
              function (request) {
                request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
              }
            )
          }
        },
        {
          name: '停止',
          colType: 'opt3',
          rely: {
            taskStatus: 1
          },
          cbFn: function (curData, self) {
            self.ajax({
                url: commonUrl + '/admin/orgAutoTask/changeStatus.action',
                data: JSON.stringify({
                  uuid: curData.uuid,
                  taskStatus: 3
                }),
                type: 'POST',
              },
              function (res) {
                layer.msg('已停止！', {
                  time: 700
                });
                self.lg_reloadFn(); //表格重载
              },
              function () {},
              function (request) {
                request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
              }
            )
          }
        },
        {
          name: '停止',
          colType: 'opt3',
          rely: {
            taskStatus: 0
          },
          cbFn: function (curData, self) {
            self.ajax({
                url: commonUrl + '/admin/orgAutoTask/changeStatus.action',
                data: JSON.stringify({
                  uuid: curData.uuid,
                  taskStatus: 3
                }),
                type: 'POST',
              },
              function (res) {
                layer.msg('已停止！', {
                  time: 700
                });
                self.lg_reloadFn(); //表格重载
              },
              function () {},
              function (request) {
                request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
              }
            )
          }
        }, {
          name: '停止',
          colType: 'opt3',
          rely: {
            taskStatus: 2
          },
          cbFn: function (curData, self) {
            self.ajax({
                url: commonUrl + '/admin/orgAutoTask/changeStatus.action',
                data: JSON.stringify({
                  uuid: curData.uuid,
                  taskStatus: 3
                }),
                type: 'POST',
              },
              function (res) {
                layer.msg('已停止！', {
                  time: 700
                });
                self.lg_reloadFn(); //表格重载
              },
              function () {},
              function (request) {
                request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
              }
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