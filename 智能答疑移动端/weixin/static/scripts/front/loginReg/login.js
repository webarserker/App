require.config({
	baseUrl:'../../../static/scripts/front/'
});
require(['../../../static/scripts/front/config.js'],function(){
	require(["jquery","util","validate"],function($, util){
		login = {
			/*用户登录*/
			userLogin: function() {
				var params = {};
				var sCode = $('#sCode').val();
				var identify = $('#identify').val();
				var originalUrl = $('#originalUrl').val();
				var loginLoading = util.loadObj($('#loading'));
				params['sCode'] = sCode;
				params['originalUrl'] = originalUrl;
				params['account'] = $('#account').val();
				params['password'] = $('#password').val();
				params['redirectUrl'] = $("#redirectUrl").val();
				if($('#autoLogin').is(":checked")){
					params['autoLogin'] = 1;
				}else{
					params['autoLogin'] = 0;
				}

				loginLoading.loading();
				$.ajax({
					type:"POST",
			        url: '/front/user/login',
			        data: params,
			        dataType: "json",
			        success: function(data){
			        	loginLoading.loaded();
			        	if(data && data.retCode == 0){
			        		//window.location.href = "/front/index/"+sCode;
							if(data.message.indexOf('/front/user/toRegister') != -1 || data.message.indexOf('/front/user/toLogin') != -1){
								window.location.href = "/front/index/"+identify;
							}else if(data.message == '' || data.message == 'null'){
								window.location.href = "/front/index/"+identify;
							}else{
								window.location.href = data.message;
							}
			        	}else{
			        		loginLoading.error(data.message);
			        	}
			        	
			        },
			        error: function(data){
			            util.popTips({text:"服务器发生错误",state:"no"});
			        }
			    });
			},
			bindEvent: function(){
				var me = this;
				//表单验证
				var uf = new Userform([new Field({
							fid: 'account',
							val: [new Required_val('用户名不能为空')],
							suc: function() {
								hideErr('account');
							},
							err: function(text) {
								showErr('account', text);
							}
						}),new Field({
							fid: 'password',
							val: [new Required_val('密码不能为空')],
							suc: function() {
								hideErr('password');
							},
							err: function(text) {
								showErr('password', text);
							}
						})]);

				uf.set_submit('loginBtn', function() {
					me.userLogin();
					_paq.push(['trackEvent', $("#identify").val(),'login','normal']);
				});
				function showErr(idstr, tip) {
					var tipWrap = $('#' + idstr + 'Wp').find('.valErrTip');

					tipWrap.html('<i class="errorSIcon g-mr-5"></i><span>'+ tip +'</span>').show();
				}
				function hideErr(idstr) {
					var tipWrap = $('#' + idstr + 'Wp').find('.valErrTip');

					tipWrap.html('').hide();
				}
				// $('#loginBtn').click(function(){
				// 	userLogin();
				// });
				$('#registerBtn').click(function(){
					_paq.push(['trackEvent', $("#identify").val(),'register','to-register-page']);
					toRegister();
				});
				 //回车提交事件
				$('body').keydown(function(e) {
				    if (e.keyCode == "13") {//keyCode=13是回车键
				        $('#loginBtn').click();
				    }
				});
			},
			initPlaceHolder: function() {
				$(":input[placeholder]").placeholder();
			},
			/*页面初始化入口*/
			init: function() {
				var me = this;
				me.initPlaceHolder();
				me.bindEvent();
			}
		}
		login.init();
	});
});

/**
 * 跳转到用户注册页面
 * @returns
 */
function toRegister(){
	var sCode = $('#sCode').val();
	window.location.href = "/front/user/toRegister?sCode="+sCode;
}

/*页面初始化入口*/
function forgetPsw(){
	var params = {};
	$.ajax({
		type:"POST",
		url: '/front/user/login',
		data: params,
		dataType: "json",
		success: function(data){
			if(data && data.retCode == 0){
				util.popTips({text:"新密码已经发送到您的注册邮箱中，请查看。",state:"ok"});
			}else{
				util.popTips({text:data.message,state:"no"});
			}

		},
		error: function(data){
			util.popTips({text:"服务器发生错误",state:"no"});
		}
	});
}