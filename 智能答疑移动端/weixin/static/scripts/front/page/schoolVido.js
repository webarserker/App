define(['schoolVido'], function() {
	return {
		getSchoolVidoList : function(){
			var params = {};
			params['sCode'] = $('#sCode').val();
			params['pageSize'] = 3;
			$.ajax({
				type:"POST",
                url: '/front/getSchoolVidoList',
                data: params,
                dataType: "json",
                success: function(data){
                	var _html = '';
                	if(data && data.success){
                		if(data.data && data.data.length > 0){
                			_html += '<div class="g-mtb-20 section bgGray">'
                			_html += '<div class="content">'
                			_html += '<div class="g-cf tit">'
                			_html += '<span class="iconTit iconfont iconSize icon-video g-f-l g-mr-10 mt-2"></span> <span '
                			_html += 'class="g-f-l titTxt">视频在线</span>'
                			_html += '</div>'
                			_html += '<div class="g-ml-10 con" style="margin-top: 0;">'
                			_html += '<ul class="g-cf sch-info-list">'
                			var schoolScenerys = data.data;
                			for(var key in schoolScenerys){
                				_html += [
													'<li class="g-box-shadow">',
													'<a href="/front/info/vido/'+ $("#sCode").val() + '">',
													'<img src="'+ schoolScenerys[key].imgUrl +'" />',
													'<div class="desc"><p class="title">',
													utils.interceptString(schoolScenerys[key].title, 15),
													'</p>',
													'<p>'+ utils.interceptString(schoolScenerys[key].desc, 15) +'</p>',
													'</div></a></li>'
												].join('');
                			}
                			_html +='</ul>'
                			_html +='</div>'
                			_html +='</div>'
                			_html +='</div>'
                		}
                	}
                	
                    $('#vido').html(_html);
                },
                error: function(){
                    //alert("服务器发生错误");
                }
            });
		}
	}
	
});
