ss.imports(['dataTable'], function (exports) {
  var commonUrl = ss.options['commonUrl'];
  //数据表格
  ss.dataTable({
    appendTo: $('#dataCon')[0], //追加元素
    //数据选项
    dataOption: {
      listUrl: commonUrl + '/admin/label/queryByPage.action', //请求Url 
      type: 'post', //默认post请求
      dataType: 'json'
      //data:JSON.stringify({uuid:'',applyName:'',status:'',createTime:''}),
      //pageSize:5,//没值时，则默认是根据屏幕高度判断，保证一页
    },
    //搜索栏选项
    searchOption: [{
        name: '标签内容',
        txt: 'content',
        type: 'txt',
        width: '150px'
      }
    ],
    //搜索栏额外按钮
    searchBtn: { //默认
      add: {
        name: '添加+',
        dataType: 'json',
        colType: 'add',
        url: commonUrl + '/admin/label/add.action',
        items: {
          labelName: {
            name: '标签名称',
            type: 'txt'
          },
          labelNum: {
            name: '标签标识',
            type: 'txt'
          },
          remark: {
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
        //dpWith:{createTime:10,accountId:8},
        //isChangeTime:['startDate','endDate','createDate'],//是否进行时间戳转时间
        isChangeTime: ['createTime'], //是否进行时间戳转时间
      },
      tlName: ['标签名称', '标签标识', '备注', '创建人', '创建时间'], //表头名字
      tlTxt: ['labelName', 'labelNum', 'remark', 'createAuthor', 'createTime'], //表头字段
      //操作项
      operation: [
        //编辑和删除为默认，其它按钮需txt
        {
          name: '编辑',
          url: commonUrl + '/admin/label/update.action',
          dataType: 'json',
          items: {
            labelName: {
              name: '标签名称',
              type: 'txt',
              verify: true
            },
            labelNum: {
              name: '标签标识',
              type: 'txt',
              verify: true
            },
            remark: {
              name: '备注',
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
          url: commonUrl + '/admin/label/delete.action',
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