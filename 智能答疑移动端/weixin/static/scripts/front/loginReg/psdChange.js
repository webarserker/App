require.config({
	baseUrl:'../../../static/scripts/front/'
});
require(['../../../static/scripts/front/config.js'],function(){
	require(['jquery','util', 'validate'],function($, util){
		var psd = {
			/*页面绑定事件*/
			bindEvent: function() {

				var me = this;

				/*表单change事件*/
				$('input[name="email"],input[name="emailValicode"]').keydown(function() {
					var idstr = $(this).attr('id');
					hideErr(idstr);
				});
				//表单验证
				//第一部分表单验证
				var step1 = new Userform([new Field({
					fid: 'email',
					val: [new Required_val('邮箱不能为空'), new Exp_val(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,'请输入正确的邮箱账号')],
					suc: function() {
						hideErr('email');
					},
					err: function(text) {
						showErr('email', text);
					}
				})]);
				step1.set_submit('valiCodeBtn', function() {
					//发送验证码
					sendEmailValiCode();
					_paq.push(['trackEvent', $("#identify").val(),'send-email',$("#type").val()==1?'update-password':'reset-password']);
				});
				var step2 = new Userform([new Field({
							fid: 'email',
							val: [new Required_val('邮箱不能为空'), new Exp_val(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,'请输入正确的邮箱账号')],
							suc: function() {
								hideErr('email');
							},
							err: function(text) {
								showErr('email', text);
							}
						}),new Field({
							fid: 'emailValicode',
							val: [new Required_val('邮箱验证码不能为空')],
							suc: function() {
								hideErr('emailValicode');
							},
							err: function(text) {
								showErr('emailValicode', text);
							}
						})]);

				step2.set_submit('emailConfirm', function() {
					//下一步，进入修改密码
					checkValidateCode();

				});
				//第二部分表单验证
				var step3 = new Userform([new Field({
							fid: 'password',
							val: [new Required_val('密码不能为空'), new Exp_val(/^[0-9a-zA-Z]{6,12}$/,'密码必须是6-12位的字母或者数字')],
							suc: function() {
								hideErr('password');
							},
							err: function(text) {
								showErr('password', text);
							}
						}),new Field({
							fid: 'repassword',
							val: [new Required_val('确认密码不能为空'), new Equal_val('password', 'repassword', '重复密码必须与密码保持一致')],
							suc: function() {
								hideErr('repassword');
							},
							err: function(text) {
								showErr('repassword', text);
							}
						})]);

				step3.set_submit('psdConfirm', function() {
					//修改密码
					updatePsw();
					_paq.push(['trackEvent', $("#identify").val(),'update-password',$("#type").val()==1?'update-password':'reset-password']);
					//修改失败则展示失败界面
					//$('#step2').hide();
					//$('#fail').show();
				});

				function showErr(idstr, tip) {
					var tipWrap = $('#' + idstr + 'Wp').find('.valErrTip');

					tipWrap.html('<i class="errorSIcon g-mr-5"></i><span>'+ tip +'</span>').show();
				}
				function hideErr(idstr) {
					var tipWrap = $('#' + idstr + 'Wp').find('.valErrTip');

					tipWrap.html('').hide();
				}
			},
			/*页面初始化入口*/
			init: function() {
				var me = this;
				me.bindEvent();
			}
		}
		psd.init();	
	});
});
/**
 * 发送邮箱验证码
 */
function sendEmailValiCode(){
	var tipWrap = $('#emailWp').find('.valErrTip');
	var params = {};
	var email = $('#email').val();
	if(email != ''){
		params['toEmail'] = email;
	}else{
		tipWrap.html("邮箱不能为空").show();
		return;
	}
	params['codeType'] = $('#type').val();
	var btn = $('#valiCodeBtn');
	var count = 5;
	btn.css('opacity','0.3');
	btn.unbind("click");
	$.ajax({
		type:"POST",
		url: '/front/user/sendEmailValiCode',
		data: params,
		dataType: "json",
		success: function(data){
			if(data && data.retCode == '0'){
				var tipWrap = $('#emailValicodeWp').find('.valSucTip');
				tipWrap.html('').html('<i class="sucSIcon g-mr-5"></i><span>验证码已经以邮件形式发送到您的邮箱</span>').show();
				var resend = setInterval(function(){
					if (count <=0){
						clearInterval(resend);
						btn.css('opacity','1');
						btn.val("重新获取").bind('click',function(){
							sendEmailValiCode();
						});
					}else {
						count--;
						btn.val(count+" S");
					}
				}, 1000);
			}else if(data && data.retCode == '-1'){
				var tipWrap = $('#emailWp').find('.valErrTip');
				tipWrap.html('').html('<i class="errorSIcon g-mr-5"></i><span>'+ data.message +'</span>').show();
				btn.css('opacity','1');
				btn.val("重新获取").bind('click',function(){
					sendEmailValiCode();
				});
			}else{
				tipWrap.html('').html('<i class="errorSIcon g-mr-5"></i><span>系统繁忙，请稍后再试</span>').show();
				btn.css('opacity','1');
				btn.val("重新获取").bind('click',function(){
					sendEmailValiCode();
				});
			}

		},
		error: function(){
			//util.popTips({text:"系统繁忙，请稍后再试", state:"no"});
		}
	});
}
/**
 * 检验验证码的正确性
 */
function checkValidateCode(){
	var params = {};
	params['codeType'] = $('#type').val();
	params['account'] =$('#email').val();
	params['validateCode'] = $('#emailValicode').val();

	$.ajax({
		type:"POST",
		url: '/front/user/checkValidateCode',
		data: params,
		dataType: "json",
		success: function(data){
			if(data && data.retCode == '0'){
				$('#step1').hide();
				$('#step2').show();
			}else{
				var tipWrap = $('#emailValicodeWp').find('.valErrTip');
				tipWrap.html('').html('<i class="errorSIcon g-mr-5"></i><span>'+ data.message +'</span>').show();
			}
		}
	});
}
function updatePsw(){
	var params = {};
	params['password'] = $('#password').val();
	params['valiCode'] = $('#emailValicode').val();
	var url = '';
	var type = $('#type').val();
	if(type == '1'){
		params['oldPassword'] = $('#oldPassword').val();
		url = '/front/user/updatePassword';
	}else if(type == '2'){
		params['email'] = $('#email').val();
		url = '/front/user/forgetPassword';
	}
	$.ajax({
		type:"POST",
		url: url,
		data: params,
		dataType: "json",
		success: function(data){
			if(data && data.retCode == '0'){
				$('#step2').hide();
				$('#success').show();
			}else{
				$('#step2').hide();
				$('#fail').show();
			}
		}
	});
}