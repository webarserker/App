define(['customerContent'], function() {
    /**
     * 获取热点问题和自定义一级分类下的类型
     */
    function getCustomerContents() {
        /*热点问题tab切换*/
        $('#customerContent').click(function(e) {
            var e = e || window.event;
            var src = e.target || e.srcElement;
            var tag = $(src).attr('attr-tag');

            switch(tag) {
                case 'tab':
                    var lis = $(src).siblings('li');
                    var value = $(src).attr('attr-value');
                    var parentCatId = $(src).attr('attr-cat');
                    var isCol2 = $(src).parents('.leftColumn').length > 0 ? 'l' : $(src).parents('.rightColumn').length > 0 ? 'r' : '';

                    lis.removeClass('cur');
                    $(src).addClass('cur');
                    getCustomerContentList(value, parentCatId, isCol2);
            }
        });
        //获取内容
        getContents();
    }
    //获取内容
    function getContents() {
        var params = {
            sCode: $('#sCode').val()
        };
        $.ajax({
            type:"POST",
            url: '/front/getCustomerContents',
            data: params,
            dataType: "json",
            success: function(data){
                var customer = $("#customerContent");
                var htmlArr = [];
                var _html = '';
                var _leftColumnHtml = '';
                var _rightColumnHtml = '';

                if(data && data.length > 0){
                    $.each(data, function(i, v){

                        //排除掉不显示的内容，开始显示的内容
                        if(v.contentType != 1 && v.contentType != 3 && v.contentType != 4 && v.contentType != 5){
                            //拼接两栏左栏模块代码
                            if(v.sortNum == $('#leftContentType').val()) {
                                _leftColumnHtml = getContentStr(v, 'l');
                                return true;
                            }
                            //拼接两栏右栏模块代码
                            if(v.sortNum == $('#rightContentType').val()) {
                                _rightColumnHtml = getContentStr(v, 'r');
                                return true;
                            }
                            //拼接一栏模块代码
                            _html += getContentStr(v);
                        }
                    });
                }
                if(_leftColumnHtml != '' || _rightColumnHtml != '') {
                    customer.html('<div class="section bgGray"><div class="content">' + _leftColumnHtml + _rightColumnHtml + '</div></div>' + _html);
                } else {
                    customer.html(_html);
                }

                //初始化加载每个模块第一个分类tab下的文章
                var contents = $('.hot-qus-class');
                $.each(contents, function(i, v){
                    $(this).find('li').eq(0).click();
                });
            },
            error: function(){
                //alert("服务器发生错误");
            }
        });
    }
    //拼接两栏模块html字符串
    function getContentStr(v, isCol2) {
        var icon = v.icon || 'icon-article';
        var isShowCol2 = isCol2 ? 'col2' : '';
        var lrr = isCol2 == 'l' ? 'leftColumn' : isCol2 == 'r' ? 'rightColumn' : '';
        var str = '';
        if(lrr != '') {
            str += '<div class="col2 '+ lrr +'">'
            str += '<div class="g-cf tit">';
            str += '<span class="iconTit iconfont iconSize '+ icon +' g-f-l g-mr-10 mt-2"></span> <span class="g-f-l titTxt">'+ v.name +'</span>';
            str += '</div>';
            str += '<div class="g-m-10 con g-cf contentType">';
            str += '<ul class="g-cf hot-qus-class '+ isShowCol2 + '">';
            $.each(v.subMenu || [], function(j, m){
                if(j == 0){
                    str += '<li class="cur" attr-tag="tab" attr-cat="'+ v.id +'" attr-value="'+ m.id +'">'+ utils.interceptString(m.name, 9) +'</li>';
                }else{
                    str += '<li attr-tag="tab" attr-cat="'+ v.id +'" attr-value="'+ m.id +'">'+ utils.interceptString(m.name, 9) +'</li>';
                }
            });
            str += '</ul>'
            str += '<div class="hot-qus-list-wrap '+ isShowCol2 +'">'
            str += '<ul class="g-box-shadow g-cf hot-qus-list '+ isShowCol2 +'" id="hot-qus-list-'+ v.id +'">'
            str += '</ul>'
            str += '</div>'
            str += '</div>'
            str += '</div>'
        } else {
            str += '<div class="section bgGray">';
            str += '<div class="content">';
            str += '<div class="g-cf tit">';
            str += '<span class="iconTit iconfont iconSize '+ icon +' g-f-l g-mr-10 mt-2"></span> <span class="g-f-l titTxt">'+ v.name +'</span>';
            str += '</div>';
            str += '<div class="g-m-10 con g-cf contentType">';
            str += '<ul class="g-cf hot-qus-class">';
            $.each(v.subMenu || [], function(j, m){
                if(j == 0){
                    str += '<li class="cur" attr-tag="tab" attr-cat="'+ v.id +'" attr-value="'+ m.id +'">'+ utils.interceptString(m.name, 9) +'</li>';
                }else{
                    str += '<li attr-tag="tab" attr-cat="'+ v.id +'" attr-value="'+ m.id +'">'+ utils.interceptString(m.name, 9) +'</li>';
                }
            });
            str += '</ul>'
            str += '<div class="hot-qus-list-wrap">'
            str += '<ul class="g-box-shadow g-cf hot-qus-list" id="hot-qus-list-'+ v.id +'">'
            str += '</ul>'
            str += '</div>'
            str += '</div>'
            str += '</div>'
            str += '</div>'
        }

        return str;
    }
    /**
     * 根据热点问题类型ID获取到该类型下的内容
     */
    function getCustomerContentList(catId, parentCatId, isCol2) {
        var params = {
            catId: catId,
            sCode: $('#sCode').val(),
            pageSize: 13
        };
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
                        var count = 0;
                        for(var key in hotQuestions){
                            //两栏模式下，分类下的文章最多显示7条
                            if(isCol2 == 'l' && count >= 4) {
                                _html += '<a href="javascript:toSelfServiceList('+ catId +');" class="more">more>></a>';
                                break;
                            }else if(isCol2 == 'r' && count >= 8) {
                                _html += '<a href="javascript:toSelfServiceList('+ catId +');" class="more">more>></a>';
                                break;
                            }else if(isCol2 == '' && count >= 12) {
                                _html += '<a href="javascript:toSelfServiceList('+ catId +');" class="more">more>></a>';
                                break;
                            }
                            _html += '<li><i class="dot-list-blue"></i><a href="/front/info/route/3/' + hotQuestions[key].id +'?parentId='+catId+'" title="'+ hotQuestions[key].title +'">'+ utils.interceptString(hotQuestions[key].title) +'</a></li>';
                            count += 1;
                        }
                    }else {
                        _html += '<p class="g-mtb-20 g-ta-c">暂无信息</p>'
                    }
                    $('#hot-qus-list-'+ parentCatId ).html(_html);
                }
            },
            error: function(e){
                debugger;
                alert("服务器发生错误");
            }
        });
    }

	return {
		getCustomerContents : getCustomerContents
	}
})
