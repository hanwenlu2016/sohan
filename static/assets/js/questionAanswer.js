ss.imports(['dataTable'], function (exports) {

  var commonUrl = ss.options['commonUrl'];
  //数据表格
  ss.dataTable({
    appendTo: $('#dataCon')[0], //追加元素
    //数据选项
    dataOption: {
      listUrl: commonUrl + '/admin/question/queryByPage.action', //请求Url 
      type: 'post', //默认post请求
      dataType: 'json'
      //data:JSON.stringify({uuid:'',applyName:'',status:'',createTime:''}),
      //pageSize:5,//没值时，则默认是根据屏幕高度判断，保证一页
    },
    //搜索栏选项
    searchOption: [{
        name: '对方提问、回答内容',
        txt: 'questionContent',
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
        url: commonUrl + '/admin/question/addQuestion.action',
        items: {
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
          perAnswer: {
            name: '对方提问',
            type: 'area',
            verify: true
          },
          recordContent: {
            name: '回答内容',
            type: 'area',
            verify: true
          },
          recordPath: {
            name: '录音路径',
            type: '_upload',
            verify: true
          }
          //callTime:{name:'拨打时间', type:'time', verify:true}
        }
      }
    },
    //表格内容
    table: {
      //各选项
      options: {
        dpWith:{flowName:12,createTime:18},
        showTitle:['perAnswer','recordContent'],
        //isChangeTime:['startDate','endDate','createDate'],//是否进行时间戳转时间
        isChangeTime: ['createTime'], //是否进行时间戳转时间
      },
      tlName: ['流程名称', '对方提问', '回答内容', '录音路径', '创建时间'], //表头名字
      tlTxt: ['flowName', 'perAnswer', 'recordContent', 'recordPath', 'createTime'], //表头字段
      //操作项
      operation: [
        {
          name: '播放',
          colType: 'opt1',
          cbFn: function (curData, self) {
            if(!curData['recordPath']){
              ss.layer.msg('录音文件尚未上传！');
              return;
            }
            $('#box').css('display', 'block')
            $('#dataCon2')[0].style.top = '100px';
            $('#dataCon2')[0].style.width = $('#dataCon')[0].offsetWidth + 'px';
            self['domWrap']['dtcWrap'].style.paddingTop = '40px';
            ss.crtDom('div', '', '', $('#dataCon2')[0], {
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
                    $('#dataCon2')[0].innerHTML = '';
                    $('#dataCon2')[0].style.top = '-99999px';
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
                    ss.crtDom('p', '',curData.recordContent, dom, {
                      cn: ['textAlign', 'margin'],
                      cv: ['center', '20px auto'],
                    })
                  })
              })
          }
        },
        //编辑和删除为默认，其它按钮需txt
        {
          name: '编辑',
          url: commonUrl + '/admin/question/updateQuestion.action',
          dataType: 'json',
          items: {
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
            perAnswer: {
              name: '对方提问',
              type: 'textarea',
              verify: true
            },
            recordContent: {
              name: '回答内容',
              type: 'textarea',
              verify: true
            },
            recordPath: {
              name: '录音路径',
              type: '_upload',
              verify: true
            },
          },
          data: {
            uuid: '',
            recordUuid:''
          },
        },
        {
          name: '删除',
          colType: 'del',
          url: commonUrl + '/admin/question/deleteQuestion.action',
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
