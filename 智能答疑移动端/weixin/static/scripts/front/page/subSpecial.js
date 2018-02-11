require.config({
	baseUrl:"../../../static/scripts/front/"
});
require(["../../../static/scripts/front/config.js"],function(){
	require(["jquery","util","common","subpage", "getNoticeNum"],function($, util, c, sub, notice){
		var subspecial = {
			/*定位菜单*/
			fixMenu: function() {
				var curIndex = $('#contentId').val();
				var parentId = $('#parentId').val();
				var curEle = null;
				if(parentId) {
					curEle = $('[data-id-cat="' + parentId + '_' + curIndex + '"]');
				}else {
					curEle = $("#" + curIndex);
				}
				curEle.parents('.m-level2').children('ul').show().end().
				children('p.txt').addClass('active').end().end().
				parents('.m-level1').children('ul').show().end().
				children('p.txt').addClass('active');
				//curEle.addClass('active');
				curEle.parents('.m-level3').addClass('active');

			},

			/*页面绑定事件*/
			bindEvent: function() {
				var me = this;
                var menu = $('.menu');
                var menuOffset = menu.offset();
                $(window).scroll(function(){
                    var menuOffsetNew = $('#subpageCon').offset();
                    if(window.scrollY >= menuOffset.top){
                        menu.addClass('sticky');
                        menu.css({
                            left: menuOffsetNew.left + 'px'
                        });
                    }else{
                        menu.removeClass('sticky');
                        menu.css({
                            left: 0,
                            top: '30px'
                        });
                    }
                });
                $(window).resize(function() {
                    var menuOffsetNew = $('#subpageCon').offset();
                    if($('.menu').hasClass('sticky')) {
                        menu.css({
                            left: menuOffsetNew.left + 'px'
                        });
                    }
                });
				/*头部个人信息下拉框*/
				$('#userPhoto').click(function(e){
					$('#dropDown').toggle();
					$(document).one("click", function(){
						$('#dropDown').hide();
					});
					e.stopPropagation();
				});

				$('.tab-tit li').click(function() {
					
					$(this).closest('.tab').find('.tab-tit li').attr('class','notactive g-dropDownList drop-dwon');
					$(this).attr('class', 'cur g-dropDownList drop-dwon');
					$(this).closest('.tab').find('.tab-con').hide();
					$($(this).closest('.tab').find('.tab-con')[$(this).index()]).show();
				});
				function openAnsDialog(){
					//不需要完善，直接进入对话框
					var host = utils.getHost();
					var url = host + ':3000/users?id=' + $("#userId").val() + '&sCode=' + $("#sCode").val() + '&name=' + $("#nickName").val() + '&professor=智能招办'+ "&school=" + $("#schoolName").val();
					_paq.push(['trackEvent', $("#identify").val(),'inteli-ans']);
					//判断是否打开
					if (me.objWin == null || me.objWin.closed) {
						me.objWin = window.open(url,
							'newwindow',
							'height=600, width=900, top=20, left=150, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
						if (me.objWin == null || typeof(me.objWin)=='undefined'){
							util.popTips({delay:5000, text:"窗口被浏览器阻止打开，请点击允许弹出窗口。", state:"alert"});
						}
					} else {
						me.objWin.focus();
					}
				};
				function getSelectedList(options) {
					var ipt = options.find('input[name="source"]:checked');
					var selectedTxt = [];
					var selectedVal = [];
					/*根据已选择的项返回相应的text和value*/
					ipt.each(function() {
						selectedTxt.push($(this).parent().text());
						selectedVal.push($(this).val());
					})

					return{
						selectedTxt: selectedTxt.join('，'),
						selectedVal: selectedVal.join(',')
					}
				};

				// 智能问答小机器人拖拉
				var ansEnter = $(".ans_entry");
				var draging, dragArea;

				var position = ansEnter.offset();
				var posX = position.left,
					posY = position.top,
					dragX, dragY, oriX, oriY;

				$(document).on('mousemove', function(e) {

					if(draging){
						posX = posX + (e.pageX - dragX);
						posY = posY + (e.pageY - dragY);

						ansEnter.css({
							left: posX + 'px',
							top: posY + 'px'
						});

						dragX = e.pageX;
						dragY = e.pageY;
					}
				}).on('mouseup', function(e) {

					dragArea = Math.abs( (e.pageX - oriX) * (e.pageY - oriY) );

					setTimeout(function (){
						draging = false;
					}, 50);

				});

				ansEnter.on('mousedown', function (e){
					dragArea = 0;
					draging = true;
					oriX = dragX = e.pageX;
					oriY = dragY = e.pageY;

				}).on('click', function() {
					if(draging && dragArea > 0) return;

					if($("#userId").val() != null && $("#userId").val() != '') {
						$.ajax({
							type:"POST",
							url: '/front/user/unionUserLogin',
							data: {"id":$("#userId").val(),"sCode":$("#sCode").val()},
							dataType: "json",
							success: function(data){
								if(data.alreadLogin){
									//被别人登录，需要重新登录
									util.popTips({delay:5000, text:"您账号已登录,请重新登录<a href='/front/user/toLogin?sCode="+$("#sCode").val()+"'>登录</a><br/>", state:"alert"});
								}else{
									if(data.needAddUserInfo){
										util.popup({
											id:'editUserInfo',
											width:'500px',
											height:'500px',
											til: '完善信息',
											beforeShow: function() {
												//将数据插入到对应的框中
												//用户生源地
												var province = data.province;
												var provinceId = data.provinceId;
												if(province != null && province != ''){
													$("#location").html(province)
													$("#location").attr('value',provinceId);
												}else{
													$("#location").html("不限")
												}
												$("#userId").val(data.id);
												$("#options").empty();
												$("#options").append("<li><a href='javascript:;' value=''>不限</a></li>")
												var provinces = data.provinces
												for(i=0;i<provinces.length;i++){
													$("#options").append("<li><a href='javascript:;' value='"+provinces[i].id+"'>"+provinces[i].name+"</a></li>")
												}
												var scienceClass = data.scienceClass;
												if(scienceClass != null && scienceClass != ''){
													$("#scienceClass").html(scienceClass);
													$("#scienceClass").attr('value',scienceClass);
												}else{
													$("#scienceClass").html("请选择")
												}
												var sourceTypeText = data.sourceTypeText;
												if(sourceTypeText != null && sourceTypeText != ''){
													$("#sourceType").html(sourceTypeText)
													$("#sourceType").attr('value',sourceTypeText);
												}else{
													$("#sourceType").html("请选择")
												}
												$("#sourceTypeUl").empty();
												$("#sourceTypeUl").append("<li><a href='javascript:;' value=''>请选择</a></li>")
												var sourceTypes = data.sourceTypes
												for(i=0;i<sourceTypes.length;i++){
													$("#sourceTypeUl").append("<li><a href='javascript:;' value=''><input type='checkbox' name='source' class='g-mr-5' value="+sourceTypes[i].name+" />"+sourceTypes[i].name+"</a></li>")
												}
												$("#score").val(data.score);
												/*下拉框事件*/
												$('.g-select').click(function(e) {
													var self = $(this);
													var options = $(self.find('.options').get(0));

													if(!self.attr('readonly')) {
														if(options.is(':hidden')) {
															options.show();
														} else {
															options.hide();
														}
													}
													$(document).one("click", function(){
														$(".g-select .options").hide();
													});

													e.stopPropagation();
												});

												/*下拉框option点击事件*/
												$('.g-select li').click(function(e) {
													var self = $(this);
													var multitype = self.parents('.g-select').attr('multiple');
													var resultTxt = self.find('a').text();
													var resultVal = self.find('a').attr('value');
													var resultEle = self.parents('.sleBd').find('.value');
													var src = e.target || e.srcElement;

													if(multitype == "multiple") {
														e.stopPropagation();
														if(src.tagName.toLowerCase() != 'input') {

															if(self.find('input').attr('checked') == 'checked') {
																self.find('input').removeAttr('checked');
															} else {
																self.find('input').click();
															}
														}
														resultTxt = getSelectedList(self.parents('.options')).selectedTxt;
														resultVal = getSelectedList(self.parents('.options')).selectedVal;
													}

													if(resultTxt == '') {
														resultTxt = '请选择';
														resultVal = '';
													}
													resultEle.text(resultTxt).attr('value',resultVal);
													if(multitype == 'multiple'){
														resultEle.attr("title", resultVal);
													}
												});

											},
											confirmCallback:function(){
												//取到参数值，保存，调整
												var params = {};
												params['id'] = $('#userId').val();
												params['provinceId'] = $('#location').attr("value");
												var provinceName = $('#location').html();
												if(provinceName == '不限'){
													provinceName = '';
												}
												params['provinceName'] = provinceName;
												params['scienceClass'] = $('#scienceClass').attr("value");
												params['sourceType'] = $('#sourceType').attr("value");
												params['score'] = $('#score').val();
												params['schoolCode'] = $('#sCode').val();
												$.ajax({
													type:"POST",
													url: '/front/user/updateUserInfo',
													data: params,
													dataType: "json",
													success: function(data){
														return;
														if(data && data.retCode == 0){
															util.popTips({text:"修改成功", state:"ok"});
														}else{
															util.popTips({text:data.message, state:"no"});
														}
														openAnsDialog();
													},
													error: function(){
														util.popTips({text:"用户信息修改失败", state:"no"});
														openAnsDialog();
													}
												});
											},
											cancleCallback:function(){
												openAnsDialog();
											},
											closeCallback: function(){
												openAnsDialog();
											}
										});
									}else{
										openAnsDialog();
									}
								}
							}
						});

					}else {
						//alert("您还未登录,请先登录");
						util.popTips({delay:5000, text:"您还未登录,请先<a href='/front/user/toLogin?sCode="+$("#sCode").val()+"'>登录</a><br/><br/>如果还没有账户需要先<a href='/front/user/toRegister?sCode="+$("#sCode").val()+"'>注册</a>哦 ！", state:"alert"});
					}
				});

			},
			initTree : function() {
				$.post('', {}, function(data) {

				}, 'json');
			},
			getNoticeNum : function(){
				if($("#userId").val() != null && $("#userId").val() != '') {
					notice.queryNum();
				}
			},
			searchAns :function() {
				var ques = $.trim($("#searchIpt").val());
				if(ques != null && ques != '') {
					window.location.href = $("#ctx").val() + '/front/info/search?question=' + ques;
				}
			},
			/*页面初始化入口*/
			init: function() {
				var me = this;
				me.bindEvent();
				me.initTree();
				me.fixMenu();
				me.getNoticeNum();
				$("#searchBtn").click(me.searchAns);
			}
		}
		subspecial.init();
	});
});