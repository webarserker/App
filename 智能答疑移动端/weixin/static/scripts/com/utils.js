var utils = {
		getHost : function() {
			var host = window.location + "";
			//截取host
			if(host.indexOf('http://') > -1) {
				host = host.substr(7, host.length-1);
			}
			
			if(host.indexOf(':') > 0) {
				host = host.substr(0, host.indexOf(':'));
			}
			if(host.indexOf('/') > 0) {
				host = host.substr(0, host.indexOf('/'));
			}
			return 'http://'+host;
		},
		/**
		 * 截取字符串
		 */
		interceptString : function(str, length) {
			if(!length)
				length = 15;
			if (str) {
				if (str.length > length) {
					str = str.substr(0, length) + "...";
				}
				return str;
			}
			return "";
		},
		
		/**
		 * 文件上传formId：form表单的ID
		 * fid ：fid文件ID	
		 * cb回调函数
		 */
	    uploadFile : function(fromId,cb,errorCB){
		        var options = {
		            url : "/file/upload",
		            type : 'POST',
		            cache:true,
		            contentType : "application/x-www-form-urlencoded; charset=utf-8", 
		            mitType : "uplaodFile",
		            dataType : "json",
		            success : function(data) {
		            	if(!data){
		            		utils.warningTip("文件上传失败，请重新上传！");
	                    	if(errorCB)
	                    		errorCB();
		            	}else{
		            		if(data.retCode == 0){
		                        if(cb)
		                        	cb(data);
		                    }else if(data.retCode==2){
		                    	utils.warningTip("文件大小超过了指定大小");
		                    	if(errorCB)
		                    		errorCB();
		                    }else {
		                    	utils.warningTip("文件服务器错误，请重新上传");
		                    	if(errorCB)
		                    		errorCB();
		                    }
		            	}
		            },
		            error : function(data){
		            	utils.warningTip("上传文件错误！");
                    	if(errorCB)
                    		errorCB();
		            }
		        };
		      $('#'+fromId).ajaxSubmit(options);
	    },

		/**
		 * dest : 装载分页容器 $对象
		 * pageCount : 页总记录数
		 * pageNo : 当前页数  第一页下标为 0 , 以此类推
		 * cb : 分页完成后回调函数
		 * pageBar : TRUE OR FLASE 是否需要指定跳转功能
		 * preNum : 中心页前显示页数
		 * allNum ：总显示页数
		 */
		paginationPage : function(dest , pageCount , pageNo , cb ,pageBar, preNum , allNum){
			if(paginationSys){
				if(!dest){
					utils.errorTip('请设置分页装载容器！');
					return false;
				}

				if(isNaN(pageCount)){
					utils.errorTip('请设置分页总数！');
					return false;
				}

				if(isNaN(pageNo)){
					utils.errorTip('请设置当前页数！');
					return false;
				}

				if(!cb){
					utils.errorTip('请设置翻页回调函数！');
					return false;
				}
				if(!pageBar){
					pageBar = false;
				}
				if(pageCount==0){
					dest.html('暂无数据');
					return;
				}
				paginationSys.turnPage(dest , pageCount , pageNo , cb , pageBar, preNum , allNum);
			}
		},

		addUserViewLog : function(remoteIpInfo){
			var params = {};
			params['userProvince'] = remoteIpInfo["province"];
			params['userCity'] = remoteIpInfo["city"];
			params['sCode'] = $('#sCode').val();
			params['pageUrl'] = $('#pageUrl').val();
			params['infoId'] = $('#contentId').val();
			params['majorId'] = $('#majorId').val();
			params['viewSourceUrl'] = document.referrer;
			$.ajax({
				type:"POST",
				url: '/front/addUserViewLog',
				data: params,
				dataType: "json",
				success: function(data){
					if(data && data.code == '000000'){
						// console.log('添加用户访问记录成功！');
					}else{
						// console.log('添加用户访问记录失败！');
					}

				},
				error: function(data){
					// console.log('添加用户访问记录失败！');
				}
			});

		}
}