//选中标签的后台数据,底下函数getFlowLabelList调用赋值
var FlowLabelList = [];
var flowUuid = localStorage.getItem("flowUuid")   //获取缓存中的图形id
function init() {
  if (window.goSamples) goSamples(); // 这些样本的init - 你不需要调用它
  var $$ = go.GraphObject.make; // 为了简洁定义模板
  myDiagram =
    $$(go.Diagram, "myDiagramDiv", // 必须命名或引用div HTML元素    //网格布置
      {
        grid: $$(go.Panel, "Grid",
          $$(go.Shape, "LineH", {
            stroke: "lightgray",
            strokeWidth: 0.5
          }),
          $$(go.Shape, "LineH", {
            stroke: "gray",
            strokeWidth: 0.5,
            interval: 10
          }),
          $$(go.Shape, "LineV", {
            stroke: "lightgray",
            strokeWidth: 0.5
          }),
          $$(go.Shape, "LineV", {
            stroke: "gray",
            strokeWidth: 0.5,
            interval: 10
          })
        ),
        allowDrop: true, // 必须是真的才能接受调色板中的液滴
        allowCopy:false,   //禁止复制模块
        "draggingTool.dragsLink": true,
        "draggingTool.isGridSnapEnabled": true,
        "linkingTool.isUnconnectedLinkValid": true,
        "linkingTool.portGravity": 20,
        "relinkingTool.isUnconnectedLinkValid": true,
        "relinkingTool.portGravity": 20,
        "relinkingTool.fromHandleArchetype": $$(go.Shape, "Diamond", {
          segmentIndex: 0,
          cursor: "pointer",
          desiredSize: new go.Size(8, 8),
          fill: "tomato",
          stroke: "darkred"
        }),
        "relinkingTool.toHandleArchetype": $$(go.Shape, "Diamond", {
          segmentIndex: -1,
          cursor: "pointer",
          desiredSize: new go.Size(8, 8),
          fill: "darkred",
          stroke: "tomato"
        }),
        "linkReshapingTool.handleArchetype": $$(go.Shape, "Diamond", {
          desiredSize: new go.Size(7, 7),
          fill: "lightblue",
          stroke: "deepskyblue"
        }),
        rotatingTool: $$(TopRotatingTool), // 定义如下
        "rotatingTool.snapAngleMultiple": 15,
        "rotatingTool.snapAngleEpsilon": 15,
        "undoManager.isEnabled": true
      });
  // 当文档被修改时，为标题添加一个“*”并启用“保存”按钮   //不起作用
  myDiagram.addDiagramListener("Modified", function (e) {
    var button = document.getElementById("SaveButton");
    if (button) button.disabled = !myDiagram.isModified;
    var idx = document.title.indexOf("*");
    if (myDiagram.isModified) {
      if (idx < 0) document.title += "*";
    } else {
      if (idx >= 0) document.title = document.title.substr(0, idx);
    }
  });
  //-------------------------------------------------------------
  // 点击事件触发
  var myProperty = document.getElementById('myProperty')
  myDiagram.addDiagramListener("ObjectSingleClicked",
    function (e) {
      // 每次进来删除原有dom
      function fnDelete(elem) {
        var childs = elem.childNodes;
        for (var i = childs.length - 1; i >= 0; i--) {
          elem.removeChild(childs.item(i));
        }
      }
      fnDelete(myProperty)
      // 获取每一条模块数据
    var part = e.subject.part;
      var arrKey;
      if (!(part instanceof go.Link)) {
        //#D63030红色，判断为流程节点
        if (part.data.fill == "#D63030") {
          arrKey = ['flow_name','flow_id','record_uuid','priority','timeout',
          "pre_answser","record_content"]
          //模板数据 流程节点
          var domData = [
            {
              dom: "input",
              text: "流程名称:",
              name: "flow_name",
              display: 'block',
              disabled: "disabled",
              background: '#f5f5f5',
              placeholder: "流程名称",
              flow_name: part.data.flow_name,
            }, 
            {
              dom: "input",
              text: "流程id:",
              name: "flow_id",
              display: 'none',
              disabled: "disabled",
              background: '#f5f5f5',
              placeholder: "流程id",
              flow_id:part.data.flow_id
            },
            {
              dom: "input",
              text: "录音ID:",
              name: "record_uuid",
              disabled: "disabled",
              display: 'none',
              background: '#f5f5f5',
              placeholder: "录音ID",
              record_uuid:part.data.record_uuid
            },
            {
              dom: "input",
              text: "优先级:",
              name: "priority",
              display: 'block',
              disabled: "null",
              background: '#FFFFFF',
              placeholder: "优先级",
              priority:part.data.priority
            },
            {
              dom: "input",
              text: "超时时间:",
              name: "timeout",
              disabled: "null",
              display: 'block',
              background: '#FFFFFF',
              placeholder: "超时时间",
              timeout:part.data.timeout
            },
            {
              dom: "textarea",
              text: "前置语义:",
              name: "pre_answser",
              display: 'block',
              pre_answser:part.data.pre_answser
            },
            {
              dom: "textarea",
              text: "机器人回答:",
              name: "record_content",
              display: 'block',
              record_content:part.data.record_content
            }
          ]
          createdDom(domData);//创建dom函数调用
        }
        //#FF69B4粉色，判断为前置节点
        else if(part.data.fill == "#FF69B4"){
          // 前置节点
          arrKey = ['flow_name','flow_id','record_uuid','priority','count','timeout','timeout_count',
          "pre_answser","record_content"]
          var domData = [{
            dom: "input",
            text: "流程名称:",
            name: "flow_name",
            disabled: "disabled",
            display: 'block',
            background: '#f5f5f5',
            placeholder: "流程名称",
            flow_name: part.data.flow_name,
          }, {
            dom: "input",
            text: "流程id:",
            name: "flow_id",
            display: 'none',
            disabled: "disabled",
            background: '#f5f5f5',
            placeholder: "流程id",
            flow_id:part.data.flow_id
          },{
            dom: "input",
            text: "录音ID:",
            name: "record_uuid",
            display: 'none',
            disabled: "disabled",
            background: '#f5f5f5',
            placeholder: "录音ID",
            record_uuid:part.data.record_uuid
          },{
            dom: "input",
            text: "优先级:",
            name: "priority",
            disabled: "null",
            display: 'block',
            background: '#FFFFFF',
            placeholder: "优先级",
            priority:part.data.priority
          },
          {
            dom: "input",
            text: "次数:",
            name: "count",
            disabled: "null",
            display: 'none',
            background: '#FFFFFF',
            placeholder: "次数",
            count:part.data.count
          },
          {
            dom: "input",
            text: "超时时间:",
            name: "timeout",
            disabled: "null",
            display: 'none',
            background: '#FFFFFF',
            placeholder: "超时时间",
            timeout:part.data.timeout
          }, 
          {
            dom: "input",
            text: "超时次数:",
            name: "timeout_count",
            disabled: "null", 
            display: 'none',
            background: '#FFFFFF',
            placeholder: "超时次数",
            timeout_count:part.data.timeout_count
          },
          {
            dom: "textarea",
            text: "前置语义:",
            name: "pre_answser",
            display: 'block',
            pre_answser:part.data.pre_answser
          },{
            dom: "textarea",
            text: "机器人回答:",
            name: "record_content",
            display: 'none',
            record_content:part.data.record_content
          }]
          createdDom(domData)
        }
        //其它节点：会话结束/开始/条件/流程结束
        else{
          arrKey = ['flow_name']
          var domData = [{
            dom: "input",
            text: "流程名称:",
            name: "flow_name",
            disabled: "disabled",
            background: '#f5f5f5',
            placeholder: "流程名称",
            flow_name: part.data.flow_name,
          }]
          createdDom(domData)
        }
        function createdDom(domData) {
            // flow_name: "流程节点",
            // flow_id: "", //流程id
            // record_uuid:"",//录音文件id
            // priority: "", //优先级
            // type: "", //类型
            // pre_answser: "", //前置语义  
            // timeout: "", //超时时间
            // timeout_count: "", //超时次数
            // auto_next_time:"",//允许跳过
            // record_content:""//机器人
            // var arrKey = ['flow_name','flow_id','record_uuid','priority',
            // "timeout","timeout_count","pre_answser","record_content"]
              var isSele = true;
              var isSele1 = true;
              // debugger
            for (var i = 0; i < domData.length; i++) {
              //dom属性为input类型
              if( domData[i].dom =="input"){
                var div = 
                $("<div></div>")
                .css('display',domData[i].display)
                .append('<span class="el-span">' + domData[i].text + '</span>');

                var inputData = 
                $(
                  '<'+domData[i].dom+' ' 
                  + (domData[i].disabled == "null" ? "" : domData[i].disabled) 
                  + ' name=' + domData[i].name + ' placeholder=' + domData[i].placeholder 
                  + ' style="background:' + domData[i].background 
                  + '" class="el-input el-blur"></'+domData[i].dom+'>'
                )
                .val(domData[i][arrKey[i]]);

                div.append(inputData);
                $('#myProperty').append(div);
              }
              //dom属性为textarea类型
              else if(domData[i].dom =="textarea"){
                //#D63030红色，流程节点
                if(part.data.fill == "#D63030" && isSele == true){
                    isSele = false;
                    // [{name: "中性",code: 0},{name: "肯定",code: 10},
                    //   {name: "否定",code: 20},{name: "无法识别",code: 30},{name: "超时",code: 40},
                    //   {name: "重播",code: 50},{name: "其他",code: 60}]
                    //下拉框渲染
                    commonTool.renderFn(
                      '允许跳过', 
                      [
                        {name: "允许",code: 1},
                        {name: "不允许",code: 0}
                      ], 
                      myProperty,
                      '222',
                      'select',
                      part.data.auto_next_time,
                      'display', 
                      function (code,html) {
                        part.data.auto_next_time = code; 
                      }
                    );

                    //'none'->隐藏
                    commonTool.renderFn(
                      '类型', 
                      [
                        {name: "中性",code: 0},{name: "肯定",code: 10},
                        {name: "否定",code: 20},{name: "其他",code: 60}
                      ], 
                      myProperty, 
                      'yy222222s22', 
                      'select', 
                      part.data.type,
                      'none', 
                      function (code,html) {
                        part.data.type = code;
                      }
                    );
                    createSelect(part.data.label?part.data.label.split(','):[]);
                    //domData[i].dom =="textarea"

                }
                //#FF69B4粉色，前置节点
                else if(part.data.fill == "#FF69B4" && isSele1 == true){
                  isSele1 = false;
                  commonTool.renderFn(
                    '类型', 
                    [
                      {name: "无法识别",code: 30},
                      {name: "超时",code: 40},
                      {name: "重播",code: 50},
                      {name: "其他",code: 60}
                    ], 
                    myProperty, 
                    'yy222222s22', 
                    'select', 
                    part.data.type,
                    'block', 
                    function (code,html) {
                      part.data.type = code;
                    }
                  );
                  commonTool.renderFn(
                    '允许跳过', 
                    [
                      {name: "允许",code: 1},
                      {name: "不允许",code: 0}
                    ],
                    myProperty, 
                    '222', 
                    'select', 
                    part.data.auto_next_time, 
                    'none', 
                    function (code,html) {
                      part.data.auto_next_time = code; 
                    }
                  );
                };
                var div = $("<div></div>")
                .css('display',domData[i].display)
                .append('<span class="el-span" style="vertical-align: top;">' + domData[i].text + '</span>');

                var textareaData = 
                $(
                  '<'+domData[i].dom+' rows="8"'+' name=' 
                  + domData[i].name 
                  + ' style="resize: none ;width:140px"'+ 'class="el-blur"></'+domData[i].dom+'>'
                )
                .val(domData[i][arrKey[i]]);
                div.append(textareaData);
                $('#myProperty').append(div);
                //若是为机器人回答->追加短信发送选项
                if(domData[i].name=='record_content'){
                    //处理接口的数据
                    var smsListVal = smsList;
                    var endArr = [];
                    for(var e=0; e<smsListVal.length; e++){
                      endArr.push({
                        name:smsListVal[e].templateName,
                        code:smsListVal[e].uuid
                      })
                    }
                    commonTool.renderFn(
                      '发送短信', 
                      [{name: "不发送",code: ''}].concat(endArr), 
                      myProperty,
                      '222',
                      'select',
                      part.data.sms_id,
                      'display', 
                      function (code,html) {
                        console.log(code);
                        part.data.sms_id = code; 
                      }
                    );
                }

              }
            }
          }
      };
      myProperty.style.display = 'block'
      // 创建下拉复选
      function createSelect(labelARR){
        var select = $('<select multiple="multiple" placeholder="请选择标签" class="testsel"></select>')
        for (let i = 0; i < FlowLabelList.length; i++) {
          var isTF = false;
          for (let index = 0; index < labelARR.length; index++) {
            if(labelARR[index] == FlowLabelList[i].labelNum){
              isTF = true;
              break;
             };
           }
           if(isTF){
            $(select).append($('<option selected value="'+ FlowLabelList[i].labelNum +'">'+ FlowLabelList[i].labelName +'</option>'))
          }else{
            $(select).append($('<option value="'+ FlowLabelList[i].labelNum +'">'+ FlowLabelList[i].labelName +'</option>'))
          }
        }
        $('#myProperty').append(select)
        $('.items').eq(0).append($('<span style="position:absolute;left:5px;top:40px;font-size:14px">选择标签:</span>'))

        window.Search = $('.testsel').SumoSelect({ csvDispCount: 10, search: true,triggerChangeCombined:true, searchText:'Enter here.', searchFn: function(haystack, needle) {
          var re = RegExp('^' + needle.replace(/([^\w\d])/gi, '\\$1'), 'i');
          return !haystack.match(re);
        } 
        }); 
      }
      //监听input失去焦点事件
      $(document).ready(function(){
        $(".el-blur").blur(function(){
          part.data.flow_id = $("input[ name='flow_id' ]").val()
          part.data.flow_name = $("input[ name='flow_name' ]").val()
          part.data.record_uuid = $("input[ name='record_uuid' ]").val()
          part.data.priority = $("input[ name='priority' ]").val()
          part.data.count = $("input[ name='count' ]").val()
          part.data.pre_answser = $("textarea[ name='pre_answser' ]").val().replace(/，/g,',')
          part.data.timeout = $("input[ name='timeout' ]").val()==undefined?"0":$("input[ name='timeout' ]").val()
          part.data.timeout_count = $("input[ name='timeout_count' ]").val()==undefined?"0":$("input[ name='timeout_count' ]").val()
          part.data.record_content = $("textarea[ name='record_content' ]").val().replace(/，/g,',')
        })
      })
      $('.testsel').change(function(){
        part.data.label = $(this).val().toString()
      })
    });
  // font-size: inherit;
// 单击画布事件  隐藏右侧模块
myDiagram.addDiagramListener("BackgroundSingleClicked",function(e) { 
  myProperty.style.display = 'none'
});
// 监听模块值变化 模块修改之后触发右边模块修改
myDiagram.addDiagramListener("TextEdited",function(e) { 
  $("input[ name='flow_name' ]").val(e.subject.part.data.flow_name)
});

// 不起作用
myDiagram.addModelChangedListener(function(evt) {
  // ignore unimportant Transaction events
  if (!evt.isTransactionFinished) return;
  var txn = evt.object;  // a Transaction
  if (txn === null) return;
  // iterate over all of the actual ChangedEvents of the Transaction
  txn.changes.each(function(e) {
    // ignore any kind of change other than adding/removing a node
    if (e.modelChange !== "nodeDataArray") return;
    // record node insertions and removals
    if (e.change === go.ChangedEvent.Insert) {
      console.log( e.newValue);
    } else if (e.change === go.ChangedEvent.Remove) {
      console.log( e.oldValue);
    }
  });
});
//----------------------------------------------------------
  // 定义一个创建通常透明的“端口”的函数    暂时未动过
  //“name”用作GraphObject.portId，“spot”用于控制链接的连接方式
  // 以及端口在节点上的位置以及布尔型“输出”和“输入”参数
  // 控制用户是否可以从端口或从端口获取链接。
  function makePort(name, spot, output, input) {
    // 港口基本上只是一个小透明的广场
    return $$(go.Shape, "Circle", {
      fill: null, // 没有看到，默认情况下; 通过showSmallPorts设置为半透明灰色，如下定义
      stroke: null,
      desiredSize: new go.Size(7, 7),
      alignment: spot, // 对齐主Shape中的端口
      alignmentFocus: spot, // 只是在形状内
      portId: name, // 声明这个对象是一个“端口”
      fromSpot: spot,
      toSpot: spot, // 声明链接可能在此端口连接的位置
      fromLinkable: output,
      toLinkable: input, // 声明用户是否可以在此处绘制链接
      cursor: "pointer" // 显示不同的光标以指示潜在的链接点
    });
  }

  var nodeSelectionAdornmentTemplate =
    $$(go.Adornment, "Auto",
      $$(go.Shape, {
        fill: null,
        stroke: "deepskyblue",
        strokeWidth: 1.5,
        strokeDashArray: [4, 2]
      }),
      $$(go.Placeholder)
    );
  var nodeResizeAdornmentTemplate =
    $$(go.Adornment, "Spot", {
        locationSpot: go.Spot.Right
      },
      $$(go.Placeholder),
      $$(go.Shape, {
        alignment: go.Spot.TopLeft,
        cursor: "nw-resize",
        desiredSize: new go.Size(6, 6),
        fill: "lightblue",
        stroke: "deepskyblue"
      }),
      $$(go.Shape, {
        alignment: go.Spot.Top,
        cursor: "n-resize",
        desiredSize: new go.Size(6, 6),
        fill: "lightblue",
        stroke: "deepskyblue"
      }),
      $$(go.Shape, {
        alignment: go.Spot.TopRight,
        cursor: "ne-resize",
        desiredSize: new go.Size(6, 6),
        fill: "lightblue",
        stroke: "deepskyblue"
      }),
      $$(go.Shape, {
        alignment: go.Spot.Left,
        cursor: "w-resize",
        desiredSize: new go.Size(6, 6),
        fill: "lightblue",
        stroke: "deepskyblue"
      }),
      $$(go.Shape, {
        alignment: go.Spot.Right,
        cursor: "e-resize",
        desiredSize: new go.Size(6, 6),
        fill: "lightblue",
        stroke: "deepskyblue"
      }),
      $$(go.Shape, {
        alignment: go.Spot.BottomLeft,
        cursor: "se-resize",
        desiredSize: new go.Size(6, 6),
        fill: "lightblue",
        stroke: "deepskyblue"
      }),
      $$(go.Shape, {
        alignment: go.Spot.Bottom,
        cursor: "s-resize",
        desiredSize: new go.Size(6, 6),
        fill: "lightblue",
        stroke: "deepskyblue"
      }),
      $$(go.Shape, {
        alignment: go.Spot.BottomRight,
        cursor: "sw-resize",
        desiredSize: new go.Size(6, 6),
        fill: "lightblue",
        stroke: "deepskyblue"
      })
    );
  var nodeRotateAdornmentTemplate =
    $$(go.Adornment, {
        locationSpot: go.Spot.Center,
        locationObjectName: "CIRCLE"
      },
      $$(go.Shape, "Circle", {
        name: "CIRCLE",
        cursor: "pointer",
        desiredSize: new go.Size(7, 7),
        fill: "lightblue",
        stroke: "deepskyblue"
      }),
      $$(go.Shape, {
        geometryString: "M3.5 7 L3.5 30",
        isGeometryPositioned: true,
        stroke: "deepskyblue",
        strokeWidth: 1.5,
        strokeDashArray: [4, 2]
      })
    );
  myDiagram.nodeTemplate =
    $$(go.Node, "Spot", {
        locationSpot: go.Spot.Center
      },
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), {
        selectable: true,
        selectionAdornmentTemplate: nodeSelectionAdornmentTemplate
      }, {
        resizable: true,
        resizeObjectName: "PANEL",
        resizeAdornmentTemplate: nodeResizeAdornmentTemplate
      }, {
        rotatable: true,
        rotateAdornmentTemplate: nodeRotateAdornmentTemplate
      },
      new go.Binding("angle").makeTwoWay(),
      //主要对象是围绕具有形状的TextBlock的面板
      $$(go.Panel, "Auto", {
          name: "PANEL"
        },
        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
        $$(go.Shape, "Rectangle", // 默认数字
          {
            portId: "", // 默认端口：如果链接数据没有位置，请使用最近端
            fromLinkable: true,
            toLinkable: true,
            cursor: "pointer",
            fill: "white", // default color
            strokeWidth: 0
          },
          new go.Binding("figure"),
          new go.Binding("fill")),
        $$(go.TextBlock, {
            font: "500  11pt Helvetica, Arial, sans-serif",
            margin: 4,
            stroke: "#fff",
            maxSize: new go.Size(160, NaN),
            wrap: go.TextBlock.WrapFit,
            editable: true
          },
          new go.Binding("text", "flow_name").makeTwoWay())
      ),
      // 四个小的有名港口，每边一个：
      makePort("T", go.Spot.Top, false, true),
      makePort("L", go.Spot.Left, true, true),
      makePort("R", go.Spot.Right, true, true),
      makePort("B", go.Spot.Bottom, true, false), { // 处理鼠标进入/离开事件以显示/隐藏端口
        mouseEnter: function (e, node) {
          showSmallPorts(node, true);
        },
        mouseLeave: function (e, node) {
          showSmallPorts(node, false);
        }
      }
    );

  function showSmallPorts(node, show) {
    node.ports.each(function (port) {
      if (port.portId !== "") { // 不要更改默认端口，这是一个很大的形状
        port.fill = show ? "rgba(0,0,0,.3)" : null;
      }
    });
  }

  var linkSelectionAdornmentTemplate =
    $$(go.Adornment, "Link",
      $$(go.Shape,
        // isPanelMain声明这个Shape共享Link.geometry
        {
          isPanelMain: true,
          fill: null,
          stroke: "deepskyblue",
          strokeWidth: 0
        }) // 使用选择对象的strokeWidth
    );
    myDiagram.copuSelection = false  
  myDiagram.linkTemplate =
    $$(go.Link, // 整个链接面板
      {
        selectable: true,
        selectionAdornmentTemplate: linkSelectionAdornmentTemplate
      }, {
        relinkableFrom: true,
        relinkableTo: true,
        reshapable: true
      }, {
        routing: go.Link.AvoidsNodes,
        curve: go.Link.JumpOver,
        corner: 5,
        toShortLength: 4
      },
      new go.Binding("points").makeTwoWay(),
      $$(go.Shape, // the link path shape
        {
          isPanelMain: true,
          strokeWidth: 1,
          stroke: "#000"
        }),
      $$(go.Shape, // the arrowhead
        {
          toArrow: "Standard",
          stroke: null
        }),
      $$(go.Panel, "Auto",
        // new go.Binding("visible", "isSelected").ofObject(),
        // $$(go.Shape, "RoundedRectangle", // 链接形状
        //     {
        //         fill: "#F8F8F8",
        //         stroke: null
        //     }),
        $$(go.TextBlock, {
            textAlign: "center",
            font: "12pt helvetica, arial, sans-serif",
            stroke: "#000",
            margin: 2,
            minSize: new go.Size(40, 50),
            editable: true
          },
          new go.Binding("text", "flow_name").makeTwoWay())
      )
    );
  load(); // 从一些JSON文本加载初始图
  // 初始化页面左侧的Palette
  myPalette =
    $$(go.Palette, "myPaletteDiv", // 必须命名或引用DIV HTML元素
      {
        maxSelectionCount: 1,
        nodeTemplateMap: myDiagram.nodeTemplateMap, // 共享myDiagram使用的模板
        linkTemplate: // 简化链接模板，就在这个调色板中
          $$(go.Link, { // 因为GridLayout.alignment是Location，并且节点具有locationSpot == Spot.Center，
              // 以相同的方式排列链接，我们必须假装链接具有相同的位置点
              locationSpot: go.Spot.Center,
              selectionAdornmentTemplate: $$(go.Adornment, "Link", {
                  locationSpot: go.Spot.Center
                },
                $$(go.Shape, {
                  isPanelMain: true,
                  fill: null,
                  stroke: "deepskyblue",
                  strokeWidth: 0
                }),
                $$(go.Shape, // the arrowhead
                  {
                    toArrow: "Standard",
                    stroke: null
                  })
              )
            }, {
              routing: go.Link.AvoidsNodes,
              curve: go.Link.JumpOver,
              corner: 5,
              toShortLength: 4
            },
            new go.Binding("points"),
            $$(go.Shape, // 链接路径形状
              {
                isPanelMain: true,
                strokeWidth: 2
              }),
            $$(go.Shape, // 箭头
              {
                toArrow: "Standard",
                stroke: null
              })
          ),
          //----------------------------------------------------------
        model: new go.GraphLinksModel([ // 指定调色板的内容
          //{text: "模块内容", figure: "形状", fill: "颜色"},值可以接受变量
          // type 话术类型 0 中性 10 肯定  20 否定 30 无法识别 40 超时  50 重播 60其他

          {
            flow_name: "前置节点",
            figure: "RoundedRectangle",
            fill: "#FF69B4",
            flow_id: "", //流程id
            record_uuid:"",//录音文件id
            priority: "", //优先级
            type: "30", //类型
            pre_answser: "", //前置语义
            timeout: "", //超时时间
            count:"0", //次数
            timeout_count: "", //超时次数
            auto_next_time:"0",//允许跳过
            record_content:""//机器人
          },
          {
            flow_name: "会话\n结束",
            figure: "Circle",
            fill: "#FEC213",
          },
          {
            flow_name: "开始",
            fill: "#6B5CE7",
            figure: "Circle"
          },
          {
            fill: "#D63030",
            flow_id: "", //流程id
            flow_name: "流程节点",
            record_uuid:"",//录音文件id
            priority: "", //优先级
            type: "0", //类型
            timeout: "", //超时时间
            count:"0", //次数
            label: "", //标签
            pre_answser: "", //前置语义
            auto_next_time:"1",//允许跳过
            record_content:""//机器人
          },
          {
            flow_name: "条件",
            figure: "Diamond",
            fill: "#02B894"
          },
          {
            flow_name: "流程\n结束",
            figure: "Circle",
            fill: "#00D0F6"
          }
        ], [
          // 调色板也有一个断开的链接，用户可以拖放
          {
            points: new go.List(go.Point).addAll([new go.Point(0, 0), new go.Point(30, 0),
              new go.Point(30, 40), new go.Point(60, 40)
            ])
          }
        ])
      });
}
//没作用
function TopRotatingTool() {
  go.RotatingTool.call(this);
}

go.Diagram.inherit(TopRotatingTool, go.RotatingTool);
/** @override */
TopRotatingTool.prototype.updateAdornments = function (part) {
  go.RotatingTool.prototype.updateAdornments.call(this, part);
  var adornment = part.findAdornment("Rotating");
  if (adornment !== null) {
    adornment.location = part.rotateObject.getDocumentPoint(new go.Spot(0.5, 0, 0, -30)); // 在中间顶部以上
  }
};

/** @override */
TopRotatingTool.prototype.rotate = function (newangle) {
  go.RotatingTool.prototype.rotate.call(this, newangle + 90);
};
//-------------------------------------------------------------
// TopRotatingTool类的结尾
// 以JSON格式显示用户可编辑的图表模型  html页面save用于调试是打开
function save() {
  saveDiagramProperties(); // 在写入JSON之前先执行此操作

  document.getElementById("mySavedModel").value = myDiagram.model.toJson();
  myDiagram.isModified = false;
}
var commonUrl = ss.options['commonUrl'];
// 最终提交
function submit(){
  saveDiagramProperties(); // 调试->在写入JSON之前先执行此操作
  // document.getElementById("mySavedModel").value = myDiagram.model.toJson();
  // return;
  var data = myDiagram.model.toJson();
  $.ajax({
    url: commonUrl+'/admin/flow/savePictureById.action',
    type:'post',
    dataType:"json",
    contentType:"application/json",
    data:JSON.stringify({"uuid":flowUuid,"flowPicture":data}),
    success:function(data){
        if(data.result == 'success'){
          layer.msg(data.result)
        }
    },
    beforeSend:function(){
        ss.c3Loading.show();
    },
    complete:function(xhr){
        ss.c3Loading.hidden();
        xhr.responseText || ss.error('登陆失效，接口没返回登陆页面！');
        //登陆时效性，接口约定：重定向->index.html
        xhr.responseText.indexOf('lg_login_pw_label') != -1 &&
            layer.confirm('登陆已失效，请重新登陆！', function (index) {
            location.href = 'index.html';
        });
    }
  })
}
function load(data) {
  //data：接口flowPicture字段的值，用于go.js流程图的初始化数据
  // myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
    myDiagram.model = go.Model.fromJson(
      (
        data 
        || 
        { 
          "class": "go.GraphLinksModel", 
          "linkFromPortIdProperty": "fromPort", 
          "linkToPortIdProperty": "toPort", 
          "nodeDataArray":[], 
          "linkDataArray": [ ]
        }
      )
    );
    loadDiagramProperties(); // 在Model.modelData被带入内存后执行此操作
}
// 用于调试
function load1(data) {
  // myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
    myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value)
    loadDiagramProperties(); // 在Model.modelData被带入内存后执行此操作
}
//---------------------------------------------
function saveDiagramProperties() {
  myDiagram.model.modelData.position = go.Point.stringify(myDiagram.position);
}

function loadDiagramProperties(e) {
  // 设置Diagram.initialPosition而不是Diagram.position，以处理初始化副作用
  var pos = myDiagram.model.modelData.position;
  if (pos) myDiagram.initialPosition = go.Point.parse(pos);
}
function ajaxData(flowUuid){
    $.ajax({
      url:commonUrl+'/admin/flow/findPictureById.action',
      type:'post',
      dataType:"json",
      contentType:"application/json",
      data:JSON.stringify({uuid:flowUuid}),
      success:function(data){
          //flowPicture go.js插件所需的数据
          if(data.result == 'success'){
            load(data.data.flowPicture)
          }
      },
      beforeSend:function(){
          ss.c3Loading.show();
      },
      complete:function(xhr){
          ss.c3Loading.hidden();
          xhr.responseText || ss.error('登陆失效，接口没返回登陆页面！');
          //登陆时效性，接口约定：重定向->index.html
          xhr.responseText.indexOf('lg_login_pw_label') != -1 &&
              layer.confirm('登陆已失效，请重新登陆！', function (index) {
                  location.href = 'index.html';
              });
      }
    })
}

//流程节点->标签下拉框所需的后台数据
(function getFlowLabelList(){
  $.ajax({
    url:commonUrl+'/admin/label/getFlowLabelList.action',
    type:'post',
    dataType:"json",
    contentType:"application/json",
    data:{uuid:flowUuid},
    success:function(data){
        data.result == 'success'
        FlowLabelList = data.data;
    },
    beforeSend:function(){
        ss.c3Loading.show();
    },
    complete:function(xhr){
        ss.c3Loading.hidden();
        xhr.responseText || ss.error('登陆失效，接口没返回登陆页面！');
        //登陆时效性，接口约定：重定向->index.html
        xhr.responseText.indexOf('lg_login_pw_label') != -1 &&
            layer.confirm('登陆已失效，请重新登陆！', function (index) {
                location.href = 'index.html';
            });
    }
  })
}())//自调用
//流程节点->短信发送下拉框所需的后台数据
var smsList;
(function getFlowLabelList(){
  $.ajax({
    url:commonUrl+'/admin/TSmsManege/selectByConditions.action',
    type:'post',
    dataType:"json",
    contentType:"application/json",
    data:JSON.stringify({flowUuid:flowUuid}),
    success:function(data){
        if(data.result == 'success'){
          smsList = data.data;
        }
    },
    beforeSend:function(){
        ss.c3Loading.show();
    },
    complete:function(xhr){
        ss.c3Loading.hidden();
        xhr.responseText || ss.error('登陆失效，接口没返回登陆页面！');
        //登陆时效性，接口约定：重定向->index.html
        xhr.responseText.indexOf('lg_login_pw_label') != -1 &&
            layer.confirm('登陆已失效，请重新登陆！', function (index) {
                location.href = 'index.html';
            });
    }
  })
}())//自调用
ajaxData(flowUuid);//flowUuid：缓存中的图形id->从本地存储中获取
init();//初始化