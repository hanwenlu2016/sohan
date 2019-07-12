ss.imports(['dataTable'], function (exports) {
  var commonUrl = ss.options['commonUrl'];
  //数据表格
  ss.dataTable({
    appendTo: $('#dataCon')[0], //追加元素
    //数据选项
    dataOption: {
      listUrl: commonUrl + '/admin/calllog/queryByPage.action', //请求Url
      type: 'post', //默认post请求
      dataType: 'json'
      //data:JSON.stringify({uuid:'',applyName:'',status:'',createTime:''}),
      //pageSize:5,//没值时，则默认是根据屏幕高度判断，保证一页
    },
    //搜索栏选项
    searchOption: [{
        name: '号码、内容',
        txt: 'content',
        type: 'txt',
        width: '150px'
      }, {
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
      {
        name: '开始时间',
        txt: 'startTime',
        type: 'date',
        width: '120px',
        isLine: true,
      },
      {
        name: '结束时间',
        txt: 'endTime',
        type: 'date',
        width: '120px',
      },
    ],
    //搜索栏额外按钮
    searchBtn: {
      //默认
       exportExcel: {
				name: '导出通话记录',
				colType: 'opt6',
				cbFn: function(self) {
               self.lg_getSelectParasFn();//序列化搜索参数
	             var endTime = self['scope']['queryObj']['endTime'];
	             var startTime = self['scope']['queryObj']['startTime'];
               function download(filename,actionUrl) {
                  var oReq = new XMLHttpRequest();
                  ss.c3Loading.show();
                  oReq.open("GET", actionUrl, true);
                  oReq.responseType = "blob";
                  oReq.onload = function (oEvent) {
                      ss.c3Loading.hidden();
                      var content = oReq.response;
                      var elink = document.createElement('a');
                      elink.download = filename;
                      elink.style.display = 'none';
                      var blob = new Blob([content]);
                      elink.href = URL.createObjectURL(blob);
                      document.body.appendChild(elink);
                      elink.click();
                      document.body.removeChild(elink);
                  };
                  oReq.send();
            };
            //方法调用：文件名 请求地址
            download(
              '通话记录_'+new Date().getTime()+'.xlsx',
              commonUrl+'/admin/calllog/exportCustomer.action?endTime='+endTime+'&startTime='+startTime
            );
				}
			}
    },
    //表格内容
    table: {
      //各选项
      options: {
		dpWPer: '105%',
        showTitle: ['flowName', 'callUuid'],
        // isChangeTime: ['createDate'], //是否进行时间戳转时间
        dpWith: {
          createTime: 8,
          callPhone: 5,
          callUuid: 8,
          dialTime: 3,
          callTime: 3,
          callCount: 3,
          flowName: 5,
		  callStatus: 3,
		  lastResponse: 5,
		  pflowname: 5
		  
        },
        shim: {},
      },
      tlName: ['通话序号', '拨出号码', '业务流程', '拨打时长/S', '通话时长/S','交互次数', '通话状态', '挂断节点', '对方最后应答', '创建时间',], //表头名字
      tlTxt: ['callUuid', 'callPhone', 'flowName', 'dialTime', 'callTime','callCount','callStatus','pflowname', 'lastResponse', 'createTime'], //表头字段
      //操作项
      operation: [{
          name: '详情',
          colType: 'opt2',
          cbFn: function (curData, self) {
            ss.dataTable({
              appendTo: $('#dataCon2')[0], //追加元素
              name: 'two',
              dataOption: {
                listUrl: commonUrl + '/admin/calllog/findLogDetailById.action', //请求Url
                type: 'post', //默认post请求
                dataType: 'json',
                data: {
                  callUuid: curData.callUuid
                },
                digitalModelFn: {
                  data: {
                    location: ['data', 'data']
                  },
                }
              },
              table: {
                options: {
                  isChangeTime: ['createTime'], //是否进行时间戳转时间
                  showTitle: ['callVoice', 'recordContent', 'remark'],
                  dpWith: {
                    createTime: 7,
					callVoice: 10,
					recordContent:10,
					logType:3,
					flowLabel:5,
					flowName:5
                  },
                  cbFn: function (self) {
                    $('#dataCon2')[0].style.top = '100px';
                    $('#dataCon2')[0].style.width = $('#dataCon')[0].offsetWidth + 'px';
                    self['domWrap']['dtcWrap'].style.paddingTop = '40px';
                    ss.crtDom('div', '', '', $('#dataCon2')[0], {
                        cn: ['width', 'position', 'top'],
                        cv: ['100%', 'absolute', '10px']
                      })
                      .appendDom(function (dom) {
                        ss.crtDom('div', '', '返回', dom, {
                          cn: ['width', 'height', 'lineHeight', 'textAlign', 'backgroundColor', 'color', 'margin', 'borderRadius', 'cursor'],
                          cv: ['50px', '30px', '30px', 'center', 'rgb(41, 103, 153)', '#fff', '0 auto', '5px', 'pointer']
                        }, [
                          'click',
                          function (dom) {
                            $('#dataCon2')[0].innerHTML = '';
                            $('#dataCon2')[0].style.top = '-99999px';
                          }
                        ])
                      });
                  },
                  shim: {
                    logType: {
                      '1': '对方应答',
                      '2': '我方应答',
                      '3': '通话状态'
                    }
                  }
                },
                tlName: ['时间', '类型', '对方应答', '我方应答','流程节点', '标签', '备注'], //表头名字
                tlTxt: ['createTime', 'logType', 'callVoice', 'recordContent','flowName', 'flowLabel', 'remark'], //表头字段
                operation: [ //编辑和删除为默认，其它按钮需txt
                  {
                    name: '编辑',
                    url: commonUrl + '/admin/calllog/updateDetail.action',
                    data: {
                      uuid: ''
                    },
                    dataType: 'json',
                    items: {
                      callVoice: {
                        name: '对方应答',
                        type: 'txt',
                        verify: true
                      },
                      flowLabel: {
                        name: '标签',
                        type: 'mulSelect',
                        verify: true,
                        data: {
                          url: commonUrl + '/admin/label/getFlowLabelList.action',
                          dataType: 'json',
                          data: {},
                          rely: {
                            name: 'labelName',
                            code: 'labelNum'
                          },
                          digitalModel: {
                            data: {
                              location: ['data']
                            }
                          }
                        }
                      },
                      remark: {
                        name: '备注',
                        type: 'textarea',
                      },
                    }
                  }
                ]
              },
              //分页
              pageOption: {
                //各选项
              }
            });
          }
        },
        {
          name: '播放',
          colType: 'opt1',
          cbFn: function (curData, self) {
            $('#box').css('display', 'block')
            $('#dataCon3')[0].style.top = '100px';
            $('#dataCon3')[0].style.width = $('#dataCon')[0].offsetWidth + 'px';
            self['domWrap']['dtcWrap'].style.paddingTop = '40px';
            ss.crtDom('div', '', '', $('#dataCon3')[0], {
                cn: ['width', 'height', 'overflow'],
                cv: ['100%', '100%', 'hidden']
              })
              .appendDom(function (dom) {
                ss.crtDom('div', '', '返回', dom, {
                  cn: ['width', 'height', 'lineHeight', 'textAlign', 'backgroundColor', 'color', 'margin', 'borderRadius', 'cursor'],
                  cv: ['50px', '30px', '30px', 'center', 'rgb(41, 103, 153)', '#fff', '0 auto', '5px', 'pointer']
                }, [
                  'click',
                  function (dom) {
                    $('#dataCon3')[0].innerHTML = '';
                    $('#dataCon3')[0].style.top = '-99999px';
                    $('#box').css('display', 'none')
                  }
                ])
                ss.crtDom('div', '', '', dom, {
                    cn: ['width', 'height', 'lineHeight', 'textAlign', 'color', 'margin', 'borderRadius', 'cursor'],
                    cv: ['100%', '30px', '30px', 'center', '#fff', '0 auto', '5px', 'pointer']
                  })
                  .appendDom(function (dom) {
                    ss.crtDom('audio', '', '', dom, {
                      cn: ['width', 'height', 'textAlign', 'margin'],
                      cv: ['90%', '20px', 'center', '20px auto'],
                      an: ['src', 'controls'],
                      av: [curData.playUrl, 'controls']
                    })
                  })
                  ss.crtDom('div', '', '', dom, {
                    cn: ['width', 'height', 'lineHeight', 'textAlign', 'margin', 'borderRadius', 'cursor'],
                    cv: ['100%', '30px', '30px', 'center', '0 auto', '5px', 'pointer']
                  })
                  .appendDom(function (dom) {
                    ss.crtDom('p', '',curData.playUrl == ""?"沒有录音":"", dom, {
                      cn: ['textAlign', 'margin'],
                      cv: ['center', '20px auto'],
                    })
                  })
              })
          }
        }
      ]
    },
    //分页
    pageOption: {
      //各选项
    }
  });
   
   function exportExcelFn(self) {
    	self.lg_getSelectParasFn();//序列化搜索参数
    	var endTime = self['scope']['queryObj']['endTime'];
    	var startTime = self['scope']['queryObj']['startTime'];
    	location.href=commonUrl+'/admin/calllog/exportCustomer.action?endTime='+endTime+'&startTime='+startTime;
	};
  
})

