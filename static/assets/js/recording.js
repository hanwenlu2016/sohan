ss.imports(['dataTable'], function (exports) {
  var commonUrl = ss.options['commonUrl'];
  //数据表格
  ss.dataTable({
    appendTo: $('#dataCon')[0], //追加元素
    //数据选项
    dataOption: {
      listUrl: commonUrl + '/admin/record/queryByPage.action', //请求Url 
      type: 'post', //默认post请求
      dataType: 'json'
      //data:JSON.stringify({uuid:'',applyName:'',status:'',createTime:''}),
      //pageSize:5,//没值时，则默认是根据屏幕高度判断，保证一页
    },
    //搜索栏选项
    searchOption: [{
        name: '录音名称、录音内容',
        txt: 'recordContent',
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
    searchBtn: {},
    //表格内容
    table: {
      //各选项
      options: {
        showTitle: ['recordContent', 'recordPath', 'flowName'],
        dpWith: {
          recordName: 10,
          flowName: 10,
          createTime: 9,
          recordPath: 15
        },
        //isChangeTime:['startDate','endDate','createDate'],//是否进行时间戳转时间
        isChangeTime: ['createTime'], //是否进行时间戳转时间
      },
      tlName: ['录音名称', '流程名称', '录音内容', '录音路径', '创建时间'], //表头名字
      tlTxt: ['recordName', 'flowName', 'recordContent', 'recordPath', 'createTime'], //表头字段
      //操作项
      operation: [
        //编辑和删除为默认，其它按钮需txt
//      {
//        name: '编辑',
//        url: commonUrl + '/admin/record/update.action',
//        dataType: 'json',
//        items: {
//          recordName: {
//            name: '录音名称',
//            type: 'txt',
//            disabled: true,
//            verify: true
//          },
//          recordPath: {
//            name: '录音路径',
//            type: 'txt',
//            verify: true
//          },
//        },
//        data: {
//          uuid: ''
//        },
//      },
        {
          name: '上传录音',
        	colType: 'opt2',
        	cbFn:function(curData,self){
        		ss.getDom('#uuidWrap').value = curData['uuid'];
        		ss.getDom('#flowNameWrap').value = curData['flowName'];
        		//弹窗显示
        		ss.mdfCss(ss.getDom('#dataCon3'),[
        			'display','block','width',ss.paraWrap.clw*0.4+'px',
        			'height','200px','top','150px','left',ss.paraWrap.clw*0.3+'px'
        		]);
        		//弹窗隐藏
        		ss.getDom('#closeSvg_1').onclick = function(){
        			ss.mdfCss(ss.getDom('#dataCon3'),['display','none']);
        		};
        		//打开时，先清空input文件
        		ss.getDom('[name="file"]').value = '';
        		ss.getDom('[for="file"]').innerHTML = '请选择录音文件';
        		
        		//文件格式校验
						ss.getDom('[name="file"]').onchange = function(){
							var file = this.files[0];
							//判断所选择文件是否为excel文件类型
							if(/\.mp3|\.wav|\.wma|\.ogg|\.ape|\.aac/.test(file.name)){
								this.parentNode.querySelector('label').innerHTML = file.name;
		            this.parentNode.querySelector('label').title = file.name;
							}
							else{
								layer.msg ('非音频文件，请重新选择');
								return;
							}
						};
						//上传
						ss.getDom('#updateBtn_1').onclick = function(){
							//提交前参数判断
							if(document.querySelector('[for="file"]').innerHTML.indexOf('请选择')!=-1){
								layer.msg ('请先选择音频文件！');
								return false;
							};
							var options={
								type: 'post',
								url:'/admin/record/uploadFile.action',
								beforeSend: function(request) {
									ss.c3Loading.show();
								},
								success:function(data){
									if(data.result=='success'){
										ss.c3Loading.hidden();
			        			ss.mdfCss(ss.getDom('#dataCon3'),['display','none']);
			        			self.lg_reloadFn();//列表重载
			        			ss.layer.msg('上传成功！');
									}
									else{
			        			ss.layer.msg(data['data']&&data['msgError']&&'系统异常！');
									}
									console.log(data);
								}
							};
							$('#frm_ps').ajaxSubmit(options); 
						};//上传事件
        	}
        }
        ,
        {
          name: '播放',
          colType: 'opt1',
          cbFn: function (curData, self) {
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
        }
      ]
    },
    //分页
    pageOption: {
      //各选项
    }
  })
})