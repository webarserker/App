define(['schoolScenery'], function() {
	return {
		getSchoolSceneryList : function(){
			var params = {};
			params['sCode'] = $('#sCode').val();
			params['pageSize'] = 4;
			$.ajax({
				type:"POST",
                url: '/front/getSchoolSceneryList',
                data: params,
                dataType: "json",
                success: function(data){
                	var _html = '';
                	if(data && data.success){
                		if(data.data && data.data.length > 0){
                			var schoolScenerys = data.data;
                			for(var key in schoolScenerys){
//                				_html += '<li class="g-box-shadow g-mr-15"><a href="'+contextPath + '/front/info/scenery"><img src="'+ schoolScenerys[key].imgUrl +'" /><br/><br/><span title="'+ schoolScenerys[key].title +'">'+ utils.interceptString(schoolScenerys[key].title, 15) +'</span><br/><br/></a></li>';
                				_html += '<li class="g-box-shadow"><a href="/front/info/scenery/'+$("#sCode").val()+'"><img src="'+ schoolScenerys[key].imgUrl +'" /></a><p class="g-mtb-15">'+ utils.interceptString(schoolScenerys[key].title, 15) +'</p></li>';
                			}
                		}
                	}
                	
                    $('#sch-info-list').html(_html);
                },
                error: function(){
                    //alert("服务器发生错误");
                }
            });
		}
	}
	
});
