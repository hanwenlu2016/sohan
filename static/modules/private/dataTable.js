ss.define(['laydate'], function (exports) {
    function ss_dataTable(obj) {
        this.sourceObj = obj;
        this.domWrap = {}; //dom容器
        this.scope = {}; //scope参数容器
        this.tableData = {}; //存储表格数据
        this.init(); //初始化
    };
    ss_dataTable.prototype = {
        constructor: ss_dataTable,
        init: function () {
            var self = this,
                obj = self.sourceObj;
            self.rd_dataLayFn(); //渲染整体
            self.rd_searchFn(); //渲染搜索栏
            self.theEnd(); //先追加，才能获得dom的高度值
            self.lg_autoHFn(); //表格自适应屏幕的高度
            self.lg_getSelectParasFn(); //序列化搜索参数
            self.lg_reloadFn(); //表格重载函数
        },
        //先追加，才能获得dom的高度值
        theEnd: function () {
            var self = this,
                obj = self.sourceObj;
            self.sourceObj.appendTo.appendChild(self.domWrap['tempContainer']); //将虚拟dom容器追加到文档上
        },
        //细节处理：是否需要分页上面的框线 -||- 是否存在信息栏，进行高度提升
        theEnd2: function () {
            var self = this,
                obj = self.sourceObj;
            //分页上面的框线
            self.domWrap['dtcWrap'].style.borderBottom = self.tableData.data.length >= self['scope']['autoSize'] ? '0px solid #ccc' : '1px solid #ccc';
            //信息栏，位置高度提升
            var infoWrap = self.domWrap['infoWrap'];
            if (infoWrap) {
                var dtcWrapH = self.domWrap['tbCWrap'].offsetHeight;
                var lisH = ss.getDomAll('ul', self.domWrap['tbCWrap']).length * 36;
                infoWrap.style.marginTop = '-' + (dtcWrapH - lisH + 1) + 'px';
            };
        },
        //渲染部分
        //整体布局->(搜索栏+表格+分页+&&信息栏)
        rd_dataLayFn: function () {
            var self = this,
                obj = self.sourceObj;
            self.domWrap = {};
            //存在则移除
            var dtContainer = self['domWrap']['dtContainer'];
            dtContainer && dtContainer.parentNode.removeChild(dtContainer);

            var tempContainer = document.createDocumentFragment();
            var dtsWrap, dtcWrap, dtpWrap;

            var dtContainer = ss.crtDom('div', 'dtContainer', '', tempContainer, {
                    cn: ['width', 'height', 'overflow'],
                    cv: ['100%', '100%', 'hidden']
                })
                .appendDom(function (dom) {
                    var isdpWPer = obj.table.options && obj.table.options.dpWPer; //是否存在百分比宽度扩展
                    //搜索栏
                    obj.searchOption && ss.judgeArr(obj.searchOption) && obj.searchOption.length !== 0 &&
                        (dtsWrap = ss.crtDom('div', 'dtsWrap', '', dom, {
                            cn: ['backgroundColor', 'borderBottom', 'height', 'padding'],
                            cv: ['#fff', '1px solid #ccc', 'auto', '0px 0px 10px 5px']
                        }));
                    //表格
                    dtcWrap = ss.crtDom('div', 'dtcWrap', '', dom, {
                            cn: ['backgroundColor', 'height', 'paddingTop', 'borderBottom', isdpWPer && 'overflowX', isdpWPer && 'overflowY'],
                            cv: ['#fff', '380px', '15px', '0px solid #ccc', isdpWPer && 'scroll', isdpWPer && 'hidden']
                        }),
                        //分页
                        dtpWrap = obj.pageOption && ss.judgeObj(obj.pageOption) && ss.crtDom('div', 'dtpWrap', '', dom, {
                            cn: ['height'],
                            cv: ['50px']
                        })
                })
            self.domWrap['tempContainer'] = tempContainer;
            self.domWrap['dtContainer'] = dtContainer; //总表格容器
            self.domWrap['dtsWrap'] = dtsWrap; //搜索栏
            self.domWrap['dtcWrap'] = dtcWrap; //表格
            self.domWrap['dtpWrap'] = dtpWrap; //分页器

        },
        //搜索栏渲染
        rd_searchFn: function () {
            var self = this,
                obj = self.sourceObj,
                searchDom = self.domWrap['dtsWrap'];
            if (searchDom) {
                for (var a = 0; a < obj.searchOption.length; a++) {
                    var isType = function (type) {
                        var judgeArr = ['year', 'month', 'time', 'datetime', 'date'];
                        if (judgeArr.indexOf(type) != -1) {
                            return true;
                        } else {
                            return false;
                        };
                    };
                    //txt类型 || date类型
                    (obj.searchOption[a].type === 'txt' || isType(obj.searchOption[a].type)) &&
                    ss.crtDom('div', obj.searchOption[a].txt + 'Wrap', '', searchDom, {
                            cn: ['paddingTop', 'display', 'height', 'verticalAlign', 'position', 'marginRight'],
                            cv: ['7px', 'inline-block', '40px', 'top', 'relative', obj.searchOption[a].isLine ? '3px' : (a === obj.searchOption.length - 1 ? '40px' : '8px')]
                        })
                        .appendDom(
                            function (dom) {
                                var defaultVal = obj.searchOption[a].value;
                                ss.crtDom('input', obj.searchOption[a].txt, '', dom, {
                                    cn: ['paddingLeft', 'height', 'lineHeight', 'border', 'backgroundColor', 'color', 'width', 'fontSize', 'borderRadius', 'verticalAlign', 'marginTop'],
                                    cv: ['10px', '30px', '30px', '1px solid #dee4f1', '#f4f8fa', '#757575', obj.searchOption[a].width ? obj.searchOption[a].width : obj.searchOption[a].name.length * (obj.searchOption[a].type === 'date' ? 32 : 28) + 'px', '13px', '2px', 'top', '0px'],
                                    an: ['name', 'placeholder', defaultVal && 'value', defaultVal && 'sourceval'],
                                    av: [obj.searchOption[a].txt, obj.searchOption[a].name, defaultVal && defaultVal, defaultVal && defaultVal]
                                }, [
                                    'focus',
                                    function (dom) {
                                        ss.mdfCss(dom, ['boxShadow', '0px 0px .5px .3px #1890ff', 'border', '1px solid #f4f8fa', 'color', '#000'])
                                    },
                                    'blur',
                                    function (dom) {
                                        ss.mdfCss(dom, ['boxShadow', 'none', 'border', '1px solid #dee4f1', 'color', dom.value.length === 0 && '#757575'])
                                    }
                                ])
                            });
                    //date类型->增加laydate时间日期选择选择器 ->增加日期icon
                    var dateObj = {
                        elem: ss.getDom('.' + obj.searchOption[a].txt, searchDom),
                        type: obj.searchOption[a].type || 'date',
                        value: obj.searchOption[a].value || '',
                        done: function () {
                            this.elem[0].value && (this.elem[0].style.color = '#000');
                        }
                    };
                    obj.searchOption[a].type == 'date' && (dateObj['showBottom'] = false);
                    isType(obj.searchOption[a].type) && (!ss.laydate && ss.error('未引入时间控件！'),
                        ss.laydate.render(dateObj),
                        ss.crtDom('span', 'dateSvg', ss.svgRepository.date(28, '#555'), ss.getDom('.' + obj.searchOption[a].txt + 'Wrap', searchDom), {
                            cn: ['display', 'top', 'right', 'width', 'height', 'position'],
                            cv: ['block', '8px', '10px', '28px', '28px', 'absolute']
                        })
                    );
                    //背后是否带有横线
                    obj.searchOption[a].isLine && ss.crtDom('div', '', '-', searchDom, {
                        cn: ['display', 'padding', 'border', 'backgroundColor', 'color', 'width', 'fontSize', 'marginRight', 'borderRadius', 'verticalAlign', 'marginTop'],
                        cv: ['inline-block', '5px 0px', '1px solid #fff', '#fff', '#757575', 'auto', '14px', '3px', '2px', 'top', '7px'],
                    });

                    //select类型
                    obj.searchOption[a].type === 'select' && ss.crtDom('div', obj.searchOption[a].txt, obj.searchOption[a].name, searchDom, {
                            cn: ['height', 'lineHeight', 'display', 'paddingLeft', 'border', 'backgroundColor', 'color', 'width', 'fontSize', 'borderRadius', 'marginRight', 'userSelect', 'cursor', 'marginTop', 'position'],
                            cv: ['30px', '30px', 'inline-block', '10px', '1px solid #dee4f1', '#f4f8fa', '#757575', obj.searchOption[a].width ? obj.searchOption[a].width : obj.searchOption[a].name.length * 40 + 'px', '13px', '3px', a === obj.searchOption.length - 1 ? '40px' : '8px', 'none', 'pointer', '7px', 'relative'],
                            an: ['name', 'code'],
                            av: [obj.searchOption[a].txt, '']
                        }, [
                            'click',
                            function (dom, e) {
                                //下拉框展开
                                ss.getDom('.selectItems', dom).style.display = 'block';
                                ss.getDom('.dateSvg', dom).style.transform = 'rotate(180deg)';
                                ss.mdfCss(dom, ['boxShadow', '0px 0px .5px .3px #1890ff', 'border', '1px solid #f4f8fa']);
                                //展开高亮
                                var pDoms = ss.getDom('.selectItems', dom).children;
                                for (var c = 0; c < pDoms.length; c++) {
                                    ss.mdfCss(pDoms[c], ['backgroundColor', '#fff', 'color', pDoms[c].getAttribute('code') ? '#333' : '#ccc']);
                                }
                                if (dom.getAttribute('code')) {
                                    for (var b = 0; b < pDoms.length; b++) {
                                        pDoms[b].getAttribute('code') && pDoms[b].getAttribute('code') === dom.getAttribute('code') &&
                                            ss.mdfCss(pDoms[b], ['backgroundColor', 'rgb(41, 103, 153)', 'color', '#fff']);
                                    }
                                }
                                e.stopPropagation();
                            }
                        ])
                        .appendDom([
                            //select->icon
                            ss.crtDom('span', 'dateSvg', ss.svgRepository.sl_ad(14, '#555'), '', {
                                cn: ['display', 'top', 'right', 'width', 'height', 'position'],
                                cv: ['block', '8px', '8px', '14px', '14px', 'absolute']
                            }),
                            //select->con
                            ss.crtDom('div', 'selectItems', '', '', {
                                cn: [
                                    'width', 'height',
                                    'border', 'position', 'top', 'left', 'backgroundColor', 'borderRadius', 'overflowX', 'overflowY', 'display', 'zIndex'
                                ],
                                cv: [
                                    obj.searchOption[a].width ? obj.searchOption[a].width : obj.searchOption[a].name.length * 40 + 'px',
                                    obj.searchOption[a].data.length < 5 ? 'auto' : 5 * 30 + 'px',
                                    '1px solid #ccc', 'absolute', '32px', '-1px', '#fff', '3px', 'hidden', 'auto', 'none', 13
                                ],
                                an: ['selCount'],
                                av: [obj.searchOption[a].selCount ? obj.searchOption[a].selCount : '5']
                            })
                            .appendDom(function (dom) {
                                var curSelData = obj.searchOption[a].data;
                                var firstData = [{
                                    name: '' + obj.searchOption[a].name + '',
                                    code: ''
                                }];
                                var crtDom = function (curSelFnData) {
                                    var selCount = Number(dom.getAttribute('selCount'));
                                    dom.style.height = firstData.concat(curSelFnData).length < selCount ? 'auto' : selCount * 30 + 'px';
                                    firstData.concat(curSelFnData).forEach(function (v, i) {
                                        ss.crtDom('p', '', v.name, dom, {
                                            cn: ['paddingLeft', 'color', 'fontSize', 'overflow', 'textOverflow', 'whiteSpace', 'boxSizing'],
                                            cv: ['10px', i === 0 ? '#ccc' : '#333', '13px', 'hidden', 'ellipsis', 'nowrap', 'border-box'],
                                            an: ['code'],
                                            av: [v.code]
                                        }, [
                                            'mouseenter',
                                            function (dom) {
                                                ss.mdfCss(dom, ['backgroundColor', 'rgb(41, 103, 153)', 'color', '#fff'])
                                            },
                                            'mouseleave',
                                            function (dom) {
                                                var isTF = dom.getAttribute('code') && dom.parentNode.parentNode.getAttribute('code') === dom.getAttribute('code'); //满足选中状态
                                                ss.mdfCss(dom, ['backgroundColor', isTF ? 'rgb(41, 103, 153)' : '#fff', 'color', isTF ? '#fff' : (dom.getAttribute('code') ? '#333' : '#ccc')]);
                                            },
                                            'click',
                                            function (dom, e) {
                                                ss.setDomTxt(dom.parentNode.parentNode, dom.innerHTML); //赋值
                                                dom.parentNode.parentNode.setAttribute('code', dom.getAttribute('code')); //code属性赋值
                                                dom.parentNode.style.display = 'none'; //下拉框隐藏
                                                ss.getDom('.dateSvg', dom.parentNode.parentNode).style.transform = 'rotate(0deg)'; //icon旋转
                                                ss.mdfCss(dom.parentNode.parentNode, ['boxShadow', 'none', 'border', '1px solid #dee4f1', 'color', dom.getAttribute('code') ? '#000' : '#757575']); //
                                                e.stopPropagation();
                                            }
                                        ])
                                    });
                                };
                                //数组类型，固定数据
                                if (curSelData && ss.judgeArr(curSelData)) {
                                    crtDom(curSelData);
                                }
                                //对象类型，ajax动态获取
                                else if (curSelData && ss.judgeObj(curSelData)) {

                                    var isJsonTF = curSelData.dataType && curSelData.dataType === 'json';
                                    var fqObj = {
                                        url: curSelData.url,
                                        type: curSelData.type || 'post',
                                    };
                                    curSelData.data && (fqObj['data'] = curSelData.data);

                                    var selDataObj = curSelData;

                                    self.eAjax(
                                        fqObj, {
                                            success: function (data) {
                                                var selDatas = data['data'] || [];
                                                selDataObj['digitalModel'] && (selDatas = self.digitalModelFn(data, 'data', selDataObj['digitalModel']) || []);
                                                var newWrap = [];
                                                var isName = selDataObj['rely'] && selDataObj['rely']['name'];
                                                var isCode = selDataObj['rely'] && selDataObj['rely']['code'];
                                                for (var v = 0; v < selDatas.length; v++) {
                                                    newWrap.push({
                                                        name: isName ? selDatas[v][selDataObj['rely']['name']] : selDatas[v]['name'],
                                                        code: isCode ? selDatas[v][selDataObj['rely']['code']] : selDatas[v]['code']
                                                    });
                                                };
                                                crtDom(newWrap);
                                            },
                                            isJson: isJsonTF
                                        });

                                } else {
                                    ss.error('下拉框选项数据未找到！');
                                }
                            })
                        ]);

                    //mulSel类型------------
                    obj.searchOption[a].type === 'mulSel' && ss.crtDom('div', obj.searchOption[a].txt, '', searchDom, {
                            cn: ['height', 'lineHeight', 'display', 'paddingLeft', 'border', 'backgroundColor', 'color', 'width', 'fontSize', 'borderRadius', 'marginRight', 'userSelect', 'cursor', 'marginTop', 'position'],
                            cv: ['30px', '30px', 'inline-block', '10px', '1px solid #dee4f1', '#f4f8fa', '#757575', obj.searchOption[a].width ? obj.searchOption[a].width : obj.searchOption[a].name.length * 40 + 'px', '13px', '3px', a === obj.searchOption.length - 1 ? '40px' : '8px', 'none', 'pointer', '7px', 'relative'],
                            an: ['name', 'code', 'sourceW'],
                            av: [obj.searchOption[a].txt, '', obj.searchOption[a].width ? obj.searchOption[a].width : obj.searchOption[a].name.length * 40 + 'px']
                        }, [
                            'click',
                            function (dom, e) {
                                //下拉框展开
                                ss.getDom('.selectItems', dom).style.display = 'block';
                                ss.getDom('.dateSvg', dom).style.transform = 'rotate(180deg)';
                                ss.mdfCss(dom, ['boxShadow', '0px 0px .5px .3px #1890ff', 'border', '1px solid #f4f8fa']);
                                //颜色控制
                                var pDoms = ss.getDom('.selectItems', dom).children;
                                for (var c = 0; c < pDoms.length; c++) {
                                    ss.mdfCss(pDoms[c], ['backgroundColor', '#fff', 'color', pDoms[c].getAttribute('fontcol')]);
                                }
                                e.stopPropagation();
                            }
                        ])
                        .appendDom([
                            //mulSel->itemsWrap
                            ss.crtDom('div', 'itemsWrap', '', '', {
                                an: ['codescope'],
                                av: ['']
                            })
                            .appendDom([
                                ss.crtDom('span', '', obj.searchOption[a].name, '', {
                                    cn: ['display'],
                                    cv: ['inline-block']
                                })
                            ]),
                            //mulSel->icon
                            ss.crtDom('span', 'dateSvg', ss.svgRepository.sl_ad(14, '#555'), '', {
                                cn: ['display', 'top', 'right', 'width', 'height', 'position'],
                                cv: ['block', '7px', '5px', '14px', '14px', 'absolute']
                            }),
                            //mulSel->con
                            ss.crtDom('div', 'selectItems', '', '', {
                                cn: ['width', 'height', 'border', 'position', 'top', 'left', 'backgroundColor', 'borderRadius', 'overflowX', 'overflowY', 'display', 'zIndex'],
                                cv: [obj.searchOption[a].width ? obj.searchOption[a].width : obj.searchOption[a].name.length * 40 + 'px', obj.searchOption[a].data.length < 5 ? 'auto' : '200px', '1px solid #ccc', 'absolute', '32px', '-1px', '#fff', '3px', 'hidden', 'auto', 'none', 13],
                                an: ['itemVals'],
                                av: [obj.searchOption[a].itemVals]
                            })
                            .appendDom(function (dom) {
                                var curSelData = obj.searchOption[a].data;
                                var firstData = [{
                                    name: '' + obj.searchOption[a].name + '',
                                    code: ''
                                }];
                                var crtDom = function (curSelFnData) {
                                    firstData.concat(curSelFnData).forEach(function (v, i) {
                                        ss.crtDom('p', '', v.name, dom, {
                                            cn: ['padding', 'color', 'fontSize', 'overflow', 'textOverflow', 'whiteSpace'],
                                            cv: ['5px 10px', i === 0 ? '#ccc' : '#333', '13px', 'hidden', 'ellipsis', 'nowrap'],
                                            an: ['code', 'fontcol', 'isfirst'],
                                            av: [v.code, i === 0 ? '#ccc' : '#333', i === 0 ? 'true' : 'false']
                                        }, [
                                            'mouseenter',
                                            function (dom) {
                                                dom.getAttribute('isclick') != 'true' &&
                                                    ss.mdfCss(dom, ['backgroundColor', 'rgb(41, 103, 153)', 'color', '#fff']);
                                            },
                                            'mouseleave',
                                            function (dom) {
                                                var isTF = dom.getAttribute('code') && dom.parentNode.parentNode.getAttribute('code') === dom.getAttribute('code'); //满足选中状态
                                                ss.mdfCss(dom, ['backgroundColor', isTF ? 'rgb(41, 103, 153)' : '#fff', 'color', dom.getAttribute('fontcol')]);
                                            },
                                            'click',
                                            function (dom, e) {
                                                var allWrap = dom.parentNode.parentNode,
                                                    itemsWrap = ss.getDom('.itemsWrap', allWrap),
                                                    selectItemsWrap = ss.getDom('.selectItems', allWrap),
                                                    defaultSpan = ss.getDom('span', itemsWrap);
                                                //点击第一项处理
                                                if (dom.getAttribute('isfirst') == 'true') {
                                                    itemsWrap.setAttribute('codescope', ''); //清空code容器数据
                                                    itemsWrap.innerHTML = '';
                                                    //恢复p的状态
                                                    var ps = ss.getDomAll('p', selectItemsWrap);
                                                    //恢复宽度
                                                    allWrap.style.width = allWrap.getAttribute('sourceW');
                                                    //更新高度
                                                    allWrap.style.height = 30 + 'px';
                                                    selectItemsWrap.style.top = 30 + 3 + 'px';
                                                    for (var s = 0; s < ps.length; s++) {
                                                        if (s != 0) {
                                                            ps[s].style.color = '#333';
                                                            ps[s].setAttribute('isclick', 'false');
                                                            ps[s].setAttribute('fontcol', '#333');
                                                        }
                                                    };
                                                    //选择框已清空，恢复原始状态
                                                    ss.crtDom('span', '', ss.getDom('p', selectItemsWrap).innerHTML, itemsWrap, {
                                                        cn: ['display'],
                                                        cv: ['inline-block']
                                                    })
                                                    return;
                                                }
                                                //点击其它项
                                                if (dom.getAttribute('isclick') && dom.getAttribute('isclick') == 'true') {

                                                } else {
                                                    //未点击
                                                    dom.style.color = '#ccc'; //给选中的项样式处理
                                                    dom.setAttribute('isclick', 'true'); //已点击样式
                                                    dom.setAttribute('fontcol', '#ccc'); //已点击样式
                                                    defaultSpan && itemsWrap.removeChild(defaultSpan);
                                                    var pDom = ss.crtDom('p', '', dom.innerHTML, itemsWrap, {
                                                            cn: ['height', 'lineHeight', 'width', 'display', 'verticalAlign', 'position', 'backgroundColor', 'color', 'padding', 'borderRadius', 'marginTop', 'marginRight'],
                                                            cv: ['22px', '22px', dom.innerHTML.length * 14 + 20 + 'px', 'inline-block', 'top', 'relative', '#ededed', '#222', '0px 5px', '3px', '3px', '5px'],
                                                            an: ['code'],
                                                            av: [dom.getAttribute('code')]
                                                        })
                                                        .appendDom([
                                                            ss.crtDom('p', 'close', ss.svgRepository.close(14, '#666'), '', {
                                                                cn: ['display', 'width', 'height', 'position', 'top', 'right', 'verticalAlign'],
                                                                cv: ['inline-block', '14px', '14px', 'absolute', '4px', '4px', 'middle']
                                                            })
                                                        ]);
                                                    //处理code容器数据
                                                    var codeScope = itemsWrap.getAttribute('codescope') ? itemsWrap.getAttribute('codescope').split(',') : [];
                                                    codeScope.push(dom.getAttribute('code'));
                                                    itemsWrap.setAttribute('codescope', codeScope.join(','));
                                                    var count = selectItemsWrap.getAttribute('itemVals') || 6;
                                                    count = Number(count);
                                                    if (codeScope.length != 1 && codeScope.length <= count) {
                                                        allWrap.style.width = allWrap.offsetWidth + dom.innerHTML.length * 16 + 20 + 'px';
                                                    };
                                                    if (codeScope.length != 1 && codeScope.length % count == 1) {
                                                        allWrap.style.height = 30 + 30 * Math.floor((codeScope.length / count)) + 'px';
                                                        selectItemsWrap.style.top = 33 + 30 * Math.floor((codeScope.length / count)) + 'px';
                                                        self.lg_autoHFn(); //表格自适应屏幕的高度
                                                        self.lg_getSelectParasFn(); //序列化搜索参数
                                                        self.lg_reloadFn(); //表格加载
                                                    };
                                                    //svg绑定事件
                                                    var svgDom = pDom.querySelector('svg');
                                                    svgDom.addEventListener('mousemove', function () {
                                                        var paths = this.querySelectorAll('path');
                                                        for (var a = 0; a < paths.length; a++) {
                                                            paths[a].setAttribute('fill', 'red');
                                                        }
                                                    }, false);
                                                    svgDom.addEventListener('mouseout', function () {
                                                        var paths = this.querySelectorAll('path');
                                                        for (var a = 0; a < paths.length; a++) {
                                                            paths[a].setAttribute('fill', '#666');
                                                        }
                                                    }, false);
                                                    svgDom.addEventListener('click', function (e) {
                                                        var curCilP = this.parentNode.parentNode;
                                                        curCilP.parentNode.removeChild(curCilP); //移除li元素
                                                        var curCode = curCilP.getAttribute('code');
                                                        var codeArr = itemsWrap.getAttribute('codescope').split(',');
                                                        codeArr.splice(codeArr.indexOf(curCode), 1);
                                                        itemsWrap.setAttribute('codescope', codeArr.join(','));
                                                        //将该code的项恢复
                                                        var resetDom = ss.getDom('[code="' + curCode + '"]', selectItemsWrap);
                                                        resetDom.style.color = '#333';
                                                        resetDom.setAttribute('fontcol', '#333');
                                                        resetDom.setAttribute('isclick', 'false');
                                                        if (codeArr.length != 0) {
                                                            if (codeArr.length % count == 0) {
                                                                allWrap.style.height = (codeArr.length / count) * 30 + 'px'; //更新高度
                                                                selectItemsWrap.style.top = (codeArr.length / count) * 30 + 3 + 'px';
                                                            } else if (codeArr.length / count < 1) {
                                                                allWrap.style.width = allWrap.offsetWidth - ss.getDomTxt(curCilP).length * 16 - 20 + 'px';
                                                            };
                                                        } else {
                                                            //选择框已清空，恢复原始状态
                                                            ss.crtDom('span', '', ss.getDom('p', selectItemsWrap).innerHTML, itemsWrap, {
                                                                cn: ['display'],
                                                                cv: ['inline-block']
                                                            })
                                                        };
                                                        e.stopPropagation();
                                                    }, false);
                                                }; //未点击
                                                e.stopPropagation();
                                            }
                                        ])
                                    });
                                };
                                //数组类型，固定数据
                                if (curSelData && ss.judgeArr(curSelData)) {
                                    crtDom(curSelData);
                                }
                                //对象类型，ajax动态获取
                                else if (curSelData && ss.judgeObj(curSelData)) {

                                    var isJsonTF = curSelData.dataType && curSelData.dataType === 'json';
                                    var fqObj = {
                                        url: curSelData.url,
                                        type: curSelData.type || 'post',
                                    };
                                    isJsonTF && (fqObj['dataType'] = 'json'); //json方式传输赋值
                                    curSelData.data &&
                                        (fqObj['data'] = isJsonTF ? JSON.stringify(curSelData.data) : curSelData.data); //json方式传输赋值
                                    var selDataObj = curSelData;
                                    //获得数据
                                    self.ajax(
                                        fqObj,
                                        function (data) {
                                            var selDatas = data['data'] || [];
                                            selDataObj['digitalModel'] && (selDatas = self.digitalModelFn(data, 'data', selDataObj['digitalModel']) || []);
                                            var newWrap = [];
                                            var isName = selDataObj['rely'] && selDataObj['rely']['name'];
                                            var isCode = selDataObj['rely'] && selDataObj['rely']['code'];
                                            for (var v = 0; v < selDatas.length; v++) {
                                                newWrap.push({
                                                    name: isName ? selDatas[v][selDataObj['rely']['name']] : selDatas[v]['name'],
                                                    code: isCode ? selDatas[v][selDataObj['rely']['code']] : selDatas[v]['code']
                                                });
                                            };
                                            crtDom(newWrap);
                                        },
                                        //complete
                                        function () {

                                        },
                                        //beforeSend
                                        function (request) {
                                            isJsonTF &&
                                                request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                                        }
                                    );

                                } else {
                                    ss.error('下拉框选项数据未找到！');
                                }
                            })
                        ]); //mulsel
                };
                //搜索栏自带的按钮
                var btnArr = ['清空', '搜索'];
                btnArr.forEach(function (v, i) {
                    ss.crtDom('div', '', v, searchDom, {
                        cn: ['display', 'padding', 'border', 'backgroundColor', 'color', 'width', 'fontSize', 'marginRight', 'borderRadius', 'verticalAlign', 'cursor', 'userSelect', 'marginTop'],
                        cv: ['inline-block', '5px 12px', '1px solid rgb(41, 103, 153)', 'rgb(41, 103, 153)', '#fff', 'auto', '13px', '8px', '2px', 'top', 'pointer', 'none', '7px'],
                        an: ['name'],
                        av: [v]
                    }, [
                        'click',
                        function (dom) {
                            //清空
                            if (dom.getAttribute('name') == '清空') {
                                self.lg_clearSelectFn(); //清空搜索栏
                            };
                            //搜索
                            if (dom.getAttribute('name') == '搜索') {
                                //校验搜索参数
                                function verifyPara() {
                                    var selArr = obj.searchOption;
                                    for (var a = 0; a < selArr.length; a++) {
                                        if (selArr[a].verify && !ss.getDom('[name="' + selArr[a]['txt'] + '"]').value) {
                                            layer.msg(selArr[a]['name'] + '参数不能为空');
                                            return true;
                                        }
                                    };
                                };
                                if (verifyPara()) {
                                    return
                                };
                                self.lg_getSelectParasFn(); //序列化搜索参数
                                self.lg_reloadFn(); //表格重载
                            };
                        }
                    ])
                });
                //判断是否有其它按钮(新增&&编辑)
                obj.searchBtn && ss.getObjleg(obj.searchBtn) != 0 && (
                    function () {
                        //按钮样式对照表
                        var btnCss = {
                            add: {
                                bgc: '#ff7f5b',
                                col: '#fff'
                            },
                            opt1: {
                                bgc: '#009688',
                                col: '#fff'
                            },
                            opt2: {
                                bgc: '#1E9FFF',
                                col: '#fff'
                            },
                            opt3: {
                                bgc: '#FFB800',
                                col: '#fff'
                            },
                            opt4: {
                                bgc: '#FF5722',
                                col: '#fff'
                            }
                        };
                        for (var x in obj.searchBtn) {
                            var curColType = btnCss[obj.searchBtn[x].colType]; //颜色类型
                            ss.crtDom('div', '', obj.searchBtn[x].name, searchDom, {
                                cn: ['display', 'padding', 'backgroundColor', 'color', 'width', 'fontSize', 'marginRight', 'borderRadius', 'verticalAlign', 'cursor', 'userSelect', 'marginTop'],
                                cv: ['inline-block', '6px 12px', curColType ? curColType['bgc'] : '#009688', curColType ? curColType['col'] : '#fff', 'auto', '13px', '8px', '2px', 'top', 'pointer', 'none', '7px'],
                                an: ['val', 'name'],
                                av: [obj.searchBtn[x].name, x]
                            }, [
                                'click',
                                function (dom) {
                                    var otherBtnCb = obj.searchBtn[dom.getAttribute('name')].cbFn; //其它按钮的回调
                                    dom.getAttribute('name') === 'add' && self.lg_addViewFn(
                                        obj.searchBtn[dom.getAttribute('name')].name,
                                        'add',
                                        obj.searchBtn[dom.getAttribute('name')].addType ? obj.searchBtn[dom.getAttribute('name')].addType : ''
                                    ); //新增弹窗，默认
                                    dom.getAttribute('name') !== 'add' && otherBtnCb && otherBtnCb(self);
                                }
                            ])
                        }
                    }()
                );
                //下拉框隐藏
                var clearStatuFn = function () {
                    var dom = ss.getDomAll('.selectItems', self.domWrap['dtsWrap']);
                    if (dom) {
                        for (var d = 0; d < dom.length; d++) {
                            dom[d].style.display = 'none';
                            ss.getDom('.dateSvg', dom[d].parentNode) &&
                                (ss.getDom('.dateSvg', dom[d].parentNode).style.transform = 'rotate(0deg)'); //icon旋转
                            ss.mdfCss(dom[d].parentNode, ['boxShadow', 'none', 'border', '1px solid #dee4f1', 'color', dom[d].parentNode.getAttribute('code') ? '#000' : '#757575']); //
                        }
                    };
                };
                if (ss.bodyClickObj.listeners[location.hash.slice(1)]) {
                    var tempArr = ss.bodyClickObj.listeners[location.hash.slice(1)];
                    tempArr.push(function () {
                        clearStatuFn();
                    });
                    ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
                } else {
                    var tempArr = [];
                    tempArr.push(function () {
                        clearStatuFn();
                    });
                    ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
                };
            }
        },
        //序列化搜索栏参数
        lg_getSelectParasFn: function () {
            var self = this,
                obj = self.sourceObj;
            var dtsWrapDom = self.domWrap['dtsWrap'];
            var queryObj = {};
            if (obj.searchOption) {
                for (var a = 0; a < obj.searchOption.length; a++) {
                    queryObj[obj.searchOption[a].txt] = '';
                };
                var names = dtsWrapDom.querySelectorAll('[name]');
                for (var b = 0; b < names.length; b++) {
                    queryObj[names[b].getAttribute('name')] != void 0 && (
                        names[b].nodeName == 'INPUT' ?
                        //input类型
                        queryObj[names[b].getAttribute('name')] = names[b].value :
                        (
                            ss.getDom('.itemsWrap', names[b]) ?
                            //mulSel类型
                            queryObj[names[b].getAttribute('name')] = ss.getDom('.itemsWrap', names[b]).getAttribute('codescope')
                            //select类型
                            :
                            queryObj[names[b].getAttribute('name')] = names[b].getAttribute('code') ? names[b].getAttribute('code') : ''
                        )
                    );
                };
            }
            self['scope']['queryObj'] = queryObj;
        },
        //清空搜索栏
        lg_clearSelectFn: function () {
            var self = this,
                obj = self.sourceObj;
            //判断多项下拉框的类型
            function judgeMul() {
                var selArr = obj.searchOption;
                for (var a = 0; a < selArr.length; a++) {
                    if (selArr[a]['type'] == 'mulSel') {
                        return true;
                    }
                }
                return false;
            };
            var dtsWrapDom = self.domWrap['dtsWrap'];
            //用于满足搜索栏的nameDom
            var queryObj = {};
            for (var a = 0; a < obj.searchOption.length; a++) {
                queryObj[obj.searchOption[a].txt] = '';
            };
            var names = dtsWrapDom.querySelectorAll('[name]');
            for (var b = 0; b < names.length; b++) {
                queryObj[names[b].getAttribute('name')] != void 0 && (
                    names[b].nodeName == 'INPUT' ?
                    //输入框类型，清空时，带有默认值，则清空为默认值
                    (names[b].getAttribute('sourceval') ? (names[b].value = names[b].getAttribute('sourceval')) : (names[b].value = '')) :
                    (
                        judgeMul() ?
                        //多选下拉框
                        (function () {
                            var allWrap = names[b],
                                itemsWrap = ss.getDom('.itemsWrap', allWrap),
                                selectItemsWrap = ss.getDom('.selectItems', allWrap);
                            itemsWrap.setAttribute('codescope', ''); //清空code容器数据
                            itemsWrap.innerHTML = '';
                            //恢复p的状态
                            var ps = ss.getDomAll('p', selectItemsWrap);
                            //恢复宽度
                            allWrap.style.width = allWrap.getAttribute('sourceW');
                            //更新高度
                            allWrap.style.height = 30 + 'px';
                            selectItemsWrap.style.top = 30 + 3 + 'px';
                            for (var s = 0; s < ps.length; s++) {
                                if (s != 0) {
                                    ps[s].style.color = '#333';
                                    ps[s].setAttribute('isclick', 'false');
                                    ps[s].setAttribute('fontcol', '#333');
                                }
                            };
                            ss.crtDom('span', '', ss.getDom('p', selectItemsWrap).innerHTML, itemsWrap, {
                                cn: ['display'],
                                cv: ['inline-block']
                            })
                        }())
                        //单项下拉框
                        :
                        (names[b].setAttribute('code', ''), ss.setDomTxt(names[b], names[b].querySelector('.selectItems').children[0].innerHTML))
                    )
                );
            };
            self['scope']['queryObj'] = null; //清空请求参数列表
        },
        //表格重载
        lg_reloadFn: function (fixedObj, runPage) {
            var self = this,
                obj = self.sourceObj;
            //tempObj：对参数请求对象，加入pageSize的控制
            var tempObj = obj.dataOption.data ? (typeof obj.dataOption.data === 'string' ? JSON.parse(obj.dataOption.data) : obj.dataOption.data) : {};
            tempObj && !obj.dataOption.pageSize && (tempObj['pageSize'] = self['scope']['autoSize']);
            tempObj['currentPage'] = 1;
            //是否进行翻页操作
            runPage && (tempObj['currentPage'] = runPage);
            //存在搜索字段
            var otherObj = self['scope']['queryObj'];
            if (otherObj) {
                for (var w in otherObj) {
                    tempObj[w] = otherObj[w];
                }
            };
            //存在格外参数
            if (fixedObj) {
                for (var w in fixedObj) {
                    tempObj[w] = fixedObj[w];
                }
            };
            //存在额外固定值，则追加
            var extraPara = obj.dataOption.extraPara;
            if (extraPara && ss.judgeObj(extraPara) && ss.getObjleg(extraPara) != 0) {
                for (var xx in extraPara) {
                    tempObj[xx] = extraPara[xx];
                }
            };

            var isJsonTF = obj.dataOption.dataType && obj.dataOption.dataType === 'json';

            var fqObj = {
                url: obj.dataOption.listUrl,
                type: obj.dataOption.type || 'post',
                data: tempObj,
            };

            self.eAjax(
                fqObj, {
                    success: function (data) {
                        data.data['data'] ? (self.tableData = data.data) : (self.tableData = {
                            data: []
                        });
                        var realDatas;
                        if (obj.dataOption.digitalModelFn) {
                            realDatas = self.digitalModelFn(data, 'data', obj.dataOption.digitalModelFn);
                            self.tableData['data'] = realDatas;
                        };
                        //当前页数信息存储
                        self.pageData = {
                            page: data.data.currentPage || '1',
                            totalPage: data.data.totalPages || '1'
                        };
                        self.lg_dpItemsWFn(); //各字段长度占比
                        self.lg_optWFn(); //操作各项占比
                        self.rd_tableFn(); //表格内容渲染
                        self.theEnd2(); //是否需要分页上面的框线
                        self.rd_pageFn(); //分页容器渲染
                        //渲染完回调
                        obj.table.options && obj.table.options.cbFn && obj.table.options.cbFn(self);
                    },
                    isJson: isJsonTF
                });

        },
        //-----| 表格内容渲染 |--------
        rd_tableFn: function () {
            var self = this,
                obj = self.sourceObj;
            var isdpWPer = obj.table.options && obj.table.options.dpWPer; //是否存在百分比宽度扩展
            //若已存在，进行移除
            var tableDom = self.domWrap['tbTCWrap'];
            tableDom && tableDom.parentNode.removeChild(tableDom);
            //创建dom虚拟容器
            var tempContainer = document.createDocumentFragment();
            var tbHh = '38px', //表头高度
                tbBh = '36px'; //表格每项高度
            //整体容器
            var tbTCWrap = ss.crtDom('div', 'tbTCWrap', '', tempContainer, {
                    cn: ['width', 'position'],
                    cv: [isdpWPer ? obj.table.options.dpWPer : '100%', 'relative']
                })
                .appendDom(function (dom) {
                    //遮挡
                    ss.crtDom('div', 'scrollShadow', '', dom, {
                        cn: ['position', 'top', 'right', 'backgroundColor', 'width', 'height', 'border', 'borderLeft', 'borderBottom', 'display'],
                        cv: ['absolute', '0px', '0px', '#fff', '17px', tbHh, '1px solid #ccc', 'none', '1.5px solid #ccc', self.tableData.data.length > self['scope']['autoSize'] ? 'block' : 'none']
                    });
                    //表head
                    ss.crtDom('div', 'tbTWrap', '', dom, {
                            cn: ['width', 'overflowX', 'overflowY', 'backgroundImage'],
                            cv: ['100%', 'hidden', self.tableData.data.length > self['scope']['autoSize'] ? 'scroll' : 'hidden', 'linear-gradient(to bottom,#F8F8F8 0,#ECECEC 100%)']
                        })
                        .appendDom([
                            ss.crtDom('ul', '', '', '', {
                                cn: ['width', 'height', 'paddingRight', 'position'],
                                cv: ['100%', tbHh, self['scope']['oprationW'] ? self['scope']['oprationW'] + 'px' : '0px', 'relative']
                            })
                            .appendDom(function (dom) {
                                //li各项
                                for (var a = 0; a < obj.table.tlTxt.length; a++) {
                                    //是否需要加入排序icon
                                    var isSort = obj.table.options && obj.table.options.sort &&
                                        obj.table.options.sort.items && obj.table.options.sort.items.length != 0 &&
                                        obj.table.options.sort.items.indexOf(obj.table.tlTxt[a]) != -1;
                                    //当前渲染的li项
                                    var curLiDom = ss.crtDom('li', '', obj.table.tlName[a], dom, {
                                        cn: [
                                            'width', 'display', 'verticalAlign', 'paddingLeft', 'fontSize', 'textAlign',
                                            'paddingRight', 'position', 'cursor', 'userSelect',
                                            'height', 'lineHeight', 'border', 'borderLeft', 'borderTop', 'borderBottom', 'overflow', 'textOverflow', 'whiteSpace'
                                        ],
                                        cv: [
                                            self.scope.dpWObj[obj.table.tlTxt[a]], 'inline-block', 'middle', obj.dataOption.pdL || '10px', '14px', 'left',
                                            isSort ? '20px' : '0px', 'relative', isSort ? 'pointer' : 'default', 'none',
                                            '100%', tbHh, '1px solid #ccc', a === 0 ? '1px solid #ccc' : 'none', '1px solid #ccc', '1.5px solid #ccc', 'hidden', 'ellipsis', 'nowrap'
                                        ],
                                        an: ['name', 'issort'],
                                        av: [obj.table.tlTxt[a], isSort]
                                    }, [
                                        'click',
                                        function (dom) {
                                            if (dom.getAttribute('issort') == 'true') {
                                                //先清空所有状态
                                                function clearFn() {
                                                    var tbTWrap = self['domWrap']['tbTWrap'];
                                                    var sjUps = ss.getDomAll('.sjUp', tbTWrap);
                                                    var sjDowns = ss.getDomAll('.sjDown', tbTWrap);
                                                    for (var u = 0; u < sjUps.length; u++) {
                                                        sjUps[u].innerHTML = ss.svgRepository.sjUp(20, '#888');
                                                        sjUps[u].style.display = 'block';
                                                        sjUps[u].setAttribute('sorttype', '0');
                                                    };
                                                    for (var j = 0; j < sjDowns.length; j++) {
                                                        sjDowns[j].innerHTML = ss.svgRepository.sjDown(20, '#888');
                                                        sjDowns[j].style.display = 'block';
                                                        sjDowns[j].setAttribute('sorttype', '0');
                                                    };
                                                };
                                                clearFn();
                                                if (dom.getAttribute('sorttype') == 'up') {
                                                    ss.getDom('.sjDown', dom).innerHTML = ss.svgRepository.sjDown(20, '#296799');
                                                    ss.getDom('.sjUp', dom).style.display = 'none';
                                                    ss.getDom('.sjDown', dom).style.display = 'block';
                                                    dom.setAttribute('sorttype', 'down');
                                                } else {
                                                    ss.getDom('.sjUp', dom).innerHTML = ss.svgRepository.sjUp(20, '#296799');
                                                    ss.getDom('.sjDown', dom).style.display = 'none';
                                                    ss.getDom('.sjUp', dom).style.display = 'block';
                                                    dom.setAttribute('sorttype', 'up');
                                                }
                                            }
                                        }
                                    ]);
                                    isSort && ss.crtDom('div', 'sortWrap', '', curLiDom, {
                                            cn: ['position', 'top', 'right', 'height', 'width'],
                                            cv: ['absolute', '0px', '0px', '100%', '20px']
                                        })
                                        .appendDom(function (dom) {
                                            ss.crtDom('div', 'sjUp', ss.svgRepository.sjUp(20, '#888'), dom, {
                                                cn: ['height', 'width', 'position', 'top', 'left'],
                                                cv: ['50%', '20px', 'absolute', '0px', '0px']
                                            });
                                            ss.crtDom('div', 'sjDown', ss.svgRepository.sjDown(20, '#888'), dom, {
                                                cn: ['height', 'width', 'position', 'bottom', 'left'],
                                                cv: ['50%', '20px', 'absolute', '0px', '0px']
                                            });
                                        })
                                };
                                //是否渲染操作项
                                if (obj.table.operation && obj.table.operation.length != 0) {
                                    ss.crtDom('li', '', '操作', dom, {
                                        cn: ['width', 'paddingLeft', 'position', 'top', 'right', 'border', 'borderLeft', 'height', 'borderBottom', 'fontSize', 'lineHeight'],
                                        cv: [self['scope']['oprationW'] + 'px', obj.dataOption.pdL || '10px', 'absolute', '0px', '0px', '1px solid #ccc', 'none', '100%', '1.5px solid #ccc', '14px', '38px']
                                    })
                                }
                            })
                        ]);
                    //表body
                    ss.crtDom('div', 'tbCWrap', '', dom, {
                            cn: ['height', 'overflowX', 'overflowY', 'marginTop'],
                            cv: [self['scope']['curTableDom_conH'], 'hidden', 'auto', '-0px']
                        })
                        .appendDom(function (dom) {
                            if (self.tableData.data.length != 0) {
                                var hoverCol = '#f2f2f2', //鼠标移入颜色
                                    apartCol = '#f9f9f9'; //相隔斑马颜色
                                //渲染整体的函数
                                function crtFn() {
                                    for (var c = 0; c < self.tableData.data.length; c++) {
                                        var curUl = ss.crtDom('ul', 'item', '', dom, {
                                                cn: ['width', obj.table.options ? (!obj.table.options.closeInterlace && c % 2 !== 0 && 'backgroundColor') : c % 2 !== 0 && 'backgroundColor', 'height', 'paddingRight', 'position'],
                                                cv: ['100%', obj.table.options ? (!obj.table.options.closeInterlace && c % 2 !== 0 && apartCol) : c % 2 !== 0 && apartCol, tbBh, self['scope']['oprationW'] ? self['scope']['oprationW'] + 'px' : '0px', 'relative'],
                                                an: ['bgc', 'index'],
                                                av: [
                                                    obj.table.options ? ((!obj.table.options.closeInterlace && c % 2 !== 0) ? apartCol : '#fff') : (c % 2 !== 0 ? apartCol : '#fff'),
                                                    c
                                                ]
                                            }, [
                                                'mouseenter',
                                                function (dom) {
                                                    dom.style.backgroundColor = hoverCol;
                                                },
                                                'mouseleave',
                                                function (dom) {
                                                    dom.style.backgroundColor = dom.getAttribute('bgc');
                                                }
                                            ])
                                            //li各项
                                            .appendDom(function (dom) {
                                                for (var a = 0; a < obj.table.tlTxt.length; a++) {
                                                    //是否进行时间戳转换
                                                    var isTimeTf = obj.table.options && obj.table.options.isChangeTime && obj.table.options.isChangeTime.indexOf(obj.table.tlTxt[a]) != -1;
                                                    //是否需要别名替换
                                                    var isShimTf = obj.table.options && obj.table.options.shim && obj.table.options.shim[obj.table.tlTxt[a]];
                                                    //是否存在动态数据的别名转换
                                                    var isShim2Tf = self.scope['shimScope'] && self.scope['shimScope'][obj.table.tlTxt[a]];
                                                    //是否需要颜色替换
                                                    var isColorTf = obj.table.options && obj.table.options.color && obj.table.options.color[obj.table.tlTxt[a]];
                                                    //是否需要文字按钮项
                                                    var isTxtBtn = obj.table.options && obj.table.options['txtBtn'] &&
                                                        obj.table.options['txtBtn'][obj.table.tlTxt[a]];
                                                    //是否需要图片显示
                                                    var imgShow = obj.table.options && obj.table.options['imgShow'] &&
                                                        obj.table.options['imgShow'][obj.table.tlTxt[a]];
                                                    //是否扩展按钮
                                                    var isExtendBtn = obj.table.options && obj.table.options['extendBtn'] &&
                                                        obj.table.options['extendBtn'][obj.table.tlTxt[a]];

                                                    //当前值
                                                    var curVal = self.tableData.data[c][obj.table.tlTxt[a]];
                                                    //创建项
                                                    var liDom = ss.crtDom(
                                                        'li',
                                                        '',
                                                        (isTxtBtn || imgShow || isExtendBtn) ?
                                                        '' :
                                                        (
                                                            //时间戳
                                                            //字段存在 || 等于0
                                                            (curVal || curVal == 0) ?
                                                            (
                                                                isTimeTf ?
                                                                ss.dpDate.normal(curVal) :
                                                                (
                                                                    //别名替换
                                                                    isShimTf ?
                                                                    obj.table.options.shim[obj.table.tlTxt[a]][curVal] :
                                                                    (
                                                                        //动态数据
                                                                        isShim2Tf ?
                                                                        self.scope['shimScope'][obj.table.tlTxt[a]][curVal] :
                                                                        String(curVal)
                                                                    )
                                                                )
                                                            ) :
                                                            ''
                                                        ),
                                                        dom, {
                                                            cn: [
                                                                'width', 'display', 'verticalAlign', 'paddingLeft', 'fontSize', 'textAlign', 'height', 'lineHeight', 'border', 'borderLeft', 'borderTop',
                                                                'overflow', 'textOverflow', 'whiteSpace', 'position', isColorTf && 'color'
                                                            ],
                                                            cv: [
                                                                self.scope.dpWObj[obj.table.tlTxt[a]], 'inline-block', 'middle', obj.dataOption.pdL || '10px', '13px', 'left', '100%', tbBh, '1px solid #ccc', a === 0 ? '1px solid #ccc' : 'none', 'none',
                                                                'hidden', 'ellipsis', 'nowrap', 'relative', isColorTf && obj.table.options.color[obj.table.tlTxt[a]][curVal]
                                                            ],
                                                            an: ['name', obj.table.options && obj.table.options.showTitle && obj.table.options.showTitle.indexOf(obj.table.tlTxt[a]) != -1 && 'title'],
                                                            av: [obj.table.tlTxt[a], obj.table.options && obj.table.options.showTitle && obj.table.options.showTitle.indexOf(obj.table.tlTxt[a]) != -1 && self.tableData.data[c][obj.table.tlTxt[a]]]
                                                        }
                                                    );
                                                    //是否需要文字按钮项
                                                    if (isTxtBtn && (curVal || curVal == 0)) {
                                                        var curArr2 = curVal.split(',');
                                                        for (var cc = 0; cc < curArr2.length; cc++) {
                                                            var fillVal =
                                                                isTimeTf ?
                                                                ss.dpDate.normal(curArr2[cc]) :
                                                                (
                                                                    //别名替换
                                                                    isShimTf ?
                                                                    obj.table.options.shim[obj.table.tlTxt[a]][curArr2[cc]] :
                                                                    (
                                                                        //动态数据
                                                                        isShim2Tf ?
                                                                        self.scope['shimScope'][obj.table.tlTxt[a]][curArr2[cc]] :
                                                                        String(curArr2[cc])
                                                                    )
                                                                );
                                                            //是否是普通项
                                                            var curObj = obj.table.options['txtBtn'][obj.table.tlTxt[a]];
                                                            var isdTxt = curObj['type'] && curObj['type'] == 'txt';
                                                            ss.crtDom('span', '', fillVal, liDom, {
                                                                cn: ['dispaly', 'backgroundColor', 'color', 'padding', 'marginLeft', 'cursor', 'borderRadius'],
                                                                cv: ['inline-block', isdTxt ? 'transparent' : '#3A87AD', isdTxt ? '#000' : '#fff',
                                                                    '5px 8px', cc == 0 ? '0px' : (isdTxt ? '0px' : '6px'), isdTxt ? 'default' : 'pointer', '3px'
                                                                ],
                                                                an: ['txtIndex', 'dataIndex', 'txtCode'],
                                                                av: [a, c, curArr2[cc]]
                                                            }, [
                                                                'click',
                                                                function (dom) {
                                                                    var curObj = obj.table.options['txtBtn'][obj.table.tlTxt[dom.getAttribute('txtIndex')]];
                                                                    curObj.cbFn && curObj.cbFn(self.tableData.data[dom.getAttribute('dataIndex')], self, dom);
                                                                }
                                                            ])
                                                        };
                                                    };
                                                    //是否需要图片显示
                                                    if (imgShow && (curVal || curVal == 0)) {
                                                        ss.mdfCss(liDom, ['paddingLeft', '0px', 'textAlign', 'center']);
                                                        ss.crtDom('img', '', '', liDom, {
                                                            cn: ['height', 'marginTop'],
                                                            cv: ['28px', '4px'],
                                                            an: ['src'],
                                                            av: [curVal]
                                                        }, [
                                                            'click',
                                                            function (dom) {
                                                                var curObj = obj.table.options['txtBtn'][obj.table.tlTxt[dom.getAttribute('txtIndex')]];
                                                                curObj.cbFn && curObj.cbFn(self.tableData.data[dom.getAttribute('dataIndex')], self, dom);
                                                            }
                                                        ])
                                                    };
                                                    //是否需要扩展按钮
                                                    if (isExtendBtn) {
                                                        ss.crtDom('span', '', isExtendBtn['name'], liDom, {
                                                            cn: ['dispaly', 'backgroundColor', 'color', 'padding', 'marginLeft', 'cursor', 'borderRadius'],
                                                            cv: ['inline-block', '#3A87AD', '#fff',
                                                                '5px 8px', '6px', 'pointer', '3px'
                                                            ],
                                                            an: ['txtIndex', 'dataIndex', 'txtCode'],
                                                            av: [a, c, curArr2[cc]]
                                                        }, [
                                                            'click',
                                                            function (dom) {
                                                                var isExtendBtn = obj.table.options['extendBtn'][obj.table.tlTxt[dom.getAttribute('txtIndex')]];
                                                                isExtendBtn.cbFn && isExtendBtn.cbFn(self.tableData.data[dom.getAttribute('dataIndex')], self, dom);
                                                            }
                                                        ])
                                                    };
                                                    //是否具备内容展开资格
                                                    if (obj.table.options && obj.table.options.showCon && obj.table.options.showCon.indexOf(obj.table.tlTxt[a]) != -1) {
                                                        liDom.style.paddingLeft = '26px',
                                                            ss.crtDom('span', '', ss.svgRepository.arrow_down(13, '#333'), liDom, {
                                                                cn: ['position', 'top', 'left', 'width', 'height', 'cursor'],
                                                                cv: ['absolute', '13px', '10px', '13px', '13px', 'pointer']
                                                            }, [
                                                                'click',
                                                                function (dom) {
                                                                    var curUl = dom.parentNode.parentNode,
                                                                        curDom = curUl.parentNode;
                                                                    var judgeScroll = function () {
                                                                        if ((curDom.offsetWidth - curUl.offsetWidth) > 5) {
                                                                            //满足scroll条件
                                                                            self.domWrap['scrollShadow'].style.display = 'block';
                                                                            self.domWrap['tbTWrap'].style.overflowY = 'scroll';
                                                                        } else {
                                                                            self.domWrap['scrollShadow'].style.display = 'none';
                                                                            self.domWrap['tbTWrap'].style.overflowY = 'hidden';
                                                                        }
                                                                    };
                                                                    if (dom.getAttribute('isopen') && dom.getAttribute('isopen') == 'true') {
                                                                        dom.style.transform = 'rotate(0deg)';
                                                                        dom.parentNode.style.borderBottom = '1px solid #ccc'
                                                                        curDom.removeChild(curUl.nextSibling);
                                                                        judgeScroll();
                                                                        dom.setAttribute('isopen', 'false');
                                                                    } else {
                                                                        if (curUl.nextSibling && curUl.nextSibling.nodeName == 'P') {
                                                                            curDom.removeChild(curUl.nextSibling);
                                                                        }
                                                                        for (var a = 0; a < curUl.children.length; a++) {
                                                                            curUl.children[a].style.borderBottom = '1px solid #ccc';
                                                                            var spanDom = curUl.children[a].querySelector('span');
                                                                            spanDom && (spanDom.style.transform = 'rotate(0deg)');
                                                                            spanDom && (spanDom.setAttribute('isopen', 'false'));
                                                                        }
                                                                        //三角图标样式
                                                                        dom.style.transform = 'rotate(180deg)';
                                                                        dom.parentNode.style.borderBottom = '1px solid ' + curUl.getAttribute('bgc');
                                                                        var showDom = ss.crtDom('p', '', ss.getDomTxt(dom.parentNode), '', {
                                                                            cn: ['width', 'padding', 'border', 'borderTop', 'backgroundColor'],
                                                                            cv: ['100%', '10px 10px', '1px solid #ccc', 'none', curUl.getAttribute('bgc')]
                                                                        });
                                                                        curDom.insertBefore(showDom, curUl.nextSibling); //追加p展示元素
                                                                        judgeScroll();
                                                                        dom.setAttribute('isopen', 'true');
                                                                    }
                                                                }
                                                            ])
                                                    }
                                                };
                                                //是否需要渲染操作项
                                                if (obj.table.operation && obj.table.operation.length != 0) {
                                                    ss.crtDom('li', '', '', dom, {
                                                            cn: ['width', 'paddingLeft', 'position', 'top', 'right', 'border', 'borderLeft', 'height', 'borderTop', 'fontSize', 'lineHeight'],
                                                            cv: [self['scope']['oprationW'] + 'px', obj.dataOption.pdL || '10px', 'absolute', '0px', '0px', '1px solid #ccc', 'none', '100%', 'none', '13px', '36px']
                                                        })
                                                        .appendDom(function (dom) {
                                                            //按钮样式对照表
                                                            var btnCss = {
                                                                del: {
                                                                    bgc: 'rgb(245, 108, 108)',
                                                                    col: '#fff'
                                                                },
                                                                opt1: {
                                                                    bgc: '#009688',
                                                                    col: '#fff'
                                                                },
                                                                opt2: {
                                                                    bgc: '#1E9FFF',
                                                                    col: '#fff'
                                                                },
                                                                opt3: {
                                                                    bgc: '#FFB800',
                                                                    col: '#fff'
                                                                },
                                                                opt4: {
                                                                    bgc: '#FF5722',
                                                                    col: '#fff'
                                                                }
                                                            };
                                                            //span按钮的创建函数
                                                            var crtDom = function (index) {
                                                                var colType = obj.table.operation[a].colType;
                                                                ss.crtDom('span', '', obj.table.operation[a].name, dom, {
                                                                    cn: ['backgroundColor', 'padding', 'borderRadius', 'fontSize', 'marginRight', 'cursor', 'color', !colType && 'border', 'userSelect'],
                                                                    cv: [btnCss[colType] ? btnCss[colType]['bgc'] : '#fff', '3px 10px', '3px', '12px', '5px', 'pointer', btnCss[colType] ? btnCss[colType]['col'] : '#000', !colType && '1px solid #ccc', 'none'],
                                                                    an: ['location', 'index', 'flag'], //location:按钮的位置索引；index:数据的索引
                                                                    av: [index, c, obj.table.operation[a].flag]
                                                                }, [
                                                                    'click',
                                                                    function (dom) {
                                                                        var curData = self.tableData.data[dom.getAttribute('index')];
                                                                        //编辑
                                                                        (dom.innerHTML.indexOf('编辑') !== -1 || dom.getAttribute('flag') == 'edit') &&
                                                                        self.lg_editViewFn(curData, 'edit');

                                                                        //查看
                                                                        (dom.innerHTML.indexOf('查看') !== -1 || dom.getAttribute('flag') == 'dtl') &&
                                                                        self.lg_seaViewFn(curData, 'dtl');

                                                                        //删除
                                                                        (dom.innerHTML.indexOf('删除') !== -1 || dom.getAttribute('flag') == 'del') &&
                                                                        layer.confirm('确定删除吗?', function (index) {
                                                                            //删除询问
                                                                            var operationArr = obj.table.operation;
                                                                            var delObj = {},
                                                                                delItem;
                                                                            for (var a = 0; a < operationArr.length; a++) {
                                                                                (operationArr[a].name === '删除' || operationArr[a].flag === 'del') &&
                                                                                (
                                                                                    delItem = operationArr[a],
                                                                                    delObj = (
                                                                                        typeof operationArr[a].data == 'string' ?
                                                                                        JSON.parse(operationArr[a].data) :
                                                                                        operationArr[a].data
                                                                                    )
                                                                                );
                                                                            };
                                                                            for (var s in delObj) {
                                                                                delObj[s] = curData[s];
                                                                            };
                                                                            //是否json类型提交
                                                                            var isJsonTF = delItem.dataType && delItem.dataType === 'json';
                                                                            var fqObj = {
                                                                                url: delItem.url,
                                                                                type: delItem.type || 'post',
                                                                                data: isJsonTF ? JSON.stringify(delObj) : delObj
                                                                            };
                                                                            isJsonTF && (fqObj['dataType'] = 'json');
                                                                            self.ajax(
                                                                                fqObj,
                                                                                //success
                                                                                function (data) {
                                                                                    layer.close(index); //关闭询问窗
                                                                                    layer.msg('删除成功!');
                                                                                    self.lg_reloadFn(); //表格重载
                                                                                },
                                                                                //complete
                                                                                function (data) {
                                                                                    layer.close(index); //关闭询问窗
                                                                                },
                                                                                //beforeSend
                                                                                function (request) {
                                                                                    isJsonTF &&
                                                                                        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                                                                                }
                                                                            );
                                                                        });

                                                                        //其它按钮
                                                                        (['编辑', '删除', '查看'].indexOf(dom.innerHTML) === -1 &&
                                                                            ['edit', 'del', 'dtl'].indexOf(dom.getAttribute('type')) === -1
                                                                        ) &&
                                                                        obj.table.operation[dom.getAttribute('location')].cbFn &&
                                                                            obj.table.operation[dom.getAttribute('location')].cbFn(curData, self);

                                                                    }
                                                                ])
                                                            };
                                                            //遍历操作项数组
                                                            if (obj.table.operation) {
                                                                for (var a = 0; a < obj.table.operation.length; a++) {
                                                                    if (obj.table.operation[a].rely) {
                                                                        var tbData = self.tableData.data[c]; //获取当前行的值
                                                                        var isTF = true; //默认为true
                                                                        for (var xx in obj.table.operation[a].rely) {
                                                                            if (obj.table.operation[a].rely[xx] != tbData[xx]) {
                                                                                isTF = false; //只要有一个不满足，则更新isTF的值
                                                                                break;
                                                                            }
                                                                        };
                                                                        //满足条件则创建按钮
                                                                        if (isTF) {
                                                                            crtDom(a);
                                                                        }
                                                                    } else {
                                                                        //默认的编辑/删除按钮，不带rely，直接创建
                                                                        crtDom(a);
                                                                    }
                                                                }
                                                            }
                                                        });
                                                };
                                            }) //lis
                                        //是否需要右键菜单
                                        obj.table.options && obj.table.options['rMenu'] && obj.table.options['rMenu'].length != 0 && self.lg_cancelMenuFn(curUl);
                                    }; //ul
                                };
                                //判断是否需要动态获取数据再创建
                                if (obj.table.options &&
                                    obj.table.options.urlData &&
                                    ss.judgeObj(obj.table.options.urlData) &&
                                    ss.getObjleg(obj.table.options.urlData) != 0) {
                                    //shim数据容器
                                    self.scope['shimScope'] = {};
                                    var urlData = obj.table.options.urlData;
                                    for (var s in urlData) {
                                        self.scope['shimScope'][s] = ''; //数据准备状态
                                        var isJsonTF = urlData[s].dataType && urlData[s].dataType === 'json';
                                        var fqObj = {
                                            url: urlData[s].url,
                                            type: urlData[s].type || 'post',
                                        };
                                        urlData[s].data && (fqObj['data'] = urlData[s].data);
                                        (function (s) {
                                            var selDataObj = urlData[s];
                                            self.eAjax(
                                                fqObj, {
                                                    success: function (data) {
                                                        var selDatas = data['data'] || [];
                                                        selDataObj['digitalModel'] && (selDatas = self.digitalModelFn(data, 'data', selDataObj['digitalModel']) || []);
                                                        var newWrap = []; //[name:'',code:'']形式
                                                        var isName = selDataObj['rely'] && selDataObj['rely']['name'];
                                                        var isCode = selDataObj['rely'] && selDataObj['rely']['code'];
                                                        for (var v = 0; v < selDatas.length; v++) {
                                                            newWrap.push({
                                                                name: isName ? selDatas[v][selDataObj['rely']['name']] : selDatas[v]['name'],
                                                                code: isCode ? selDatas[v][selDataObj['rely']['code']] : selDatas[v]['code']
                                                            });
                                                        };
                                                        //转换成->shim别名形式
                                                        var shimWrap = {};
                                                        newWrap.forEach(function (v) {
                                                            shimWrap[v['code']] = v['name'];
                                                        });
                                                        self.scope['shimScope'][s] = shimWrap;
                                                    },
                                                    isJson: isJsonTF
                                                }
                                            );
                                        })(s)
                                    }; //拿数据
                                    //轮询数据
                                    var timer2 = window.setInterval(function () {
                                        var isTf = true;
                                        for (var e in self.scope['shimScope']) {
                                            self.scope['shimScope'][e] || (isTf = false);
                                        };
                                        isTf && (window.clearInterval(timer2), crtFn());
                                    }, 10);
                                } else {
                                    //不存在直接创建
                                    crtFn();
                                };
                            } else {
                                var tempDomStr = [
                                    '<div class="block-no-results" p-id="1308" style="padding-top:40px;text-align:center;">',
                                    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="170px" height="170px" viewBox="0 0 200 200" enable-background="new 0 0 200 200" xml:space="preserve" p-id="1309"><g p-id="1310">',
                                    '<path fill="#EEEEEE" d="M18.224,35.559c0,0,0.38-0.042,0.592,0.211s0.465,3.804,1.395,4.776s4.692,0.423,4.692,1.691c0,1.014-3.496,1.124-4.68,2.096c-1.184,0.972-0.507,5.072-1.957,4.921c-1.135-0.119-0.338-3.381-1.733-4.692s-4.776-1.057-4.776-2.24s3.466-0.465,4.65-1.818C17.59,39.152,17.083,35.559,18.224,35.559z" p-id="1311">',
                                    '</path>',
                                    '<path fill="#B1AFAE" d="M7.726,77.11c0,0,0.23-0.026,0.357,0.128c0.128,0.153,0.281,2.296,0.842,2.883s2.832,0.255,2.832,1.02c0,0.612-2.11,0.678-2.824,1.265c-0.714,0.587-0.306,3.061-1.181,2.97c-0.685-0.072-0.204-2.041-1.046-2.832c-0.842-0.791-2.883-0.638-2.883-1.352s2.092-0.281,2.806-1.097C7.343,79.279,7.037,77.11,7.726,77.11z" p-id="1312">',
                                    '</path>',
                                    '<path fill="#EEEEEE" d="M190.447,56.933c0,0,0.261-0.029,0.406,0.145s0.319,2.608,0.956,3.274c0.637,0.666,3.216,0.29,3.216,1.159c0,0.695-2.396,0.77-3.208,1.437c-0.811,0.666-0.348,3.477-1.341,3.373c-0.778-0.081-0.232-2.318-1.188-3.216c-0.956-0.898-3.274-0.724-3.274-1.536s2.376-0.319,3.187-1.246C190.013,59.396,189.665,56.933,190.447,56.933z" p-id="1313">',
                                    '</path>',
                                    '<path fill="#B1AFAE" d="M154.66,25.617c0,0,0.261-0.029,0.406,0.145c0.145,0.174,0.319,2.608,0.956,3.274c0.637,0.666,3.216,0.29,3.216,1.159c0,0.695-2.396,0.77-3.208,1.437c-0.811,0.666-0.348,3.477-1.341,3.373c-0.778-0.081-0.232-2.318-1.188-3.216c-0.956-0.898-3.274-0.724-3.274-1.536s2.376-0.319,3.187-1.246C154.226,28.08,153.878,25.617,154.66,25.617z" p-id="1314">',
                                    '</path>',
                                    '<circle fill="#EEEEEE" cx="56.234" cy="19.989" r="3.79" p-id="1315"></circle><circle fill="#EEEEEE" cx="178.362" cy="75.509" r="2.376" p-id="1316"></circle></g><circle fill="#EEEEEE" cx="95.662" cy="104.843" r="77.333" p-id="1317"></circle>',
                                    '<path fill="#FDFDFD" d="M145.856,131.98c-0.023,3.196-2.633,5.769-5.829,5.746l-89.136-0.146c-3.196-0.023-5.769-2.633-5.746-5.829l0.431-56.782c0.023-3.196,2.633-5.769,5.829-5.746l72.81,0.029c5.893,5.294,13.625,12.765,21.971,19.869L145.856,131.98z" p-id="1318" data-spm-anchor-id="a313x.7781069.1998910419.i1"></path><path fill="#D8D8D8" d="M146.469,87.616c-0.026,1.112-0.949,1.992-2.061,1.966l-19.059-0.448c-1.112-0.026-1.992-0.949-1.966-2.061l0.381-16.217c0.026-1.112,0.949-1.992,2.061-1.966L146.469,87.616z" p-id="1319">',
                                    '</path>',
                                    '<circle fill="#EEEEEE" cx="117.299" cy="128.428" r="18.247" p-id="1320"></circle>',
                                    '<path fill="#FFFFFF" d="M117.412,148.245c2.241,0,4.352-0.653,6.209-1.801l-0.006-2.304c0,0-0.31-3.921-3.169-4.83c-0.044-0.014-0.76,0.77-2.055,0.699l-0.831-0.262c-0.085,0.004-0.178,0.127-0.262,0.131c-0.085-0.004-0.395-0.433-0.481-0.437l-0.437,0.219c-1.294,0.071-2.054-0.403-2.098-0.389c-2.859,0.909-3.073,4.869-3.073,4.869l-0.006,2.304C113.06,147.592,115.171,148.245,117.412,148.245z" p-id="1321">',
                                    '</path>',
                                    '<path fill="#FFFFFF" d="M126.565,131.668c-0.091-4.974-4.313-8.929-9.431-8.836c-5.117,0.094-9.192,4.202-9.1,9.175c0.059,3.23,1.95,6.365,4.669,8.141l9.773-0.179c2.294-1.693,3.83-4.47,4.06-7.374C126.561,132.288,126.57,131.978,126.565,131.668zM121.961,139.026l-9.001,0.165c-2.103-1.47-3.536-3.873-3.581-6.347c-0.074-4.03,3.384-7.361,7.723-7.441c4.339-0.08,7.917,3.123,7.991,7.153C125.137,135.032,123.914,137.482,121.961,139.026z" p-id="1322">',
                                    '</path>',
                                    '<path fill="#B1AFAE" d="M113.09,139.511l8.674-0.159c1.881-1.543,3.058-3.992,3.013-6.467c-0.074-4.029-3.523-7.233-7.705-7.157c-4.181,0.077-7.511,3.405-7.437,7.434C109.68,135.636,111.063,138.04,113.09,139.511z" p-id="1323">',
                                    '</path>',
                                    '<linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="213.0032" y1="105.5631" x2="213.0032" y2="105.5631" gradientTransform="matrix(0.9989 0.0478 -0.0478 0.9989 -99.1255 22.5725)" p-id="1324"><stop offset="0.2225" style="stop-color:#FFFFFF" p-id="1325"></stop><stop offset="1" style="stop-color:#D1D3D4" p-id="1326"></stop></linearGradient>',
                                    '<path fill="url(#SVGID_1_)" d="M108.588,138.199" p-id="1327"></path><path fill="#B1AFAE" d="M122.101,140.456c-1.196,0.936-3.021,0.947-4.737,0.969c-1.752,0.023-3.397,0.04-4.644-0.756c-0.398-0.254-0.581-0.843-0.41-0.847l10.184-0.231C122.665,139.587,122.402,140.221,122.101,140.456z" p-id="1328"></path><path fill="#C8C7C6" d="M109.59,133.167c-0.074-4.049,3.268-7.393,7.465-7.47c4.197-0.077,7.659,3.143,7.734,7.191c0.03,1.624-0.464,3.237-1.336,4.592c1.06-1.425,1.672-3.18,1.639-4.947c-0.074-4.049-3.665-7.267-8.02-7.187c-4.355,0.08-7.826,3.427-7.752,7.477c0.027,1.493,0.558,2.96,1.434,4.214C110.041,135.862,109.615,134.525,109.59,133.167z" p-id="1329">',
                                    '</path>',
                                    '<path fill="#FFFFFF" d="M122.199,140.266c-1.218,0.535-3.07,0.508-4.805,0.538c-1.771,0.031-3.424,0.109-4.676-0.323c-0.399-0.138-0.578-0.465-0.406-0.469l10.293-0.234C122.778,139.775,122.506,140.132,122.199,140.266z" p-id="1330">',
                                    '</path>',
                                    '<linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="221.3779" y1="106.4216" x2="221.3779" y2="106.4216" gradientTransform="matrix(0.9989 0.0478 -0.0478 0.9989 -99.1255 22.5725)" p-id="1331"><stop offset="0.2225" style="stop-color:#FFFFFF" p-id="1332"></stop><stop offset="1" style="stop-color:#D1D3D4" p-id="1333"></stop></linearGradient>',
                                    '<path fill="url(#SVGID_2_)" d="M116.912,139.457" p-id="1334"></path><path fill="#C1C1C1" d="M122.63,139.791c0,0.241-0.196,0.437-0.437,0.437h-9.617c-0.241,0-0.437-0.196-0.437-0.437l0,0c0-0.241,0.196-0.437,0.437-0.437h9.617C122.434,139.354,122.63,139.549,122.63,139.791L122.63,139.791z" p-id="1335">',
                                    '</path>',
                                    '<path fill="#B1AFAE" d="M119.922,145.551c0,0.108-0.088,0.196-0.196,0.196l-4.626,0.003c-0.108,0-0.196-0.088-0.196-0.196l-0.002-3.131c0-0.108,0.088-0.196,0.196-0.196l4.626-0.003c0.108,0,0.196,0.088,0.196,0.196L119.922,145.551z" p-id="1336">',
                                    '</path>',
                                    '<path fill="#CCCCCC" d="M119.374,145.166c0,0.082-0.069,0.148-0.153,0.148l-3.616,0.002c-0.085,0-0.154-0.066-0.154-0.148l-0.001-2.36c0-0.082,0.069-0.148,0.153-0.148l3.616-0.002c0.085,0,0.154,0.066,0.154,0.148L119.374,145.166z" p-id="1337">',
                                    '</path>',
                                    '<rect x="115.894" y="143.119" fill="#FFFFFF" width="1.315" height="0.527" p-id="1338"></rect><rect x="117.613" y="143.118" fill="#FFFFFF" width="1.315" height="0.527" p-id="1339"></rect><rect x="115.895" y="144.042" fill="#FFFFFF" width="3.034" height="0.813" p-id="1340"></rect><g p-id="1341">',
                                    '<path fill="#D8D8D8" d="M111.976,131.974c-0.82-0.543,0.176-2.081,1.023-2.932s1.519-1.188,2.189-1.014c0.469,0.122,1.102,1.168-0.015,2.077C113.919,131.126,113.369,132.898,111.976,131.974z" p-id="1342">',
                                    '</path>',
                                    '<circle fill="#D8D8D8" cx="111.865" cy="133.908" r="0.962" p-id="1343"></circle></g>',
                                    '<path fill="#D8D8D8" d="M112.247,85.099c0,1.057-0.857,1.913-1.913,1.913H59.158c-1.057,0-1.913-0.857-1.913-1.913l0,0c0-1.057,0.857-1.913,1.913-1.913h51.175C111.39,83.186,112.247,84.042,112.247,85.099L112.247,85.099z" p-id="1344"></path><path fill="#D8D8D8" d="M83.201,98.717c0,1.057-0.857,1.913-1.913,1.913H59.158c-1.057,0-1.913-0.857-1.913-1.913l0,0c0-1.057,0.857-1.913,1.913-1.913h22.129C82.344,96.804,83.201,97.66,83.201,98.717L83.201,98.717z" p-id="1345"></path><path fill="#D8D8D8" d="M83.201,112.335c0,1.057-0.857,1.913-1.913,1.913H59.158c-1.057,0-1.913-0.857-1.913-1.913l0,0c0-1.057,0.857-1.913,1.913-1.913h22.129C82.344,110.422,83.201,111.278,83.201,112.335L83.201,112.335z" p-id="1346"></path><path fill="#D8D8D8" d="M141.451,148.653c-0.669-0.798-1.858-0.902-2.656-0.234l-0.003,0.003l-2.983-3.559c3.835-4.361,6.162-10.08,6.162-16.344c0-13.675-11.086-24.76-24.76-24.76c-13.675,0-24.76,11.086-24.76,24.76c0,13.675,11.086,24.76,24.76,24.76c5.177,0,9.983-1.59,13.957-4.307l2.876,3.43l-0.003,0.003c-0.798,0.669-0.902,1.858-0.234,2.656l9.153,10.918c2.63-2.047,5.132-4.249,7.475-6.612L141.451,148.653z M117.149,146.768c-10.078,0-18.247-8.17-18.247-18.248c0-10.078,8.17-18.247,18.247-18.247c10.078,0,18.248,8.17,18.248,18.247C135.397,138.598,127.227,146.768,117.149,146.768z" p-id="1347"></path>',
                                    '</svg>',
                                    '<div class="message" p-id="1348">暂时木有内容呀～～</div></div>'
                                ].join();
                                dom.innerHTML = tempDomStr; //没数据提示
                            };
                        });
                });
            //是否渲染信息展示栏
            var infoH = '40px';
            var totalData = obj.dataOption.info ? self.tableData[obj.dataOption.info['txt']] : '';
            var infoWrap = obj.dataOption.info && self.tableData.data.length != 0 && ss.crtDom('div', 'infoWrap', '', tbTCWrap, {
                    cn: ['height', 'overflowX', 'overflowY'],
                    cv: [infoH, 'hidden', self.tableData.data.length > self['scope']['autoSize'] ? 'scroll' : 'hidden']
                })
                .appendDom([
                    ss.crtDom('ul', '', '', '', {
                        cn: ['width', 'height', 'paddingRight', 'position', 'backgroundColor'],
                        cv: ['100%', infoH, self['scope']['oprationW'] ? self['scope']['oprationW'] + 'px' : '0px', 'relative', 'rgb(230, 234, 237)'],
                    }).appendDom(function (dom) {
                        //是否含有别名
                        var shimTF = function (itemVal) {
                            var isTF = obj.dataOption.info.shim && obj.dataOption.info.shim[itemVal];
                            return isTF ? obj.dataOption.info.shim[itemVal] : '';
                        }
                        //li各项
                        for (var a = 0; a < obj.table.tlTxt.length; a++) {
                            ss.crtDom('li', '', shimTF(obj.table.tlTxt[a]) ? shimTF(obj.table.tlTxt[a]) : (String(totalData[obj.table.tlTxt[a]]) != 'null' ? String(totalData[obj.table.tlTxt[a]]) : ''), dom, {
                                cn: ['width', 'display', 'verticalAlign', 'paddingLeft', 'fontSize', 'textAlign', 'height', 'lineHeight', 'border', 'borderLeft', 'borderTop', 'borderBottom', 'overflow', 'textOverflow', 'whiteSpace', 'color'],
                                cv: [self.scope.dpWObj[obj.table.tlTxt[a]], 'inline-block', 'middle', obj.dataOption.pdL || '10px', '14px', 'left', '100%', tbHh, '1px solid #ccc', a === 0 ? '1px solid #ccc' : 'none', '1px solid #ccc', '1.5px solid #ccc', 'hidden', 'ellipsis', 'nowrap', '#000'],
                                an: ['name'],
                                av: [obj.table.tlTxt[a]]
                            })
                        };
                        //是否渲染操作项
                        if (obj.table.operation) {
                            ss.crtDom('li', '', '操作', dom, {
                                cn: ['width', 'paddingLeft', 'position', 'top', 'right', 'border', 'borderLeft', 'height', 'borderBottom', 'fontSize', 'lineHeight'],
                                cv: [self['scope']['oprationW'] + 'px', '10px', 'absolute', '0px', '0px', '1px solid #ccc', 'none', '100%', '1.5px solid #ccc', '14px', '38px']
                            })
                        }
                    })
                ]);
            self.domWrap['tbTCWrap'] = tbTCWrap;
            self.domWrap['scrollShadow'] = ss.getDom('.scrollShadow', tbTCWrap);
            self.domWrap['tbTWrap'] = ss.getDom('.tbTWrap', tbTCWrap);
            self.domWrap['tbCWrap'] = ss.getDom('.tbCWrap', tbTCWrap);
            self.domWrap['infoWrap'] = ss.getDom('.infoWrap', tbTCWrap);
            //追加到文档上
            self.domWrap['dtcWrap'].appendChild(tempContainer); //将虚拟dom容器追加到文档上
        },
        //表格的逻辑函数
        //各字段长度占比
        lg_dpItemsWFn: function () {
            var self = this,
                obj = self.sourceObj;
            //首先各字段的最大长度值(包括标题)
            //标题
            var titleObj = {};
            for (var b = 0; b < obj.table.tlTxt.length; b++) {
                titleObj[obj.table.tlTxt[b]] = obj.table.tlName[b];
            };
            //data数据
            if (!self.tableData.data) {
                ss.error('接口数据缺了一层data');
                return;
            };
            var data = self.tableData.data.concat(titleObj),
                dpObj = {};
            for (var a = 0; a < data.length; a++) {
                for (var x in data[a]) {
                    obj.table.tlTxt.indexOf(x) != -1 && (
                        dpObj[x] ? (dpObj[x].push(String(data[a][x]).length)) : (dpObj[x] = [], dpObj[x].push(String(data[a][x]).length))
                    )
                }
            };
            //拿到(data+标题)各字段的长度最大值
            var maxObj = {};
            for (var m in dpObj) {
                maxObj[m] = Math.max.apply(Math, dpObj[m]);
            }
            //判断是否有手动宽度控制
            var dpWith = obj.table.options && obj.table.options.dpWith;
            dpWith && (
                //对象
                ss.judgeObj(dpWith) && (
                    function () {
                        for (var u in dpWith) {
                            maxObj[u] = dpWith[u];
                        }
                    }()
                )
            );
            //获得最大长度集合的中位数
            var medianArr = [],
                medianVal;
            for (var n in maxObj) {
                medianArr.push(Number(maxObj[n]));
            };
            var medianVal = ss.getMedian(medianArr);
            //得出各字段最后的长度值，比中位数大两倍的值取其中位数两倍
            var medianObj = {};
            for (var j in maxObj) {
                medianObj[j] = maxObj[j] > medianVal * 2 ? medianVal * 2 : maxObj[j];
            };
            //得出各字段最后长度值所占比
            var endObj = {},
                allCount = 0;
            for (var u in medianObj) {
                allCount = allCount + medianObj[u];
            };
            for (var y in medianObj) {
                endObj[y] = (medianObj[y] / allCount) * 100 + '%';
            };
            self.scope.dpWObj = endObj;
        },
        //表格高度所占高度
        lg_autoHFn: function () {
            var self = this,
                obj = self.sourceObj,
                curTableDom = self.domWrap['dtcWrap'];
            //是否存在搜索栏，51为分页容器高度
            var pageH = obj.pageOption ? 51 : 0;
            var curTableDomH = curTableDom.parentNode.offsetHeight - (self.domWrap['dtsWrap'] ? self.domWrap['dtsWrap'].offsetHeight : 0) - pageH;
            curTableDom.style.height = curTableDomH + 'px';
            self['scope']['curTableDomH'] = curTableDomH + 'px';
            //是否存在百分比宽度扩展
            var isdpWPer = obj.table.options && obj.table.options.dpWPer;
            var scrollX = isdpWPer ? 20 : 0;
            //是否存在info信息栏展示
            var isInfoTF = obj.dataOption.info ? 35 : 0;
            var tempCount = curTableDomH - 15 - 40 - scrollX - isInfoTF;
            self['scope']['curTableDom_conH'] = tempCount + 'px'; //表格内容的高度 (15:paddingTop的值，40为表头的高度)
            self['scope']['autoSize'] = tempCount % 36 === 0 ? tempCount / 36 : Math.floor(tempCount / 36);
        },
        //数据模型转换
        digitalModelFn: function (data, name, judge) {
            var endDataArr;
            if (judge[name]) {
                var judgeData = judge[name]['location'];
                var tempWrap = data;
                for (var a = 0; a < judgeData.length; a++) {
                    tempWrap = tempWrap[judgeData[a]];
                }
                endDataArr = tempWrap;
                return endDataArr;
            } else {
                ss.error('不存在该字段的数据模型！')
                return;
            }
        },
        //操作项所占宽度
        lg_optWFn: function () {
            var self = this,
                obj = self.sourceObj,
                tempArr = [];
            //存储容器
            var saveWrap = {};
            //判断数据最大
            function getArrIndex(calcObj) {
                var eWrap = {};

                function calcMax(arr) {
                    var tempC = 0;
                    arr.forEach(function (v) {
                        tempC = tempC + v;
                    })
                    return tempC;
                }
                for (var ca in calcObj) {
                    eWrap[ca] = calcMax(calcObj[ca]);
                }
                var maxVal = getMax(eWrap);
                for (var v in eWrap) {
                    if (maxVal == eWrap[v]) {
                        return v;
                    }
                }
            }
            //得出哪项为最大
            function getMax(mObj) {
                var tempArr = [];
                for (var t in mObj) {
                    tempArr.push(mObj[t]);
                }
                return Math.max.apply(Math, tempArr);
            };
            if (obj.table.operation && self.tableData.data.length != 0) {
                //对各项的按钮进行统计
                var tbData = self.tableData.data;
                for (var aa = 0; aa < tbData.length; aa++) {
                    saveWrap[aa] = [];
                    for (var a = 0; a < obj.table.operation.length; a++) {
                        if (obj.table.operation[a].rely) {
                            //依赖条件显示/隐藏
                            var isTF = true;
                            for (var x in obj.table.operation[a].rely) {
                                if (obj.table.operation[a].rely[x] != tbData[aa][x]) {
                                    isTF = false;
                                }
                            }
                            if (isTF) {
                                saveWrap[aa].push(obj.table.operation[a].name.length);
                            }
                        } else {
                            saveWrap[aa].push(obj.table.operation[a].name.length);
                        }
                    }
                }
                var tempIndex = getArrIndex(saveWrap);
                tempArr = saveWrap[tempIndex];
                var tempCount = 0;
                for (var d = 0; d < tempArr.length; d++) {
                    tempCount = Number(tempArr[d]) * 12 + 36 + tempCount;
                }
                if (tempArr.length === 1) {
                    tempCount = Number(tempArr[0]) * 12 + 50;
                }
                self['scope']['oprationW'] = tempCount;
            } else {
                self['scope']['oprationW'] = 0;
            }

        },
        //取消系统右键
        lg_cancelMenuFn: function (ctx) {
            var self = this,
                obj = self.sourceObj;
            //取消右键事件
            ctx.oncontextmenu = function (e) {
                e.preventDefault();
                self.rd_contentMebu(obj.table.options['rMenu'], e, ctx);
            };
        },
        //渲染自定义菜单
        rd_contentMebu: function (items, e, ctx) {
            var self = this,
                obj = self.sourceObj;
            var tempFn = function () {
                var rMenuDom = self.domWrap['conMenuWrap'];
                rMenuDom && rMenuDom.parentNode.removeChild(rMenuDom);
                self.domWrap['conMenuWrap'] = '';
            };
            tempFn();
            var conMenuWrap = ss.crtDom('div', 'conMenu', '', ss.getDom('body'), {
                    cn: [
                        'width', 'position', 'boxShadow', 'boxSizing', 'backgroundColor', 'border',
                        'top', 'left'
                    ],
                    cv: [
                        '110px', 'fixed', '0 1px 1px #888', 'border-box', '#fff', '1px solid #ccc',
                        e.clientY + 'px', e.clientX + 'px'
                    ],
                })
                .appendDom(function (dom) {
                    var tempMitem = items;
                    var ulDom = ctx;
                    for (var u = 0; u < tempMitem.length; u++) {
                        ss.crtDom('div', '', tempMitem[u].name, dom, {
                            cn: ['height', 'lineHeight', 'padding', 'textAlign', 'cursor', 'fontSize', 'color', 'borderBottom'],
                            cv: ['25px', '20px', '3px 10px', 'center', 'pointer', '12px', '#222', '1px solid #ccc'],
                            an: ['index'],
                            av: [u]
                        }, [
                            'mouseover',
                            function (dom) {
                                dom.style.backgroundColor = '#3089dc';
                                dom.style.color = '#fff';
                            },
                            'mouseout',
                            function (dom) {
                                dom.style.backgroundColor = '#fff';
                                dom.style.color = '#222';
                            },
                            'click',
                            function (dom) {
                                var tableData = self.tableData.data || self.tableData;
                                for (var d = 0; d < tempMitem.length; d++) {
                                    if (tempMitem[d].name == dom.innerHTML) {
                                        tempMitem[d].cbFn(tableData[ulDom.getAttribute('index')], self);
                                        break;
                                    }
                                }
                            }
                        ]);
                    }
                }) //conMenuWrap_son
            self.domWrap['conMenuWrap'] = conMenuWrap;
            self.lg_bodyCliFn(tempFn); //body点击取消
        },
        //弹窗渲染
        rd_viewFn: function (titName, typeTxt, addType) {
            var self = this,
                obj = self.sourceObj;
            var viewContainer = document.createDocumentFragment();
            //遮罩层
            var shadeView = ss.crtDom('div', 'view_shade', '', viewContainer, {
                cn: ['width', 'height', 'position', 'top', 'left', 'backgroundColor', 'opacity', 'zIndex', 'display'],
                cv: [ss.paraWrap.clwx, ss.paraWrap.clhx, 'fixed', '0px', '0px', '#000', .3, 1300, 'block']
            });
            //内容
            var conView = ss.crtDom('div', 'view_con', '', viewContainer, {
                    cn: ['width', 'position', 'top', 'left', 'backgroundColor', 'borderRadius', 'zIndex', 'padding', 'display'],
                    cv: [ss.paraWrap.clw * .5 + 'px', 'fixed', ss.paraWrap.clh * .2 + 'px', ss.paraWrap.clw * .25 + 'px', '#fff', '5px', 1301, '0% 3%', 'block']
                })
                .appendDom(function (dom) {
                    //内容标题
                    ss.crtDom('div', 'viewC_tit', titName, dom, {
                        cn: ['cursor', 'widht', 'height', 'fontSize', 'color', 'borderBottom', 'position', 'lineHeight', 'textAlign', 'color'],
                        cv: ['move', '100%', '48px', '17px', '1f1f1f', '1px solid #e5e5e5', 'relative', '48px', 'center', '#333'],
                        an: ['flag'],
                        av: [addType ? addType : typeTxt]
                    });
                    //内容容器
                    ss.crtDom(addType ? 'form' : 'div', 'viewC_con', '', dom, {
                        cn: ['width', 'boxSizing', 'padding', 'clear', 'transition'],
                        cv: ['100%', 'border-box', '10px 0px', 'both', 'all .3s'],
                        an: ['id', 'enctype'],
                        av: [addType ? 'form' : '', addType ? 'multipart/form-data' : '']
                    });
                    //内容按钮容器
                    ss.crtDom('div', 'viewC_btn', '', dom, {
                            cn: ['width', 'height', 'fontSize', 'boxSizing', 'bottom', 'borderTop', 'left', 'lineHeight', 'textAlign'],
                            cv: ['100%', '54px', '18px', 'border-box', '0px', '1px solid #e5e5e5', '0%', '54px', 'center'],
                        })
                        .appendDom(function (dom) {
                            //不是查看，才渲染保存按钮
                            if (typeTxt != 'dtl') {
                                //保存按钮
                                ss.crtDom('span', 'viewC_btnSave', '保存', dom, {
                                    cn: ['color', 'backgroundColor', 'fontSize', 'padding', 'borderRadius', 'marginRight', 'cursor'],
                                    cv: ['#fff', '#3089DC', '13px', '3px 14px', '2px', '15px', 'pointer']
                                }, [
                                    'click',
                                    function (dom) {
                                        var typeTxt = ss.getDom('.viewC_tit', dom.parentNode.parentNode).getAttribute('flag');
                                        //新增
                                        if (typeTxt === 'add') {
                                            var addParaObj = self['scope']['addParaObj'];
                                            var addParaVerObj = self['scope']['addParaVerObj'];
                                            for (var x in addParaVerObj) {
                                                if (!addParaObj[x]) {
                                                    ss.layer.msg(addParaVerObj[x] + '未填写！');
                                                    return;
                                                }
                                            };
                                            //存在额外固定值，则追加
                                            var extraPara = obj.searchBtn.add.extraPara;
                                            if (extraPara && ss.judgeObj(extraPara) && ss.getObjleg(extraPara) != 0) {
                                                for (var xx in extraPara) {
                                                    addParaObj[xx] = extraPara[xx];
                                                }
                                            };
                                            //是否存在额外值，则追加
                                            var addParaObj_extra = self['scope']['addParaObj_extra'];
                                            if (addParaObj_extra && ss.judgeObj(addParaObj_extra) && ss.getObjleg(addParaObj_extra) != 0) {
                                                for (var xx in addParaObj_extra) {
                                                    addParaObj[xx] = addParaObj_extra[xx];
                                                }
                                            };
                                            var fqObj = {
                                                url: obj.searchBtn.add.url,
                                                type: obj.searchBtn.add.type || 'post',
                                                data: (obj.searchBtn.add.dataType && obj.searchBtn.add.dataType === 'json') ? JSON.stringify(addParaObj) : addParaObj
                                            };
                                            obj.searchBtn.add.dataType && obj.searchBtn.add.dataType === 'json' && (fqObj['dataType'] = 'json');
                                            
                                            //新增保存是否对数据处理
                                            var saveCbFnTF = obj.searchBtn && obj.searchBtn.add && obj.searchBtn.add.saveCbFn;
                                            saveCbFnTF && (fqObj = obj.searchBtn.add.saveCbFn(fqObj));
                                                //校验通过，进行接口动作
                                            self.ajax(
                                                fqObj,
                                                //success
                                                function (data) {
                                                    self.lg_reloadFn(); //表格重载
                                                    layer.msg('新增成功！'); //提示
                                                },
                                                //complete
                                                function () {
                                                    self.lg_hiddenViewFn(); //隐藏弹窗
                                                },
                                                //beforeSend
                                                function (request) {
                                                    obj.searchBtn.add.dataType && obj.searchBtn.add.dataType === 'json' &&
                                                        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                                                }
                                            );
                                        };
                                        //编辑
                                        if (typeTxt === 'edit') {
                                            var editParaObj = self['scope']['editParaObj'];
                                            var editParaVerObj = self['scope']['editParaVerObj'];
                                            var otherEditObj = self['scope']['otherEditObj'];
                                            var editItem = self['scope']['editItem'];
                                            //校验参数
                                            for (var x in editParaVerObj) {
                                                if (!editParaObj[x]) {
                                                    ss.layer.msg(editParaVerObj[x] + '未填写！');
                                                    return;
                                                }
                                            };
                                            //校验通过，进行接口动作
                                            for (var w in otherEditObj) {
                                                editParaObj[w] = otherEditObj[w];
                                            };
                                            var queryObj = editParaObj;
                                            //根据操作项数组，获取对应的{}数据
                                            var editBtnObj;

                                            function getEditBtnObj(str) {
                                                for (var a = 0; a < obj.table.operation.length; a++) {
                                                    if (obj.table.operation[a].flag == str || obj.table.operation[a].name == '编辑') {
                                                        return obj.table.operation[a];
                                                    };
                                                };
                                            };
                                            obj.table.operation && obj.table.operation.length !== 0 &&
                                                (editBtnObj = getEditBtnObj('edit'));

                                            

                                            //是否json类型提交
                                            var isJsonTF = editBtnObj.dataType && editBtnObj.dataType === 'json';
                                            var fqObj = {
                                                url: editItem.url,
                                                type: editBtnObj.type || 'post',
                                                data: isJsonTF ? JSON.stringify(queryObj) : queryObj
                                            };
                                            isJsonTF && (fqObj['dataType'] = 'json');
                                            //新增保存是否对数据处理
                                            var editCbFnTF =obj.table && obj.table.options && obj.table.options.editCbFn;
                                            editCbFnTF && (fqObj = obj.table.options.editCbFn(fqObj));
                                            self.ajax(
                                                fqObj,
                                                //success
                                                function (data) {
                                                    self.lg_reloadFn(); //表格重载
                                                    layer.msg('编辑成功！'); //提示
                                                },
                                                //complete
                                                function () {
                                                    self.lg_hiddenViewFn(); //隐藏弹窗
                                                },
                                                //beforeSend
                                                function (request) {
                                                    isJsonTF &&
                                                        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                                                }
                                            );
                                        };
                                        //from表单
                                        if (typeTxt === 'form') {
                                            var formData = obj.searchBtn.add;
                                            var options = {
                                                type: 'post',
                                                url: formData.url,
                                                success: function (d) {
                                                    if (d.result == 'success') {
                                                        self.lg_reloadFn(); //表格重载
                                                        layer.msg('新增成功！'); //提示
                                                    } else {
                                                        layer.msg(d.errorMsg || '新增失败！');
                                                    }
                                                },
                                                complete: function () {
                                                    self.lg_hiddenViewFn(); //隐藏弹窗
                                                }
                                            };
                                            $('#form').ajaxSubmit(options);
                                        };
                                    }
                                ]);
                            };
                            //取消按钮
                            ss.crtDom('span', 'viewC_btnCan', '取消', dom, {
                                cn: ['color', 'backgroundColor', 'fontSize', 'padding', 'borderRadius', 'marginLeft', 'cursor'],
                                cv: ['#fff', '#3089DC', '13px', '3px 14px', '2px', '15px', 'pointer']
                            }, [
                                'click',
                                function (dom) {
                                    self.lg_hiddenViewFn();
                                }
                            ])
                        })

                });
            self.domWrap['shadeView'] = shadeView;
            self.domWrap['conView'] = conView;
            self.domWrap['viewC_tit'] = ss.getDom('.viewC_tit', conView);
            self.domWrap['viewC_con'] = ss.getDom('.viewC_con', conView);
            self.domWrap['viewC_btnSave'] = ss.getDom('.viewC_btnSave', conView);
            ss.drag(self.domWrap['viewC_tit'], self.domWrap['conView']); //拖拽
            ss.getDom('body').appendChild(viewContainer);
        },
        //弹窗的函数
        //弹窗新增
        lg_addViewFn: function (titleName, type, addType) {
            var self = this,
                obj = self.sourceObj;
            self.rd_viewFn(titleName, type, addType); //渲染弹窗容器
            //新增数据
            var addViewData = (obj.searchBtn && obj.searchBtn.add && obj.searchBtn.add.items) ? obj.searchBtn.add.items : ss.error('缺少新增参数！');
            //虚拟dom
            var nviewContainer = document.createDocumentFragment();
            //新增参数存储
            self['scope']['addParaObj'] = {};
            //需要校验的参数存储
            self['scope']['addParaVerObj'] = {};
            //渲染
            for (var x in addViewData) {
                self['scope']['addParaObj'][x] = ''; //各个字段为空
                addViewData[x].verify && (self['scope']['addParaVerObj'][x] = addViewData[x].name);
                var itemH = '40px'; //每项高度
                //选项容器
                var itemDom = ss.crtDom('div', 'items', '', nviewContainer, {
                        cn: ['width', 'height', 'lineHeight', addViewData[x].type === 'pic' && 'marginTop'],
                        cv: [
                            '100%',
                            (addViewData[x].type === 'mulSelect' || addViewData[x].type === 'pic' || addViewData[x].type === 'video') ?
                            'auto' :
                            itemH, itemH, '10px'
                        ],
                        an: ['name'],
                        av: [x]
                    })
                    .appendDom([
                        //左---
                        ss.crtDom('div', '', addViewData[x].verify ? '* ' + addViewData[x].name + '：' : addViewData[x].name + '：', '', {
                            cn: ['display', 'verticalAlign', 'width', 'height', 'textAlign', 'paddingRight', 'paddingLeft', 'fontSize'],
                            cv: ['inline-block', 'top', '40%', '100%', 'right', '20px', '10px', '14px']
                        }),
                        //右---
                        ss.crtDom('div', '', '', '', {
                            cn: ['display', 'verticalAlign', 'width', 'height', 'paddingRight'],
                            cv: ['inline-block', 'top', '60%', '100%', addViewData[x].type === 'mulSelect' ? '50px' : '50px']
                        })
                        .appendDom(function (dom) {
                            //txt类型
                            if (addViewData[x].type === 'txt') {
                                ss.crtDom('input', '', '', dom, {
                                    cn: ['width', 'height', 'borderBottom', 'fontSize', 'marginTop'],
                                    cv: ['100%', '30px', '1px solid #ccc', '14px', '6px'],
                                    an: ['placeholder', 'type', 'name'],
                                    av: [addViewData[x].placeholder || '请输入' + addViewData[x].name, 'text', x]
                                }, [
                                    'change',
                                    function (dom) {
                                        self['scope']['addParaObj'][dom.getAttribute('name')] = dom.value;
                                    }
                                ]);
                            };
                            //area类型
                            if (addViewData[x].type === 'area') {
                                ss.crtDom('textarea', 'add', '', dom, {
                                    cn: ['width', 'height', 'border', 'fontSize', 'marginTop', 'padding'],
                                    cv: ['100%', '60px', '1px solid #ccc', '14px', '6px', '10px'],
                                    an: ['placeholder', 'name'],
                                    av: [addViewData[x].placeholder || '请输入' + addViewData[x].name, x]
                                }, [
                                    'change',
                                    function (dom) {
                                        var curVal = dom.value;
                                        if (/([^\u4e00-\u9fa5|\w])/.test(curVal) && addViewData[x].wrap) {
                                            var nCode = /([^\u4e00-\u9fa5|\w])/g.exec(curVal)[0];
                                            var tempArr = curVal.split(nCode);
                                            var endStr = '';
                                            for (var b = 0; b < tempArr.length; b++) {
                                                endStr = endStr + '<p>' + tempArr[b] + '</p>'
                                            }
                                            self['scope']['addParaObj'][dom.getAttribute('name')] = endStr;
                                        } else {
                                            self['scope']['addParaObj'][dom.getAttribute('name')] = dom.value;
                                        };
                                    }
                                ])
                            };
                            //num类型
                            if (addViewData[x].type === 'num') {
                                ss.crtDom('input', '', '', dom, {
                                    cn: ['width', 'height', 'borderBottom', 'fontSize', 'marginTop'],
                                    cv: ['100%', '30px', '1px solid #ccc', '14px', '6px'],
                                    an: ['placeholder', 'type', 'name'],
                                    av: [addViewData[x].placeholder || '请输入' + addViewData[x].name, 'number', x]
                                }, [
                                    'change',
                                    function (dom) {
                                        self['scope']['addParaObj'][dom.getAttribute('name')] = dom.value;
                                    }
                                ]);
                            };
                            //time类型
                            if (addViewData[x].type === 'time') {
                                var timeDom = ss.crtDom('input', '', '', dom, {
                                    cn: ['width', 'height', 'borderBottom', 'fontSize', 'marginTop'],
                                    cv: ['100%', '30px', '1px solid #ccc', '14px', '6px'],
                                    an: ['placeholder', 'name'],
                                    av: [addViewData[x].placeholder || '请选择' + addViewData[x].name, x]
                                });
                                !ss.laydate && ss.error('未引入时间控件！')
                                ss.laydate.render({
                                    elem: timeDom,
                                    type: addViewData[x].timeType || 'date',
                                    value: '',
                                    done: function (val) {
                                        self['scope']['addParaObj'][timeDom.getAttribute('name')] = val;
                                    }
                                })
                            };
                            //select类型
                            if (addViewData[x].type === 'select') {
                                ss.crtDom('div', '', addViewData[x].placeholder || addViewData[x].name, dom, {
                                        cn: ['width', 'height', 'lineHeight', 'padding', 'border', 'backgroundColor', 'color', 'fontSize', 'borderRadius', 'userSelect', 'cursor', 'position', 'marginTop'],
                                        cv: [addViewData[x].width ? addViewData[x].width : '80%', '30px', '30px', '0px 10px', '1px solid #dee4f1', '#f4f8fa', '#757575', '13px', '3px', 'none', 'pointer', 'relative', '5px'],
                                        an: ['name', 'code'],
                                        av: [x, '']
                                    }, [
                                        'click',
                                        function (dom, e) {
                                            //下拉框展开
                                            ss.getDom('.selectItems', dom).style.display = 'block';
                                            ss.getDom('.dateSvg', dom).style.transform = 'rotate(180deg)';
                                            ss.mdfCss(dom, ['boxShadow', '0px 0px .5px .3px #1890ff', 'border', '1px solid #f4f8fa']);
                                            //展开高亮
                                            var pDoms = ss.getDom('.selectItems', dom).children;
                                            for (var c = 0; c < pDoms.length; c++) {
                                                ss.mdfCss(pDoms[c], ['backgroundColor', '#fff', 'color', pDoms[c].getAttribute('code') ? '#333' : '#ccc']);
                                            }
                                            if (dom.getAttribute('code')) {
                                                for (var b = 0; b < pDoms.length; b++) {
                                                    pDoms[b].getAttribute('code') && pDoms[b].getAttribute('code') === dom.getAttribute('code') &&
                                                        ss.mdfCss(pDoms[b], ['backgroundColor', 'rgb(41, 103, 153)', 'color', '#fff']);
                                                }
                                            };
                                            var curDom = dom;
                                            //下拉框隐藏
                                            var clearStatuFn = function () {
                                                var dom = ss.getDom('.selectItems', curDom);
                                                ss.getDom('.selectItems', curDom).style.display = 'none';
                                                ss.getDom('.dateSvg', dom.parentNode).style.transform = 'rotate(0deg)'; //icon旋转
                                                ss.mdfCss(dom.parentNode, ['boxShadow', 'none', 'border', '1px solid #dee4f1', 'color', dom.parentNode.getAttribute('code') ? '#000' : '#757575']); //
                                            };
                                            if (ss.bodyClickObj.listeners[location.hash.slice(1)]) {
                                                var tempArr = ss.bodyClickObj.listeners[location.hash.slice(1)];
                                                tempArr.push(function () {
                                                    clearStatuFn();
                                                });
                                                ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
                                            } else {
                                                var tempArr = [];
                                                tempArr.push(function () {
                                                    clearStatuFn();
                                                });
                                                ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
                                            };

                                            e.stopPropagation();
                                        }
                                    ])
                                    .appendDom([
                                        //select->icon
                                        ss.crtDom('span', 'dateSvg', ss.svgRepository.sl_ad(14, '#555'), '', {
                                            cn: ['display', 'top', 'right', 'width', 'height', 'position', 'lineHeight'],
                                            cv: ['block', '8px', '5px', '14px', '14px', 'absolute', '14px']
                                        }),
                                        //select->con
                                        ss.crtDom('div', 'selectItems', '', '', {
                                            cn: ['width', 'height', 'border', 'position', 'top', 'left', 'backgroundColor', 'borderRadius', 'overflowX', 'overflowY', 'display', 'zIndex'],
                                            cv: [addViewData[x].width ? addViewData[x].width : '100%', addViewData[x].data.length < 5 ? 'auto' : addViewData[x].data.length * 30 + 'px', '1px solid #ccc', 'absolute', '32px', '-1px', '#fff', '3px', 'hidden', 'auto', 'none', 13]
                                        })
                                        .appendDom(function (dom) {
                                            if (addViewData[x].data) {
                                                //[{name:''+addViewData[x].name+'',code:''}].concat(addViewData[x].data).forEach(function(v,i){
                                                var crtDom = function (dataArr, sData) {
                                                    dataArr.forEach(function (v, i) {
                                                        ss.crtDom('p', '', v.name, dom, {
                                                            cn: ['padding', 'color', 'fontSize', 'overflow', 'textOverflow', 'whiteSpace'],
                                                            cv: ['0px 10px', i === 0 ? '#ccc' : '#333', '13px', 'hidden', 'ellipsis', 'nowrap'],
                                                            an: ['code'],
                                                            av: [v.code]
                                                        }, [
                                                            'mouseenter',
                                                            function (dom) {
                                                                ss.mdfCss(dom, ['backgroundColor', 'rgb(41, 103, 153)', 'color', '#fff'])
                                                            },
                                                            'mouseleave',
                                                            function (dom) {
                                                                var isTF = dom.getAttribute('code') && dom.parentNode.parentNode.getAttribute('code') === dom.getAttribute('code'); //满足选中状态
                                                                ss.mdfCss(dom, ['backgroundColor', isTF ? 'rgb(41, 103, 153)' : '#fff', 'color', isTF ? '#fff' : (dom.getAttribute('code') ? '#333' : '#ccc')]);
                                                            },
                                                            'click',
                                                            function (dom, e) {
                                                                ss.setDomTxt(dom.parentNode.parentNode, dom.innerHTML); //赋值
                                                                dom.parentNode.parentNode.setAttribute('code', dom.getAttribute('code')); //code属性赋值
                                                                self['scope']['addParaObj'][dom.parentNode.parentNode.getAttribute('name')] = dom.getAttribute('code');
                                                                dom.parentNode.style.display = 'none'; //下拉框隐藏
                                                                ss.getDom('.dateSvg', dom.parentNode.parentNode).style.transform = 'rotate(0deg)'; //icon旋转
                                                                ss.mdfCss(dom.parentNode.parentNode, ['boxShadow', 'none', 'border', '1px solid #dee4f1', 'color', dom.getAttribute('code') ? '#000' : '#757575']); //
                                                                //点击回调
                                                                var indexVal = dom.parentNode.parentNode.parentNode.parentNode.getAttribute('name');
                                                                addViewData[indexVal].cbFn && addViewData[indexVal].cbFn(dom, sData[i]);
                                                                e.stopPropagation();
                                                            }
                                                        ])
                                                    })
                                                };

                                                //是否数组，对象则需要动态获取
                                                ss.judgeArr(addViewData[x].data) ?
                                                    crtDom(addViewData[x].data) :
                                                    (function () {
                                                        var isJsonTF = addViewData[x].data.dataType && addViewData[x].data.dataType === 'json';
                                                        var fqObj = {
                                                            url: addViewData[x].data.url,
                                                            type: addViewData[x].data.type || 'post'
                                                        };
                                                        //data:isJsonTF ? JSON.stringify(tempObj) : tempObj,
                                                        isJsonTF && (fqObj['dataType'] = 'json'); //json方式传输赋值
                                                        addViewData[x].data.data &&
                                                            (fqObj['data'] = isJsonTF ? JSON.stringify(addViewData[x].data.data) : addViewData[x].data.data); //json方式传输赋值

                                                        var selDataObj = addViewData[x].data;
                                                        //获得数据
                                                        self.ajax(
                                                            fqObj,
                                                            function (data) {
                                                                var selDatas = data['data'] || [];
                                                                selDataObj['digitalModel'] && (selDatas = self.digitalModelFn(data, 'data', selDataObj['digitalModel']) || []);
                                                                var newWrap = [];
                                                                var isName = selDataObj['rely'] && selDataObj['rely']['name'];
                                                                var isCode = selDataObj['rely'] && selDataObj['rely']['code'];
                                                                for (var v = 0; v < selDatas.length; v++) {
                                                                    newWrap.push({
                                                                        name: isName ? selDatas[v][selDataObj['rely']['name']] : selDatas[v]['name'],
                                                                        code: isCode ? selDatas[v][selDataObj['rely']['code']] : selDatas[v]['code']
                                                                    });
                                                                };
                                                                crtDom(newWrap, selDatas);
                                                            },
                                                            //complete
                                                            function () {

                                                            },
                                                            //beforeSend
                                                            function (request) {
                                                                isJsonTF &&
                                                                    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                                                            }
                                                        );
                                                    }());
                                            } else {
                                                ss.error('下拉框选项数据未找到！');
                                                return;
                                            }
                                        })
                                    ]);
                            };
                            //mulSelect类型
                            if (addViewData[x].type === 'mulSelect') {
                                ss.crtDom('div', '', '', dom, {
                                        cn: ['width', 'height', 'paddingTop'],
                                        cv: ['100%', 'auto', '6px'],
                                        an: ['name', 'code'],
                                        av: [x, '']
                                    })
                                    .appendDom(function (dom) {
                                        //select->con
                                        ss.crtDom('div', 'selectItems', '', dom, {
                                                cn: [
                                                    'width', 'height', 'border', 'backgroundColor', 'borderRadius', 'zIndex', 'padding', 'paddingLeft'
                                                ],
                                                cv: [
                                                    '100%', 'auto', '1px solid #ccc', '#fff', '3px', 13, '5px', '15px'
                                                ]
                                            })
                                            .appendDom(function (dom) {
                                                //若存在form类型，则增加input赋值
                                                if (obj.searchBtn['add'].addType && obj.searchBtn['add'].addType == 'form') {
                                                    ss.crtDom('input', 'input', '', dom, {
                                                        an: ['type', 'name', 'id'],
                                                        av: ['hidden', x, 'input_form']
                                                    });
                                                };
                                                if (addViewData[x].data) {
                                                    //[{name:''+addViewData[x].name+'',code:''}].concat(addViewData[x].data).forEach(function(v,i){
                                                    var svgW = 20;
                                                    var crtDom = function (dataArr) {
                                                        dataArr.forEach(function (v, i) {
                                                            ss.crtDom('p', '', v.name, dom, {
                                                                    cn: ['padding', 'color', 'fontSize', 'display', 'boxSizing', 'paddingLeft', 'position', 'userSelect', 'marginRight', 'cursor'],
                                                                    cv: ['0px 5px', '#bbb', '13px', 'inline-block', 'content-box', '25px', 'relative', 'none', '10px', 'pointer'],
                                                                    an: ['code'],
                                                                    av: [v.code]
                                                                }, [
                                                                    'click',
                                                                    function (dom) {
                                                                        function setId(type, str) {
                                                                            var fscope = dom.parentNode.parentNode;
                                                                            var fscopeWrap = fscope.getAttribute('code') ? fscope.getAttribute('code').split(',') : [];
                                                                            if (type == 'add') {
                                                                                fscopeWrap.push(str);
                                                                            } else {
                                                                                fscopeWrap.splice(fscopeWrap.indexOf(str), 1);
                                                                            };
                                                                            fscope.setAttribute('code', fscopeWrap.join());
                                                                            self['scope']['addParaObj'][fscope.getAttribute('name')] = fscope.getAttribute('code'); //赋值给新增参数对象
                                                                            //若是form类型
                                                                            if (obj.searchBtn['add'].addType && obj.searchBtn['add'].addType == 'form') {
                                                                                ss.getDom('#input_form') && (ss.getDom('#input_form').value = fscopeWrap.join());
                                                                            }
                                                                        };
                                                                        if (dom.getAttribute('ischeck') && dom.getAttribute('ischeck') == 'true') {
                                                                            ss.getDom('.svg', dom).innerHTML = ss.svgRepository.checkboxIcon(svgW, '#bbb');
                                                                            ss.mdfCss(dom, ['color', '#bbb']);
                                                                            ss.mdfAttr(dom, ['ischeck', 'false']);
                                                                            setId('sul', dom.getAttribute('code'));
                                                                        } else {
                                                                            ss.getDom('.svg', dom).innerHTML = ss.svgRepository.checkboxIcon(svgW, '#3089DC');
                                                                            ss.mdfCss(dom, ['color', '#3089DC']);
                                                                            ss.mdfAttr(dom, ['ischeck', 'true']);
                                                                            setId('add', dom.getAttribute('code'));
                                                                        };
                                                                    }
                                                                ])
                                                                .appendDom(function (dom) {
                                                                    //svg
                                                                    ss.crtDom('div', 'svg', ss.svgRepository.checkboxIcon(svgW, '#bbb'), dom, {
                                                                        cn: ['position', 'width', 'height', 'top', 'left'],
                                                                        cv: ['absolute', svgW + 'px', svgW + 'px', '8px', '0px']
                                                                    });
                                                                })
                                                        })
                                                    };

                                                    //是否数组，对象则需要动态获取
                                                    ss.judgeArr(addViewData[x].data) ?
                                                        crtDom(addViewData[x].data) :
                                                        (function () {
                                                            var isJsonTF = addViewData[x].data.dataType && addViewData[x].data.dataType === 'json';
                                                            var fqObj = {
                                                                url: addViewData[x].data.url,
                                                                type: addViewData[x].data.type || 'post'
                                                            };
                                                            //data:isJsonTF ? JSON.stringify(tempObj) : tempObj,
                                                            isJsonTF && (fqObj['dataType'] = 'json'); //json方式传输赋值
                                                            addViewData[x].data.data &&
                                                                (fqObj['data'] = isJsonTF ? JSON.stringify(addViewData[x].data.data) : addViewData[x].data.data); //json方式传输赋值

                                                            var selDataObj = addViewData[x].data;
                                                            //获得数据
                                                            self.ajax(
                                                                fqObj,
                                                                function (data) {
                                                                    var selDatas = data['data'] || [];
                                                                    selDataObj['digitalModel'] && (selDatas = self.digitalModelFn(data, 'data', selDataObj['digitalModel']) || []);
                                                                    var newWrap = [];
                                                                    var isName = selDataObj['rely'] && selDataObj['rely']['name'];
                                                                    var isCode = selDataObj['rely'] && selDataObj['rely']['code'];
                                                                    for (var v = 0; v < selDatas.length; v++) {
                                                                        newWrap.push({
                                                                            name: isName ? selDatas[v][selDataObj['rely']['name']] : selDatas[v]['name'],
                                                                            code: isCode ? selDatas[v][selDataObj['rely']['code']] : selDatas[v]['code']
                                                                        });
                                                                    };
                                                                    crtDom(newWrap);
                                                                },
                                                                //complete
                                                                function () {

                                                                },
                                                                //beforeSend
                                                                function (request) {
                                                                    isJsonTF &&
                                                                        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                                                                }
                                                            );
                                                        }());
                                                } else {
                                                    ss.error('下拉框选项数据未找到！');
                                                    return;
                                                }
                                            })
                                    });
                            };
                            //图片类型
                            if (addViewData[x].type === 'pic') {
                                ss.crtDom('div', '', '', dom, {
                                        cn: ['width', 'height'],
                                        cv: ['100%', 'auto'],
                                    })
                                    .appendDom(function (dom) {
                                        //图片各项

                                        [1, 2].forEach(function (v) {
                                            ss.crtDom('label', '', '', dom, {
                                                    cn: ['display', 'marginRight'],
                                                    cv: ['inline-block', '10px'],
                                                    an: ['for'],
                                                    av: [x + v]
                                                }, [
                                                    'click',
                                                    function (dom) {
                                                        var showExcelNameFn = function (inputId) {
                                                            document.getElementById(inputId).onchange = function () {
                                                                var preview = ss.getDom('.img', dom);
                                                                var addSvgDom = ss.getDom('.addSvg', dom);
                                                                var file = ss.getDom('input', dom).files[0];
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
                                                        showExcelNameFn(ss.getDom('input', dom).getAttribute('id'));
                                                    }
                                                ])
                                                .appendDom(function (dom) {
                                                    ss.crtDom('div', 'selectItems', '', dom, {
                                                            cn: [
                                                                'width', 'height', 'border', 'backgroundColor', 'borderRadius', 'zIndex', 'padding', 'cursor'
                                                            ],
                                                            cv: [
                                                                '90px', '100px', '1px solid #ccc', '#fff', '3px', 13, '5px', 'pointer'
                                                            ]
                                                        })
                                                        .appendDom(function (dom) {
                                                            var svgW = 40;
                                                            ss.crtDom('div', 'addSvg', ss.svgRepository.add(svgW, '#ccc'), dom, {
                                                                cn: ['width', 'height', 'margin', 'position', 'marginTop'],
                                                                cv: [svgW + 'px', svgW + 'px', '0 auto', 'relative', '20px']
                                                            });
                                                            ss.crtDom('img', 'img', '', dom, {
                                                                cn: ['display', 'height', 'width', 'margin'],
                                                                cv: ['none', '100%', '100%', '0 auto'],
                                                                an: ['type', 'id'],
                                                                av: ['file', x + '_img']
                                                            });
                                                        });
                                                    ss.crtDom('input', 'input', '', dom, {
                                                        cn: ['display'],
                                                        cv: ['none'],
                                                        an: ['type', 'id', 'name'],
                                                        av: ['file', x + v, x]
                                                    });
                                                });
                                        })
                                    });
                            };
                            //视频类型
                            if (addViewData[x].type === 'video') {
                                ss.crtDom('div', '', '', dom, {
                                        cn: ['width', 'height'],
                                        cv: ['100%', 'auto'],
                                    })
                                    .appendDom(function (dom) {
                                        //图片各项
                                        ss.crtDom('label', '', '', dom, {
                                                cn: ['display', 'marginRight'],
                                                cv: ['inline-block', '10px'],
                                                an: ['for'],
                                                av: [x]
                                            }, [
                                                'click',
                                                function (dom) {
                                                    var showExcelNameFn = function (inputId) {
                                                        document.getElementById(inputId).onchange = function () {
                                                            var file = this.files[0];
                                                            //判断所选择文件是否为excel文件类型
                                                            //if(/\.xl/.test(file.name)){
                                                            if (true) {
                                                                ss.getDom('.wrap', dom).innerHTML = String(file.name);
                                                            } else {
                                                                layer.msg('非视频文件，请重新选择');
                                                                return;
                                                            }

                                                        }
                                                    };
                                                    showExcelNameFn(ss.getDom('input', dom).getAttribute('id'));
                                                }
                                            ])
                                            .appendDom(function (dom) {
                                                ss.crtDom('div', 'wrap', '', dom, {
                                                        cn: [
                                                            'width', 'height', 'border', 'backgroundColor', 'borderRadius', 'zIndex', 'padding', 'cursor'
                                                        ],
                                                        cv: [
                                                            '90px', '100px', '1px solid #ccc', '#fff', '3px', 13, '5px', 'pointer'
                                                        ]
                                                    })
                                                    .appendDom(function (dom) {
                                                        var svgW = 40;
                                                        ss.crtDom('div', 'addSvg', ss.svgRepository.add(svgW, '#ccc'), dom, {
                                                            cn: ['width', 'height', 'margin', 'position', 'marginTop'],
                                                            cv: [svgW + 'px', svgW + 'px', '0 auto', 'relative', '20px']
                                                        });
                                                    });
                                                ss.crtDom('input', 'input', '', dom, {
                                                    cn: ['display'],
                                                    cv: ['none'],
                                                    an: ['type', 'id', 'name'],
                                                    av: ['file', x, x]
                                                });
                                            });
                                    });
                            };
                            //上传录音的特殊类型
                            if(addViewData[x].type === '_upload'){
                                ss.crtDom('form','','',dom,{
                                    cn:[],
                                    cv:[],
                                    an:['id','enctype'],
                                    av:['_uploadForm','multipart/form-data']
                                })
                                .appendDom(function(dom){
                                    //录音路径+文件选择+上传 
                                    ss.crtDom('div', '', '**录音路径**', dom, {
                                        cn: [
                                            'width', 'height', 'lineHeight','borderBottom', 'fontSize', 'marginTop','display','verticalAlign','color',
                                            'textOverflow','overflow','whiteSpace'
                                        ],
                                        cv: [
                                            '40%', '38px', '38px','1px solid #ccc', '14px', '6px','inline-block','middle','#333',
                                            'ellipsis','hidden','nowrap'
                                        ],
                                        an: ['name'],
                                        av: [x]
                                    });
                                    //录音上传所带的参数：流程名+uuid
                                    ss.crtDom('input','','',dom,{cn:[],cv:[],
                                        an:['type','name','id'],av:['hidden','flowName','_uploadFlowName']
                                    });
                                    ss.crtDom('input','','',dom,{cn:[],cv:[],
                                        an:['type','name'],av:['hidden','uuid']
                                    });
                                    ss.crtDom('label','','请选择录音文件',dom,{
                                        cn:[
                                            'height','display','lineHeight','textAlign','cursor','fontSize','width',
                                            'boxSizing','border','borderRadius','textOverflow','overflow','whiteSpace','verticalAlign','marginLeft'
                                        ],
                                        cv:[
                                            '38px','inline-block','38px','center','pointer','14px','33%',
                                            'border-box','1px solid #ccc','3px','ellipsis','hidden','nowrap','middle','5%'
                                        ],
                                        an:['for','id'],
                                        av:['file','_uploadLabel']
                                    });
                                    ss.crtDom('input','','',dom,{
                                        cn:['display'],cv:['none'],
                                        an:['id','type','name'],av:['file','file','file']
                                    },[
                                        'change',function(dom){
                                            var file = dom.files[0];
                                            //判断所选择文件是否为excel文件类型
                                            if(/\.mp3|\.wav|\.wma|\.ogg|\.ape|\.aac/.test(file.name)){
                                                dom.parentNode.querySelector('label').innerHTML = file.name;
                                                dom.parentNode.querySelector('label').title = file.name;
                                            }
                                            else{
                                                layer.msg ('非音频文件，请重新选择');
                                                return;
                                            }
                                        }
                                    ])
                                    ss.crtDom('div','','上传',dom,{
                                        cn:['display','height','lineHeight','border','borderRadius','width','verticalAlign','fontSize','textAlign','cursor','marginLeft'],
                                        cv:['inline-block','38px','38px','1px solid #ccc','3px','20%','middle','14px','center','pointer','2%']
                                    },[
                                        'click',function(){
                                            //提交前参数判断
                                            if(document.querySelector('#_uploadLabel').innerHTML.indexOf('请选择')!=-1){
                                                layer.msg ('请先选择音频文件！');
                                                return false;
                                            };
                                            if(!self['scope']['addParaObj']['flowUuid']){
                                                layer.msg ('上传文件需要选择流程名称！');
                                                return false;
                                            };
                                            //根据id获取流程图名
                                            var ps = ss.getDom('[name="flowUuid"]',ss.getDom('.view_con')).querySelectorAll('p');
                                            var endName = '';
                                            for(var c=0; c<ps.length; c++){
                                                if(ps[c].getAttribute('code')==self['scope']['addParaObj'][['flowUuid']]){
                                                    endName=ps[c].innerHTML;
                                                    break;
                                                }
                                            };
                                            ss.getDom('#_uploadFlowName').value = endName;
                                            var options={
                                                type: 'post',
                                                url:'/admin/record/uploadFile.action',
                                                beforeSend: function(request) {
                                                    ss.c3Loading.show();
                                                },
                                                success:function(data){
                                                    if(data.result=='success'){
                                                        ss.c3Loading.hidden();
                                                        ss.layer.msg('上传成功！请填写提问对答保存！');
                                                        self['scope']['addParaObj']['recordPath'] = data['data']['path'];
                                                        //修改路径
                                                        ss.getDom('#_uploadForm').querySelector('[name="recordPath"]').innerHTML = data['data']['path'];
                                                        //新增弹窗的额外参数集合
                                                        self['scope']['addParaObj_extra'] || (self['scope']['addParaObj_extra']={}); 
                                                        self['scope']['addParaObj_extra']['recordUuid']= data['data']['uuid'];
                                                    }
                                                    else{
                                                        ss.layer.msg(data['data']&&data['msgError']&&'系统异常！');
                                                    }
                                                    console.log(data);
                                                }
                                            };
                                            $('#_uploadForm').ajaxSubmit(options); 
                                        }
                                    ])
                                    
                                })
                            }
                        })
                    ]);
                addViewData[x].type === 'area' && (itemDom.style.height = 'auto');
            }; //for循环
            self.domWrap['viewC_con'].appendChild(nviewContainer);
        },
        //弹窗编辑
        lg_editViewFn: function (curData, type) {
            var self = this,
                obj = self.sourceObj;
            //编辑数据
            var operationArr = obj.table.operation;
            //editItem：整个编辑配置项
            //editObj：主键的值
            var editObj, editItem;
            for (var a = 0; a < operationArr.length; a++) {
                (operationArr[a].name === '编辑' || operationArr[a].flag === 'edit') &&
                (editItem = operationArr[a], editObj = (typeof operationArr[a].data == 'string' ? JSON.parse(operationArr[a].data) : operationArr[a].data));
            };
            self.rd_viewFn(editItem['name'], type); //渲染弹窗
            for (var s in editObj) {
                editObj[s] = curData[s];
            }
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
            for (var x in editViewData) {
                self['scope']['editParaObj'][x] = curData[x]; //各个字段为空
                editViewData[x].verify && (self['scope']['editParaVerObj'][x] = editViewData[x].name);
                var itemH = '40px'; //每项高度
                //选项容器
                ss.crtDom('div', 'items', '', eviewContainer, {
                        cn: ['width', 'height', 'lineHeight'],
                        cv: ['100%', editViewData[x].type === 'mulSelect' || editViewData[x].type === 'textarea' ? 'auto' : itemH, itemH],
                        an: ['name'],
                        av: [x]
                    })
                    .appendDom([
                        //左---
                        ss.crtDom('div', '', editViewData[x].verify ? '* ' + editViewData[x].name + '：' : editViewData[x].name + '：', '', {
                            cn: ['display', 'verticalAlign', 'width', 'height', 'textAlign', 'paddingRight', 'paddingLeft', 'fontSize'],
                            cv: ['inline-block', 'top', '40%', '100%', 'right', '20px', '10px', '14px']
                        }),
                        //右---
                        ss.crtDom('div', '', '', '', {
                            cn: ['display', 'verticalAlign', 'width', 'height', 'paddingRight'],
                            cv: ['inline-block', 'top', '60%', '100%', '50px']
                        })
                        .appendDom(function (dom) {
                            //txt类型--------------------
                            if (editViewData[x].type === 'txt') {
                                ss.crtDom('input', '', '', dom, {
                                    cn: ['width', 'height', 'borderBottom', 'fontSize', 'marginTop'],
                                    cv: ['100%', '30px', '1px solid #ccc', '14px', '6px'],
                                    an: ['placeholder', 'type', 'name', 'value', editViewData[x].disabled == "" || editViewData[x].disabled == undefined ? "id" : "disabled"],
                                    av: [editViewData[x].placeholder || '请输入' + editViewData[x].name, 'text', x, curData[x] ? curData[x] : '']
                                }, [
                                    'change',
                                    function (dom) {
                                        self['scope']['editParaObj'][dom.getAttribute('name')] = dom.value;
                                    }
                                ]);
                            };
                            //num类型-------------------
                            if (editViewData[x].type === 'num') {
                                ss.crtDom('input', '', '', dom, {
                                    cn: ['width', 'height', 'borderBottom', 'fontSize', 'marginTop'],
                                    cv: ['100%', '30px', '1px solid #ccc', '14px', '6px'],
                                    an: ['placeholder', 'type', 'name', 'value'],
                                    av: [editViewData[x].placeholder || '请输入' + editViewData[x].name, 'number', x, curData[x] ? curData[x] : '']
                                }, [
                                    'change',
                                    function (dom) {
                                        self['scope']['editParaObj'][dom.getAttribute('name')] = dom.value;
                                    }
                                ]);
                            };
                            //textarea类型
                            if (editViewData[x].type === 'textarea') {
                                ss.crtDom('textarea', '', curData[x] ? curData[x] : '', dom, {
                                    cn: ['width', 'height', 'borderBottom', 'fontSize', 'marginTop'],
                                    cv: ['100%', '60px', '1px solid #ccc', '14px', '6px', '6px'],
                                    an: ['placeholder', 'type', 'name'],
                                    av: [editViewData[x].placeholder || '请输入' + editViewData[x].name, 'textarea', x]
                                }, [
                                    'change',
                                    function (dom) {
                                        // console.log(dom)
                                        var curVal = dom.value;
                                        if (/([^\u4e00-\u9fa5|\w])/.test(curVal) && editViewData[x].wrap) {
                                            var nCode = /([^\u4e00-\u9fa5|\w])/g.exec(curVal)[0];
                                            var tempArr = curVal.split(nCode);
                                            var endStr = '';
                                            for (var b = 0; b < tempArr.length; b++) {
                                                endStr = endStr + '<p>' + tempArr[b] + '</p>'
                                            }
                                            self['scope']['editParaObj'][dom.getAttribute('name')] = endStr;
                                        } else {
                                            self['scope']['editParaObj'][dom.getAttribute('name')] = dom.value;
                                        };
                                    }
                                ])
                            };
                            //time类型------------------
                            if (editViewData[x].type === 'time') {
                                var timeDom = ss.crtDom('input', '', '', dom, {
                                    cn: ['width', 'height', 'borderBottom', 'fontSize', 'marginTop'],
                                    cv: ['100%', '30px', '1px solid #ccc', '14px', '6px'],
                                    an: ['placeholder', 'name'],
                                    av: [editViewData[x].placeholder || '请选择' + editViewData[x].name, x]
                                });
                                !ss.laydate && ss.error('未引入时间控件！')
                                ss.laydate.render({
                                    elem: timeDom,
                                    type: editViewData[x].timeType || 'date',
                                    value: curData[x] ? (curData[x].length === 13 ? ss.dpDate.normal(curData[x]) : curData[x]) : '',
                                    done: function (val) {
                                        self['scope']['editParaObj'][timeDom.getAttribute('name')] = val;
                                    }
                                })
                            };
                            //select类型----------------
                            if (editViewData[x].type === 'select') {
                                editViewData[x].data || ss.error('select类型缺少data数据！');
                                var curEditVal = '-';
                                ss.crtDom('div', '', curEditVal, dom, {
                                        cn: [
                                            'width', 'height', 'lineHeight', 'padding', 'border', 'backgroundColor', 'color', 'fontSize',
                                            'borderRadius', 'userSelect', 'cursor', 'position', 'marginTop'
                                        ],
                                        cv: [
                                            editViewData[x].width ? editViewData[x].width : '80%', '30px', '30px', '0px 10px', '1px solid #dee4f1', '#f4f8fa', '#757575', '13px',
                                            '3px', 'none', 'pointer', 'relative', '5px'
                                        ],
                                        an: ['name', 'code'],
                                        av: [x, '']
                                    }, [
                                        'click',
                                        function (dom, e) {
                                            //下拉框展开
                                            ss.getDom('.selectItems', dom).style.display = 'block';
                                            ss.getDom('.dateSvg', dom).style.transform = 'rotate(180deg)';
                                            ss.mdfCss(dom, ['boxShadow', '0px 0px .5px .3px #1890ff', 'border', '1px solid #f4f8fa']);
                                            //展开高亮
                                            var pDoms = ss.getDom('.selectItems', dom).children;
                                            for (var c = 0; c < pDoms.length; c++) {
                                                ss.mdfCss(pDoms[c], ['backgroundColor', '#fff', 'color', pDoms[c].getAttribute('code') ? '#333' : '#ccc']);
                                            }
                                            if (dom.getAttribute('code')) {
                                                for (var b = 0; b < pDoms.length; b++) {
                                                    pDoms[b].getAttribute('code') && pDoms[b].getAttribute('code') === dom.getAttribute('code') &&
                                                        ss.mdfCss(pDoms[b], ['backgroundColor', 'rgb(41, 103, 153)', 'color', '#fff']);
                                                }
                                            }
                                            var curDom = dom;
                                            //下拉框隐藏
                                            var clearStatuFn = function () {
                                                var dom = ss.getDom('.selectItems', curDom);
                                                ss.getDom('.selectItems', curDom) && (ss.getDom('.selectItems', curDom).style.display = 'none');
                                                ss.getDom('.dateSvg', dom.parentNode) && (ss.getDom('.dateSvg', dom.parentNode).style.transform = 'rotate(0deg)'); //icon旋转
                                                ss.mdfCss(dom.parentNode, ['boxShadow', 'none', 'border', '1px solid #dee4f1', 'color', dom.parentNode.getAttribute('code') ? '#000' : '#757575']); //
                                            };
                                            if (ss.bodyClickObj.listeners[location.hash.slice(1)]) {
                                                var tempArr = ss.bodyClickObj.listeners[location.hash.slice(1)];
                                                tempArr.push(function () {
                                                    clearStatuFn();
                                                });
                                                ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
                                            } else {
                                                var tempArr = [];
                                                tempArr.push(function () {
                                                    clearStatuFn();
                                                });
                                                ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
                                            };
                                            e.stopPropagation();
                                        }
                                    ])
                                    .appendDom(function (dom) {
                                        var fDom = dom;
                                        //select->icon
                                        ss.crtDom('span', 'dateSvg', ss.svgRepository.sl_ad(14, '#555'), dom, {
                                                cn: ['display', 'top', 'right', 'width', 'height', 'position', 'lineHeight'],
                                                cv: ['block', '8px', '5px', '14px', '14px', 'absolute', '14px']
                                            }),
                                            //select->con
                                            ss.crtDom('div', 'selectItems', '', dom, {
                                                cn: [
                                                    'width', 'height',
                                                    'border', 'position', 'top', 'left', 'backgroundColor', 'borderRadius', 'overflowX', 'overflowY', 'display', 'zIndex'
                                                ],
                                                cv: [
                                                    editViewData[x].width ? editViewData[x].width : '100%', editViewData[x].data.length < 5 ? 'auto' : editViewData[x].data.length * 30 + 'px',
                                                    '1px solid #ccc', 'absolute', '32px', '-1px', '#fff', '3px', 'hidden', 'auto', 'none', 13
                                                ],
                                                an: ['txt'],
                                                av: [x]
                                            })
                                            .appendDom(function (dom) {
                                                if (editViewData[x].data) {
                                                    //[{name:''+editViewData[x].name+'',code:''}].concat(editViewData[x].data).forEach(function(v,i){
                                                    var crtDom = function (dataArr, type) {

                                                        function endNameCodeFn(dataArr, curVal) {
                                                            var tempObj = {};
                                                            for (var e = 0; e < dataArr.length; e++) {
                                                                (dataArr[e].code == curVal || dataArr[e].name == curVal) &&
                                                                (tempObj['eName'] = dataArr[e].name, tempObj['eCode'] = dataArr[e].code);
                                                            }
                                                            return tempObj;
                                                        };
                                                        var xx = dom.getAttribute('txt'); //当前修改的字段
                                                        //追加编辑的默认值
                                                        if (type == 'fixed') {
                                                            var endD = endNameCodeFn(editViewData[xx].data, curData[xx]);
                                                            ss.setDomTxt(fDom, endD.eName);
                                                            ss.mdfAttr(fDom, ['code', endD.eCode]);
                                                        } else {
                                                            var endD = endNameCodeFn(dataArr, curData[xx]);
                                                            ss.setDomTxt(fDom, endD.eName);
                                                            ss.mdfAttr(fDom, ['code', endD.eCode]);
                                                        };
                                                        //遍历渲染fn
                                                        dataArr.forEach(function (v, i) {
                                                            ss.crtDom('p', '', v.name, dom, {
                                                                cn: ['padding', 'color', 'fontSize', 'overflow', 'textOverflow', 'whiteSpace'],
                                                                cv: ['0px 10px', i === 0 ? '#ccc' : '#333', '13px', 'hidden', 'ellipsis', 'nowrap'],
                                                                an: ['code'],
                                                                av: [v.code]
                                                            }, [
                                                                'mouseenter',
                                                                function (dom) {
                                                                    ss.mdfCss(dom, ['backgroundColor', 'rgb(41, 103, 153)', 'color', '#fff'])
                                                                },
                                                                'mouseleave',
                                                                function (dom) {
                                                                    var isTF = dom.getAttribute('code') && dom.parentNode.parentNode.getAttribute('code') === dom.getAttribute('code'); //满足选中状态
                                                                    ss.mdfCss(dom, ['backgroundColor', isTF ? 'rgb(41, 103, 153)' : '#fff', 'color', isTF ? '#fff' : (dom.getAttribute('code') ? '#333' : '#ccc')]);
                                                                },
                                                                'click',
                                                                function (dom, e) {
                                                                    ss.setDomTxt(dom.parentNode.parentNode, dom.innerHTML); //赋值
                                                                    dom.parentNode.parentNode.setAttribute('code', dom.getAttribute('code')); //code属性赋值
                                                                    self['scope']['editParaObj'][dom.parentNode.parentNode.getAttribute('name')] = dom.getAttribute('code');
                                                                    dom.parentNode.style.display = 'none'; //下拉框隐藏
                                                                    ss.getDom('.dateSvg', dom.parentNode.parentNode).style.transform = 'rotate(0deg)'; //icon旋转
                                                                    ss.mdfCss(dom.parentNode.parentNode, ['boxShadow', 'none', 'border', '1px solid #dee4f1', 'color', dom.getAttribute('code') ? '#000' : '#757575']); //
                                                                    e.stopPropagation();
                                                                }
                                                            ])
                                                        });
                                                    };

                                                    //是否数组，对象则需要动态获取
                                                    ss.judgeArr(editViewData[x].data) ?
                                                        crtDom(editViewData[x].data, 'fixed') :
                                                        (function () {
                                                            var isJsonTF = editViewData[x].data.dataType && editViewData[x].data.dataType === 'json';
                                                            var fqObj = {
                                                                url: editViewData[x].data.url,
                                                                type: editViewData[x].data.type || 'post',
                                                            };
                                                            isJsonTF && (fqObj['dataType'] = 'json'); //json方式传输赋值
                                                            editViewData[x].data.data &&
                                                                (fqObj['data'] = isJsonTF ? JSON.stringify(editViewData[x].data.data) : editViewData[x].data.data); //json方式传输赋值
                                                            var selDataObj = editViewData[x].data;
                                                            //获得数据
                                                            self.ajax(
                                                                fqObj,
                                                                function (data) {
                                                                    var selDatas = data['data'] || [];
                                                                    selDataObj['digitalModel'] && (selDatas = self.digitalModelFn(data, 'data', selDataObj['digitalModel']) || []);
                                                                    var newWrap = [];
                                                                    var isName = selDataObj['rely'] && selDataObj['rely']['name'];
                                                                    var isCode = selDataObj['rely'] && selDataObj['rely']['code'];
                                                                    for (var v = 0; v < selDatas.length; v++) {
                                                                        newWrap.push({
                                                                            name: isName ? selDatas[v][selDataObj['rely']['name']] : selDatas[v]['name'],
                                                                            code: isCode ? selDatas[v][selDataObj['rely']['code']] : selDatas[v]['code']
                                                                        });
                                                                    };
                                                                    crtDom(newWrap);
                                                                },
                                                                //complete
                                                                function () {

                                                                },
                                                                //beforeSend
                                                                function (request) {
                                                                    isJsonTF &&
                                                                        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                                                                }
                                                            );
                                                        }())
                                                } else {
                                                    ss.error('下拉框选项数据data未配置！');
                                                }
                                            })
                                    });
                            };
                            //mulSelect类型
                            if (editViewData[x].type === 'mulSelect') {
                                ss.crtDom('div', '', '', dom, {
                                        cn: ['width', 'height', 'paddingTop'],
                                        cv: ['100%', 'auto', '6px'],
                                        an: ['name', 'code'],
                                        av: [x, '']
                                    })
                                    .appendDom(function (dom) {
                                        //select->con
                                        ss.crtDom('div', 'selectItems', '', dom, {
                                                cn: [
                                                    'width', 'height', 'border', 'backgroundColor', 'borderRadius', 'zIndex', 'padding', 'paddingLeft'
                                                ],
                                                cv: [
                                                    '100%', 'auto', '1px solid #ccc', '#fff', '3px', 13, '5px', '15px'
                                                ]
                                            })
                                            .appendDom(function (dom) {
                                                if (editViewData[x].data) {
                                                    var svgW = 20;
                                                    var crtDom = function (dataArr, type) {
                                                        //追加默认值
                                                        var xx = dom.parentNode.getAttribute('name'); //当前修改的字段
                                                        var defaultVal = curData[xx]; //当前编辑的字段
                                                        dom.parentNode.setAttribute('code', defaultVal); //存储
                                                        var judgeArr = defaultVal ? defaultVal.split(',') : [];
                                                        dataArr.forEach(function (v, i) {
                                                            ss.crtDom('p', '', v.name, dom, {
                                                                    cn: [
                                                                        'padding', 'color',
                                                                        'fontSize', 'display', 'boxSizing', 'paddingLeft', 'position', 'userSelect', 'marginRight', 'cursor'
                                                                    ],
                                                                    cv: [
                                                                        '0px 5px', judgeArr.length != 0 ? (judgeArr.indexOf(String(v.code)) != -1 ? '#3089DC' : '#bbb') : '#bbb',
                                                                        '13px', 'inline-block', 'content-box', '25px', 'relative', 'none', '10px', 'pointer'
                                                                    ],
                                                                    an: ['code', 'ischeck'],
                                                                    av: [v.code, judgeArr.indexOf(String(v.code)) != -1 ? 'true' : 'false']
                                                                }, [
                                                                    'click',
                                                                    function (dom) {
                                                                        function setId(type, str) {
                                                                            var fscope = dom.parentNode.parentNode;
                                                                            var fscopeWrap = fscope.getAttribute('code') ? fscope.getAttribute('code').split(',') : [];
                                                                            if (type == 'add') {
                                                                                fscopeWrap.push(str);
                                                                            } else {
                                                                                fscopeWrap.splice(fscopeWrap.indexOf(str), 1);
                                                                            };
                                                                            fscope.setAttribute('code', fscopeWrap.join());
                                                                            self['scope']['editParaObj'][fscope.getAttribute('name')] = fscope.getAttribute('code'); //赋值给新增参数对象
                                                                        };
                                                                        if (dom.getAttribute('ischeck') && dom.getAttribute('ischeck') == 'true') {
                                                                            ss.getDom('.svg', dom).innerHTML = ss.svgRepository.checkboxIcon(svgW, '#bbb');
                                                                            ss.mdfCss(dom, ['color', '#bbb']);
                                                                            ss.mdfAttr(dom, ['ischeck', 'false']);
                                                                            setId('sul', dom.getAttribute('code'));
                                                                        } else {
                                                                            ss.getDom('.svg', dom).innerHTML = ss.svgRepository.checkboxIcon(svgW, '#3089DC');
                                                                            ss.mdfCss(dom, ['color', '#3089DC']);
                                                                            ss.mdfAttr(dom, ['ischeck', 'true']);
                                                                            setId('add', dom.getAttribute('code'));
                                                                        };
                                                                    }
                                                                ])
                                                                .appendDom(function (dom) {
                                                                    //svg
                                                                    ss.crtDom('div', 'svg', ss.svgRepository.checkboxIcon(svgW, judgeArr.length != 0 ? (judgeArr.indexOf(String(v.code)) != -1 ? '#3089DC' : '#bbb') : '#bbb'), dom, {
                                                                        cn: ['position', 'width', 'height', 'top', 'left'],
                                                                        cv: ['absolute', svgW + 'px', svgW + 'px', '8px', '0px']
                                                                    });
                                                                })
                                                        })
                                                    };

                                                    //是否数组，对象则需要动态获取
                                                    ss.judgeArr(editViewData[x].data) ?
                                                        crtDom(editViewData[x].data, 'fixed') :
                                                        (function () {
                                                            var isJsonTF = editViewData[x].data.dataType && editViewData[x].data.dataType === 'json';
                                                            var fqObj = {
                                                                url: editViewData[x].data.url,
                                                                type: editViewData[x].data.type || 'post'
                                                            };
                                                            //data:isJsonTF ? JSON.stringify(tempObj) : tempObj,
                                                            isJsonTF && (fqObj['dataType'] = 'json'); //json方式传输赋值
                                                            editViewData[x].data.data &&
                                                                (fqObj['data'] = isJsonTF ? JSON.stringify(editViewData[x].data.data) : editViewData[x].data.data); //json方式传输赋值

                                                            var selDataObj = editViewData[x].data;
                                                            //获得数据
                                                            self.ajax(
                                                                fqObj,
                                                                function (data) {
                                                                    var selDatas = data['data'] || [];
                                                                    selDataObj['digitalModel'] && (selDatas = self.digitalModelFn(data, 'data', selDataObj['digitalModel']) || []);
                                                                    var newWrap = [];
                                                                    var isName = selDataObj['rely'] && selDataObj['rely']['name'];
                                                                    var isCode = selDataObj['rely'] && selDataObj['rely']['code'];
                                                                    for (var v = 0; v < selDatas.length; v++) {
                                                                        newWrap.push({
                                                                            name: isName ? selDatas[v][selDataObj['rely']['name']] : selDatas[v]['name'],
                                                                            code: isCode ? selDatas[v][selDataObj['rely']['code']] : selDatas[v]['code']
                                                                        });
                                                                    };
                                                                    crtDom(newWrap);
                                                                },
                                                                //complete
                                                                function () {

                                                                },
                                                                //beforeSend
                                                                function (request) {
                                                                    isJsonTF &&
                                                                        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                                                                }
                                                            );
                                                        }());
                                                } else {
                                                    ss.error('下拉框选项数据未找到！');
                                                    return;
                                                }
                                            })
                                    });
                            };
                            //上传录音的特殊类型
                            if(editViewData[x].type === '_upload'){
                                ss.crtDom('form','','',dom,{
                                    cn:[],
                                    cv:[],
                                    an:['id','enctype'],
                                    av:['_uploadForm','multipart/form-data']
                                })
                                .appendDom(function(dom){
                                    //录音路径+文件选择+上传 
                                    ss.crtDom('div', '', curData[x] ? curData[x] : '**录音路径**', dom, {
                                        cn: [
                                            'width', 'height', 'lineHeight','borderBottom', 'fontSize', 'marginTop','display','verticalAlign','color',
                                            'textOverflow','overflow','whiteSpace'
                                        ],
                                        cv: [
                                            '40%', '38px', '38px','1px solid #ccc', '14px', '6px','inline-block','middle','#333',
                                            'ellipsis','hidden','nowrap'
                                        ],
                                        an: ['name'],
                                        av: [x]
                                    });
                                    //录音上传所带的参数：流程名+uuid
                                    ss.crtDom('input','','',dom,{cn:[],cv:[],
                                        an:['type','name','id'],av:['hidden','flowName','_uploadFlowName']
                                    });
                                    ss.crtDom('input','','',dom,{cn:[],cv:[],
                                        an:['type','name','id'],av:['hidden','uuid','_uploadUuid']
                                    });
                                    ss.crtDom('label','','请选择录音文件',dom,{
                                        cn:[
                                            'height','display','lineHeight','textAlign','cursor','fontSize','width',
                                            'boxSizing','border','borderRadius','textOverflow','overflow','whiteSpace','verticalAlign','marginLeft'
                                        ],
                                        cv:[
                                            '38px','inline-block','38px','center','pointer','14px','33%',
                                            'border-box','1px solid #ccc','3px','ellipsis','hidden','nowrap','middle','5%'
                                        ],
                                        an:['for','id'],
                                        av:['file','_uploadLabel']
                                    });
                                    ss.crtDom('input','','',dom,{
                                        cn:['display'],cv:['none'],
                                        an:['id','type','name'],av:['file','file','file']
                                    },[
                                        'change',function(dom){
                                            var file = dom.files[0];
                                            //判断所选择文件是否为excel文件类型
                                            if(/\.mp3|\.wav|\.wma|\.ogg|\.ape|\.aac/.test(file.name)){
                                                dom.parentNode.querySelector('label').innerHTML = file.name;
                                                dom.parentNode.querySelector('label').title = file.name;
                                            }
                                            else{
                                                layer.msg ('非音频文件，请重新选择');
                                                return;
                                            }
                                        }
                                    ])
                                    ss.crtDom('div','','上传',dom,{
                                        cn:['display','height','lineHeight','border','borderRadius','width','verticalAlign','fontSize','textAlign','cursor','marginLeft'],
                                        cv:['inline-block','38px','38px','1px solid #ccc','3px','20%','middle','14px','center','pointer','2%']
                                    },[
                                        'click',function(){
                                            //提交前参数判断
                                            if(document.querySelector('#_uploadLabel').innerHTML.indexOf('请选择')!=-1){
                                                layer.msg ('请先选择音频文件！');
                                                return false;
                                            };

                                            if(!self['scope']['editParaObj']['flowUuid']){
                                                layer.msg ('上传文件需要选择流程名称！');
                                                return false;
                                            };
                                            //根据id获取流程图名
                                            var ps = ss.getDom('[name="flowUuid"]',ss.getDom('.view_con')).querySelectorAll('p');
                                            var endName = '';
                                            for(var c=0; c<ps.length; c++){
                                                if(ps[c].getAttribute('code')==self['scope']['editParaObj'][['flowUuid']]){
                                                    endName=ps[c].innerHTML;
                                                    break;
                                                }
                                            };
                                            if(!endName){
                                                layer.msg ('上传文件需要选择流程名称！');
                                                return false;
                                            };
                                            //根据id获取流程图名
                                            var ps = ss.getDom('[name="flowUuid"]',ss.getDom('.view_con')).querySelectorAll('p');
                                            var endName = '';
                                            for(var c=0; c<ps.length; c++){
                                                if(ps[c].getAttribute('code')==self['scope']['editParaObj'][['flowUuid']]){
                                                    endName=ps[c].innerHTML;
                                                    break;
                                                }
                                            };

                                            ss.getDom('#_uploadFlowName').value = endName;
                                            ss.getDom('#_uploadUuid').value = curData['recordUuid'];
                                            var options={
                                                type: 'post',
                                                url:'/admin/record/uploadFile.action',
                                                beforeSend: function(request) {
                                                    ss.c3Loading.show();
                                                },
                                                success:function(data){
                                                    if(data.result=='success'){
                                                        ss.c3Loading.hidden();
                                                        ss.layer.msg('录音文件更新成功！');
                                                        self['scope']['editParaObj']['recordPath'] = data['data']['path'];
                                                        //修改路径
                                                        ss.getDom('#_uploadForm').querySelector('[name="recordPath"]').innerHTML = data['data']['path'];
                                                    }
                                                    else{
                                                        ss.layer.msg(data['data']&&data['msgError']&&'系统异常！');
                                                    }
                                                    console.log(data);
                                                }
                                            };
                                            $('#_uploadForm').ajaxSubmit(options); 
                                        }
                                    ])
                                    
                                })
                            }
                        })
                    ]);
            }; //for循环
            self.domWrap['viewC_con'].appendChild(eviewContainer);
        },
        //弹窗查看
        lg_seaViewFn: function (curData, flag) {
            var self = this,
                obj = self.sourceObj;
            //编辑数据
            var operationArr = obj.table.operation;
            var editObj, editItem;
            for (var a = 0; a < operationArr.length; a++) {
                (operationArr[a].name === '查看' || operationArr[a].flag === 'dtl') &&
                (editItem = operationArr[a], editObj = (typeof operationArr[a].data == 'string' ? JSON.parse(operationArr[a].data) : operationArr[a].data));
            };
            for (var r in editObj) {
                editObj[r] = (editItem['shim'] && editItem['shim'][r]) ? curData[editItem['shim'][r]] : curData[r];
            };
            console.log(editObj);
            self.rd_viewFn(editItem['name'], flag); //渲染弹窗
            //根据操作项数组，获取对应的{}数据
            var editBtnObj;

            function getEditBtnObj(str) {
                for (var a = 0; a < obj.table.operation.length; a++) {
                    if (obj.table.operation[a].flag == str || obj.table.operation[a].name == '查看') {
                        return obj.table.operation[a];
                    };
                };
            };
            obj.table.operation && obj.table.operation.length !== 0 &&
                (editBtnObj = getEditBtnObj('dtl'));

            //是否动态获取，否则->当前编辑数据
            if (editItem.url) {
                var isJsonTF = editBtnObj.dataType && editBtnObj.dataType === 'json';
                var fqObj = {
                    url: editItem.url,
                    type: editBtnObj.type || 'post',
                    data: isJsonTF ? JSON.stringify(editObj) : editObj
                };
                isJsonTF && (fqObj['dataType'] = 'json');
                self.ajax(
                    fqObj,
                    //success
                    function (data) {
                        seaRenderFn(data.data);
                    },
                    //complete
                    function () {
                        // self.lg_hiddenViewFn();//隐藏弹窗
                    },
                    //beforeSend
                    function (request) {
                        isJsonTF &&
                            request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    }
                );
            } else {
                seaRenderFn(curData);
            }
            //渲染数据
            function seaRenderFn(seaData) {
                //虚拟dom
                var eviewContainer = document.createDocumentFragment();
                var endSeaData = {};
                for (var s in editBtnObj.items) {
                    endSeaData[s] = seaData[s];
                };
                //渲染
                for (var x in endSeaData) {
                    var itemH = '40px'; //每项高度
                    //选项容器
                    ss.crtDom('div', 'items', '', eviewContainer, {
                            cn: ['width', 'height', 'padding-top'],
                            cv: ['100%', 'auto', '8px'],
                            an: ['name'],
                            av: [x]
                        })
                        .appendDom([
                            //左---
                            ss.crtDom('div', '', editBtnObj.items[x] + '：', '', {
                                cn: ['display', 'verticalAlign', 'width', 'height', 'textAlign', 'paddingRight', 'paddingLeft', 'fontSize'],
                                cv: ['inline-block', 'top', '40%', '100%', 'right', '20px', '10px', '14px']
                            }),
                            //右---
                            ss.crtDom('div', '', '', '', {
                                cn: ['display', 'verticalAlign', 'width', 'height', 'paddingRight'],
                                cv: ['inline-block', 'top', '60%', '100%', '50px']
                            })
                            .appendDom(function (dom) {
                                ss.crtDom('div', '', endSeaData[x] ? endSeaData[x] : '-', dom, {
                                    cn: ['width', 'height', 'borderBottom', 'fontSize', 'padding-bottom', endSeaData[x] || 'color'],
                                    cv: ['100%', 'auto', '1px solid #ccc', '14px', '8px', endSeaData[x] || '#fff'],
                                });
                            })
                        ]);
                }; //for循环
                self.domWrap['viewC_con'].appendChild(eviewContainer);
            };
        },
        //弹窗隐藏
        lg_hiddenViewFn: function () {
            var self = this,
                obj = self.sourceObj;
            self.domWrap['shadeView'].parentNode.removeChild(self.domWrap['shadeView']);
            self.domWrap['conView'].parentNode.removeChild(self.domWrap['conView']);
        },
        //分页跳转
        lg_pageRunFn: function (runPage) {
            var self = this,
                obj = self.sourceObj;
            self.pageData.page = runPage;
            self.lg_reloadFn({}, runPage); //表格重载
        },
        //分页器渲染
        rd_pageFn: function () {
            var self = this,
                obj = self.sourceObj,
                pageDom = self.domWrap['dtpWrap'];
            //若已存在，进行移除
            var pageSonDom = self.domWrap['productionPage'];
            pageSonDom && pageSonDom.parentNode.removeChild(pageSonDom);
            if (pageDom) {
                //当前页&总页数
                var currentPage = self.pageData.page,
                    totalPage = self.pageData.totalPage;
                //当前页数
                var curPage = currentPage;
                var preStatus = curPage == 1 ? 'not-allowed' : 'pointer',
                    preTxtStatus = curPage == 1 ? '#c6c6c6' : '#333';

                var nextStatus = curPage == totalPage ? 'not-allowed' : 'pointer',
                    nextTxtStatus = curPage == totalPage ? '#c6c6c6' : '#333';
                //分页容器
                var productionPageDom = ss.crtDom('div', 'productionPage', '', pageDom, {
                        cn: ['height', 'boxSizing', 'float', 'marginTop', 'marginRight', 'backgroundColor', 'marginBottom'],
                        cv: ['30px', 'border-box', 'right', '15px', '0px', '#fff', '10px']
                    })
                    .appendDom(
                        function (dom) {

                            //上一页
                            ss.crtDom('div', '', '上一页', dom, {
                                cn: ['border', 'boxSizing', 'borderRight', 'width', 'height', 'lineHeight', 'float', 'textAlign', 'fontSize', 'color', 'cursor', 'borderTopLeftRadius', 'borderBottomLeftRadius'],
                                cv: ['1px solid #c6c6c6', 'border-box', 'none', '68px', '30px', '28px', 'left', 'center', '13px', preTxtStatus, preStatus, '3px', '3px']
                            }, [
                                'click',
                                function (dom) {
                                    var curPage = self.pageData.page;
                                    if (Number(curPage) == 1) {
                                        return;
                                    } else {
                                        self.lg_pageRunFn(Number(curPage) - 1);
                                    }
                                }
                            ]);
                            //页数容器
                            var curUlpageDom = ss.crtDom('ul', 'ulPage', '', dom, {
                                cn: ['boxSizing', 'borderRight', 'float', 'margin', 'padding'],
                                cv: ['border-box', 'none', 'left', '0px', '0px']
                            });
                            self.domWrap['curUlpageDom'] = curUlpageDom;
                            //下一页
                            ss.crtDom('div', '', '下一页', dom, {
                                cn: ['border', 'boxSizing', 'width', 'height', 'lineHeight', 'float', 'textAlign', 'fontSize', 'color', 'cursor', 'borderTopRightRadius', 'borderBottomRightRadius'],
                                cv: ['1px solid #c6c6c6', 'border-box', '68px', '30px', '28px', 'left', 'center', '13px', nextTxtStatus, nextStatus, '3px', '3px']
                            }, [
                                'click',
                                function (dom) {
                                    var curPage = self.pageData.page;
                                    if (Number(curPage) == totalPage) {
                                        return;
                                    } else {
                                        self.lg_pageRunFn(Number(curPage) + 1);
                                    }
                                }
                            ]);
                            //跳转输入框
                            ss.crtDom('div', '', '', dom, {
                                cn: ['border', 'boxSizing', 'width', 'height', 'lineHeight', 'float', 'textAlign', 'fontSize', 'color', 'cursor', 'marginLeft'],
                                cv: ['1px solid #c6c6c6', 'border-box', '40px', '30px', '28px', 'left', 'center', '13px', '#333', 'pointer', '10px']
                            }).appendDom([
                                ss.crtDom('input', 'hrefDom', '', '', {
                                    cn: ['display', 'outline', 'border', 'width', 'height', 'boxSizing', 'textAlign'],
                                    cv: ['block', 'none', 'none', '100%', '100%', 'border-box', 'center']
                                })
                            ]);
                            //跳转
                            ss.crtDom('div', '', '跳转', dom, {
                                cn: ['border', 'boxSizing', 'width', 'height', 'lineHeight', 'float', 'textAlign', 'fontSize', 'color', 'cursor', 'borderRadius', 'marginLeft'],
                                cv: ['1px solid #c6c6c6', 'border-box', '50px', '30px', '28px', 'left', 'center', '13px', '#333', 'pointer', '3px', '3px']
                            }, [
                                'click',
                                function (dom) {
                                    var curPage = dom.parentNode.querySelector('input').value;
                                    if (Number(curPage) < 0 || Number(curPage) > Number(self.pageData.totalPage)) {
                                        ss.layer.alert("页码输入有误");
                                    } else {
                                        self.lg_pageRunFn(Number(curPage));
                                    }
                                }
                            ]);
                        }
                    )
                self.domWrap['productionPage'] = productionPageDom;
                //根据总页数进行
                var ulPageWrap = self.domWrap['curUlpageDom'];
                if (totalPage <= 6) {
                    //小页数
                    for (var i = 0; i < totalPage; i++) {
                        var curDom = ss.crtDom('li', '', i + 1, ulPageWrap, {
                            cn: ['boxSizing', 'float', 'border', 'width', 'height', 'lineHeight', 'listStyle', 'margin', 'padding', 'textAlign', 'borderRight', 'fontSize', 'color', 'cursor'],
                            cv: ['border-box', 'left', '1px solid #c6c6c6', '38px', '30px', '30px', 'none', '0px', '0px', 'center', 'none', '13px', '#666', 'pointer']
                        }, [
                            'mouseover',
                            function (dom) {
                                dom.innerHTML != '...' && (
                                    dom.style.backgroundColor = obj.lightingColor || '#3089dc',
                                    dom.style.color = '#fff'
                                );
                            },
                            'mouseout',
                            function (dom) {
                                dom.getAttribute('isClick') != 'true' && (
                                    dom.style.backgroundColor = '#fff',
                                    dom.style.color = '#666'
                                );
                            },
                            'click',
                            function (dom) {
                                self.lg_pageRunFn(Number(dom.innerHTML));
                            }
                        ]);
                        if (i + 1 == Number(curPage)) {
                            curDom.setAttribute('isClick', 'true');
                            curDom.style.backgroundColor = obj.lightingColor || '#3089dc';
                            curDom.style.color = '#fff';
                        }
                    } //for循环
                }
                //大页数
                else {
                    //大页数分两种情况:1.=7时 2.>7时
                    //当前页数1-4的情况
                    if (Number(curPage) >= 1 && Number(curPage) <= 3) {
                        for (var i = 0; i < 6; i++) {
                            var txt = i + 1; //标识
                            if (i == 4) {
                                txt = '...';
                            }
                            if (i == 5) {
                                txt = totalPage;
                            }
                            var curDom = ss.crtDom('li', '', txt, ulPageWrap, {
                                cn: ['boxSizing', 'float', 'border', 'width', 'height', 'lineHeight', 'listStyle', 'margin', 'padding', 'textAlign', 'borderRight', 'fontSize', 'color', 'cursor'],
                                cv: ['border-box', 'left', '1px solid #c6c6c6', String(txt).length > 3 ? (38 + 8 * (String(txt).length - 3) + 'px') : '38px', '30px', '30px', 'none', '0px', '0px', 'center', 'none', '13px', '#666', 'pointer']
                            }, [
                                'mouseover',
                                function (dom) {
                                    if (dom.innerHTML != '...') {
                                        dom.style.backgroundColor = obj.lightingColor || '#3089dc';
                                        dom.style.color = '#fff';
                                    }
                                },
                                'mouseout',
                                function (dom) {
                                    if (dom.getAttribute('isClick') != 'true') {
                                        dom.style.backgroundColor = '#fff';
                                        dom.style.color = '#666';
                                    }
                                },
                                'click',
                                function (dom) {
                                    if (dom.innerHTML != '...') {
                                        self.lg_pageRunFn(Number(dom.innerHTML));
                                    }
                                }
                            ]); //创建dom
                            //高亮当前页数
                            if ((curDom.innerHTML) == Number(curPage)) {
                                curDom.setAttribute('isClick', 'true');
                                curDom.style.backgroundColor = obj.lightingColor || '#3089dc';
                                curDom.style.color = '#fff';
                            }
                        } //for循环
                    }
                    //当前页数[最大页数-3 - 最大页数]
                    else if (Number(curPage) >= totalPage - 3 && Number(curPage) <= totalPage) {
                        for (var i = 5; i > -1; i--) {
                            var txt = totalPage - i; //标识
                            if (i == 4) {
                                txt = '...';
                            }
                            if (i == 5) {
                                txt = '1';
                            }
                            var curDom = ss.crtDom('li', '', txt, ulPageWrap, {
                                cn: ['boxSizing', 'float', 'border', 'width', 'height', 'lineHeight', 'listStyle', 'margin', 'padding', 'textAlign', 'borderRight', 'fontSize', 'color', 'cursor'],
                                cv: ['border-box', 'left', '1px solid #c6c6c6', String(txt).length > 3 ? (38 + 8 * (String(txt).length - 3) + 'px') : '38px', '30px', '30px', 'none', '0px', '0px', 'center', 'none', '13px', '#666', 'pointer']
                            }, [
                                'mouseover',
                                function (dom) {
                                    if (dom.innerHTML != '...') {
                                        dom.style.backgroundColor = obj.lightingColor || '#3089dc';
                                        dom.style.color = '#fff';
                                    }
                                },
                                'mouseout',
                                function (dom) {
                                    if (dom.getAttribute('isClick') != 'true') {
                                        dom.style.backgroundColor = '#fff';
                                        dom.style.color = '#666';
                                    }
                                },
                                'click',
                                function (dom) {
                                    if (dom.innerHTML != '...') {
                                        self.lg_pageRunFn(Number(dom.innerHTML));
                                    }
                                }
                            ]); //创建dom
                            //高亮当前页数
                            if ((curDom.innerHTML) == Number(curPage)) {
                                curDom.setAttribute('isClick', 'true');
                                curDom.style.backgroundColor = obj.lightingColor || '#3089dc';
                                curDom.style.color = '#fff';
                            }
                        } //for循环
                    }
                    //
                    else {
                        for (var i = 0; i < 6; i++) {
                            i == 0 && (txt = '1');
                            i == 1 && (txt = '...');
                            i == 2 && (txt = Number(curPage));
                            i == 3 && (txt = Number(curPage) + 1);
                            i == 4 && (txt = '...');
                            i == 5 && (txt = totalPage);
                            var curDom = ss.crtDom('li', '', txt, ulPageWrap, {
                                cn: ['boxSizing', 'float', 'border', 'width', 'height', 'lineHeight', 'listStyle', 'margin', 'padding', 'textAlign', 'borderRight', 'fontSize', 'color', 'cursor'],
                                cv: ['border-box', 'left', '1px solid #c6c6c6', String(txt).length > 3 ? (38 + 8 * (String(txt).length - 3) + 'px') : '38px', '30px', '30px', 'none', '0px', '0px', 'center', 'none', '13px', '#666', 'pointer']
                            }, [
                                'mouseover',
                                function (dom) {
                                    if (dom.innerHTML != '...') {
                                        dom.style.backgroundColor = obj.lightingColor || '#3089dc';
                                        dom.style.color = '#fff';
                                    }
                                },
                                'mouseout',
                                function (dom) {
                                    if (dom.getAttribute('isClick') != 'true') {
                                        dom.style.backgroundColor = '#fff';
                                        dom.style.color = '#666';
                                    }
                                },
                                'click',
                                function (dom) {
                                    if (dom.innerHTML != '...') {
                                        self.lg_pageRunFn(Number(dom.innerHTML));
                                    }
                                }
                            ]) //创建dom
                            //高亮当前页数
                            if ((curDom.innerHTML) == Number(curPage)) {
                                curDom.setAttribute('isClick', 'true');
                                curDom.style.backgroundColor = obj.lightingColor || '#3089dc';
                                curDom.style.color = '#fff';
                            }
                        } //for循环
                    }
                }
            }
        },
        //body取消事件
        lg_bodyCliFn: function (cliFn) {
            if (ss.bodyClickObj.listeners[location.hash.slice(1)]) {
                var tempArr = ss.bodyClickObj.listeners[location.hash.slice(1)];
                tempArr.push(function () {
                    cliFn();
                });
                ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
            } else {
                var tempArr = [];
                tempArr.push(function () {
                    cliFn();
                });
                ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
            };
        },
        //各工具类
        ajax: function (obj, success, complete, beforeSend) {
            var tempObj = obj;
            tempObj.success = function (data) {
                if (data.result == 'success') {
                    success(data);
                } else {
                    data['data'] && ss.layer.msg(data['data']);
                    data['errorMsg'] && ss.layer.msg(data['errorMsg']);
                    !data['data'] && !data['errorMsg'] && ss.layer.msg('接口有误！');
                }
            };
            tempObj.beforeSend = function (request) {
                ss.c3Loading.show();
                beforeSend && beforeSend(request);
            };
            tempObj.complete = function (xhr) {
                ss.c3Loading.hidden();
                complete && complete();
                xhr.responseText || ss.error('登陆失效，接口没返回登陆页面！');
                //登陆时效性，接口约定：重定向->index.html
                xhr.responseText.indexOf('lg_login_pw_label') != -1 &&
                    layer.confirm('登陆已失效，请重新登陆！', function (index) {
                        location.href = 'index.html';
                    });
            }
            $.ajax(tempObj);
        },
        eAjax: function (qObj, oObj) {
            var self = this,
                obj = self.sourceObj;
            oObj['isJson'] && (qObj['data'] = JSON.stringify(qObj['data'])); //json方式传输赋值
            oObj['isJson'] && (qObj['dataType'] = 'json'); //dataType值为json
            //获得数据
            self.ajax(
                qObj,
                //success
                function (data) {
                    oObj['success'] && oObj['success'](data);
                },
                //complete
                function () {
                    oObj['complete'] && oObj['complete']();
                },
                //beforeSend
                function (request) {
                    oObj['isJson'] &&
                        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

                    oObj['beforeSend'] && oObj['beforeSend'](request);
                }
            );
        }
    }
    exports('dataTable', function (obj) {
        return new ss_dataTable(obj);
    });
})