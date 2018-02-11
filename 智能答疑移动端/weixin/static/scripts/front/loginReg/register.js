require.config({
	baseUrl:'../../../static/scripts/front/'
});
require(['../../../static/scripts/front/config.js'],function(){
	require(["jquery","util","validate"],function($, util,validate){
		register = {

			bindEvent: function(){
				
				$('#valiCodeBtn').click(function(){
					sendEmailValiCode();
					_paq.push(['trackEvent', $("#identify").val(),'send-email','register']);
				});
				var me = this;
				/*生源地下拉框事件*/
				$('.g-select').click(function(e) {
					var self = $(this);
					var options = $(self.find('.options').get(0));

					if(options.is(':hidden')) {
						options.show();
					} else {
						options.hide();
					}
					$(document).one("click", function(){
						$(".g-select .options").hide();
					});
					e.stopPropagation();
					
				});
				/*下拉框option点击事件*/
				$('#locationSel li').click(function(e) {
					var self = $(this);
					var resultTxt = self.find('a').text();
					var resultVal = self.find('a').attr('value');
					var resultEle = $('#locationSel').find('.value');

					resultEle.text(resultTxt).attr('value',resultVal);
				});
				/*表单change事件*/
				$('input[name="nickName"],input[name="email"],input[name="emailValicode"],input[name="password"],input[name="repassword"]').keydown(function() {
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
						}),new Field({
							fid: 'emailValicode',
							val: [new Required_val('邮箱验证码不能为空')],
							suc: function() {
								hideErr('emailValicode');
							},
							err: function(text) {
								showErr('emailValicode', text);
							}
						}),new Field({
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
				
				uf.set_submit('formSubmit', function() {
					//提交表单
					userRegister();
					_paq.push(['trackEvent', $("#identify").val(),'register','register-user']);
				});
				function showErr(idstr, tip) {
					var tipWrap = $('#' + idstr + 'Wp').find('.valErrTip');

					tipWrap.html('<i class="errorSIcon g-mr-5"></i><span>'+ tip +'</span>').show();
				}
				function hideErr(idstr) {
					var tipWrap = $('#' + idstr + 'Wp').find('.valErrTip');

					tipWrap.html('').hide();
				}

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
					params['codeType'] = "0";
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
							var tipWrap = $('#emailValicodeWp').find('.valSucTip');
							if(data && data.retCode == '0'){
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
							}else{
								tipWrap.html('<i class="errorSIcon g-mr-5"></i><span>系统繁忙，请稍后再试</span>').show();
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
				 * 用户注册
				 * @returns
				 */
				function userRegister(){
					var params = {};
					var sCode = $('#sCode').val();
					var identify = $('#identify').val();
					params['redirectUrl'] = $('#redirectUrl').val();
					params['account'] = $('#email').val();
					params['email'] = $('#email').val();
					params['nickName'] = $('#nickName').val();
					params['password'] = $('#password').val();
					params['emailValicode'] = $('#emailValicode').val();
					params['provinceId'] = $('#location').attr("value");
					params['provinceName'] = $('#location').html();
					params['valiCode'] = $('#emailValicode').val();
					params['schoolCode'] = sCode;
					var tipWrap = null;

					$.ajax({
						type:"POST",
						url: '/front/user/register',
						data: params,
						dataType: "json",
						success: function(data){
							if(data && data.retCode == 0){
								util.popTips({text:"注册成功", state:"ok"});
								if(data.message.indexOf('/front/user/toRegister') != -1 || data.message.indexOf('/front/user/toLogin') != -1){
									window.location.href = "/front/index/"+identify;
								}else if(data.message == '' || data.message == 'null'){
									window.location.href = "/front/index/"+identify;
								}else{
									window.location.href = data.message;
								}
							}else{
								if(data.retCode == -1){
									tipWrap = $('#emailValicodeWp').find('.valErrTip');
								}else if(data.retCode == 1){
									tipWrap = $('#emailWp').find('.valErrTip');
								}
								tipWrap.html('<i class="errorSIcon g-mr-5"></i><span>'+ data.message +'</span>').show();
							}
						},
						error: function(){
							//alert("服务器发生错误");
							util.popTips({text:"系统繁忙，请稍后再试", state:"ok"});
						}
					});

				}
			},
			/*页面初始化入口*/
			init: function() {
				var me = this;
//				util.placeholder();
				me.bindEvent();
			}
		}
		register.init();
	});
});



