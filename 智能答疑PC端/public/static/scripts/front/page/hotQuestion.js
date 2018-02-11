define(['hotQuestion'], function() {
	return {
		/**
		 * 获取热点问题下的类型
		 */
		getHotQuesTypes : function(){
			var params = {};
			params['sCode'] = $('#sCode').val();
			params['contentType'] = 2;
			params['pageSize'] = 5;
			$.ajax({
				type:"POST",
                url: '/front/getHotQuesTypes',
                data: params,
                dataType: "json",
                success: function(data){
                	var _html = '';
                	if(data && data.success){
                		if(data.data && data.data.length > 0){
                			var hotQuesTypes = data.data;
                			for(var key in hotQuesTypes){
                				if(key == 0){
                					_html += '<li class="cur" attr-tag="tab" attr-value="'+ hotQuesTypes[key].id +'">'+ hotQuesTypes[key].name +'</li>';
                				}else{
                					_html += '<li attr-tag="tab" attr-value="'+ hotQuesTypes[key].id +'">'+ hotQuesTypes[key].name +'</li>';
                				}
                			}
                		}
                	}
                	
                    $('.hot-qus-class').html(_html);
                    $('.hot-qus-class').find('li').eq(0).click();
                },
                error: function(){
                    //alert("服务器发生错误");
                }
            });
		},
		/**
		 * 根据热点问题类型ID获取到该类型下的内容
		 */
		getHotQuesList : function(hotQuesTypeId){
			var params = {};
			params['catId'] = hotQuesTypeId;
			params['sCode'] = $('#sCode').val();
			params['pageSize'] = 12;
			$.ajax({
				type:"POST",
                url: '/front/getHotQuesList',
                data: params,
                dataType: "json",
                success: function(data){
                	var _html = '';
                	if(data && data.success){
                		if(data.data && data.data.length > 0){
                			var hotQuestions = data.data;
                			for(var key in hotQuestions){
                				_html += '<li><i class="dot-list-blue"></i><a href="'+contextPath + '/front/info/route/3/' + hotQuestions[key].id +'?parentId='+hotQuesTypeId+'" title="'+ hotQuestions[key].title +'">'+ utils.interceptString(hotQuestions[key].title) +'</a></li>';
                			}
                		}
                	}
                	
                    $('.hot-qus-list').html(_html);
                },
                error: function(e){
                    debugger;
                    alert("服务器发生错误");
                }
            });
		}
	}
})
