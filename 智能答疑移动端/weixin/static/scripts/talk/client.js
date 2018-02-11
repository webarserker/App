var sCode;
var id;
var socket;
var name;
//var serverHost = 'http://localhost:3000';
var serverHost = 'http://101.201.43.54:3000';
$(function() {
	id = $("#id").val();
	name = $("#name").val();
	sCode = $("#sCode").val();
	clientApp.checkStatus();
});

var clientApp = {
	//检查聊天状态
	checkStatus : function() {
		if($("#isCs").val() == 'true') {//是在线客服就连接服务器
			if(!id) {
				alert("连接在线对话服务器失败，请刷新或重新登录");
			} else {
				clientApp.connect();
			}
		}
	},
	//连接服务器
	connect : function() {
		socket = io.connect(serverHost, {
			'userId' : id,
			'sCode' : $("#sCode").val(),
			'type' : 'kefu'
		});
		clientApp.addKefu();
		//监听服务器返回的消息
		clientApp.listen();
	},
	addKefu : function() {
		socket.emit("addKefu", {'kefu': id, 'sCode' : sCode ,'handNum' : $("#handNum").val(), 'level' : $("#cusLevel").val()});
	},
	//获取答案
	ans : function() {
		var ans = $.trim($("#message").val());
		if(!ans) {
			
		}else {
			lastMsgTimeStamp = Date.parse(new Date());
			socket.emit("ansFromKefu", {'sCode': sCode, 'from' : id, 'mode' : mode, 'ans' : ans});
		}
	},
	sendMsg : function() {
		var msg = $.trim($("#msg").val());
		if(msg && msg.length > 0) {
			var userId = $("#talkContent").find('div .active').attr("userId");
			var isOver = $("#talk_title_" + userId).attr("isOver");
			if(userId && !isOver) {
				$("#msg").val('');
				$("#talk_user_"+userId).append('<p class="msg text-right alert alert-warning">'+msg+'</p>');
				clientApp.scrollBottom("#talk_user_"+userId);
				socket.emit("ansFromKefu", id, userId, {'sCode': sCode, 'name' : encodeURIComponent(name), 'mode' : 'kefu', 'from' : id, 'to' : userId, 'ans' : encodeURIComponent(msg)});
			}
		}
	},
	listen : function() {
		//监听连接服务器结果
//		socket.on('connected', function(data) {
//			if(data) {
//				mode = 'auto';
//			}else {
//				//TODO 处理连接失败的情况
//			}
//		});

		$("#sendMsg").click(function() {
				clientApp.sendMsg();
			}
		);
		//监听提问
		socket.on('getAns', function(from, data) {
			//判断用户是否已连接
			var user = $("#talk_user_"+from);
			var ques;
			if(user.length == 0) {
				var userNum = $("#talkTab").find('li').length;
				user = '<li id="talk_title_'+from+'" class="not_read_title';
				if(userNum == 0) {
					user += ' active ';
				}
				user += '"><a href="#talk_user_'+from+'" style="color:red;" data-toggle="tab" aria-expanded="true"> <i class="pink glyphicon glyphicon-user bigger-110"></i>'+decodeURIComponent(data.name)+'</a></li>';
				$("#talkTab").prepend(user);//新的对话放在上面
				ques = '<div class="tab-pane ';
				if(userNum == 0) {
					ques += ' active ';
				}
				
				ques += '" userId="'+from+'"  username="'+data.name+'" id="talk_user_'+from+'"><p class="msg text-left alert alert-success">'+decodeURIComponent(data.question)
				if($("#cusLevel").val() == 1) {//非专家客服才显示转发按钮 
					ques += '<a class="trans_to_pro" href="javascript:void(0);" onclick="clientApp.transToPro(this,\''+(data.question)+'\', '+ from +', \''+ data.name +'\');">转交招办专家</a>';
				}
				ques += '</p></div>';
				$("#talkContent").append(ques);
			} else {
				var str = '<p class="msg text-left alert alert-success">'+decodeURIComponent(data.question);
				if($("#cusLevel").val() == 1) {//非专家客服才显示转发按钮 
					str += '<a class="trans_to_pro" href="javascript:void(0);" onclick="clientApp.transToPro(this,\''+(data.question)+'\', '+ from +', \''+ data.name +'\');">转交招办专家</a>';
				}
				str += '</p>';
				$("#talk_user_"+from).append(str);
			}
			$(".not_read_title").click(function() {
				$(this).find("a").css('color','');
				$(this).removeClass('not_read_title');
			});
			clientApp.scrollBottom("#talk_user_"+from);
		});
		
		document.onkeydown=function(event){
			var e = event || window.event || arguments.callee.caller.arguments[0];
			if(e && e.keyCode == 13) {
				clientApp.sendMsg();
			}
		}
	},
	transToPro : function(node, ques, userId, userName) {
		//判断专家客服是否在线
		socket.emit("getOnlinePro", sCode, function(kefuId) {
			var onlineTrans = false;
			if(kefuId != null) {//在线转交
				onlineTrans = true;
			}
			if(onlineTrans) {
				socket.emit("transToPro", {'kefuId' : kefuId,'userId' : userId ,'name': encodeURIComponent($("#talk_user_"+userId).attr('username')), 'ques' : ques, 'sCode' : sCode}, function(success) {
					if(success) {
						$("#talk_user_"+userId).attr('isOver', true);
						$("#talk_user_"+userId).append('<p class="msg text-right alert alert-warning">转接成功，点击<a href="clientApp.closeTalk('+userId+')">结束</a>关闭此对话</p>');
					}else {//在线转发失败，发送离线消息
						clientApp.toOfflinePro(ques, userId, userName);
					}
				});
			}else {//转交离线消息
				clientApp.toOfflinePro(ques, userId, userName);
			}
		});
	},
	closeTalk : function(userId) {
		$("#talk_user_"+userId).remove();
		$("#talk_title_" + userId).remove();
	},
	scrollBottom : function(scrollTarget) {
		$("#talkContent").scrollTop($("#talkContent")[0].scrollHeight);
	},
	toOfflinePro : function(ques, userId, userName) {
		ques = decodeURIComponent(ques);
		$.post('/backend/index/transToPro', {'ques' : decodeURIComponent(ques), 'userId' : userId, 'uesrName' : userName}, function(result){
			if(result) {
				if(ques.length > 10) {
					ques = ques.substr(0,9) + '...';
				}
				ques = '问题“'+ques+'”已经转交给招办专家，稍后请在“<a href="http://'+$.getHost()+'/index/noticePage?sCode="'+sCode+'>消息通知</a>”中查看。';
				$("#talk_user_"+userId).append('<p class="msg text-right alert alert-warning">'+ques+'</p>');
				socket.emit("ansFromKefu", id, userId, {'sCode': sCode, 'name' : encodeURIComponent(name), 'mode' : 'kefu', 'from' : id, 'to' : userId, 'ans' : encodeURIComponent(ques)});
				$(node).remove();
				clientApp.scrollBottom("#talk_user_"+userId);
			}else {
				$("#talk_user_"+userId).append('<p class="msg text-right alert alert-warning">转接失败</p>');
			}
		}, 'json');
	}
}