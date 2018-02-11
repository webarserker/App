require.config({
	baseUrl:'../../../static/scripts/front/'
});
require(['../../../static/scripts/front/config.js'],function(){
	require(['jquery', 'util', 'validate', 'getNoticeNum', 'common'],function($, util, validate, getNoticeNum){
		var userInfo = {

			getNoticeNum : function(){
				if($("#id").val() != null && $("#id").val() != '') {
					getNoticeNum.queryNum();
				}
			},
			initSourceType : function(){
				var sourceTypes = $('#sourceType').attr("value");
				var sourceTypeArray = sourceTypes.split(",");
				for(var sKey in sourceTypeArray){
					$('.options').find("input").each(function(){
						if($(this).val() == sourceTypeArray[sKey]){
							$(this).attr("checked", "checked");
						}
					});
				}

			},
			/*页面绑定事件*/
			bindEvent: function() {
				var me = this;
				/*头部个人信息下拉框*/
				$('#userPhoto').click(function(e){
					$('#dropDown').toggle();
					$(document).one("click", function(){
				        $('#dropDown').hide();
				    });
				    e.stopPropagation();
				});
				/*修改个人信息*/
				$('#editUserInfo').click(function(e) {
					//去掉可编辑元素上的readonly属性
					$('*[readonly="readonly"]').removeAttr('readonly');
					//判断email是否为空
					if($("#email").val() == ''){
						$("#email").prop('disabled', false);
					}
					//显示取消保存按钮
					$('#btnSet').show();
				});

				/*取消按钮*/
				$('#cancle').click(function(e) {
					//直接刷新当前页面
					window.location.reload();

				});

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
				/*根据已选择的项返回相应的text和value*/
				function getSelectedList(options) {
					var ipt = options.find('input[name="source"]:checked');
					var selectedTxt = [];
					var selectedVal = [];

					ipt.each(function() {
						 selectedTxt.push($(this).parent().text());
						 selectedVal.push($(this).val());
					})

					return{
						selectedTxt: selectedTxt.join('，'),
						selectedVal: selectedVal.join(',')
					}
				}
				
				/*表单change事件*/
				$('input[name="nickName"],input[name="email"],input[name="password"]').keydown(function() {
					var idstr = $(this).attr('id');
					hideErr(idstr);
				});
				//表单验证
				var uf = new Userform([new Field({
							fid: 'nickName',
							val: [new Required_val('昵称不能为空'), new Len_val(0, 20, '昵称长度不能超过20个字符')],
							suc: function() {
								hideErr('nickName');
							},
							err: function(text) {
								showErr('nickName', text);
							}
						}),new Field({
							fid: 'email',
							val: [new Required_val('邮箱不能为空'), new Exp_val(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,'请输入正确的邮箱账号')],
							suc: function() {
								hideErr('email');
							},
							err: function(text) {
								showErr('email', text);
							}
						})]);
				var ufpw = new Userform([new Field({
					fid: 'password',
					val: [new Required_val('密码不能为空'), new Exp_val(/^[0-9a-zA-Z]{6,12}$/,'密码必须是6-12位的字母或者数字')],
					suc: function() {
						hideErr('password');
					},
					err: function(text) {
						showErr('password', text);
					}
				})]);

				uf.set_submit('save', function() {
					updateUserInfo();
				});
				ufpw.set_submit('pwdSubmit', function() {
					updatePassword();

				});
				function showErr(idstr, tip) {
					var tipWrap = $('#' + idstr + 'Wp').find('.valErrTip');

					tipWrap.html('<i class="errorSIcon g-mr-5"></i><span>'+ tip +'</span>').show();
				}
				function hideErr(idstr) {
					var tipWrap = $('#' + idstr + 'Wp').find('.valErrTip');

					tipWrap.html('').hide();
				}
				//修改用户信息
				function updateUserInfo(){
					var params = {};
					var sCode = $('#sCode').val();
					params['email'] = $('#email').val();
					params['nickName'] = $('#nickName').val();
					params['provinceId'] = $('#location').attr("value");
					var provinceName = $('#location').html();
					if(provinceName == '不限'){
						provinceName = '';
					}
					params['provinceName'] = provinceName;
					params['scienceClass'] = $('#scienceClass').attr("value");
					params['sourceType'] = $('#sourceType').attr("value");
					params['score'] = $('#score').val();
					var tipWrap = $('#password').find('.valErrTip');
					params['schoolCode'] = sCode;
					$.ajax({
						type:"POST",
						url: '/front/user/updateUserInfo',
						data: params,
						dataType: "json",
						success: function(data){
							if(data && data.retCode == 0){
								tipWrap.html('').hide();
								util.popTips({text:"修改成功", state:"ok"});
								//window.location.href = "/front/index/"+sCode;
								window.location.reload();
							}else{
								util.popTips({text:data.message, state:"no"});
							}
						},
						error: function(){
							util.popTips({text:"用户信息修改失败", state:"no"});
						}
					});
				}

				function updatePassword(){
					var params = {};
					params['password'] = $('#password').val();
					var tipWrap = $('#password').find('.valErrTip');

					$.ajax({
						type:"POST",
						url: '/front/user/updatePassword',
						data: params,
						dataType: "json",
						success: function(data){
							if(data && data.retCode == 0){
								util.popTips({text:"密码修改成功", state:"ok"});
							}else{
								util.popTips({text:"密码修改失败", state:"no"});
							}
						},
						error: function(){
							util.popTips({text:"密码修改失败", state:"no"});
						}
					});
				}
			},
			/*页面初始化入口*/
			init: function() {
				var me = this;
				me.getNoticeNum();
				me.initSourceType();
				me.bindEvent();
			}
		}
		userInfo.init();
	});
});

/**
 * 修改用户信息
 * @returns
 */
/*function updateUserInfo(){
	var params = {};
	var sCode = $('#sCode').val();
	params['id'] = $('#id').val();
	/!*params['account'] = $('#email').val();
	params['email'] = $('#email').val();*!/
	params['nickName'] = $('#nickName').val();
	params['provinceId'] = $('#location').attr("value");
	var provinceName = $('#location').html();
	if(provinceName == '不限'){
		provinceName = '';
	}
	params['provinceName'] = provinceName;
	/!*params['scienceClass'] = $('#scienceClass').attr("value");
	params['sourceType'] = $('#sourceType').attr("value");
	params['score'] = $('#score').val();*!/
	var tipWrap = $('#password').find('.valErrTip');

	$.ajax({
		type:"POST",
		url: '/front/user/updateUserInfo',
		data: params,
		dataType: "json",
		success: function(data){
			if(data && data.retCode == 0){
				tipWrap.html('').hide();
				util.popTips({text:"修改成功", state:"ok"});
				window.location.href = "/front/index/"+sCode;
			}else{
				util.popTips({text:data.message, state:"no"});
			}
		},
		error: function(){
			util.popTips({text:"用户信息修改失败", state:"no"});
		}
	});
}*/

/**
 * 用户修改密码
 * @returns
 */
/*
function updatePassword(){
	var params = {};
	params['password'] = $('#password').val();
	var tipWrap = $('#password').find('.valErrTip');

	$.ajax({
		type:"POST",
		url: '/front/user/updatePassword',
		data: params,
		dataType: "json",
		success: function(data){
			if(data && data.retCode == 0){
				alert('密码修改成功');
			}else{
				alert(data.message);
			}
		},
		error: function(){
			alert("服务器发生错误");
		}
	});

}*/
