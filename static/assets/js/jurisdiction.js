ss.imports(['dataTable'],function(exports) {
  var commonUrl = ss.options['commonUrl'];
  ss.mdfCss(ss.getDom('.ly_ssView'),['position','relative']);

  //弹窗对象
  function View(obj){
      this.sourceObj = obj;
      this.domWrap = {};
      this.scope = {};
  };
  View.prototype = {
      constructor:View,//构造函数
      //初始化
      init:function(){

      },
      //弹窗渲染
      rd_viewFn:function(titName,typeTxt,addType,curData){
          //titName:标题名 typeTxt:弹窗类型
          var self = this,obj = self.sourceObj;
          var viewContainer = document.createDocumentFragment();
          //遮罩层
          var shadeView = ss.crtDom('div','view_shade','',viewContainer,{
              cn:['width','height','position','top','left','backgroundColor','opacity','zIndex','display'],
              cv:[ss.paraWrap.clwx,ss.paraWrap.clhx,'fixed','0px','0px','#000',.3,1300,'block']
          });
          //内容
          var conView = ss.crtDom('div','view_con','',viewContainer,{
              cn:['width','position','top','left','backgroundColor','borderRadius','zIndex','padding','display'],
              cv:[ss.paraWrap.clw*.5+'px','fixed',ss.paraWrap.clh *.2+'px',ss.paraWrap.clw*.25+'px','#fff','5px',1301,'0% 3%','block']
          })
              .appendDom(function(dom){
                  //内容标题
                  ss.crtDom('div','viewC_tit',titName,dom,{
                      cn:['cursor','widht','height','fontSize','color','borderBottom','position','lineHeight','textAlign','color'],
                      cv:['move','100%','48px','17px','1f1f1f','1px solid #e5e5e5','relative','48px','center','#333'],
                      an:['flag'],
                      av:[typeTxt]
                  });
                  //内容容器
                  ss.crtDom(addType?'form':'div','viewC_con','',dom,{
                      cn:['width','boxSizing','padding','clear','transition'],
                      cv:['100%','border-box','10px 0px','both','all .3s'],
                  });
                  //内容按钮容器
                  ss.crtDom('div','viewC_btn','',dom,{
                      cn:['width','height','fontSize','boxSizing','bottom','borderTop','left','lineHeight','textAlign'],
                      cv:['100%','54px','18px','border-box','0px','1px solid #e5e5e5','0%','54px','center'],
                  })
                      .appendDom(function(dom){
                          //不是查看，才渲染保存按钮
                          if(typeTxt!='dtl'){
                              //保存按钮
                              ss.crtDom('span','viewC_btnSave','保存',dom,{
                                  cn:['color','backgroundColor','fontSize','padding','borderRadius','marginRight','cursor'],
                                  cv:['#fff','#3089DC','13px','3px 14px','2px','15px','pointer']
                              },[
                                  'click',function(dom){
                                      var typeTxt = ss.getDom('.viewC_tit',dom.parentNode.parentNode).getAttribute('flag');
                                      //新增
                                      if(typeTxt === 'add'){
                                          var addParaObj = self['scope']['addParaObj'];
                                          var addParaVerObj = self['scope']['addParaVerObj'];
                                          for(var x in addParaVerObj){
                                              if(!addParaObj[x]){
                                                  ss.layer.msg(addParaVerObj[x]+'未填写！',{offset:'150px'});
                                                  return;
                                              }
                                          };
                                          //存在额外固定值，则追加
                                          var extraPara = obj.searchBtn.add.extraPara;
                                          if(extraPara && ss.judgeObj(extraPara) && ss.getObjleg(extraPara)!=0 ){
                                              for(var xx in extraPara){
                                                  addParaObj[xx] = extraPara[xx];
                                              }
                                          };
                                          var fqObj = {
                                              url:obj.searchBtn.add.url,
                                              type:obj.searchBtn.add.type||'post',
                                              data: (obj.searchBtn.add.dataType &&  obj.searchBtn.add.dataType === 'json') ? JSON.stringify(addParaObj) : addParaObj
                                          };
                                          obj.searchBtn.add.dataType &&  obj.searchBtn.add.dataType === 'json' && (fqObj['dataType']='json');
                                          //校验通过，进行接口动作
                                          self.ajax(
                                              fqObj
                                              ,
                                              //success
                                              function(data){
                                                  layer.msg('新增成功！');//提示
                                                  permissionInstance.lg_reload_defaultFn('',addType);//重载_默认项
                                              },
                                              //complete
                                              function(){
                                                  self.lg_hiddenViewFn();//隐藏弹窗
                                              },
                                              //beforeSend
                                              function(request){
                                                  obj.searchBtn.add.dataType &&  obj.searchBtn.add.dataType === 'json' &&
                                                  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                                              }
                                          );
                                      };
                                      //编辑
                                      if(typeTxt === 'edit'){
                                          var editParaObj = self['scope']['editParaObj'];
                                          var editParaVerObj = self['scope']['editParaVerObj'];
                                          var otherEditObj = self['scope']['otherEditObj'];
                                          var editItem = self['scope']['editItem'];
                                          //校验参数
                                          for(var x in editParaVerObj){
                                              if(!editParaObj[x]){
                                                  ss.layer.msg(editParaVerObj[x]+'未填写！',{offset:'150px'});
                                                  return;
                                              }
                                          };
                                          //校验通过，进行接口动作
                                          for(var w in otherEditObj){
                                              editParaObj[w]  = otherEditObj[w];
                                          };
                                          var queryObj = editParaObj;
                                          //根据操作项数组，获取对应的{}数据
                                          var editBtnObj;
                                          function getEditBtnObj(str){
                                              for(var a=0; a<obj.table.operation.length; a++){
                                                  if(obj.table.operation[a].flag==str || obj.table.operation[a].name=='编辑'){
                                                      return obj.table.operation[a];
                                                  };
                                              };
                                          };
                                          obj.table.operation && obj.table.operation.length!==0 &&
                                          (editBtnObj = getEditBtnObj('edit'));
                                          //editBtnObj -> 编辑项的对象
                                          //是否json类型提交
                                          var isJsonTF = editBtnObj.dataType &&  editBtnObj.dataType === 'json';
                                          if(editBtnObj.updateType && editBtnObj.updateType=='all'){
                                              var tempObj = curData;
                                              for(var d in queryObj){
                                                  tempObj[d] = queryObj[d];
                                              }
                                              queryObj = tempObj;
                                          };

                                          var fqObj = {
                                              url:editItem.url,
                                              type:editBtnObj.type||'post',
                                              data:isJsonTF ? JSON.stringify(queryObj) : queryObj
                                          };
                                          isJsonTF && (fqObj['dataType']='json');
                                          self.ajax(
                                              fqObj
                                              ,
                                              //success
                                              function(data){
                                                  layer.msg('编辑成功！');//提示
                                                  permissionInstance.lg_reload_defaultFn(curData,addType);//重载_默认项
                                              },
                                              //complete
                                              function(){
                                                  self.lg_hiddenViewFn();//隐藏弹窗
                                              },
                                              //beforeSend
                                              function(request){
                                                  isJsonTF  &&
                                                  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                                              }
                                          );
                                      };

                                  }
                              ]);
                          };
                          //取消按钮
                          ss.crtDom('span','viewC_btnCan','取消',dom,{
                              cn:['color','backgroundColor','fontSize','padding','borderRadius','marginLeft','cursor'],
                              cv:['#fff','#3089DC','13px','3px 14px','2px','15px','pointer']
                          },[
                              'click',function(dom){
                                  self.lg_hiddenViewFn();
                              }
                          ])
                      })

              });
          self.domWrap['shadeView'] = shadeView;
          self.domWrap['conView'] = conView;
          self.domWrap['viewC_tit'] = ss.getDom('.viewC_tit',conView);
          self.domWrap['viewC_con'] = ss.getDom('.viewC_con',conView);
          self.domWrap['viewC_btnSave'] = ss.getDom('.viewC_btnSave',conView);
          ss.drag(self.domWrap['viewC_tit'],self.domWrap['conView']);//拖拽
          ss.getDom('body').appendChild(viewContainer);
      },
      //弹窗新增
      lg_addViewFn:function(titleName,type,addType){
          var self = this,obj = self.sourceObj;
          self.rd_viewFn(titleName,type,addType);//渲染弹窗容器
          //新增数据
          var addViewData = (obj.searchBtn&&obj.searchBtn.add&&obj.searchBtn.add.items) ? obj.searchBtn.add.items : ss.error('缺少新增参数！');
          //虚拟dom
          var nviewContainer = document.createDocumentFragment();
          //新增参数存储
          self['scope']['addParaObj'] = {};
          //需要校验的参数存储
          self['scope']['addParaVerObj'] = {};
          //渲染
          for(var x in addViewData){
              self['scope']['addParaObj'][x] = '';//各个字段为空
              addViewData[x].verify && (self['scope']['addParaVerObj'][x] = addViewData[x].name);
              var itemH = '40px';//每项高度
              //选项容器
              var itemDom = ss.crtDom('div','items','',nviewContainer,{
                  cn:['width','height','lineHeight',addViewData[x].type === 'pic'&&'marginTop'],
                  cv:[
                      '100%',
                      (addViewData[x].type === 'mulSelect'||addViewData[x].type === 'pic'||addViewData[x].type === 'video')
                          ?
                          'auto'
                          :
                          itemH,itemH,'10px'
                  ],
                  an:['name'],
                  av:[x]
              })
              .appendDom([
                  //左---
                  ss.crtDom('div','',addViewData[x].verify?'* '+addViewData[x].name+'：':addViewData[x].name+'：','',{
                      cn:['display','verticalAlign','width','height','textAlign','paddingRight','paddingLeft','fontSize'],
                      cv:['inline-block','top','40%','100%','right','20px','10px','14px']
                  }),
                  //右---
                  ss.crtDom('div','','','',{
                      cn:['display','verticalAlign','width','height','paddingRight'],
                      cv:['inline-block','top','60%','100%',addViewData[x].type === 'mulSelect'?'50px':'50px']
                  })
                  .appendDom(function(dom){
                      //txt类型
                      if(addViewData[x].type === 'txt'){
                          ss.crtDom('input','','',dom,{
                              cn:['width','height','borderBottom','fontSize','marginTop'],
                              cv:['100%','30px','1px solid #ccc','14px','6px'],
                              an:['placeholder','type','name'],
                              av:[addViewData[x].placeholder || '请输入'+addViewData[x].name,'text',x]
                          },[
                              'change',function(dom){
                                  self['scope']['addParaObj'][dom.getAttribute('name')] = dom.value;
                              }
                          ]);
                      };
                      //area类型
                      if(addViewData[x].type === 'area'){
                          ss.crtDom('textarea','add','',dom,{
                              cn:['width','height','border','fontSize','marginTop','padding'],
                              cv:['100%','60px','1px solid #ccc','14px','6px','10px'],
                              an:['placeholder','name'],
                              av:[addViewData[x].placeholder || '请输入'+addViewData[x].name,x]
                          },[
                              'change',function(dom){
                                  var curVal = dom.value;
                                  if(/([^\u4e00-\u9fa5|\w])/.test(curVal) && addViewData[x].wrap ){
                                      var nCode = /([^\u4e00-\u9fa5|\w])/g.exec(curVal)[0];
                                      var tempArr = curVal.split(nCode);
                                      var endStr = '';
                                      for(var b=0; b<tempArr.length; b++){
                                          endStr = endStr + '<p>'+tempArr[b]+'</p>'
                                      }
                                      self['scope']['addParaObj'][dom.getAttribute('name')] = endStr;
                                  }
                                  else{
                                      self['scope']['addParaObj'][dom.getAttribute('name')] = dom.value;
                                  };
                              }
                          ])
                      };
                      //num类型
                      if(addViewData[x].type === 'num'){
                          ss.crtDom('input','','',dom,{
                              cn:['width','height','borderBottom','fontSize','marginTop'],
                              cv:['100%','30px','1px solid #ccc','14px','6px'],
                              an:['placeholder','type','name'],
                              av:[addViewData[x].placeholder || '请输入'+addViewData[x].name,'number',x]
                          },[
                              'change',function(dom){
                                  self['scope']['addParaObj'][dom.getAttribute('name')] = dom.value;
                              }
                          ]);
                      };
                      //time类型
                      if(addViewData[x].type === 'time'){
                          var timeDom = ss.crtDom('input','','',dom,{
                              cn:['width','height','borderBottom','fontSize','marginTop'],
                              cv:['100%','30px','1px solid #ccc','14px','6px'],
                              an:['placeholder','name'],
                              av:[addViewData[x].placeholder || '请选择'+addViewData[x].name,x]
                          });
                          !ss.laydate && ss.error('未引入时间控件！')
                          ss.laydate.render({
                              elem: timeDom,
                              type:addViewData[x].timeType||'date',
                              value:'',
                              done:function(val){
                                  self['scope']['addParaObj'][timeDom.getAttribute('name')] = val;
                              }
                          })
                      };
                      //select类型
                      if(addViewData[x].type === 'select'){
                          ss.crtDom('div','',addViewData[x].placeholder || addViewData[x].name,dom,{
                              cn:['width','height','lineHeight','padding','border','backgroundColor','color','fontSize','borderRadius','userSelect','cursor','position','marginTop'],
                              cv:[addViewData[x].width?addViewData[x].width:'80%','30px','30px','0px 10px','1px solid #dee4f1','#f4f8fa','#757575','13px','3px','none','pointer','relative','5px'],
                              an:['name','code'],
                              av:[x,'']
                          },[
                              'click',function(dom,e){
                                  //下拉框展开
                                  ss.getDom('.selectItems',dom).style.display = 'block';
                                  ss.getDom('.dateSvg',dom).style.transform = 'rotate(180deg)';
                                  ss.mdfCss(dom,['boxShadow','0px 0px .5px .3px #1890ff','border','1px solid #f4f8fa']);
                                  //展开高亮
                                  var pDoms = ss.getDom('.selectItems',dom).children;
                                  for(var c=0; c<pDoms.length; c++){
                                      ss.mdfCss(pDoms[c],['backgroundColor','#fff','color',pDoms[c].getAttribute('code')?'#333':'#ccc']);
                                  }
                                  if(dom.getAttribute('code')){
                                      for(var b=0; b<pDoms.length; b++){
                                          pDoms[b].getAttribute('code')&& pDoms[b].getAttribute('code')===dom.getAttribute('code')
                                          &&
                                          ss.mdfCss(pDoms[b],['backgroundColor','rgb(41, 103, 153)','color','#fff']);
                                      }
                                  };
                                  var curDom = dom;
                                  //下拉框隐藏
                                  var clearStatuFn = function(){
                                      var dom = ss.getDom('.selectItems',curDom);
                                      ss.getDom('.selectItems',curDom).style.display = 'none';
                                      ss.getDom('.dateSvg',dom.parentNode).style.transform = 'rotate(0deg)';//icon旋转
                                      ss.mdfCss(dom.parentNode,['boxShadow','none','border','1px solid #dee4f1','color',dom.parentNode.getAttribute('code')?'#000':'#757575']);//
                                  };
                                  if(ss.bodyClickObj.listeners[location.hash.slice(1)]){
                                      var tempArr = ss.bodyClickObj.listeners[location.hash.slice(1)];
                                      tempArr.push(function(){
                                          clearStatuFn();
                                      });
                                      ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
                                  }
                                  else{
                                      var tempArr = [];
                                      tempArr.push(function(){
                                          clearStatuFn();
                                      });
                                      ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
                                  };

                                  e.stopPropagation();
                              }
                          ])
                              .appendDom([
                                  //select->icon
                                  ss.crtDom('span','dateSvg',ss.svgRepository.sl_ad(14,'#555'),'',{
                                      cn:['display','top','right','width','height','position','lineHeight'],
                                      cv:['block','8px','5px','14px','14px','absolute','14px']
                                  }),
                                  //select->con
                                  ss.crtDom('div','selectItems','','',{
                                      cn:['width','height','border','position','top','left','backgroundColor','borderRadius','overflowX','overflowY','display','zIndex'],
                                      cv:[addViewData[x].width?addViewData[x].width:'100%',addViewData[x].data.length<5?'auto':addViewData[x].data.length*30+'px','1px solid #ccc','absolute','32px','-1px','#fff','3px','hidden','auto','none',13]
                                  })
                                      .appendDom(function(dom){
                                          if(addViewData[x].data){
                                              //[{name:''+addViewData[x].name+'',code:''}].concat(addViewData[x].data).forEach(function(v,i){
                                              var crtDom = function(dataArr,sData){
                                                  [{name:''+addViewData[x].name+'',code:''}].concat(dataArr).forEach(function(v,i){
                                                      ss.crtDom('p','',v.name,dom,{
                                                          cn:['padding','color','fontSize','overflow','textOverflow','whiteSpace'],
                                                          cv:['0px 10px',i===0?'#ccc':'#333','13px','hidden','ellipsis','nowrap'],
                                                          an:['code'],
                                                          av:[v.code]
                                                      },[
                                                          'mouseenter',function(dom){
                                                              ss.mdfCss(dom,['backgroundColor','rgb(41, 103, 153)','color','#fff'])
                                                          },
                                                          'mouseleave',function(dom){
                                                              var isTF = dom.getAttribute('code')&&dom.parentNode.parentNode.getAttribute('code')===dom.getAttribute('code');//满足选中状态
                                                              ss.mdfCss(dom,['backgroundColor',isTF?'rgb(41, 103, 153)':'#fff','color',isTF?'#fff':(dom.getAttribute('code')?'#333':'#ccc')]);
                                                          },
                                                          'click',function(dom,e){
                                                              ss.setDomTxt(dom.parentNode.parentNode,dom.innerHTML);//赋值
                                                              dom.parentNode.parentNode.setAttribute('code',dom.getAttribute('code'));//code属性赋值
                                                              self['scope']['addParaObj'][dom.parentNode.parentNode.getAttribute('name')] = dom.getAttribute('code');
                                                              dom.parentNode.style.display = 'none';//下拉框隐藏
                                                              ss.getDom('.dateSvg',dom.parentNode.parentNode).style.transform = 'rotate(0deg)';//icon旋转
                                                              ss.mdfCss(dom.parentNode.parentNode,['boxShadow','none','border','1px solid #dee4f1','color',dom.getAttribute('code')?'#000':'#757575']);//
                                                              //点击回调
                                                              var indexVal = dom.parentNode.parentNode.parentNode.parentNode.getAttribute('name');
                                                              addViewData[indexVal].cbFn && addViewData[indexVal].cbFn(dom,sData[i]);
                                                              e.stopPropagation();
                                                          }
                                                      ])
                                                  })
                                              };

                                              //是否数组，对象则需要动态获取
                                              ss.judgeArr(addViewData[x].data)
                                                  ?
                                                  crtDom(addViewData[x].data)
                                                  :
                                                  (function(){
                                                      var isJsonTF = addViewData[x].data.dataType && addViewData[x].data.dataType === 'json';
                                                      var fqObj = {
                                                          url:addViewData[x].data.url,
                                                          type:addViewData[x].data.type||'post'
                                                      };
                                                      //data:isJsonTF ? JSON.stringify(tempObj) : tempObj,
                                                      isJsonTF && (fqObj['dataType']='json');//json方式传输赋值
                                                      addViewData[x].data.data &&
                                                      (fqObj['data']=isJsonTF ? JSON.stringify(addViewData[x].data.data) : addViewData[x].data.data);//json方式传输赋值

                                                      var selDataObj = addViewData[x].data;
                                                      //获得数据
                                                      self.ajax(
                                                          fqObj,
                                                          function(data){
                                                              var selDatas = data['data'];
                                                              selDataObj['digitalModel'] && (selDatas = self.digitalModelFn(data,'data',selDataObj['digitalModel']));
                                                              var newWrap = [];
                                                              var isName = selDataObj['rely'] && selDataObj['rely']['name'];
                                                              var isCode = selDataObj['rely'] && selDataObj['rely']['code'];
                                                              for(var v=0; v<selDatas.length; v++){
                                                                  newWrap.push({
                                                                      name: isName ? selDatas[v][selDataObj['rely']['name']] : selDatas[v]['name'],
                                                                      code: isCode ? selDatas[v][selDataObj['rely']['code']] : selDatas[v]['code']
                                                                  });
                                                              };
                                                              crtDom(newWrap,selDatas);
                                                          },
                                                          //complete
                                                          function(){

                                                          },
                                                          //beforeSend
                                                          function(request){
                                                              isJsonTF  &&
                                                              request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                                                          }
                                                      );
                                                  }())
                                              ;
                                          }
                                          else{
                                              ss.error('下拉框选项数据未找到！');
                                              return;
                                          }
                                      })
                              ]);
                      };
                      //mulSelect类型
                      if(addViewData[x].type === 'mulSelect'){
                          ss.crtDom('div','','',dom,{
                              cn:['width','height','paddingTop'],
                              cv:['100%','auto','6px'],
                              an:['name','code'],
                              av:[x,'']
                          })
                              .appendDom(function(dom){
                                  //select->con
                                  ss.crtDom('div','selectItems','',dom,{
                                      cn:[
                                          'width','height', 'border','backgroundColor','borderRadius','zIndex','padding','paddingLeft'
                                      ],
                                      cv:[
                                          '100%','auto', '1px solid #ccc','#fff','3px',13,'5px','15px'
                                      ]
                                  })
                                      .appendDom(function(dom){
                                          //若存在form类型，则增加input赋值
                                          if(obj.searchBtn['add'].addType && obj.searchBtn['add'].addType=='form'){
                                              ss.crtDom('input','input','',dom,{
                                                  an:['type','name','id'],
                                                  av:['hidden',x,'input_form']
                                              });
                                          };
                                          if(addViewData[x].data){
                                              //[{name:''+addViewData[x].name+'',code:''}].concat(addViewData[x].data).forEach(function(v,i){
                                              var svgW = 20;
                                              var crtDom = function(dataArr){
                                                  dataArr.forEach(function(v,i){
                                                      ss.crtDom('p','',v.name,dom,{
                                                          cn:['padding','color','fontSize','display','boxSizing','paddingLeft','position','userSelect','marginRight','cursor'],
                                                          cv:['0px 5px','#bbb','13px','inline-block','content-box','25px','relative','none','10px','pointer'],
                                                          an:['code'],
                                                          av:[v.code]
                                                      },[
                                                          'click',function(dom){
                                                              function setId(type,str){
                                                                  var fscope = dom.parentNode.parentNode;
                                                                  var fscopeWrap = fscope.getAttribute('code') ? fscope.getAttribute('code').split(',') : [];
                                                                  if(type=='add'){
                                                                      fscopeWrap.push(str);
                                                                  }
                                                                  else{
                                                                      fscopeWrap.splice(fscopeWrap.indexOf(str),1);
                                                                  };
                                                                  fscope.setAttribute('code',fscopeWrap.join());
                                                                  self['scope']['addParaObj'][fscope.getAttribute('name')] = fscope.getAttribute('code');//赋值给新增参数对象
                                                                  //若是form类型
                                                                  if(obj.searchBtn['add'].addType && obj.searchBtn['add'].addType=='form'){
                                                                      ss.getDom('#input_form') && (ss.getDom('#input_form').value=fscopeWrap.join());
                                                                  }
                                                              };
                                                              if(dom.getAttribute('ischeck') && dom.getAttribute('ischeck')=='true'){
                                                                  ss.getDom('.svg',dom).innerHTML = ss. svgRepository.checkboxIcon(svgW,'#bbb');
                                                                  ss.mdfCss(dom,['color','#bbb']);
                                                                  ss.mdfAttr(dom,['ischeck','false']);
                                                                  setId('sul',dom.getAttribute('code'));
                                                              }
                                                              else{
                                                                  ss.getDom('.svg',dom).innerHTML = ss. svgRepository.checkboxIcon(svgW,'#3089DC');
                                                                  ss.mdfCss(dom,['color','#3089DC']);
                                                                  ss.mdfAttr(dom,['ischeck','true']);
                                                                  setId('add',dom.getAttribute('code'));
                                                              };
                                                          }
                                                      ])
                                                          .appendDom(function(dom){
                                                              //svg
                                                              ss.crtDom('div','svg',ss.svgRepository.checkboxIcon(svgW,'#bbb'),dom,{
                                                                  cn:['position','width','height','top','left'],
                                                                  cv:['absolute',svgW+'px',svgW+'px','8px','0px']
                                                              });
                                                          })
                                                  })
                                              };

                                              //是否数组，对象则需要动态获取
                                              ss.judgeArr(addViewData[x].data)
                                                  ?
                                                  crtDom(addViewData[x].data)
                                                  :
                                                  (function(){
                                                      var isJsonTF = addViewData[x].data.dataType && addViewData[x].data.dataType === 'json';
                                                      var fqObj = {
                                                          url:addViewData[x].data.url,
                                                          type:addViewData[x].data.type||'post'
                                                      };
                                                      //data:isJsonTF ? JSON.stringify(tempObj) : tempObj,
                                                      isJsonTF && (fqObj['dataType']='json');//json方式传输赋值
                                                      addViewData[x].data.data &&
                                                      (fqObj['data']=isJsonTF ? JSON.stringify(addViewData[x].data.data) : addViewData[x].data.data);//json方式传输赋值

                                                      var selDataObj = addViewData[x].data;
                                                      //获得数据
                                                      self.ajax(
                                                          fqObj,
                                                          function(data){
                                                              var selDatas = data['data'];
                                                              selDataObj['digitalModel'] && (selDatas = self.digitalModelFn(data,'data',selDataObj['digitalModel']));
                                                              var newWrap = [];
                                                              var isName = selDataObj['rely'] && selDataObj['rely']['name'];
                                                              var isCode = selDataObj['rely'] && selDataObj['rely']['code'];
                                                              for(var v=0; v<selDatas.length; v++){
                                                                  newWrap.push({
                                                                      name: isName ? selDatas[v][selDataObj['rely']['name']] : selDatas[v]['name'],
                                                                      code: isCode ? selDatas[v][selDataObj['rely']['code']] : selDatas[v]['code']
                                                                  });
                                                              };
                                                              crtDom(newWrap);
                                                          },
                                                          //complete
                                                          function(){

                                                          },
                                                          //beforeSend
                                                          function(request){
                                                              isJsonTF  &&
                                                              request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                                                          }
                                                      );
                                                  }())
                                              ;
                                          }
                                          else{
                                              ss.error('下拉框选项数据未找到！');
                                              return;
                                          }
                                      })
                              }
                          );
                      };
                      //图片类型
                      if(addViewData[x].type === 'pic'){
                          ss.crtDom('div','','',dom,{
                              cn:['width','height'],
                              cv:['100%','auto'],
                          })
                              .appendDom(function(dom){
                                  //图片各项

                                  [1,2].forEach(function(v){
                                      ss.crtDom('label','','',dom,{
                                          cn:['display','marginRight'],
                                          cv:['inline-block','10px'],
                                          an:['for'],
                                          av:[x+v]
                                      },[
                                          'click',function(dom){
                                              var showExcelNameFn = function(inputId){
                                                  document.getElementById(inputId).onchange = function(){
                                                      var preview = ss.getDom('.img',dom);
                                                      var addSvgDom = ss.getDom('.addSvg',dom);
                                                      var file = ss.getDom('input',dom).files[0];
                                                      var reader = new FileReader();
                                                      if (file) {
                                                          reader.readAsDataURL(file);
                                                      }
                                                      reader.addEventListener("load", function () {
                                                          preview.src = reader.result;
                                                          preview.style.display = 'block';
                                                          addSvgDom.style.display = 'none';
                                                      }, false);
                                                      return file;
                                                  }
                                              };
                                              showExcelNameFn(ss.getDom('input',dom).getAttribute('id'));
                                          }
                                      ])
                                          .appendDom(function(dom){
                                              ss.crtDom('div','selectItems','',dom,{
                                                  cn:[
                                                      'width','height', 'border','backgroundColor','borderRadius','zIndex','padding','cursor'
                                                  ],
                                                  cv:[
                                                      '90px','100px', '1px solid #ccc','#fff','3px',13,'5px','pointer'
                                                  ]
                                              })
                                                  .appendDom(function(dom){
                                                      var svgW = 40;
                                                      ss.crtDom('div','addSvg',ss.svgRepository.add(svgW,'#ccc'),dom,{
                                                          cn:['width','height','margin','position','marginTop'],
                                                          cv:[svgW+'px',svgW+'px','0 auto','relative','20px']
                                                      });
                                                      ss.crtDom('img','img','',dom,{
                                                          cn:['display','height','width','margin'],
                                                          cv:['none','100%','100%','0 auto'],
                                                          an:['type','id'],
                                                          av:['file',x+'_img']
                                                      });
                                                  });
                                              ss.crtDom('input','input','',dom,{
                                                  cn:['display'],
                                                  cv:['none'],
                                                  an:['type','id','name'],
                                                  av:['file',x+v,x]
                                              });
                                          });
                                  })
                              }
                          );
                      };
                      //视频类型
                      if(addViewData[x].type === 'video'){
                          ss.crtDom('div','','',dom,{
                              cn:['width','height'],
                              cv:['100%','auto'],
                          })
                              .appendDom(function(dom){
                                  //图片各项
                                  ss.crtDom('label','','',dom,{
                                      cn:['display','marginRight'],
                                      cv:['inline-block','10px'],
                                      an:['for'],
                                      av:[x]
                                  },[
                                      'click',function(dom){
                                          var showExcelNameFn = function(inputId){
                                              document.getElementById(inputId).onchange = function(){
                                                  var file = this.files[0];
                                                  //判断所选择文件是否为excel文件类型
                                                  //if(/\.xl/.test(file.name)){
                                                  if(true){
                                                      ss.getDom('.wrap',dom).innerHTML = String(file.name);
                                                  }
                                                  else{
                                                      layer.msg ('非视频文件，请重新选择');
                                                      return;
                                                  }

                                              }
                                          };
                                          showExcelNameFn(ss.getDom('input',dom).getAttribute('id'));
                                      }
                                  ])
                                      .appendDom(function(dom){
                                          ss.crtDom('div','wrap','',dom,{
                                              cn:[
                                                  'width','height', 'border','backgroundColor','borderRadius','zIndex','padding','cursor'
                                              ],
                                              cv:[
                                                  '90px','100px', '1px solid #ccc','#fff','3px',13,'5px','pointer'
                                              ]
                                          })
                                              .appendDom(function(dom){
                                                  var svgW = 40;
                                                  ss.crtDom('div','addSvg',ss.svgRepository.add(svgW,'#ccc'),dom,{
                                                      cn:['width','height','margin','position','marginTop'],
                                                      cv:[svgW+'px',svgW+'px','0 auto','relative','20px']
                                                  });
                                              });
                                          ss.crtDom('input','input','',dom,{
                                              cn:['display'],
                                              cv:['none'],
                                              an:['type','id','name'],
                                              av:['file',x,x]
                                          });
                                      });
                              }
                          );
                      };
                  })
              ]);
              addViewData[x].type === 'area' && (itemDom.style.height = 'auto');
          };//for循环
          self.domWrap['viewC_con'].appendChild(nviewContainer);
      },
      //弹窗编辑
      lg_editViewFn:function(curData,type,listType){
          var self = this,obj = self.sourceObj;
          //编辑数据
          var operationArr = obj.table.operation;
          //editItem：整个编辑配置项
          //editObj：主键的值
          var editObj,editItem;
          for(var a=0; a<operationArr.length; a++){
              (operationArr[a].name === '编辑' || operationArr[a].flag==='edit') &&
              (editItem = operationArr[a],editObj = (typeof operationArr[a].data=='string'  ? JSON.parse(operationArr[a].data) : operationArr[a].data));
          };
          self.rd_viewFn(editItem['name'],type,listType,curData);//渲染弹窗
          for(var s in editObj){
              editObj[s] = curData[s];
          };
          var editViewData = editItem.items ? editItem.items : ss.error('缺少编辑参数！');
          //虚拟dom
          var eviewContainer = document.createDocumentFragment();
          //编辑参数存储
          self['scope']['editParaObj'] = {};
          //需要校验的参数存储
          self['scope']['editParaVerObj'] = {};
          //额外的编辑字段
          self['scope']['otherEditObj'] = editObj;
          self['scope']['editItem'] = editItem;
          //渲染
          for(var x in editViewData){
              self['scope']['editParaObj'][x] = curData[x];//各个字段为空
              editViewData[x].verify && (self['scope']['editParaVerObj'][x] = editViewData[x].name);
              var itemH = '40px';//每项高度
              //选项容器
              ss.crtDom('div','items','',eviewContainer,{
                  cn:['width','height','lineHeight'],
                  cv:['100%',editViewData[x].type === 'mulSelect'?'auto':itemH,itemH],
                  an:['name'],
                  av:[x]
              })
              .appendDom([
                  //左---
                  ss.crtDom('div','',editViewData[x].verify?'* '+editViewData[x].name+'：':editViewData[x].name+'：','',{
                      cn:['display','verticalAlign','width','height','textAlign','paddingRight','paddingLeft','fontSize'],
                      cv:['inline-block','top','40%','100%','right','20px','10px','14px']
                  }),
                  //右---
                  ss.crtDom('div','','','',{
                      cn:['display','verticalAlign','width','height','paddingRight'],
                      cv:['inline-block','top','60%','100%','50px']
                  })
                  .appendDom(function(dom){
                      //txt类型--------------------
                      if(editViewData[x].type === 'txt'){
                          ss.crtDom('input','','',dom,{
                              cn:['width','height','borderBottom','fontSize','marginTop'],
                              cv:['100%','30px','1px solid #ccc','14px','6px'],
                              an:['placeholder','type','name','value'],
                              av:[editViewData[x].placeholder || '请输入'+editViewData[x].name,'text',x,curData[x]?curData[x]:'']
                          },[
                              'change',function(dom){
                                  self['scope']['editParaObj'][dom.getAttribute('name')] = dom.value;
                              }
                          ]);
                      };
                      //num类型-------------------
                      if(editViewData[x].type === 'num'){
                          ss.crtDom('input','','',dom,{
                              cn:['width','height','borderBottom','fontSize','marginTop'],
                              cv:['100%','30px','1px solid #ccc','14px','6px'],
                              an:['placeholder','type','name','value'],
                              av:[editViewData[x].placeholder || '请输入'+editViewData[x].name,'number',x,curData[x]?curData[x]:'']
                          },[
                              'change',function(dom){
                                  self['scope']['editParaObj'][dom.getAttribute('name')] = dom.value;
                              }
                          ]);
                      };
                      //time类型------------------
                      if(editViewData[x].type === 'time'){
                          var timeDom = ss.crtDom('input','','',dom,{
                              cn:['width','height','borderBottom','fontSize','marginTop'],
                              cv:['100%','30px','1px solid #ccc','14px','6px'],
                              an:['placeholder','name'],
                              av:[editViewData[x].placeholder || '请选择'+editViewData[x].name,x]
                          });
                          !ss.laydate && ss.error('未引入时间控件！')
                          ss.laydate.render({
                              elem: timeDom,
                              type:editViewData[x].timeType||'date',
                              value:curData[x]?( curData[x].length===13 ? ss.dpDate.normal(curData[x]):curData[x]):'',
                              done:function(val){
                                  self['scope']['editParaObj'][timeDom.getAttribute('name')] = val;
                              }
                          })
                      };
                      //select类型----------------
                      if(editViewData[x].type === 'select'){
                          editViewData[x].data || ss.error('select类型缺少data数据！');
                          var curEditVal = '-';
                          ss.crtDom('div','',curEditVal,dom,{
                              cn:[
                                  'width','height','lineHeight','padding','border','backgroundColor','color','fontSize',
                                  'borderRadius','userSelect','cursor','position','marginTop'
                              ],
                              cv:[
                                  editViewData[x].width?editViewData[x].width:'80%','30px','30px','0px 10px','1px solid #dee4f1','#f4f8fa','#757575','13px',
                                  '3px','none','pointer','relative','5px'
                              ],
                              an:['name','code'],
                              av:[x,'']
                          },[
                              'click',function(dom,e){
                                  //下拉框展开
                                  ss.getDom('.selectItems',dom).style.display = 'block';
                                  ss.getDom('.dateSvg',dom).style.transform = 'rotate(180deg)';
                                  ss.mdfCss(dom,['boxShadow','0px 0px .5px .3px #1890ff','border','1px solid #f4f8fa']);
                                  //展开高亮
                                  var pDoms = ss.getDom('.selectItems',dom).children;
                                  for(var c=0; c<pDoms.length; c++){
                                      ss.mdfCss(pDoms[c],['backgroundColor','#fff','color',pDoms[c].getAttribute('code')?'#333':'#ccc']);
                                  }
                                  if(dom.getAttribute('code')){
                                      for(var b=0; b<pDoms.length; b++){
                                          pDoms[b].getAttribute('code')&& pDoms[b].getAttribute('code')===dom.getAttribute('code')
                                          &&
                                          ss.mdfCss(pDoms[b],['backgroundColor','rgb(41, 103, 153)','color','#fff']);
                                      }
                                  }
                                  var curDom = dom;
                                  //下拉框隐藏
                                  var clearStatuFn = function(){
                                      var dom = ss.getDom('.selectItems',curDom);
                                      ss.getDom('.selectItems',curDom) && (ss.getDom('.selectItems',curDom).style.display = 'none');
                                      ss.getDom('.dateSvg',dom.parentNode) && (ss.getDom('.dateSvg',dom.parentNode).style.transform = 'rotate(0deg)');//icon旋转
                                      ss.mdfCss(dom.parentNode,['boxShadow','none','border','1px solid #dee4f1','color',dom.parentNode.getAttribute('code')?'#000':'#757575']);//
                                  };
                                  if(ss.bodyClickObj.listeners[location.hash.slice(1)]){
                                      var tempArr = ss.bodyClickObj.listeners[location.hash.slice(1)];
                                      tempArr.push(function(){
                                          clearStatuFn();
                                      });
                                      ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
                                  }
                                  else{
                                      var tempArr = [];
                                      tempArr.push(function(){
                                          clearStatuFn();
                                      });
                                      ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
                                  };
                                  e.stopPropagation();
                              }
                          ])
                              .appendDom(function(dom){
                                  var fDom = dom;
                                  //select->icon
                                  ss.crtDom('span','dateSvg',ss.svgRepository.sl_ad(14,'#555'),dom,{
                                      cn:['display','top','right','width','height','position','lineHeight'],
                                      cv:['block','8px','5px','14px','14px','absolute','14px']
                                  }),
                                      //select->con
                                      ss.crtDom('div','selectItems','',dom,{
                                          cn:[
                                              'width','height',
                                              'border','position','top','left','backgroundColor','borderRadius','overflowX','overflowY','display','zIndex'
                                          ],
                                          cv:[
                                              editViewData[x].width?editViewData[x].width:'100%',editViewData[x].data.length<5?'auto':editViewData[x].data.length*30+'px',
                                              '1px solid #ccc','absolute','32px','-1px','#fff','3px','hidden','auto','none',13
                                          ],
                                          an:['txt'],
                                          av:[x]
                                      })
                                          .appendDom(function(dom){
                                              if(editViewData[x].data){
                                                  //[{name:''+editViewData[x].name+'',code:''}].concat(editViewData[x].data).forEach(function(v,i){
                                                  var crtDom = function(dataArr,type){

                                                      function endNameCodeFn(dataArr,curVal){
                                                          var tempObj = {};
                                                          for(var e=0; e<dataArr.length; e++){
                                                              (dataArr[e].code == curVal || dataArr[e].name == curVal) &&
                                                              (tempObj['eName']=dataArr[e].name,tempObj['eCode']=dataArr[e].code);
                                                          }
                                                          return tempObj;
                                                      };
                                                      var xx = dom.getAttribute('txt');//当前修改的字段
                                                      //追加编辑的默认值
                                                      if(type=='fixed'){
                                                          var endD = endNameCodeFn(editViewData[xx].data,curData[xx]);
                                                          ss.setDomTxt(fDom,endD.eName);
                                                          ss.mdfAttr(fDom,['code',endD.eCode]);
                                                      }
                                                      else{
                                                          var endD = endNameCodeFn(dataArr,curData[xx]);
                                                          ss.setDomTxt(fDom,endD.eName);
                                                          ss.mdfAttr(fDom,['code',endD.eCode]);
                                                      };
                                                      //遍历渲染fn
                                                      [{name:''+editViewData[x].name+'',code:''}].concat(dataArr).forEach(function(v,i){
                                                          ss.crtDom('p','',v.name,dom,{
                                                              cn:['padding','color','fontSize','overflow','textOverflow','whiteSpace'],
                                                              cv:['0px 10px',i===0?'#ccc':'#333','13px','hidden','ellipsis','nowrap'],
                                                              an:['code'],
                                                              av:[v.code]
                                                          },[
                                                              'mouseenter',function(dom){
                                                                  ss.mdfCss(dom,['backgroundColor','rgb(41, 103, 153)','color','#fff'])
                                                              },
                                                              'mouseleave',function(dom){
                                                                  var isTF = dom.getAttribute('code')&&dom.parentNode.parentNode.getAttribute('code')===dom.getAttribute('code');//满足选中状态
                                                                  ss.mdfCss(dom,['backgroundColor',isTF?'rgb(41, 103, 153)':'#fff','color',isTF?'#fff':(dom.getAttribute('code')?'#333':'#ccc')]);
                                                              },
                                                              'click',function(dom,e){
                                                                  ss.setDomTxt(dom.parentNode.parentNode,dom.innerHTML);//赋值
                                                                  dom.parentNode.parentNode.setAttribute('code',dom.getAttribute('code'));//code属性赋值
                                                                  self['scope']['editParaObj'][dom.parentNode.parentNode.getAttribute('name')] = dom.getAttribute('code');
                                                                  dom.parentNode.style.display = 'none';//下拉框隐藏
                                                                  ss.getDom('.dateSvg',dom.parentNode.parentNode).style.transform = 'rotate(0deg)';//icon旋转
                                                                  ss.mdfCss(dom.parentNode.parentNode,['boxShadow','none','border','1px solid #dee4f1','color',dom.getAttribute('code')?'#000':'#757575']);//
                                                                  e.stopPropagation();
                                                              }
                                                          ])
                                                      });
                                                  };

                                                  //是否数组，对象则需要动态获取
                                                  ss.judgeArr(editViewData[x].data)
                                                      ?
                                                      crtDom(editViewData[x].data,'fixed')
                                                      :
                                                      (function(){
                                                          var isJsonTF = editViewData[x].data.dataType && editViewData[x].data.dataType === 'json';
                                                          var fqObj = {
                                                              url:editViewData[x].data.url,
                                                              type:editViewData[x].data.type||'post',
                                                          };
                                                          isJsonTF && (fqObj['dataType']='json');//json方式传输赋值
                                                          editViewData[x].data.data &&
                                                          (fqObj['data']=isJsonTF ? JSON.stringify(editViewData[x].data.data) : editViewData[x].data.data);//json方式传输赋值
                                                          var selDataObj = editViewData[x].data;
                                                          //获得数据
                                                          self.ajax(
                                                              fqObj,
                                                              function(data){
                                                                  var selDatas = data['data'];
                                                                  selDataObj['digitalModel'] && (selDatas = self.digitalModelFn(data,'data',selDataObj['digitalModel']));
                                                                  var newWrap = [];
                                                                  var isName = selDataObj['rely'] && selDataObj['rely']['name'];
                                                                  var isCode = selDataObj['rely'] && selDataObj['rely']['code'];
                                                                  for(var v=0; v<selDatas.length; v++){
                                                                      newWrap.push({
                                                                          name: isName ? selDatas[v][selDataObj['rely']['name']] : selDatas[v]['name'],
                                                                          code: isCode ? selDatas[v][selDataObj['rely']['code']] : selDatas[v]['code']
                                                                      });
                                                                  };
                                                                  crtDom(newWrap);
                                                              },
                                                              //complete
                                                              function(){

                                                              },
                                                              //beforeSend
                                                              function(request){
                                                                  isJsonTF  &&
                                                                  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                                                              }
                                                          );
                                                      }())
                                              }
                                              else{
                                                  ss.error('下拉框选项数据data未配置！');
                                              }
                                          })
                              });
                      };
                      //mulSelect类型
                      if(editViewData[x].type === 'mulSelect'){
                          ss.crtDom('div','','',dom,{
                              cn:['width','height','paddingTop'],
                              cv:['100%','auto','6px'],
                              an:['name','code'],
                              av:[x,'']
                          })
                              .appendDom(function(dom){
                                  //select->con
                                  ss.crtDom('div','selectItems','',dom,{
                                      cn:[
                                          'width','height', 'border','backgroundColor','borderRadius','zIndex','padding','paddingLeft'
                                      ],
                                      cv:[
                                          '100%','auto', '1px solid #ccc','#fff','3px',13,'5px','15px'
                                      ]
                                  })
                                      .appendDom(function(dom){
                                          if(editViewData[x].data){
                                              var svgW = 20;
                                              var crtDom = function(dataArr,type){
                                                  //追加默认值
                                                  var xx = dom.parentNode.getAttribute('name');//当前修改的字段
                                                  var defaultVal = curData[xx]; //当前编辑的字段
                                                  dom.parentNode.setAttribute('code',defaultVal);//存储
                                                  var judgeArr = defaultVal ? defaultVal.split(',') :[];
                                                  dataArr.forEach(function(v,i){
                                                      ss.crtDom('p','',v.name,dom,{
                                                          cn:[
                                                              'padding','color',
                                                              'fontSize','display','boxSizing','paddingLeft','position','userSelect','marginRight','cursor'],
                                                          cv:[
                                                              '0px 5px',judgeArr.length!=0 ?(judgeArr.indexOf(String(v.code))!=-1?'#3089DC':'#bbb') :'#bbb',
                                                              '13px','inline-block','content-box','25px','relative','none','10px','pointer'],
                                                          an:['code','ischeck'],
                                                          av:[v.code,judgeArr.indexOf(String(v.code))!=-1?'true':'false']
                                                      },[
                                                          'click',function(dom){
                                                              function setId(type,str){
                                                                  var fscope = dom.parentNode.parentNode;
                                                                  var fscopeWrap = fscope.getAttribute('code') ? fscope.getAttribute('code').split(',') : [];
                                                                  if(type=='add'){
                                                                      fscopeWrap.push(str);
                                                                  }
                                                                  else{
                                                                      fscopeWrap.splice(fscopeWrap.indexOf(str),1);
                                                                  };
                                                                  fscope.setAttribute('code',fscopeWrap.join());
                                                                  self['scope']['editParaObj'][fscope.getAttribute('name')] = fscope.getAttribute('code');//赋值给新增参数对象
                                                              };
                                                              if(dom.getAttribute('ischeck') && dom.getAttribute('ischeck')=='true'){
                                                                  ss.getDom('.svg',dom).innerHTML = ss. svgRepository.checkboxIcon(svgW,'#bbb');
                                                                  ss.mdfCss(dom,['color','#bbb']);
                                                                  ss.mdfAttr(dom,['ischeck','false']);
                                                                  setId('sul',dom.getAttribute('code'));
                                                              }
                                                              else{
                                                                  ss.getDom('.svg',dom).innerHTML = ss. svgRepository.checkboxIcon(svgW,'#3089DC');
                                                                  ss.mdfCss(dom,['color','#3089DC']);
                                                                  ss.mdfAttr(dom,['ischeck','true']);
                                                                  setId('add',dom.getAttribute('code'));
                                                              };
                                                          }
                                                      ])
                                                          .appendDom(function(dom){
                                                              //svg
                                                              ss.crtDom('div','svg',ss.svgRepository.checkboxIcon(svgW,judgeArr.length!=0 ?(judgeArr.indexOf(String(v.code))!=-1?'#3089DC':'#bbb') :'#bbb'),dom,{
                                                                  cn:['position','width','height','top','left'],
                                                                  cv:['absolute',svgW+'px',svgW+'px','8px','0px']
                                                              });
                                                          })
                                                  })
                                              };

                                              //是否数组，对象则需要动态获取
                                              ss.judgeArr(editViewData[x].data)
                                                  ?
                                                  crtDom(editViewData[x].data,'fixed')
                                                  :
                                                  (function(){
                                                      var isJsonTF = editViewData[x].data.dataType && editViewData[x].data.dataType === 'json';
                                                      var fqObj = {
                                                          url:editViewData[x].data.url,
                                                          type:editViewData[x].data.type||'post'
                                                      };
                                                      //data:isJsonTF ? JSON.stringify(tempObj) : tempObj,
                                                      isJsonTF && (fqObj['dataType']='json');//json方式传输赋值
                                                      editViewData[x].data.data &&
                                                      (fqObj['data']=isJsonTF ? JSON.stringify(editViewData[x].data.data) : editViewData[x].data.data);//json方式传输赋值

                                                      var selDataObj = editViewData[x].data;
                                                      //获得数据
                                                      self.ajax(
                                                          fqObj,
                                                          function(data){
                                                              var selDatas = data['data'];
                                                              selDataObj['digitalModel'] && (selDatas = self.digitalModelFn(data,'data',selDataObj['digitalModel']));
                                                              var newWrap = [];
                                                              var isName = selDataObj['rely'] && selDataObj['rely']['name'];
                                                              var isCode = selDataObj['rely'] && selDataObj['rely']['code'];
                                                              for(var v=0; v<selDatas.length; v++){
                                                                  newWrap.push({
                                                                      name: isName ? selDatas[v][selDataObj['rely']['name']] : selDatas[v]['name'],
                                                                      code: isCode ? selDatas[v][selDataObj['rely']['code']] : selDatas[v]['code']
                                                                  });
                                                              };
                                                              crtDom(newWrap);
                                                          },
                                                          //complete
                                                          function(){

                                                          },
                                                          //beforeSend
                                                          function(request){
                                                              isJsonTF  &&
                                                              request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                                                          }
                                                      );
                                                  }())
                                              ;
                                          }
                                          else{
                                              ss.error('下拉框选项数据未找到！');
                                              return;
                                          }
                                      })
                              }
                          );
                      };
                  })
              ]);
          };//for循环
          self.domWrap['viewC_con'].appendChild(eviewContainer);
      },
      //弹窗查看
      lg_seaViewFn:function(paraObj,curData){
          var self = this,obj = self.sourceObj;
          self.rd_viewFn(paraObj.name,'dtl');//渲染弹窗
          var editBtnObj = paraObj;
          //渲染数据
          function seaRenderFn(seaData){
              //虚拟dom
              var eviewContainer = document.createDocumentFragment();
              var endSeaData = {};
              for(var s in editBtnObj.items){
                  endSeaData[s] = seaData[s];
              };
              //渲染
              for(var x in endSeaData){
                  var itemH = '40px';//每项高度
                  //选项容器
                  ss.crtDom('div','items','',eviewContainer,{
                      cn:['width','height','padding-top'],
                      cv:['100%','auto','8px'],
                      an:['name'],
                      av:[x]
                  })
                  .appendDom([
                      //左---
                      ss.crtDom('div','',editBtnObj.items[x]+'：','',{
                          cn:['display','verticalAlign','width','height','textAlign','paddingRight','paddingLeft','fontSize'],
                          cv:['inline-block','top','40%','100%','right','20px','10px','14px']
                      }),
                      //右---
                      ss.crtDom('div','','','',{
                          cn:['display','verticalAlign','width','height','paddingRight'],
                          cv:['inline-block','top','60%','100%','50px']
                      })
                      .appendDom(function(dom){
                          ss.crtDom('div','',endSeaData[x]?endSeaData[x]:'-',dom,{
                              cn:['width','height','borderBottom','fontSize','padding-bottom',endSeaData[x]||'color'],
                              cv:['100%','auto','1px solid #ccc','14px','8px',endSeaData[x]||'#fff'],
                          });
                      })
                  ]);
              };//for循环
              self.domWrap['viewC_con'].appendChild(eviewContainer);
          };
          seaRenderFn(curData);
      },
      //弹窗隐藏
      lg_hiddenViewFn:function(){
          var self = this,obj = self.sourceObj;
          self.domWrap['shadeView'].parentNode.removeChild(self.domWrap['shadeView']);
          self.domWrap['conView'].parentNode.removeChild(self.domWrap['conView']);
      },
      //body取消事件
      lg_bodyCliFn:function(cliFn){
          if(ss.bodyClickObj.listeners[location.hash.slice(1)]){
              var tempArr = ss.bodyClickObj.listeners[location.hash.slice(1)];
              tempArr.push(function(){
                  cliFn();
              });
              ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
          }
          else{
              var tempArr = [];
              tempArr.push(function(){
                  cliFn();
              });
              ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
          };
      },
      //各工具函数
      ajax:function(obj,success,complete,beforeSend){
          var tempObj = obj;
          tempObj.success = function(data){
              if(data.result == 'success'){
                  success(data);
              }
              else{
                  data['data'] && ss.layer.msg(data['data']);
                  data['errorMsg'] && ss.layer.msg(data['errorMsg']);
                  !data['data'] && !data['errorMsg'] && ss.layer.msg('接口有误！');
              }
          };
          tempObj.beforeSend = function(request) {
              ss.c3Loading.show();
              beforeSend && beforeSend(request);
          };
          tempObj.complete = function(xhr){
              ss.c3Loading.hidden();
              complete && complete();
              xhr.responseText || ss.error('登陆失效，接口没返回登陆页面！');
              //登陆时效性，接口约定：重定向->index.html
              xhr.responseText.indexOf('lg_login_pw_label')!=-1 &&
              layer.confirm('登陆已失效，请重新登陆！', function(index){
                  location.href='index.html';
              });
          }
          $.ajax(tempObj);
      },
      eAjax:function(qObj,oObj){
          var self = this,obj = self.sourceObj;
          oObj['isJson'] && (qObj['data'] = JSON.stringify(qObj['data']));//json方式传输赋值
          oObj['isJson'] && (qObj['dataType']='json');//dataType值为json
          //获得数据
          self.ajax(
              qObj
              ,
              //success
              function(data){
                  oObj['success'] && oObj['success'](data);
              },
              //complete
              function(){
                  oObj['complete'] && oObj['complete']();
              },
              //beforeSend
              function(request){
                  oObj['isJson'] &&
                  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                  oObj['beforeSend'] && oObj['beforeSend'](request);
              }
          );
      }
  };

  //权限对象
  function Jurisdiction(obj){
      this.sourceObj = obj;//参数对象
      this.domWrap = {};//dom容器
      this.scope = {};//各值
      this.init();//初始化
  };
  Jurisdiction.prototype = {
      constructor:Jurisdiction,//构造函数
      //初始化
      init:function(){
          var self = this;
          //轮询数据后->执行
          this.rd_pollUrlFn(function(){
              self.rd_layoutFn();//整体布局
              self.rd_listFn();//列表
          });
      },
      //列表数据轮询函数
      rd_pollUrlFn:function(cbFn,f5Arr){
          var self = this,obj = self.sourceObj;
          var urlData = obj.list;
          if(f5Arr){
              var tempObj = {};
              f5Arr.forEach(function(v){
                  tempObj[v] = urlData[v];
              });
              urlData = tempObj;
          };
          self.scope['listData'] || (self.scope['listData'] = {});//列表数据记录
          for(var s in urlData){
              self.scope['listData'][s] = '';//数据准备状态
              var isJsonTF = urlData[s].dataType && urlData[s].dataType === 'json';
              var fqObj = {
                  url:urlData[s].listUrl,
                  type:urlData[s].type||'post',
              };
              urlData[s].data && (fqObj['data']=urlData[s].data);
              (function(s){
                  var selDataObj = urlData[s];
                  self.eAjax(
                      fqObj,
                      {
                          success:function(data){
                              self.scope['listData'][s] = data;
                          },
                          isJson:isJsonTF
                      }
                  );
              })(s)
          };//拿数据
          //轮询数据
          var timer2 = window.setInterval(function(){
              var isTf = true;
              for(var e in self.scope['listData']){
                  self.scope['listData'][e] || (isTf = false);
              };
              isTf && (window.clearInterval(timer2),self.lg_dpDataFn(),cbFn&&cbFn());
          },10);
      },
      //列表数据简单处理
      lg_dpDataFn:function(){
          var self = this;obj = self.sourceObj;
          //列表类型别名字段对象
          var listTypeShimTxtOBj = {
              user:'loginNickName',
              role:'roleName',
              permission:'permissionName',
              source:'sourceName'
          };
          self['scope']['newListData'] || (self['scope']['newListData']={});//初始化数据容器
          for(var s in self['scope']['listData']){
              var curData = self['scope']['listData'][s]['data']['data'];
              var tempArr = [{
                  name:'临时组别',
                  data:[]
              }];
              for(var u=0; u<curData.length; u++){
                  tempArr[0]['data'].push({
                      name:curData[u][listTypeShimTxtOBj[s]],
                      uuid:curData[u]['uuid']
                  })
              };
              self['scope']['newListData'][s] = tempArr;
          }
      },
      //查询接口->匹配列表数据是否满足状态
      lg_check_matchDataFn:function(listType,queryData,cbFn){
          var self = this;obj = self.sourceObj;
          //数据转换
          var shimObj = {
              user:'user_role',
              role:'role_permission',
              permission:'permission_source'
          };
          //列表转换
          var listShimObj = {
              user:'role',
              role:'permission',
              permission:'source'
          };
          //id数据转换
          var idShimObj = {
              user:'roleUuid',
              role:'permissionUuid',
              permission:'sourceUuid'
          };
          var urlData = obj[shimObj[listType]]['get'];
          var isJsonTF = urlData.dataType && urlData.dataType === 'json';
          var fqObj = {
              url:urlData.listUrl,
              data:queryData,
              type:urlData.type||'post',
          };
          urlData.data && (fqObj['data']=urlData.data);
          self.eAjax(
              fqObj,
              {
                  success:function(data){
                      updateListDataFn(data['data']||[]);
                      cbFn && cbFn(data['data']||[]);//接口回调
                  },
                  isJson:isJsonTF
              }
          );
          //根据查询状态，跟新列表数据
          function updateListDataFn(data){
              var waitListData = self['scope']['newListData'][listShimObj[listType]];
              for(var u=0; u<waitListData.length; u++){
                  var waitListData_item = waitListData[u]['data'];
                  for(var y=0; y<waitListData_item.length; y++){
                      waitListData_item[y]['isTF'] = false;
                      var isThrottle = false;
                      //获得该匹配项的关系uuid
                      var relevanceUuid = '';
                      for(var t=0; t<data.length; t++){
                          if(data[t][idShimObj[listType]] == waitListData_item[y]['uuid']){
                              isThrottle = true;
                              relevanceUuid = data[t]['uuid'];
                              break;
                          };
                      };
                      isThrottle && (
                          waitListData_item[y]['isTF'] = true,
                          waitListData_item[y]['ischeckuuid'] = relevanceUuid
                      );
                  };
              };
          };
      },
      //整体布局
      rd_layoutFn:function(){
          var self = this;obj = self.sourceObj;
          ['user','role','permission','source'].forEach(function(v,i){
              var tempAppendToDom = ss.getDom('#listWrap');
              var item = ss.crtDom('div',v,'',tempAppendToDom,{
                  cn:['display','width','verticalAlign','position','marginRight'],
                  cv:['inline-block',(v=='source'||v=='permission')?'400px':'300px','top','relative','5px']
              });
              self.domWrap[v] = item;
          });
      },
      //|- 列表渲染 -|
      rd_listItemFn:function(obj){
          var self = this;
          //操作宽度
          var operationBtnW = ss.getObjleg(obj.operationBtn)==1?50:ss.getObjleg(obj.operationBtn)*38;//只有1项时，修正宽度
          ss.crtDom('div','listWrap','',obj.appendTo,{
              cn:['width','boxShadow','border'],
              cv:['100%','0px 0px .5px 0px #ccc','1px solid #ccc']
          })
          .appendDom(function(dom){
              //标题
              ss.crtDom('div','titleDom',obj.title,dom,{
                  cn:['boxSizing','height','lineHeight','color','font-size','padding','position','borderBottom'],
                  cv:['border-box','35px','35px','#626a78','14px','0% 3%','relative','1px solid #ccc']
              })
              .appendDom(function(dom){
                  var svgH = 20;
                  //svg
                  ss.crtDom('div','ctAdd',ss.svgRepository.circleAdd(svgH,'#ff815d'),dom,{
                      cn:['position','width','height','right','top'],
                      cv:['absolute',svgH+'px',svgH+'px','10px','8px'],
                      an:['type'],av:[obj.type]
                  },[
                      'click',function(dom){
                          self.lg_addFn(dom);//新增函数
                      }
                  ])
              });
              //表头
              ss.crtDom('div','tTable','',dom,{
                  cn:['paddingLeft','paddingRight','height','lineHeight','position','backgroundColor'],
                  cv:['50px',operationBtnW+'px','36px','36px','relative','#f0f3fa']
              })
              .appendDom(function(dom){
                  obj.tName.forEach(function(v,i){
                      //各项
                      ss.crtDom('div','',v,dom,{
                          cn:['display','width','boxSizing','paddingLeft','color','fontSize'],
                          cv:['inline-block',(100/obj.tName.length)+'%','border-box','10px','#626a78','14px']
                      });
                      //操作
                      if(obj.operationBtn && ss.getObjleg(obj.operationBtn)!=0){
                          ss.crtDom('div','','操作',dom,{
                              cn:['width','boxSizing','paddingLeft','position','top','right','color','fontSize'],
                              cv:[operationBtnW+'px','border-box','10px','absolute','0px','0px','#626a78','14px']
                          });
                      }
                  });
              });
              //表身
              ss.crtDom('div','cTable','',dom)
              .appendDom(function(dom){
                  var sourceData = obj.data;
                  for(var i=0; i<sourceData.length; i++){
                      ss.crtDom('div','itemWrap','',dom).appendDom(function(dom){
                          //标题项
                          ss.crtDom('div','item','',dom,{
                              cn:['paddingLeft','paddingRight','height','lineHeight','position'],
                              cv:['50px',operationBtnW+'px','36px','36px','relative'],

                          })
                          .appendDom(function(dom){
                              //各项
                              ss.crtDom('div','',sourceData[i].name,dom,{
                                  cn:['display','width','boxSizing','paddingLeft','color','fontSize','height','userSelect'],
                                  cv:['inline-block','100%','border-box','10px','#626a78','14px','100%','none']
                              });
                              var svgH = 18;
                              //svg
                              ss.crtDom('div','cttAdd',ss.svgRepository.frameMinus(svgH,'#4877e8'),dom,{
                                  cn:['position','width','height','left','top'],
                                  cv:['absolute',svgH+'px',svgH+'px','15px','9px'],
                                  an:['status'],
                                  av:['open']
                              },[
                                  'click',function(dom){
                                      function judgeFn(str){
                                          var itemCons = ss.getDomAll('.itemCon',dom.parentNode.parentNode);
                                          for(var t=0; t<itemCons.length; t++){
                                              ss.mdfCss(itemCons[t],['display',str=='open'?'block':'none']);
                                          };
                                          dom.setAttribute('status',str=='open'?'open':'close');
                                          dom.innerHTML = ss.svgRepository[str=='open'?'frameMinus':'frameAdd'](svgH,'#4877e8');
                                      };
                                      //显示隐藏
                                      dom.getAttribute('status')=='close' ? judgeFn('open') : judgeFn('close');
                                  }
                              ])
                          });
                          //内容项
                          var curDataArr = sourceData[i].data;
                          for(var c=0; c<curDataArr.length; c++){
                              ss.crtDom('div','itemCon','',dom,{
                                  cn:['paddingLeft','paddingRight','height','lineHeight','position','borderBottom','backgroundColor','borderTop'],
                                  cv:['50px',operationBtnW+'px','36px','36px','relative','1px solid #ddd','#f0f3fa',c==0?'1px solid #ddd':'none'],
                                  an:['istf','index'],
                                  av:[curDataArr[c].isTF?'true':'false',c]
                              })
                              .appendDom(function(dom){
                                  for(var f in curDataArr[c]){
                                      if(f!='isTF' && f!='uuid' && f!='ischeckuuid'){
                                          //各项
                                          ss.crtDom('div',f,curDataArr[c][f],dom,{
                                              cn:['display','width','boxSizing','paddingLeft','color','fontSize','overflow','textOverflow','whiteSpace','userSelect'],
                                              cv:['inline-block',(100/obj.tName.length)+'%','border-box','10px','#626a78','13px','hidden','ellipsis','nowrap','none']
                                          });
                                      }
                                  };
                                  //操作
                                  ss.crtDom('div','','',dom,{
                                      cn:['width','boxSizing','paddingLeft','position','top','right','color','fontSize'],
                                      cv:[operationBtnW+'px','border-box','10px','absolute','0px','0px','#626a78','13px']
                                  })
                                  .appendDom(function(dom){
                                      for(var u in obj.operationBtn){
                                          ss.crtDom('div','btn',obj.operationBtn[u]['name'],dom,{
                                              cn:[
                                                  'display','width','fontSize','userSelect',
                                                  'color','cursor'
                                              ],
                                              cv:[
                                                  'inline-block',(100/ss.getObjleg(obj.operationBtn))+'%','13px','none',
                                                  obj.operationBtn[u]['name']=='删除'?'#ff815d':'#4877e8','pointer'
                                              ],
                                              an:['type','uuid'],
                                              av:[obj.type,curDataArr[c]['uuid']]
                                          },[
                                              'click',function(dom){
                                                  //配置选项
                                                  if(dom.innerHTML.indexOf('配')!=-1){
                                                      self.rd_configFn(dom);
                                                  }
                                                  else if(dom.innerHTML.indexOf('闭')!=-1){
                                                      self.lg_closeFn(dom);
                                                  }
                                                  else if(dom.innerHTML.indexOf('查')!=-1){
                                                      self.lg_lookFn(dom);
                                                  }
                                                  else if(dom.innerHTML.indexOf('修')!=-1){
                                                      self.lg_editFn(dom);
                                                  }
                                                  else if(dom.innerHTML.indexOf('删')!=-1){
                                                      self.lg_delectFn(dom);
                                                  }
                                              }
                                          ])
                                      }
                                  });
                                  //是否有勾选框
                                  if(obj.ischeck){
                                      var svgH = 14;
                                      var svgPath = curDataArr[c].isTF ? ss.svgRepository.checkboxIcon(svgH,'#4877e8') : ss.svgRepository.uncheckboxIcon(svgH,'#4877e8');
                                      //是否勾选
                                      ss.crtDom('div','cAdd',svgPath,dom,{
                                              cn:['position','width','height','left','top'],
                                              cv:['absolute',svgH+'px',svgH+'px','17px','11px'],
                                              an:[
                                                  'type','curuuid',
                                                  'ischeckuuid','uuid'
                                              ],
                                              av:[
                                                  obj.type,obj.curDom?obj.curDom.getAttribute('uuid'):'',
                                                  curDataArr[c].ischeckuuid?curDataArr[c].ischeckuuid:'',curDataArr[c]['uuid']
                                              ]
                                          },
                                          [
                                              'click',function(dom){
                                                  var ptNode = dom.parentNode;
                                                  if(ptNode.getAttribute('istf')=='true'){
                                                      self.lg_configCheckFn(
                                                          'cancel',
                                                          dom.getAttribute('type'),
                                                          ss.getDom('[uuid]',dom.parentNode).getAttribute('uuid'),
                                                          dom.getAttribute('curuuid'),
                                                          dom.getAttribute('ischeckuuid'),
                                                          function(){
                                                              //取消配置
                                                              dom.innerHTML = ss.svgRepository.uncheckboxIcon(svgH,'#4877e8');
                                                              ss.mdfAttr(ptNode,['istf','false']);
                                                          }
                                                      );
                                                  }
                                                  else{
                                                      self.lg_configCheckFn(
                                                          'sure',
                                                          dom.getAttribute('type'),
                                                          ss.getDom('[uuid]',dom.parentNode).getAttribute('uuid'),
                                                          dom.getAttribute('curuuid'),
                                                          dom.getAttribute('ischeckuuid'),
                                                          function(){
                                                              //勾选配置
                                                              dom.innerHTML = ss.svgRepository.checkboxIcon(svgH,'#4877e8');
                                                              ss.mdfAttr(ptNode,['istf','true']);
                                                          }
                                                      );
                                                  };
                                              }
                                      ]);
                                  };
                              });
                          };
                      });
                  };
              });
          });
      },
      //列表各项渲染Fn
      lg_listFn:function(listType){
          var self = this,obj = self.sourceObj;
          var listData = self['scope']['newListData'][listType];//数据
          //列表类型别名标题对象
          var listTypeShimTitleOBj = {
              user:'用户列表',
              role:'角色列表',
              permission:'权限列表',
              source:'资源列表'
          };
          self.domWrap[listType] && (self.domWrap[listType].innerHTML = '');
          //请求对象
          var itemObj = {
              title:listTypeShimTitleOBj[listType],
              type:listType,
              appendTo:self.domWrap[listType],
              tName:['名称'],
              tTxt:['name'],
              operationBtn: {
                  sea: {
                      name: '查看'
                  },
                  edit: {
                      name: '修改'
                  },
                  del: {
                      name: '删除'
                  }
              },
              data: listData
          };
          //ischeck:true,
          //listType!='user' && (itemObj['ischeck']=true);
          listType!='source' && (itemObj['operationBtn']['look'] = {name:'配置'});
          self.rd_listItemFn(itemObj);//渲染各列表函数
      },
      //列表各项渲染
      rd_listFn:function(){
          var self = this;obj = self.sourceObj;
          self.lg_listFn('user');//用户
          self.lg_listFn('role');//角色
          self.lg_listFn('permission');//权限
          self.lg_listFn('source');//资源
      },
      //列表重载_默认展开
      lg_reload_defaultFn:function(curData,listType){
          var self = this,obj = self.sourceObj;
          self.rd_pollUrlFn(function () {
              self.lg_listFn(listType);//重新刷新当前列表类型的数据
              //if(curData){
              //    var curDom = ss.getDom('[uuid='+curData['uuid']+']');
              //    debugger;
              //
              //    var curDomWrap = curDom.parentNode.parentNode.parentNode;
              //    var itemCons = ss.getDomAll('.itemCon',curDom);
              //    for(var t=0; t<itemCons.length; t++){
              //        ss.mdfCss(itemCons[t],['display','block']);
              //    };
              //};
          }, [listType]);
      },
      //修改2->配置渲染
      lg_listConfigFn:function(listType,data,dom){
          var self = this,obj = self.sourceObj;
          var listData = data;//数据
          //列表类型别名标题对象
          var listTypeShimTitleOBj = {
              user:'用户列表',
              role:'角色列表',
              permission:'权限列表',
              source:'资源列表'
          };
          self.domWrap[listType] && (self.domWrap[listType].innerHTML = '');
          //请求对象
          var itemObj = {
              title:listTypeShimTitleOBj[listType],
              type:listType,
              appendTo:self.domWrap[listType],
              tName:['名称'],
              tTxt:['name'],
              ischeck:true,
              curDom:dom,
              operationBtn: {
                  sea: {
                      name: '查看'
                  },
                  edit: {
                      name: '修改'
                  },
                  del: {
                      name: '删除'
                  }
              },
              data: listData
          };
          listType!='source' && (itemObj['operationBtn']['look'] = {name:'配置'});
          self.rd_listItemFn(itemObj);//渲染各列表函数
      },
      //高亮_取消当前项的样式
      lg_lightCancelCurFn:function(dom,type){
          var self = this,obj = self.sourceObj;
          self['domWrap']['light'] || (self['domWrap']['light']={});
          var curDom = dom.parentNode.parentNode;
          if(type=='open'){
              self['domWrap']['light'][dom.getAttribute('type')] &&
              (
                  self['domWrap']['light'][dom.getAttribute('type')].style.backgroundColor = 'rgb(240, 243, 250)',
                  self['domWrap']['light'][dom.getAttribute('type')] = ''
              );
              curDom.style.backgroundColor = '#ffdbd1';
              self['domWrap']['light'][dom.getAttribute('type')] = curDom;
              //关闭时->其它列表重置状态
              if(dom.getAttribute('type')=='user'){
                  self.lg_listFn('permission');
                  self.lg_listFn('source');
              }
              else if(dom.getAttribute('type')=='role'){
                  self.lg_listFn('source');
              }
          }
          else if(type=='close'){
              curDom.style.backgroundColor = 'rgb(240, 243, 250)';
              //self.lg_listFn(shimObj[dom.getAttribute('type')]);//资源
              //关闭时->其它列表重置状态
              if(dom.getAttribute('type')=='user'){
                  self.lg_listFn('role');
                  self.lg_listFn('permission');
                  self.lg_listFn('source');
              }
              else if(dom.getAttribute('type')=='role'){
                  self.lg_listFn('permission');
                  self.lg_listFn('source');
              }
              else if(dom.getAttribute('type')=='permission'){
                  self.lg_listFn('source');
              };

              //var otherRedDom = self['domWrap']['light'][shimObj[dom.getAttribute('type')]];
              //var itemCons;
              //otherRedDom&&
              //(
              //    itemCons = ss.getDomAll('.itemCon',self.domWrap[shimObj[dom.getAttribute('type')]]),
              //    itemCons[otherRedDom.getAttribute('index')].style.backgroundColor = '#ffdbd1',
              //    itemCons[otherRedDom.getAttribute('index')].querySelectorAll('.btn')[3].innerHTML = '关闭',
              //    itemCons[otherRedDom.getAttribute('index')].querySelectorAll('.btn')[3].style.color = 'red'
              //);
          };
      },
      //配置函数
      rd_configFn:function(dom){
          var self = this,obj = self.sourceObj;
          self.lg_exchangeStatusFn(dom,'config');//更换按钮
          self.lg_dpCurBtnFn(dom,'config');//处理当前按钮
          self.lg_lightCancelCurFn(dom,'open');//当前项颜色加深
          var curName = ss.getDom('.name',dom.parentNode.parentNode).innerHTML;//当前配置的项名称

          self['domWrap']['configBtn'] || (self['domWrap']['configBtn']={});
          self['domWrap']['configBtn'][dom.getAttribute('type')] = dom;

          //(用户列表->角色)
          if(dom.getAttribute('type')=='user'){
              //查询当前接口，更新列表状态
              var curLiData = self.lg_getListArrFn('user',dom);
              self.lg_check_matchDataFn(dom.getAttribute('type'),{userUuid:curLiData['uuid']},function(checkArr){
                  self.lg_listConfigFn('role',self['scope']['newListData']['role'],dom);//用户
              });
          };
          //(角色列表->权限)
          if(dom.getAttribute('type')=='role'){
              //查询当前接口，更新列表状态
              var curLiData = self.lg_getListArrFn('role',dom);
              self.lg_check_matchDataFn('role',{roleUuid:curLiData['uuid']},function(){
                  self.lg_listConfigFn('permission',self['scope']['newListData']['permission'],dom);//角色
              })
          };
          //(权限列表->资源)
          if(dom.getAttribute('type')=='permission'){
              //查询当前接口，更新列表状态
              var curLiData = self.lg_getListArrFn('permission',dom);
              self.lg_check_matchDataFn('permission',{permissionUuid:curLiData['uuid']},function(){
                  self.lg_listConfigFn('source',self['scope']['newListData']['source'],dom);//角色
              })
          };
      },
      //是否配置勾选函数
      lg_configCheckFn:function(type,listType,endUuid,curUuid,delUuid,cbFn){
          var self = this,obj = self.sourceObj;
          //取消勾选
          if(type=='cancel'){
              //[ 用户 <-> 角色 ]
              if(listType=='role'){
                  var fqObj = {
                      url:obj.user_role.delete.url,
                      type:'post',
                      data:{
                          uuid:delUuid,
                      }
                  };
                  self.eAjax(
                      fqObj, {
                          success:function(data){
                              ss.layer.msg('取消关系成功',{
                                  offset:'200px'
                              });
                              cbFn && cbFn();
                          },
                          isJson:true
                      });
              }
              //[ 角色 <-> 权限 ]
              else if(listType=='permission'){
                  var fqObj = {
                      url:obj.role_permission.delete.url,
                      type:'post',
                      data:{
                          uuid:delUuid,
                      }
                  };
                  self.eAjax(
                      fqObj, {
                          success:function(data){
                              ss.layer.msg('取消关系成功',{
                                  offset:'200px'
                              });
                              cbFn && cbFn();
                          },
                          isJson:true
                      }
                  );
              }
              //[ 权限 <-> 资源 ]
              else if(listType=='source'){
                  var fqObj = {
                      url:obj.permission_source.delete.url,
                      type:'post',
                      data:{
                          uuid:delUuid,
                      }
                  };
                  self.eAjax(
                      fqObj, {
                          success:function(data){
                              ss.layer.msg('取消关系成功',{
                                  offset:'200px'
                              });
                              cbFn && cbFn();
                          },
                          isJson:true
                      }
                  );
              }
          }
          //确定勾选
          else if(type=='sure'){
              //[ 用户 <-> 角色 ]
              if(listType=='role'){
                  var fqObj = {
                      url:obj.user_role.bind.url,
                      type:'post',
                      data:{
                          userUuid:curUuid,
                          roleUuid:endUuid
                      }
                  };
                  self.eAjax(
                      fqObj, {
                          success:function(data){
                              ss.layer.msg('设置关系成功',{
                                  offset:'200px'
                              });
                              //查询当前接口，更新列表状态
                              var dom = self['domWrap']['configBtn']['user'];
                              var curLiData = self.lg_getListArrFn('user',dom);
                              self.lg_check_matchDataFn(dom.getAttribute('type'),{userUuid:curLiData['uuid']},function(checkArr){
                                  self.lg_listConfigFn('role',self['scope']['newListData']['role'],dom);//用户
                              });
                              cbFn && cbFn();
                          },
                          isJson:true
                  });
              }
              //[ 角色 <-> 权限 ]
              else if(listType=='permission'){
                  var fqObj = {
                      url:obj.role_permission.bind.url,
                      type:'post',
                      data:{
                          roleUuid:curUuid,
                          permissionUuid:endUuid
                      }
                  };
                  self.eAjax(
                      fqObj, {
                          success:function(data){
                              ss.layer.msg('设置关系成功',{
                                  offset:'200px'
                              });
                              //查询当前接口，更新列表状态
                              var dom = self['domWrap']['configBtn']['role'];
                              var curLiData = self.lg_getListArrFn('role',dom);
                              self.lg_check_matchDataFn('role',{roleUuid:curLiData['uuid']},function(){
                                  self.lg_listConfigFn('permission',self['scope']['newListData']['permission'],dom);//角色
                              })
                              cbFn && cbFn();
                          },
                          isJson:true
                      });
              }
              //[ 权限 <-> 资源 ]
              else if(listType=='source'){
                  var fqObj = {
                      url:obj.permission_source.bind.url,
                      type:'post',
                      data:{
                          permissionUuid:curUuid,
                          sourceUuid:endUuid
                      }
                  };
                  self.eAjax(
                      fqObj, {
                          success:function(data){
                              ss.layer.msg('设置关系成功',{
                                  offset:'200px'
                              });
                              //查询当前接口，更新列表状态
                              var dom = self['domWrap']['configBtn']['permission'];
                              var curLiData = self.lg_getListArrFn('permission',dom);
                              self.lg_check_matchDataFn('permission',{permissionUuid:curLiData['uuid']},function(){
                                  self.lg_listConfigFn('source',self['scope']['newListData']['source'],dom);//角色
                              })
                              cbFn && cbFn();
                          },
                          isJson:true
                      });
              }
          };
      },
      //关闭函数
      lg_closeFn:function(dom){
          var self = this,obj = self.sourceObj;
          self.lg_exchangeStatusFn(dom,'close');//更换按钮
          self.lg_dpCurBtnFn(dom,'close');//处理当前按钮
          self.lg_lightCancelCurFn(dom,'close');//当前项颜色加深
      },
      //新增函数
      lg_addFn:function(dom){
          var self = this,obj = self.sourceObj;
          //弹窗构建
          function newView(str){
              new View({
                  searchBtn:{
                      add:obj.add[str]
                  }
              })
              .lg_addViewFn(obj.add[str].name,'add',dom.getAttribute('type'));
          };
          //用户新增
          if(dom.getAttribute('type')=='user'){
              newView('user');
          };
          //角色新增
          if(dom.getAttribute('type')=='role'){
              newView('role');
          };
          //权限新增
          if(dom.getAttribute('type')=='permission'){
              newView('permission');
          };
          //资源新增
          if(dom.getAttribute('type')=='source'){
              newView('source');
          };
      },
      //查看函数
      lg_lookFn:function(dom){
          var self = this,obj = self.sourceObj;
          //弹窗构建
          function newView(str){
              //弹窗查看
              new View()
              .lg_seaViewFn(obj.look[str],self.lg_getListArrFn(str,dom));
          };
          //用户查看
          if(dom.getAttribute('type')=='user'){
              newView('user');
          };
          //角色查看
          if(dom.getAttribute('type')=='role'){
              newView('role');
          };
          //权限查看
          if(dom.getAttribute('type')=='permission'){
              newView('permission');
          };
          //资源查看
          if(dom.getAttribute('type')=='source'){
              newView('source');
          };
      },
      //编辑函数
      lg_editFn:function(dom){
          var self = this,obj = self.sourceObj;
          //弹窗构建
          function newView(str){
              new View({
                  table:{
                      operation:[
                          obj.edit[str]
                      ]
                  }
              })
              .lg_editViewFn(self.lg_getListArrFn(str,dom),'edit',dom.getAttribute('type'));
          };
          //用户编辑
          if(dom.getAttribute('type')=='user'){
              newView('user');
          };
          //角色编辑
          if(dom.getAttribute('type')=='role'){
              newView('role');
          };
          //权限编辑
          if(dom.getAttribute('type')=='permission'){
              newView('permission');
          };
          //资源编辑
          if(dom.getAttribute('type')=='source'){
              newView('source');
          };
      },
      //删除函数
      lg_delectFn:function(dom){
          var self = this,obj = self.sourceObj;
          //执行删除函数
          function executeDelFn(str){
              var curData = self.lg_getListArrFn(str,dom);
              layer.confirm('确定删除吗?', function(index){
                  //删除询问
                  var delItem=obj.delect[str],delObj=delItem['data'];
                  for(var s in delObj){
                      delObj[s] = curData[s];
                  };
                  //是否json类型提交
                  var isJsonTF = delItem.dataType &&  delItem.dataType === 'json';
                  var fqObj = {
                      url:delItem.url,
                      type:delItem.type||'post',
                      data: isJsonTF ? JSON.stringify(delObj) : delObj
                  };
                  isJsonTF && (fqObj['dataType']='json');
                  self.ajax(
                      fqObj
                      ,
                      //success
                      function(data){
                          layer.close(index);//关闭询问窗
                          layer.msg('删除成功!');
                          self.lg_reload_defaultFn(curData,str);//重载_默认项
                      },
                      //complete
                      function(data){
                          layer.close(index);//关闭询问窗
                      },
                      //beforeSend
                      function(request){
                          isJsonTF  &&
                          request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                      }
                  );
              });

          };
          //用户编辑
          if(dom.getAttribute('type')=='user'){
              executeDelFn('user');
          };
          //角色编辑
          if(dom.getAttribute('type')=='role'){
              executeDelFn('role');
          };
          //权限编辑
          if(dom.getAttribute('type')=='permission'){
              executeDelFn('permission');
          };
          //资源编辑
          if(dom.getAttribute('type')=='source'){
              executeDelFn('source');
          };
      },
      //获取当前项的列表数据
      lg_getListArrFn:function(str,dom){
          var self = this;
          var curData = self['scope']['listData'][str]['data']['data'];
          var endObj = {};
          for(var u=0; u<curData.length; u++){
              if(curData[u]['uuid']==dom.getAttribute('uuid')){
                  endObj = curData[u];
                  break;
              }
          }
          return endObj;
      },
      //dom元素移除函数
      lg_removeDomFn:function(doms){
          var self = this;
          for(var f=0; f<doms.length; f++){
              self.domWrap[doms[f]] && 
              (
                  self.domWrap[doms[f]].parentNode.removeChild(self.domWrap[doms[f]])
                  ,
                  self.domWrap[doms[f]]=''
              );

          };
      },
      //按钮配置/关闭切换
      lg_exchangeStatusFn:function(dom,type){
          if(type=='config'){
              dom.innerHTML = '关闭';
              dom.style.color = 'red';
          }
          else if(type=='close'){
              dom.innerHTML = '配置';
              dom.style.color = 'rgb(72, 119, 232)';
          }
      },
      //处理当前按钮函数
      lg_dpCurBtnFn:function(dom,type){
          var self = this;
          self.domWrap['curBtn'] || (self.domWrap['curBtn']={});
          //若已存在其它配置项，先清除
          if(self.domWrap['curBtn'] && self.domWrap['curBtn'][dom.getAttribute('type')]){
              self.lg_exchangeStatusFn(self.domWrap['curBtn'][dom.getAttribute('type')],'close');
              self.domWrap['curBtn'][dom.getAttribute('type')]='';
          };
          if(type!='close'){
              self.domWrap['curBtn'][dom.getAttribute('type')] = dom;
          }
      },
      //body取消事件
      lg_bodyCliFn:function(cliFn){
          if(ss.bodyClickObj.listeners[location.hash.slice(1)]){
              var tempArr = ss.bodyClickObj.listeners[location.hash.slice(1)];
              tempArr.push(function(){
                  cliFn();
              });
              ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
          }
          else{
              var tempArr = [];
              tempArr.push(function(){
                  cliFn();
              });
              ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
          };
      },
      //各工具函数
      ajax:function(obj,success,complete,beforeSend){
          var tempObj = obj;
          tempObj.success = function(data){
              if(data.result == 'success'){
                  success(data);
              }
              else{
                  data['data'] && ss.layer.msg(data['data']);
                  data['errorMsg'] && ss.layer.msg(data['errorMsg']);
                  !data['data'] && !data['errorMsg'] && ss.layer.msg('接口有误！');
              }
          };
          tempObj.beforeSend = function(request) {
              ss.c3Loading.show();
              beforeSend && beforeSend(request);
          };
          tempObj.complete = function(xhr){
              ss.c3Loading.hidden();
              complete && complete();
              xhr.responseText || ss.error('登陆失效，接口没返回登陆页面！');
              //登陆时效性，接口约定：重定向->index.html
              xhr.responseText.indexOf('lg_login_pw_label')!=-1 &&
              layer.confirm('登陆已失效，请重新登陆！', function(index){
                  location.href='index.html';
              });
          }
          $.ajax(tempObj);
      },
      eAjax:function(qObj,oObj){
          var self = this,obj = self.sourceObj;
          oObj['isJson'] && (qObj['data'] = JSON.stringify(qObj['data']));//json方式传输赋值
          oObj['isJson'] && (qObj['dataType']='json');//dataType值为json
          //获得数据
          self.ajax(
              qObj
              ,
              //success
              function(data){
                  oObj['success'] && oObj['success'](data);
              },
              //complete
              function(){
                  oObj['complete'] && oObj['complete']();
              },
              //beforeSend
              function(request){
                  oObj['isJson'] &&
                  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

                  oObj['beforeSend'] && oObj['beforeSend'](request);
              }
          );
      }
  };

  //权限实例
  var permissionInstance = new Jurisdiction({
      //列表
      list:{
          user:{
              listUrl:commonUrl+'/admin/user/queryLoginInfoByPage.action',//请求Url
              dataType:"json",
              data:{pageSize:10000}
          },
          role:{
              listUrl:commonUrl+'/admin/role/queryRoleByPage.action',//请求Url
              dataType:"json",
              data:{pageSize:10000}
          },
          permission:{
              listUrl:commonUrl+'/admin/permission/queryPermissionDataByPage.action',//请求Url
              dataType:"json",
              data:{pageSize:10000}
          },
          source:{
              listUrl:commonUrl+'/admin/source/querySourceDataByPage.action',//请求Url
              dataType:"json",
              data:{pageSize:10000}
          }
      },
      //新增
      add:{
          user:{
              name:'添加用户+',
              colType:'add',
              url:commonUrl+'/admin/user/addLoginInfo.action',
              dataType:"json",
              contentType:"application/json",
              items:{
                  loginName:{name:'登陆名', type:'txt',verify:true},
                  loginNickName:{name:'用户名称', type:'txt', verify:true},
                  remark:{name:'描述',type:'txt'},
                  loginPass:{name:'密码', type:'txt', verify:true},
              }
          },
          role:{
              name:'添加角色+',
              colType:'add',
              url:commonUrl+'/admin/role/addRole.action',
              dataType:"json",
              contentType:"application/json",
              items:{
                  roleName:{name:'角色名称', type:'txt',verify:true},
                  remark:{name:'描述',type:'txt'}
              }
          },
          permission:{
              name:'添加权限+',
              colType:'add',
              url:commonUrl+'/admin/permission/addPermission.action',
              dataType:"json",
              contentType:"application/json",
              items:{
                  permissionName:{name:'权限名称', type:'txt',verify:true},
                  remark:{name:'描述',type:'txt'}
              }
          },
          source:{
              name:'添加资源+',
              colType:'add',
              url:commonUrl+'/admin/source/addSource.action',
              dataType:"json",
              contentType:"application/json",
              items:{
                  sourceName:{name:'资源名称', type:'txt',verify:true},
                  sourcePath:{name:'资源路径', type:'txt', verify:true},
                  sourceLabel:{name:'资源标签', type:'txt', verify:true},
                  remark:{name:'描述',type:'txt'}
              }
          }
      },
      //删除
      delect:{
          user:{
              name:'删除',
              colType:'del',
              url:commonUrl+'/admin/user/delLoginInfoById.action',
              dataType:"json",
              contentType:"application/json",
              data:{uuid:''},
          },
          role:{
              name:'删除',
              colType:'del',
              url:commonUrl+'/admin/role/delRoleById.action',
              dataType:"json",
              contentType:"application/json",
              data:{uuid:''},
          },
          permission:{
              name:'删除',
              colType:'del',
              url:commonUrl+'/admin/permission/delPermissionById.action',
              dataType:"json",
              contentType:"application/json",
              data:{uuid:''},
          },
          source:                {
              name:'删除',
              colType:'del',
              url:commonUrl+'/admin/source/delSourceById.action',
              dataType:"json",
              contentType:"application/json",
              data:{uuid:''},
          }
      },
      //查看
      look:{
          user:{
              name: '查看',
              items:{
                  uuid:'用户ID',
                  loginName:'登陆名',
                  loginNickName:"用户名称",
                  remark:"描述",
                  createName:'创建人',
                  createAt:'创建时间',
              }
          },
          role:{
              name: '查看',
              items:{
                  roleName:'角色名称',
                  roleCode:'角色编码',
                  rolePinyin:"角色拼音",
                  remark:"描述",
                  createName:'创建人',
                  createAt:'创建时间',
              }
          },
          permission:{
              name: '查看',
              items:{
                  permissionName:'权限名称',
                  permissionCode:'权限编码',
                  permissionPinyin:"权限拼音",
                  remark:"描述",
                  createName:'创建人',
                  createAt:'创建时间',
              }
          },
          source:{
              name: '查看',
              items:{
                  sourceName:'资源名称',
                  sourcePath:'资源路径',
                  sourceCode:"资源编码",
                  sourcePinyin:"资源拼音",
                  sourceLabel:"资源标签",
                  remark:"描述",
                  createName:'创建人',
                  createAt:'创建时间',
              }
          }
      },
      //编辑
      edit:{
          user:{
              name:'编辑',
              url:commonUrl+'/admin/user/updateLoginInfo.action',
              dataType:"json",
              contentType:"application/json",
              data:JSON.stringify({uuid:''}),
              items:{
                  loginName:{name:'登陆名', type:'txt',verify:true},
                  loginNickName:{name:'用户名称', type:'txt', verify:true},
                  loginCode:{name:'用户编码', type:'txt', verify:true},
                  remark:{name:'描述',type:'txt'}
              }
          },
          role:{
              name:'编辑',
              url:commonUrl+'/admin/role/updateRole.action',
              dataType:"json",
              contentType:"application/json",
              data:JSON.stringify({uuid:''}),
              items:{
                  roleName:{name:'角色名称', type:'txt',verify:true},
                  roleCode:{name:'角色编码', type:'txt', verify:true},
                  remark:{name:'描述',type:'txt'}
              }
          },
          permission:{
              name:'编辑',
              url:commonUrl+'/admin/permission/updatePermission.action',
              dataType:"json",
              contentType:"application/json",
              data:JSON.stringify({uuid:''}),
              items:{
                  permissionName:{name:'权限名称', type:'txt',verify:true},
                  permissionCode:{name:'权限编码', type:'txt', verify:true},
                  remark:{name:'描述',type:'txt'}
              }
          },
          source:{
              name:'编辑',
              url:commonUrl+'/admin/source/updateSource.action',
              dataType:"json",
              contentType:"application/json",
              data:JSON.stringify({uuid:''}),
              items:{
                  sourceName:{name:'资源名称', type:'txt',verify:true},
                  sourcePath:{name:'资源路径', type:'txt', verify:true},
                  sourceCode:{name:'资源编码', type:'txt', verify:true},
                  sourceLabel:{name:'资源标签', type:'txt', verify:true},
                  remark:{name:'描述',type:'txt'}
              }
          }
      },
      //用户<->角色
      user_role:{
          get:{
              listUrl:commonUrl+'/admin/userRole/getUserRoleMaps.action',//请求Url
              dataType:"json",
          },
          bind:{
              url:commonUrl+'/admin/userRole/addLoginuserRoleMap.action',
              dataType:"json",
          },
          delete:{
              url:commonUrl+'/admin/userRole/delLoginuserRoleMapById.action',
              dataType:"json",
          }
      },
      //角色<->权限
      role_permission:{
          get:{
              listUrl:commonUrl+'/admin/rolePermission/getRolePermissions.action',//请求Url
              dataType:"json",
          },
          bind:{
              url:commonUrl+'/admin/rolePermission/addRolePermissionMap.action',
              dataType:"json",
          },
          delete:{
              url:commonUrl+'/admin/rolePermission/delRolePermissionMapById.action',
              dataType:"json",
          }
      },
      //权限<->资源
      permission_source:{
          get:{
              listUrl:commonUrl+'/admin/permissionSource/getPermissionSources.action',//请求Url
              dataType:"json",
          },
          bind:{
              url:commonUrl+'/admin/permissionSource/addPermissionSourceMap.action',
              dataType:"json",
          },
          delete:{
              url:commonUrl+'/admin/permissionSource/delPermissionSourceMapById.action',
              dataType:"json",
          }
      }
  });


});

////tab栏渲染
//var fDom = ss.crtDom('div','','',ss.getDom('#pitab'),{
//    cn:['width','height','borderRadius','backgroundColor'],
//    cv:['260px','40px','10px','#fff']
//})
//.appendDom(function(dom){
//    ['用户 | 角色 | 权限','资源'].forEach(function(v,i){
//        ss.crtDom('div','',v,dom,{
//            cn:[
//                'display','verticalAlign','width','cursor','backgroundColor',
//                'height','color','lineHeight','textAlign','boxSizing',
//                'border','userSelect',
//                'borderTopLeftRadius','borderBottomLeftRadius',
//                'borderTopRightRadius','borderBottomRightRadius'
//            ],
//            cv:[
//                'inline-block','top','50%','pointer',i==0?'rgb(41, 103, 153)':'#fff',
//                '100%',i==0?'#fff':'#000','40px','center','border-box',
//                '1px solid  rgb(41, 103, 153)','none',
//                i==0?'10px':'0px',i==0?'10px':'0px',i==0?'0px':'10px',i==0?'0px':'10px'
//            ],
//            an:['statu'],
//            av:[i==0?'true':'false']
//        },[
//            'click',function(dom){
//                [0,1].forEach(function(v,i){
//                    ss.mdfCss(fDom.children[v],[
//                        'backgroundColor','#fff',
//                        'color','#000'
//                    ]);
//                    ss.mdfAttr(fDom.children[v],[
//                        'statu','false'
//                    ])
//                });
//                ss.mdfCss(dom,[
//                    'backgroundColor','rgb(41, 103, 153)',
//                    'color','#fff'
//                ]);
//                ss.mdfAttr(dom,[
//                    'statu','true'
//                ]);
//                if(dom.innerHTML.indexOf('用户')!=-1){
//                    ss.getDom('#dataCon').style.display = 'block';
//                    ss.getDom('#dataCon02').style.display = 'none';
//                }
//                else{
//                    ss.getDom('#dataCon').style.display = 'none';
//                    ss.getDom('#dataCon02').style.display = 'block';
//                };
//            }
//        ]);
//    });
//
//});

















