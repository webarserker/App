$(function(){
    //初始化时间控件
    dateParamsUtil.initDatePicker($("#dateRange"), new Date(), null, 'YYYY-MM-DD');
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	refreshPage();
	
	function refreshPage(){
		appKpi();
		appKpiRadio();
		accountTypePie();//加载账号类型数据
		trendLine();//加载趋势图
		pageViwFacade.query();
	}
	
	//日期控件选择
	$("#search").on("click",function(){
		//重新计算日期
		/*queryDate = $("#queryDate").val();
		date =  new Date(queryDate.replace(/-/g,"/"));
		endDate = date.pattern("yyyy-MM-dd");
		//往前推30天
		date.addDays(-30);
		begDate = date.pattern("yyyy-MM-dd");*/
        startDate = $("#startDate").val();
        endDate = $("#endDate").val();
		refreshPage();
	});
	
	/**
	 * 设置标签css属性
	 */
	function dataCss(key,value){
		var css = "";
		if(value>0){
			css = "stat stat-success ";
		}else if(value<0){
			css = "stat stat-important";
		}
		var target = $("#" + key);
		var oldCss = target.attr("class");
		target.removeClass(oldCss);
		target.addClass(css);
	}
	/**
	 * app KPI 数据
	 */
	function appKpi(){
		$.post(ctx+"/report/schoolView/getKpi",{startDate: startDate, endDate: endDate}, function(data) {
			$("#total").html(data.total);
			$("#total_pv").html(data.total_pv);
			$("#total_uv").html(data.total_uv);
			$("#pc_pv").html(data.pc_pv);
			$("#pc_uv").html(data.pc_uv);
			$("#wx_pv").html(data.wx_pv);
			$("#wx_uv").html(data.wx_uv);
		  });
	}

    /**
     * app KPI radio 数据
     */
    function appKpiRadio(){
        $.post(ctx+"/report/schoolView/getKpiRadio",{}, function(data) {
            $("#total_ratio").html(data.total_ratio.toFixed(2)+"%");
            // dataCss("total_ratio_stat",data.total_ratio);

            $("#total_pv_ratio").html(data.total_pv_ratio.toFixed(2)+"%");
            // dataCss("total_pv_ratio_stat",data.total_pv_ratio);

            $("#total_uv_ratio").html(data.total_uv_ratio.toFixed(2)+"%");
            // dataCss("total_uv_ratio_stat",data.total_uv_ratio);

            $("#pc_pv_ratio").html(data.pc_pv_ratio.toFixed(2)+"%");
            // dataCss("pc_pv_ratio_stat",data.pc_pv_ratio);

            $("#pc_uv_ratio").html(data.pc_uv_ratio.toFixed(2)+"%");
            // dataCss("pc_uv_ratio_stat",data.pc_uv_ratio);

            $("#wx_pv_ratio").html(data.wx_pv_ratio.toFixed(2)+"%");
            // dataCss("wx_pv_ratio_stat",data.wx_pv_ratio);

            $("#wx_uv_ratio").html(data.wx_uv_ratio.toFixed(2)+"%");
            // dataCss("wx_uv_ratio_stat",data.wx_uv_ratio);

        });
    }

	function accountTypePie(){
		$.post(ctx+"/report/schoolView/queryAccountTypePie",{startDate: startDate, endDate: endDate}, function(data) {
			var option = {
				    tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c} ({d}%)"
				    },
				    legend: {
				        orient: 'vertical',
				        left: 'left',
				        data: ['微信用户','注册用户']
				    },
				    series : [
				        {
				            name: '访问来源',
				            type: 'pie',
				            radius : '55%',
				            center: ['50%', '60%'],
				            data:[
				                {value:data.wx_count || 0, name:'微信用户'},
				                {value:data.account_count || 0, name:'注册用户'}
				            ],
				            itemStyle: {
				                emphasis: {
				                    shadowBlur: 10,
				                    shadowOffsetX: 0,
				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
				                }
				            }
				        }
				    ]
				};
			echarts.init(document.getElementById('acountType')).setOption(option);
		});
	}
	
	function trendLine(){
		$.post(ctx+"/report/schoolView/queryTrendLine",{endDate:endDate,begDate:startDate}, function(data) {
			var option = {
				    tooltip : {
				        trigger: 'axis'
				    },
				    legend: {
				        data:['新增注册用户数','PV','UV']
				    },
				    toolbox: {
				        feature: {
				            saveAsImage: {}
				        }
				    },
				    grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '3%',
				        containLabel: true
				    },
				    xAxis : [
				        {
				            type : 'category',
				            boundaryGap : false,
				            data : data.xAxis
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value'
				        }
				    ],
				    series : [
				        {
				            name:'新增注册用户数',
				            type:'line',
				            data:data.newRegUser
				        },
				        {
				            name:'PV',
				            type:'line',
				            data:data.pv
				        },
				        {
				            name:'UV',
				            type:'line',
				            data:data.uv
				        }
				    ]
				};
			echarts.init(document.getElementById('trendline')).setOption(option);
		});
		
		
	}
});

var pageViwFacade = {
	    detailsGrid: null, // 数据详情
	    url : '/report/schoolView/pageView',
	    query : function() {
	        var queryString = pageViwFacade.getParams();
	        if(!queryString) {
	        	return false;
	        }
	        // 加载详情
	        pageViwFacade.loadDetails(queryString);
	    },
	    getParams : function() {
	        return 'startDate='+$("#startDate").val() + '&endDate=' + $("#endDate").val();
	    },
	    // 加载数据详情
	    loadDetails : function(params) {
	        var _this = this;
	        var grid_selector = "#table-data-list";
	        var pager_selector = "#table-data-list-pager";
	        if(_this.detailsGrid) {
	            // 根据搜索条件，重新加载
	            $(grid_selector).jqGrid('setGridParam',{
	                url : pageViwFacade.url+'?'+params,
	                page:1 
	            }).trigger("reloadGrid");
	        } else {
	            // 首次加载
	            _this.detailsGrid = $(grid_selector).jqGrid({
	                url : pageViwFacade.url+'?'+params,
	                caption: "浏览页面",
	                datatype : 'json',
	                colNames : ['页面标题','浏览站点', 'PV', 'UV'],
	                cmTemplate: {sortable:false},
	                colModel : [ {
	                    name : 'name',
	                    align :'center',
	                    width : 200
	                }, {
	                    name : 'idsite',
	                    width : 80,
	                    formatter : function(cellvalue, options, rowObject) {
	                        return cellvalue == 1?'pc':'weixin';
	                    }
	                }, {
	                    name : 'pv',
	                    width : 100
	                }, {
	                    name : 'uv',
	                    width : 100
	                }
	                ],
	                rowNum : 30,
	                rowList : [ 10, 30, 50 ],
	                pager : pager_selector,
	                pagerpos : 'left',
	                viewrecords : true,
	                height : 'auto',
	                loadComplete : function() {
	                    var table = this;
	                    setTimeout(function() {
	                        updatePagerIcons(table);
	                    }, 0);
	                }
	            });
	        }
	        // 自适应宽度
	        $.resizeGrid(grid_selector);
	    }
	}