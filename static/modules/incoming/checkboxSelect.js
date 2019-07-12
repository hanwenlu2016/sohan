var checkboxSelect = {
	//取消下拉框
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
	//渲染函数
	renderFn: function (name, data, appendDom, txt, type, defaultCode, cbFn) {
		var commonThis = this;
		var leftW = 80;
		//选择评定标准
		var selItem = ss.crtDom('div', 'items', '', appendDom, {
				cn: ['width', 'height', 'padding-top', 'position', 'paddingLeft', 'lineHeight'],
				cv: ['100%', '50px', '0px', 'relative', leftW + 'px', '50px'],
			})
			.appendDom([
				//左---
				ss.crtDom('div', 'wrapLeft', name + '：', '', {
					cn: [
						'width', 'height', 'textAlign', 'fontSize', 'marginBottom', 'marginLeft',
						'position', 'top', 'left'
					],
					cv: [
						leftW + 'px', '100%', 'left', '14px', '10px', '5px',
						'absolute', '0px', '0px'
					]
				}),
				//右---
				ss.crtDom('div', 'wrapRight', '', '', {
					cn: ['width', 'height'],
					cv: ['100%', '100%'],
					an: ['name', 'code'],
					av: [txt, defaultCode ? defaultCode : '']
				})
				.appendDom(function (dom) {
					//下拉框类型
					if (type == 'select') {
						ss.crtDom('div', 'selDom', defaultCode ? commonThis.getCodeName(defaultCode, data) : '请选择', dom, {
								cn: [
									'width', 'height', 'lineHeight', 'padding', 'border', 'backgroundColor', 'color', 'fontSize',
									'borderRadius', 'userSelect', 'cursor', 'position', 'display'
								],
								cv: [
									'90%', '40px', '40px', '0px 10px', '1px solid #dee4f1', '#f4f8fa', defaultCode ? '#000' : '#757575', '13px',
									'3px', 'none', 'pointer', 'relative', 'inline-block'
								]
							}, [
								'click',
								function (dom, e) {
                  console.log(dom)
									//下拉框展开
									ss.getDom('.selectItems', dom).style.display = 'block';
									ss.getDom('.dateSvg', dom).style.transform = 'rotate(180deg)';
									ss.mdfCss(dom, ['boxShadow', '0px 0px .5px .3px #1890ff', 'border', '1px solid #f4f8fa']);
									e.stopPropagation();
									commonThis.lg_bodyCliFn(clearSW);
								}
							])
							.appendDom(function (dom) {
								var fDom = dom;
								//select->icon
								ss.crtDom('span', 'dateSvg', ss.svgRepository.sl_ad(14, '#555'), dom, {
									cn: ['display', 'top', 'right', 'width', 'height', 'position', 'lineHeight'],
									cv: ['block', '8px', '5px', '14px', '14px', 'absolute', '14px']
								});
								//select->con
								ss.crtDom('div', 'selectItems', '', dom, {
										cn: [
											'width', 'height',
											'border', 'position', 'top', 'left', 'backgroundColor', 'borderRadius', 'overflowX', 'overflowY', 'display', 'zIndex'
										],
										cv: [
											'100%', data.length < 5 ? 'auto' : 5 * 40 + 'px',
											'1px solid #ccc', 'absolute', '32px', '-1px', '#fff', '3px', 'hidden', 'auto', 'none', 13
										],
									})
									.appendDom(function (dom) {
										var crtDom = function (dataArr, type) {
											//遍历渲染fn
											dataArr.forEach(function (v, i) {
                        console.log(v.name)
												ss.crtDom('input', '', v.name, dom, {
													cn: ['padding', 'color', 'fontSize', 'overflow', 'textOverflow', 'whiteSpace'],
													cv: ['0px 10px', '#333', '13px', 'hidden', 'ellipsis', 'nowrap'],
													an: ['code', 'type'],
													av: [v.code, txt]
												}, [
													'mouseenter',
													function (dom) {
														ss.mdfCss(dom, ['backgroundColor', 'rgb(41, 103, 153)', 'color', '#fff'])
													},
													'mouseleave',
													function (dom) {
														ss.mdfCss(dom, ['backgroundColor', '#fff', 'color', '#333'])
													},
													'click',
													function (dom, e) {
														clearSW(); //清除状态
														var saveValDom = dom.parentNode.parentNode.parentNode;
														var txtDom = ss.getDom('.selDom', saveValDom);
														ss.mdfCss(txtDom, ['color', '#000']);
														ss.mdfAttr(saveValDom, ['code', dom.getAttribute('code')]);
														cbFn && cbFn(dom.getAttribute('code'), dom.innerHTML);
														ss.setDomTxt(txtDom, dom.innerHTML);
														e.stopPropagation();
													}
												])
											});
										};
										crtDom(data, 'fixed');
									})
							});
					};
				})
			]);
		//评定下拉框清除状态
		function clearSW() {
			ss.getDom('.selectItems', selItem).style.display = 'none';
			ss.getDom('.dateSvg', selItem).style.transform = 'rotate(0deg)';
			ss.mdfCss(ss.getDom('.selDom', selItem), ['boxShadow', 'none', 'border', '1px solid #dee4f1']);
		};
		return selItem;
	},
	//通过code找到对应的值
	getCodeName: function (defaultCode, data) {
		var defaulName
		for (var index = 0; index < data.length; index++) {
			 if(data[index].code == defaultCode){
				  defaulName = data[index].name
				  return defaulName
			 }
		}
	}
}; //commonTool