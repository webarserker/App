require.config({
    baseUrl:"../../../static/scripts/front/"
});

var alt = $("#schoolName").val()+$("#professor").val();
require(["../../../static/scripts/front/config.js"],function(){
    require(["jquery","util","modelIntelEnter","slide","resize"],function($,util,modelIntelEnter){
        index = {
            getWindowWidth: function() {
                return $(window).width();
            },
            /*渲染菜单*/
            renderMenu: function(d) {
                var result = [];
                var cur = {};
                var curStr = '';
                var childrenStr = [];
                var w = 0;
                if(d.length > 0) {
                    for(var i = 0; i < d.length; i++) {
                        cur = d[i];
                        curStr = '';
                        childrenStr = [];
                        //TODO 湖工国际交流直接跳页面
                        var targetUrl = cur.refUrl;//1125
                        var target = '';
                        if(cur.catId == 1125) {
                            targetUrl = 'http://sie.hbut.edu.cn';
                            target = '_blank'
                        }
                        if(cur.catId == 1008) {//1008
                            targetUrl = 'http://www.hbut.edu.cn/upload/files/2017/2/1416101310.pdf';
                            target = '_blank'
                        }
                        if(cur.catId == 1625) {//1625
                            targetUrl = 'http://zhinengdayi.com/front/info/common?level=3&id=3577&parentId=1625';
                            target = '_blank'
                        }

                        var widthCss = '';
                        var padding = 60;//QXALHX
                        if($("#sCode").val() == 'QXALHX') {
                            widthCss = 'style="padding:0px 20px;"';
                            padding = 40;
                        }

                        curStr += '<li class="menuList" '+widthCss+' catid="'+cur.catId+'"><a target="'+target+'" href="'+ targetUrl +'" class="menuTxt">'+ cur.name +'<i class="curArrow comicon-arrowup"></i></a>';
                        if(cur.children.length > 0) {
                            curStr += '<ul class="g-cf subMenu">';
                            for(var j = 0, len = cur.children.length; j < len; j++) {
                                if(j >= 15) {
                                    break;
                                }
                                curStr += '<li class="subMenuList"><a href="'+ cur.children[j].refUrl +'" target="_blank">'
                                if(cur.children[j].imgUrl) {
                                    curStr += '<img alt="'+alt+'" class="subMenuIconImg" src="' +$('#imgServer').val()+ cur.children[j].imgUrl +'" /><br/>';
                                } else {
                                    curStr += '<span class="subMenuIconWp"><i class="subMenuIcon '+ (cur.children[j].icon ? cur.children[j].icon : '') +'"></i></span><br/>';
                                }
                                curStr += cur.children[j].name + '</a></li>';
                            }
                            curStr += '</ul>';
                        }
                        curStr += '</li>'
                        $('#menu').append(curStr);
                        //每次添加菜单计算菜单的宽度，如果超过了总宽度则不再添加
                        w = 0;
                        $('#menu .menuList').each(function() {
                            w += $(this).width() + padding;
                        })
                        if(w >= 910) {
                            $("#menu").find(".menuList:last").remove();
                            break;
                        }
                    }
                }
            },
            /*渲染banner模块*/
            renderBanner: function(d) {
                var me = this;
                var bannerImg = [];
                var bannerDesc = [];
                var cur = {};
                var width = me.getWindowWidth() > 1366 ? 1200 : 1000;
                if(d.length > 0) {
                    for(var i = 0; i < d.length; i++) {
                        cur = d[i];
                        bannerImg.push('<a href="'+ cur.link +'" target="_blank"><img src="'+$('#imgServer').val() + cur.imgUrl +'" alt="'+ alt +'" /></a>');
                        bannerDesc.push('<li class="descItem '+ (i==0?'on':i==d.length-1?'last':'') +'" data="'+ i +'"><p class="tit"><a href="'+ cur.link +'" target="_blank">'+ cur.title +'</a></p><p class="desc" title="'+ cur.desc +'">'+ cur.desc +'</p></li>');
                    }
                }
                $('#bannerList').html(bannerImg.join(''));
                $('#bannerDescList').html(bannerDesc.join(''));
                slide(true);
                //计算说明文案的宽度(1200/banner个数是每个文案的总宽度，还要减去60px的padding和1px的border)
                $('#bannerDescList').find('.descItem').css({'width': (width / d.length) - 61});
                $('#show .img img').resize(function(){
                    slide(false);
                });
                $(window).resize(function() {
                    var width = me.getWindowWidth() > 1366 ? 1200 : 1000;
                    $('#bannerDescList').find('.descItem').css({'width': (width / d.length) - 61});
                });
            },
            /*渲染热点模块*/
            renderHotBlock: function(d) {
                var result = [];
                var cur = {};
                var dYear = '';
                var dDate = '';
                if(d != null) {
                    var level = 2;
                    var catId = d.catId;
                    var parentId = '';
                    if(d.children.length > 0){
                        level = 3;
                        catId = d.children[0].infoId;
                        parentId = '?parentId=' + d.catId;
                    }
                    //模块标题
                    $('#hotTit').html('<i class="titIcon '+ d.icon +'"></i><a href="/front/info/route/'+ level +'/'+ catId + parentId +'" target="_blank">' + d.catName + '</a>');
                    //数据列表
                    if(d.children.length > 0) {
                        for(var i = 0, len = d.children.length; i < len; i++) {
                            cur = d.children[i];
                            if(i >= 3) {
                                break;
                            }
                            result.push(['<li class="infoItem '+ (i==0 ? 'first':'') +'">',
                                '<div class="time">',
                                '<p class="date">'+ util.formatDate(new Date(cur.date), 'MM.dd') +'</p>',
                                '<p class="year">'+ util.formatDate(new Date(cur.date), 'yyyy') +'</p>',
                                '</div>',
                                '<div class="desc">',
                                '<h3 class="title-truncate" title="'+ cur.title +'"><a href="'+(cur.contentLink ? cur.contentLink:'/front/info/route/3/'+ cur.infoId +'?parentId='+ d.catId) +'" target="_blank">'+ cur.title +'</a></h3>',
                                '<p>'+ (cur.contentLink ? '' :util.interceptString(cur.desc,40)) +'</p>',
                                '</div>',
                                '</li>'].join(''));
                        }
                        $('#hotInfoList').html(result.join(''));
                    }
                }
            },
            /*渲染快捷入口*/
            renderQuickEntry: function(d) {
                var result = [];
                var curResult = [];
                var cur = {};
                //数据列表
                if(d.length > 0) {
                    for(var i = 0, len = d.length; i < len; i++) {
                        curResult = [];
                        cur = d[i];
                        if(i >= 5) {
                            break;
                        }
                        //TODO 湖工
                        var color = ($('#sCode').val() == 'QXALHX' && (i + 1)%2 == 0) ? '#ed8632 !important' : '';
                        //TODO 北林
                        var desc = ($('#sCode').val() != 'FKLXDD' && cur.children.length!=0) ? cur.children[0].name : ' ';
                        curResult.push(['<li class="mainItem">',
                            '<p class="g-mtb-30 icon">'+ (cur.icon ? '<i style="color:'+color+'" class="usericon '+ cur.icon +'"></i>' : '<img src="' + cur.imgUrl +'" alt="' + alt +'" />') +'</p>',
                            '<p class="tit">'+ cur.name +'</p>',
                            '<p class="desc">——</p>',
                            '<p class="desc">'+ desc +'</p>',
                            '<div class="itemDescList">',
                            '<dl>',
                            '<dt><a href="'+ cur.refUrl +'" target="_blank">'+ cur.name +'</a></dt>'].join(''));
                        if(cur.children != null) {
                            for(var j = 0; j < cur.children.length; j++) {
                                if(j >= 4) {
                                    break;
                                }
                                curResult.push('<dd><a href="'+ cur.children[j].refUrl +'" target="_blank" title="'+ cur.children[j].name +'">'+ util.interceptString(cur.children[j].name, 8) +'</a></dd>');
                            }
                        }
                        curResult.push(['</dl>',
                            '<a class="more" href="'+ d[i].refUrl +'" target="_blank"><i class="moreIcon comicon-arrow-down"></i></a>',
                            '</div></li>'].join(''));
                        result.push(curResult.join(''));
                    }
                    $('#mainList').html(result.join(''));
                }
            },
            renderFlashBlock: function(d) {
                var result = [];
                var curResult = [];
                var curcurResult = [];
                var cur = {};
                var linkurl='';
                if(d.length > 0) {
                    for(var i = 0; i < d.length; i++) {
                        cur = d[i];
                        if($("#sCode").val() == 'QXALHX' && (i == 0 || i == 1)) {//QXALHX
                            result.push('<li class="tabTitList '+ (i==0?'cur':'') +'"><a style="color:#ed8632 !important" href="/front/info/route/2/'+ cur.catId +'" target="_blank">'+ cur.name +'</a></li>');
                        }else {
                            result.push('<li class="tabTitList '+ (i==0?'cur':'') +'"><a href="/front/info/route/2/'+ cur.catId +'" target="_blank">'+ cur.name +'</a></li>');
                        }
                    }
                    $('#tabTit').html(result.join(''));
                    result = [];
                    for(var i = 0; i < d.length; i++) {
                        curResult = [];
                        curResult.push('<ul class="dList '+ (i==0?'cur':'') +'">');
                        if(d[i].children.length > 0) {
                            for (var j = 0; j < d[i].children.length; j++) {
                                curcurResult = []
                                cur = d[i].children[j];
                                if(j >= 5) {
                                    break;
                                }
                                linkurl = cur.contentLink ? cur.contentLink : '/front/info/route/3/'+ cur.infoId +'?parentId='+ d[i].catId;
                                if (j == 0) {
                                    curcurResult.push(['<li class="dItem firstItem">',
                                        '<img alt="'+alt+'" src="' + (cur.imgUrl == null || cur.imgUrl == '' ? '/static/image/front/default/template_02_default_01.png' : $('#imgServer').val()+cur.imgUrl) + '" />',
                                        '<dl>',
                                        '<dt><a href="'+linkurl+'" target="_blank" title="'+ cur.name +'">' + cur.name + '</a><br/><span>' + util.formatDate(new Date(cur.date), 'yyyy-MM-dd') + '</span><i class="comicon-new new"></i></dt>',
                                        '<dd>' + util.interceptString(cur.desc, 40) + '</dd>',
                                        '</dl>',
                                        '</li>'].join(''));
                                } else {
                                    if (cur.isRecommended == 0) {
                                        curcurResult.push(['<li class="dItem">',
                                            '<a href="'+linkurl+'" target="_blank" title="'+ cur.name +'">' + cur.name + '</a>',
                                            '<i class="comicon-recmmond recmmond"></i>',
                                            '<span class="date">' + util.formatDate(new Date(cur.date), 'yyyy-MM-dd') + '</span>',
                                            '</li>'].join(''));
                                    } else {
                                        curcurResult.push(['<li class="dItem">',
                                            '<a href="'+linkurl+'" target="_blank" title="'+ cur.name +'">' + cur.name + '</a>',
                                            '<span class="date">' + util.formatDate(new Date(cur.date), 'yyyy-MM-dd') + '</span>',
                                            '</li>'].join(''));
                                    }
                                }
                                curResult.push(curcurResult.join(''));
                            }
                        }
                        curResult.push('</ul>');
                        result.push(curResult.join(''));
                    }
                    $('#tabCon').html(result.join(''));
                }
            },
            /*渲染招生简章*/
            renderBriefBlock: function(d) {
                var result = [];
                var cur = {};
                var linkurl = '';
                if(d != null) {
                    //渲染模块标题
                    $('#briefTit').html('<a href="/front/info/route/2/'+ d.catId +'" target="_blank">'+ d.name + '</a>');
                    //渲染数据列表
                    for(var i = 0; i < d.children.length; i++) {
                        cur = d.children[i];
                        var parentId = '';
                        if($("#sCode").val() != 'PRUAYH') {
                            parentId = '?parentId='+ d.catId;
                        }
                        linkurl = cur.contentLink ? cur.contentLink : '/front/info/route/3/'+ cur.infoId + parentId;
                        result.push(['<dd class="con">',
                            '<span class="iconBg '+ (i<=1 ? 'levelA':i==2 ? 'levelB':'') +'"><i class="comicon-hat hat"></i></span>',
                            '<p class="dListTit"><a href="'+linkurl+'" target="_blank" class="title-truncate" title="'+ cur.name +'">'+ cur.name +'</a></p>',
                            '<span class="date">'+ util.formatDate(new Date(cur.date), 'yyyy.MM.dd') +'</span>',
                            '</dd>'].join(''));
                    }
                    $('#briefCon').append(result.join(''));
                }
            },
            /*渲染视频区域*/
            renderVedio: function(d) {
                var result = [];
                if(d.length > 0) {
                    for(var i = 0; i < d.length; i++) {
                        var vidoUrl= d[i].vidoUrl && d[i].vidoUrl.indexOf('http') < 0 ? ($('#imgServer').val()+d[i].vidoUrl) : d[i].vidoUrl;
                        result.push(['<li class="vedioItem '+ (i==1?'mt14':'') +'">',
                            '<div class="vedioItemBg" title="'+d[i].title+'"></div>',
                            '<a title="'+d[i].title+'" href="'+ vidoUrl +'" target="_blank">',
                            '<img alt="'+alt+'" title="'+d[i].title+'" src="' + $('#imgServer').val() + d[i].imgUrl +'" />',
                            '<span class="vedioIcon" title="'+d[i].title+'"></span>',
                            '</a>',
                            '</li>'].join(''));
                    }
                    $('#vedioList').html(result.join(''));
                }
            },
            renderFigureBlock: function(d) {
                var result = [];
                var cur;
                var loop = false;
                var linkurl = '';
                if(d.children.length > 0) {
                    if(d.children.length >= 4) {
                        loop = true;
                    }
                    for(var i = 0; i < d.children.length; i++) {
                        cur = d.children[i];
                        linkurl = cur.contentLink ? cur.contentLink : '/front/info/route/3/'+ cur.infoId +'?parentId='+ d.catId ;
                        result.push(['<li class="item">',
                            '<img alt="'+alt+'" src="'+ (cur.imgUrl == null || cur.imgUrl == '' ? '/static/image/front/default/template_02_default_02.png' : ($('#imgServer').val() + cur.imgUrl)) +'" />',
                            '<div class="descWp">',
                            '<div class="descBg"></div>',
                            '<div class="desc">'+ cur.name +'</div>',
                            '</div>',
                            '<div class="descDetailWp">',
                            '<div class="descDetailBg"></div>',
                            '<div class="descDetail">',
                            '<p class="name"><a href="'+linkurl+'" target="_blank">'+ cur.name +'</a></p>',
                            '<p class="intro">'+ util.interceptString(cur.desc, 80) +'</p>',
                            '<p class="moreBtnWp"><a href="'+linkurl+'" class="moreBtn" target="_blank">了解更多</a></p>',
                            '</div>',
                            '</div>',
                            '</li>'].join(''));
                    }
                    $('#figureList').html(result.join(''));
                }
                //轮播,如果大于等于4条，就设为轮播
                $("#show-slide").slider({
                    interval: 5000,
                    loop: loop,
                    auto: false
                });
            },
            renderStoreis: function(d) {
                var result = [];
                var curResult = [];
                var cur = {};
                if(d != null) {
                    $('#schTit').html('<a href="/front/info/route/2/'+ d.catId +'" target="_blank">'+ d.name + '</a>');
                    if(d.children.length > 0) {
                        $('#schImg').attr('src', d.children[0].imgUrl == null || d.children[0].imgUrl == '' ? '/static/image/front/default/template_02_default_03.png' : ($('#imgServer').val()+d.children[0].imgUrl));
                        result.push(['<div class="p20">',
                            '<div class="tit"><a href="'+(d.children[0].contentLink ? d.children[0].contentLink :'/front/info/route/3/'+ d.children[0].infoId +'?parentId='+ d.catId) +'" target="_blank" title='+d.children[0].name+'>' + d.children[0].name + '</a></div>',
                            '<div class="con" title='+(d.children[0].contentLink ? '' : util.interceptString(d.children[0].desc, 217))+'>' + (d.children[0].contentLink ? '' : util.interceptString(d.children[0].desc, 217)) + '</div>',
                            '</div>'].join(''));
                        curResult.push('<ul class="g-cf moreSchStory">');
                        for (var i = 1; i < d.children.length; i++) {
                            cur = d.children[i];
                            curResult.push('<li><a href="'+(cur.contentLink ? cur.contentLink :'/front/info/route/3/'+ cur.infoId +'?parentId='+ d.catId) +'" target="_blank" title='+cur.name +'>' + cur.name + '</a></li>');
                        }
                        curResult.push('</ul>');
                        result.push(curResult.join(''));
                        $('#schStory').append(result.join(''));
                    }
                }

            },
            /*获取页面基本信息*/
            getBaseInfo: function() {
                var me = this;
                var sCode = $('#sCode').val();
                $.ajax({
                    type:"GET",
                    url: '/front/template_02/index?ran'+Math.random() + '&sCode='+sCode,
                    dataType: "json",
                    success: function(data){
                        //渲染顶部菜单
                        me.renderMenu(data.navigators);
                        //渲染banner
                        me.renderBanner(data.banner);
                        //渲染热点模块
                        me.renderHotBlock(data.hotNews);
                        //渲染快捷入口
                        me.renderQuickEntry(data.quickEnter);
                    },
                    error: function(e){
                        console.log("服务器发生错误");
                    }
                });
            },
            /*渲染快讯模块*/
            getFlash: function() {
                var me= this;
                var sCode = $('#sCode').val();
                $.ajax({
                    type:"GET",
                    url: '/front/template_02/flash?ran'+Math.random() + '&sCode='+sCode,
                    dataType: "json",
                    success: function(data){
                        me.renderFlashBlock(data);
                    },
                    error: function(e){
                        console.log("服务器发生错误");
                    }
                });
            },
            /*渲染简章模块*/
            getBrief: function() {
                var me = this;
                var sCode = $('#sCode').val();
                $.ajax({
                    type:"GET",
                    url: '/front/template_02/brief?ran'+Math.random() + '&sCode='+sCode,
                    dataType: "json",
                    success: function(data){
                        me.renderBriefBlock(data);
                    },
                    error: function(e){
                        console.log("服务器发生错误");
                    }
                });
            },
            getSchoolVidos: function() {
                var me = this;
                var params = {
                    sCode: $('#sCode').val(),
                    pageSize: 2
                };
                $.ajax({
                    type:"GET",
                    data: params,
                    url: '/front/getSchoolVidoList?ran'+Math.random(),
                    dataType: "json",
                    success: function(data){
                        me.renderVedio(data.data);
                    },
                    error: function(e){
                        console.log("服务器发生错误");
                    }
                });
            },
            getFigure: function() {
                var me = this;
                var sCode = $('#sCode').val();
                $.ajax({
                    type:"GET",
                    url: '/front/template_02/figure?ran'+Math.random() + '&sCode='+sCode,
                    dataType: "json",
                    success: function(data){
                        if(data != null) {
                            me.renderFigureBlock(data);
                        }
                    },
                    error: function(e){
                        console.log("服务器发生错误");
                    }
                });
            },
            getStoreis: function() {
                var me = this;
                var sCode = $('#sCode').val();
                $.ajax({
                    type:"GET",
                    url: '/front/template_02/stories?ran'+Math.random() + '&sCode='+sCode,
                    dataType: "json",
                    success: function(data){
                        me.renderStoreis(data);
                    },
                    error: function(e){
                        console.log("服务器发生错误");
                    }
                });
            },
            getFriendLink: function() {
                //底部友情链接
                var sCode = $('#sCode').val();
                $.ajax({
                    type:"GET",
                    url: '/front/template_02/friendLink?ran'+Math.random() + '&sCode='+sCode,
                    dataType: "json",
                    success: function(data){
                        var result = [];
                        var cur;
                        if(data.length > 0) {
                            for(var i = 0; i < data.length; i++) {
                                cur = data[i];
                                result.push('<li><a href="'+ cur.link +'" title="'+ cur.name +'" target="_blank">' + cur.name + '</a></li>');
                            }
                            $('#links').html(result.join(''));
                        }
                    },
                    error: function(e){
                        console.log("服务器发生错误");
                    }
                });
            },
            bindEvent: function() {
                //登录头像鼠标悬浮出现菜单
                $('.loggedBox').hover(function() {
                    $(this).find('.loggedDownlist').show();
                }, function() {
                    $(this).find('.loggedDownlist').hide();
                });

                //头部搜索功能
                $('#searchBtn').click(function() {
                    var ques = $.trim($("#searchIpt").val());
                    var sCode = $.trim($("#sCode").val());
                    if(ques != null && ques != '') {
                        _paq.push(['trackEvent', $("#identify").val(),'search']);
                        window.location.href = $("#ctx").val() + '/front/info/search?question=' + ques+ '&sCode=' + sCode;
                    }
                });

                //控制二级菜单的显示与隐藏
                $('#menu').on('mouseover','.menuList',function(){
                    $(this).addClass('bold');
                    if($(this).find('.subMenu').length != 0 && $(this).attr('catid') != 1121 && $(this).attr('catid') != 1125 && $(this).attr('catid') != 1008 && $(this).attr('catid') != 1625) {
                        $(this).find('.curArrow').show();
                        $(this).find('.subMenu').show();
                    }
                });
                $('#menu').on('mouseout','.menuList',function(){
                    $(this).removeClass('bold');
                    if($(this).find('.subMenu').length != 0) {
                        $(this).find('.curArrow').hide();
                        $(this).find('.subMenu').hide();
                    }
                });

                //控制快捷入口子菜单的显示与隐藏
                $('#mainList').on('mouseover','.mainItem',function(){
                    $(this).find('.itemDescList').show();
                });
                $('#mainList').on('mouseout','.mainItem',function(){
                    $(this).find('.itemDescList').hide();
                });

                //控制快讯模块tab切换
                $('#tabTit').on('mouseover','.tabTitList',function() {
                    $('.tabTitList').removeClass('cur');
                    $(this).addClass('cur');
                    $('.tabCon .dList').removeClass('cur');
                    $($('.tabCon .dList').get($(this).index())).addClass('cur');
                });

                //控制人物详情的显示与隐藏
                $('#figureList').on('mouseover','.item',function() {
                    $(this).find('.descWp').hide();
                    $(this).find('.descDetailWp').show();
                });
                $('#figureList').on('mouseout','.item',function() {
                    $(this).find('.descWp').show();
                    $(this).find('.descDetailWp').hide();
                });

                //鼠标悬浮联系方式显示联系详情
                $('.contactItem').hover(function(){
                    $(this).find('.dropDown').show();
                },function(){
                    $(this).find('.dropDown').hide();
                });

                //退出系统
                $('#loginOut').click(function() {
                    util.popup({
                        id:'logoutPop',
                        width:'420px',
                        til:'提示',
                        confirmCallback: function() {
                            window.location = '/front/user/loginOut?ran'+Math.random();
                        }
                    });
                });
                // 点击进入留言咨询页面
                $('#enterMessage').click(function() {
                    if ($("#userId").val() != null && $("#userId").val() != '') {
                        window.open("/front/answerOff/toAnswerOffPage?sCode=" + $("#sCode").val());
                    } else{
                        util.popTips({
                            delay: 5000,
                            text: "<div class='loginTip'>您还未登录,请先<a href='/front/user/toLogin?sCode=" + $("#sCode").val() + "'>登录</a><br/><br/>如果还没有账户需要先<a href='/front/user/toRegister?sCode=" + $("#sCode").val() + "'>注册</a>哦 ！</div>",
                            state: "alert"
                        });
                    }
                });
                $('#enterMessageWp').click(function() {
                    if ($("#userId").val() != null && $("#userId").val() != '') {
                        window.open("/front/answerOff/toAnswerOffPage?sCode=" + $("#sCode").val());
                    } else{
                        util.popTips({
                            delay: 5000,
                            text: "<div class='loginTip'>您还未登录,请先<a href='/front/user/toLogin?sCode=" + $("#sCode").val() + "'>登录</a><br/><br/>如果还没有账户需要先<a href='/front/user/toRegister?sCode=" + $("#sCode").val() + "'>注册</a>哦 ！</div>",
                            state: "alert"
                        });
                    }
                });
                //智能答疑入口
                $('#answerEnter').click(function() {
                    modelIntelEnter.perfectUserInfo(modelIntelEnter.openAnsDialog);
                });
                //faq入口
                $('#faqEnter').click(function() {
                    modelIntelEnter.perfectUserInfo(modelIntelEnter.gotoFaq, false);
                });
                $('#answerEntryBtn').click(function() {
                    modelIntelEnter.perfectUserInfo(modelIntelEnter.openAnsDialog);
                });

                //右侧悬浮二维码的展现和隐藏
                $('.rightQrcode').hover(function(){
                    $(this).find('.ownQrcode').show();
                }, function(){
                    $(this).find('.ownQrcode').hide();
                })
            },
            /*页面初始化入口*/
            init: function() {
                var me = this;
                me.bindEvent();
                me.getBaseInfo();
                me.getFlash();
                me.getBrief();
                me.getSchoolVidos();
                me.getFigure();
                me.getStoreis();
                me.getFriendLink();
            }
        }
        index.init();
    });

});