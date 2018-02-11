<!-- 预测分析 -->
  function preRefer(){
	  var myDate = new Date();
      var currentYear = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
      var shi="北京市天津市上海市重庆市";
      var zsquery=$("#cityName_2").val();
      if(shi.indexOf(zsquery)>=0){
    	  zsquery+='市';  
      }else{
    	  zsquery+='省';   
      }
      zsquery+=$("#science_2").val()+$("#batch_2").val()+$("#enrollType_2").val();
      var content= "根据数据查阅，我校在"+zsquery+"招生计划中，历史近三年（"+(currentYear-1)+"年、"+(currentYear-2)+"年、"+(currentYear-3)+"年）的录取最低分分别为：";
      $(".sheng_zs_info").html(zsquery);
      var preScore = "";
      var lowScore = "";
      
      var params = $("#form2").serialize();
     
      $.ajax({
        type:"POST",
        url:"/front/enroll/findScoreForRefer",
        data:params
      }).done(function (data) {
        if(data.score1 == null || data.score1<=0){
          lowScore+="暂无数据、";
        }else{
          lowScore+= data.score1+"分（分差"+(data.score1-data.provinceScore1)+"）、";
        }
        if(data.score2 == null || data.score2<=0){
          lowScore+="暂无数据、";
        }else{
          lowScore+=data.score2+"分（分差"+(data.score2-data.provinceScore2)+"）、";
        }
        if(data.score3 == null || data.score3<=0){
          lowScore+="暂无数据，";
        }else{
          lowScore+=data.score3+"分（分差"+(data.score3-data.provinceScore3)+"），";
        }
        var avgScore = "录取平均分分别为：";
        if(data.avgScore1 == null || data.avgScore1<=0){
          avgScore+="暂无数据、";
        }else{
          avgScore+= data.avgScore1+"分（分差"+(data.avgScore1-data.provinceScore1)+"）、";
        }
        if(data.avgScore2 == null || data.avgScore2<=0){
          avgScore+="暂无数据、";
        }else{
          avgScore+=data.avgScore2+"分（分差"+(data.avgScore2-data.provinceScore2)+"）、";
        }
        if(data.avgScore3 == null || data.avgScore3<=0){
          avgScore+="暂无数据";
        }else{
          avgScore+=data.avgScore3+"分（分差"+(data.avgScore3-data.provinceScore3)+"），请您参考！";
        }
   
        $("#resultSms").html(content+lowScore+avgScore);
      }).always(function () {
        $("#searchBtn").removeClass("disabled");
      });
  }
  <!-- 预测结果 -->
  function enrollForecast(){
	    var params = $("#form2").serialize();
	   $.ajax({
	      type: "POST",
	      url: "/front/enroll/preScore",
	      data: params
	    }).done(function (data) {
	      if (data.success) {
	        $("#enrollForecast").html('<h2 style="font-weight: bold;">一，分析结果参考:</h2><div style="text-indent: 26px;">'+data.message+'</div>')
	      } else {
	        $("#enrollForecast").html("很抱歉，无法预测您的分数情况");
	      }
	    }).always(function () {
	    	
	    });
  }
  <!--录取专业-->
  /**
   * 学校录取计划
   * @type {{curPage: number, pageSize: number, init: Function, initOperator: Function, initLoad: Function, getMajorList: Function, toMajorDetail: Function, toEnrollPlan: Function, oEnrollHistory: Function}}
   */
  var enrollPlan = {

      curPage : 1,
      pageSize : 10,

      /**
       * 页面初始化入口
       */
      init: function() {
          enrollPlan.initLoad();
      },

      /**
       * 加载专业数据
       */
      initLoad : function() {
          enrollPlan.getMajorList(0);
      },

      /**
       * 获取专业列表
       */
      getMajorList : function(pageIndex){
          var params = $("#form2").serialize().split("&");
          var input = {};
          for(var i = 0 ; i < params.length ; i++){
              var temp = params[i].split("=");
              input[temp[0]] =decodeURIComponent(temp[1]);
          }
          input['majorName']=$("#major_js").val();
          input['year']=$("#year_js").val();
          input['curPage'] = parseInt(pageIndex + 1);
          input['pageSize'] = enrollPlan.pageSize;
          enrollPlan.curPage = parseInt(pageIndex + 1);
          var sCode=$("#schoolCode").val();
          $.ajax({
              type:"POST",
              url: '/front/enroll/findEnrollPlan',
              data: input,
              dataType: "json",
              success: function(data){
            	  $(".schoolEnroll").show();
                  var _html = '';
                  if(data){
                      if(data.data && data.data.length > 0){
                          var majorList = data.data;
                          for(var key in majorList){
                              var plan = majorList[key];
                              _html += '<tr>';
                              _html += '<td>' + plan.year + '</td>';
                              _html += '<td>' + plan.enrollType + '</td>';
                              _html += '<td>' + plan.cityName + '</td>';
                              _html += '<td>' + plan.science + '</td>';
                              _html += '<td>' + plan.batch + '</td>';
                              if(sCode != 'NLGYFE'){
                            	  _html += '<td><a onclick="toEnrollMajor(&quot;' + plan.cityName + '&quot;,&quot;' + plan.batch + '&quot;,&quot;' + plan.enrollType + '&quot;,&quot;'+plan.science+'&quot;,&quot;'+plan.majorName+'&quot;)">' + plan.majorName + '</a></td>';  
                              }
                              _html += '<td>' + plan.totalNum + '</td>';
                              _html += '</tr>';
                          }
                      }
                  }
                  $('#majorInfoBody').html(_html);

                  if(data.needPage){
                      utils.paginationPage($('#majorInfoListPage'), data.totalPage, parseInt(data.curPage-1), enrollPlan.getMajorList,true);
                  }
              },
              error: function(data){
                  //alert("服务器发生错误");
              }
          });
      }

  }
  /**
   * 专业简介
   * @type {{curPage: number, pageSize: number, init: Function, initOperator: Function, initLoad: Function, getMajorList: Function, toMajorDetail: Function, toEnrollPlan: Function, oEnrollHistory: Function}}
   */
  var enrollPlanItem = {

      curPage : 1,
      pageSize : 10,

      /**
       * 页面初始化入口
       */
      init: function() {
         enrollPlanItem.initLoad();
         enrollPlan.init();
      },

      /**
       * 加载专业数据
       */
      initLoad : function() {
          enrollPlanItem.getMajorList(0);
         
      },

      /**
       * 获取专业列表
       */
      getMajorList : function(pageIndex){
          var params = $("#form2").serialize().split("&");
          var input = {};
          for(var i = 0 ; i < params.length ; i++){
              var temp = params[i].split("=");
              input[temp[0]] =decodeURIComponent(temp[1]);
          }
          input['majorName']=$("#major_jm").val();
          input['year']=$("#year_jm").val();
          input['curPage'] = parseInt(pageIndex + 1);
          input['pageSize'] = enrollPlanItem.pageSize;
          enrollPlanItem.curPage = parseInt(pageIndex + 1);
          $.ajax({
              type:"POST",
              url: '/front/enroll/findEnrollPlanDetail',
              data: input,
              dataType: "json",
              success: function(data){
              	$(".div_zsjh").show();
                  var _html = '';
                  if(data){
                      if(data.data && data.data.length > 0){
                          var majorList = data.data;
                          for(var key in majorList){
                              var plan = majorList[key];
                              _html += '<tr>';
                              _html += '<td>' + plan.year + '</td>';
                              _html += '<td>' + plan.enrollType + '</td>';
                              _html += '<td>' + plan.cityName + '</td>';
                              _html += '<td>' + plan.science + '</td>';
                              _html += '<td>' + plan.batch + '</td>';
                              _html += '<td><a onclick="toEnrollMajor(&quot;' + plan.cityName + '&quot;,&quot;' + plan.batch + '&quot;,&quot;' + plan.enrollType + '&quot;,&quot;'+plan.science+'&quot;,&quot;'+plan.majorName+'&quot;)">' + plan.majorName + '</a></td>';
                              _html += '<td>' + plan.enrollNum + '</td>';
                              _html += '<td>' + (plan.remark?plan.remark : '') + '</td>';
                              _html += '</tr>';
                          }
                      }
                  }
                  $('#majorInfoBodyItem').html(_html);
                  
                  if(data.needPage){
                      utils.paginationPage($('#majorInfoListPageItem'), data.totalPage, parseInt(data.curPage-1), enrollPlanItem.getMajorList,true);
                  }
                
              },
              error: function(data){
                  //alert("服务器发生错误");
              }
          });
      }

  }

//单个专业
  function getCompareReports() {
	  var cityName=$("#cityName_2").val(),batch=$("#batch_2").val(),type=$("#enrollType_2").val(),scienceClass=$("#science_2").val(),majorName=$("#major_lm").val(),year=$("#year_lm").val();
      clean("#majorCompareList");
      var param = $.trim($("#form2").find("select[name='cityName']").val());
      if(param == null || param == '') {
          return false;
      }
      param = year;
      if(param == null || param == '') {
          return false;
      }
      var params={};
        params['year']=year;
	  	params['cityName']=cityName;
	  	params['batch']=batch;
	  	params['type']=type;
	  	params['scienceClass']=scienceClass;
	  	params['majorName']=majorName;
//      param = $.trim($("#form2").find("select[name='scienceClass']").val());
//      if(param == null || param == '') {
//          return false;
//      }
//      param = $.trim($("#form2").find("select[name='type']").val());
//      if(param == null || param == '') {
//          return false;
//      }
//      param = $.trim($("#form2").find("select[name='batch']").val());
//      if(param == null || param == '') {
//          return false;
//      }
      //if (!majorCompareLineChart) {
      	  majorCompareLineChart = echarts.init($('#majorCompareLineChart')[0]);
          window.onresize = majorCompareLineChart.resize;
      //}

      // 过渡---------------------
      majorCompareLineChart.showLoading({
          text : '正在努力的读取数据中...', // loading话术
          effect : 'whirling'
      });
      $.post('/front/enroll/findMajorScoreCompareList', params, function(data) {
          var _majors = new Array();
          var _avgScore = new Array();

          if (data && data.length > 0) {
              $(data).each(function() {
                  addMajorRow("#majorCompareList", this);
                  _majors.push(this.majorName);
                  if(this.avgScore != null && this.scoreLine != null) {
                      _avgScore.push((this.avgScore-this.scoreLine).toFixed(0));
                  }
              });
              if (_majors) {
                  // 加载图标
                  loadChart(majorCompareLineChart, _majors, _avgScore, '平均分分差', 'bar');
              }
          } else {
              // 过渡---------------------
              majorCompareLineChart.showLoading({
                  text : '无数据', // loading话术
                  effect : 'bubble'
              });
          }

      });
  }
  //专业跳转
  function toEnrollMajor(cityName,batch,type,science,majorName){
	  $(".cur_major_name").html(majorName);
  	  clean("#singleMajorList");
      if(majorLineChart) {
          majorLineChart.clear();
      }
    var params = {};
    //params['year']=year;
    //$("#year_lm").val(null);
    $("#major_zlm").val(majorName);
	params['cityName']=cityName;
	params['batch']=batch;
	params['type']=type;
	params['scienceClass']=science;
	params['majorName']=majorName;
  	
     // if (!majorLineChart) {
          majorLineChart = echarts.init($('#majorLineChart')[0]);
          window.onresize = majorLineChart.resize;
      //}
   
      // 过渡---------------------
      majorLineChart.showLoading({
          text : '正在努力的读取数据中...', // loading话术
          effect : 'whirling'
      });
      $.post('/front/enroll/findMajorScoreList',params, function(data) {
          var _years = new Array();
          var _avgScore = new Array();

          if (data && data.length > 0) {
              $(data).each(function() {
                  addMajorRow("#singleMajorList", this);
                  if(this.avgScore && this.scoreLine){
                	  _years.push(this.year);
                	  _avgScore.push((this.avgScore-this.scoreLine).toFixed(0));
                  }
              });
              if (_years) {
            	  $("#lablelm1").html("单个专业纵向列表");
            	  $("#lablelm2").html("单个专业录取纵向走势图");
                  // 加载图标
                  loadChart(majorLineChart, _years.reverse(), _avgScore.reverse(), '平均分分差', 'line');
              }
              
          } else {
              // 过渡---------------------
              majorLineChart.showLoading({
                  text : '无数据', // loading话术
                  effect : 'bubble'
              });
          }
          $(".major-con").show();
      });
      window.location.href="#mAvgReports";
  }
  function getAvgReports() {
	  var cityName=$("#cityName_2").val(),batch=$("#batch_2").val(),type=$("#enrollType_2").val(),scienceClass=$("#science_2").val(),majorName=$("#major_zlm").val(),year=$("#year_lm").val();
	  $(".cur_major_name").html(majorName);
  	  clean("#singleMajorList");
      if(majorLineChart) {
          majorLineChart.clear();
      }
    var params = {};
 /*  	var param = $.trim($("#form1").find("select[name='cityName']").val());
  	if(param == null || param == '') {
  		return false;
  	} */
    params['year']=year;
	params['cityName']=cityName;
	params['batch']=batch;
	params['type']=type;
	params['scienceClass']=scienceClass;
	params['majorName']=majorName;
  	
     // if (!majorLineChart) {
          majorLineChart = echarts.init($('#majorLineChart')[0]);
          window.onresize = majorLineChart.resize;
      //}
   
      // 过渡---------------------
      majorLineChart.showLoading({
          text : '正在努力的读取数据中...', // loading话术
          effect : 'whirling'
      });
      $.post('/front/enroll/findMajorScoreList',params, function(data) {
          var _years = new Array();
          var _avgScore = new Array();

          if (data && data.length > 0) {
              $(data).each(function() {
                  addMajorRow("#singleMajorList", this);
                  if(this.avgScore && this.scoreLine){
                	  _years.push(this.year);
                	  _avgScore.push((this.avgScore-this.scoreLine).toFixed(0));
                  }
              });
              if (_years) {
                  // 加载图标
                  loadChart(majorLineChart, _years.reverse(), _avgScore.reverse(), '平均分分差', 'line');
              }
              
          } else {
              // 过渡---------------------
              majorLineChart.showLoading({
                  text : '无数据', // loading话术
                  effect : 'bubble'
              });
          }
          $(".major-con").show();
      });

  }
  
function loadChart(myChart, _cats, _avgScore, title, chartType) {
    var _this = this;
    myChart.hideLoading();
    var ser = [];
    var leg = {};
    ser[0] = {
            name : title,
            type : chartType,
            data : _avgScore,
            smooth : true,//平滑
            itemStyle : {
                normal : {
                    label : {
                        show : true,
                        position : 'top',
                        formatter : '{c}'
                    }
                }
            }/* ,
            textRotation : 90 */
        };
    if(chartType == 'line') {
    	ser[0]['symbol'] = 'circle';
    }
    leg = {data:[title]};
    
    var option = {
        legend : leg,
        tooltip : {
            trigger : 'axis'
        },
        toolbox : {
            show : true,
            feature : {
/*                     restore : {
                    show : true
                },
                saveAsImage : {
                    show : true
                }
*/                }
        },
        calculable : false,
        xAxis : [ {
            type : 'category',
            boundaryGap : false,
            data : _cats,
            axisLabel : {
            	rotate : 45,
            	
            }
        } ],
        yAxis : [ {
            type : 'value',
            position : 'top',
            axisLabel : {
                formatter : '{value}'
            }
        } ],
        series : ser
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
}
function addMajorRow(id, obj) {
	//majorCompareList
	var tr = '<tr class="row_data">';
	if(id && id.indexOf("majorCompareList")>-1){
		tr += '<td style="width:120px"><a onclick="toEnrollMajor(&quot;' + obj.cityName + '&quot;,&quot;' + obj.batch + '&quot;,&quot;' + obj.type + '&quot;,&quot;'+obj.scienceClass+'&quot;,&quot;'+obj.majorName+'&quot;)">' + obj.majorName + '</a></td>';
	}else{
		tr += '<td style="width:120px">' + obj.majorName + '</td>';
	}
    tr += '<td>' + obj.year + '</td>';
    tr += '<td>' + obj.batch + '</td>';
    tr += '<td>' + (obj.scoreLine ? obj.scoreLine : '-' ) + '</td>';
//    tr += '<td>' + (obj.enrollPlan && parseInt(obj.enrollPlan) != 0 ? obj.enrollPlan : '-' ) + '</td>';
//    tr += '<td>' + (obj.enrollNum ? obj.enrollNum : '-' ) + '</td>';
    tr += '<td>' + (obj.lowScore!=null ? parseInt(obj.lowScore) : '-') + '</td>';
    tr += '<td>' + (obj.avgScore!=null ? parseInt(obj.avgScore) : '-') + '</td>';
    tr += '<td>' + (obj.hightScore!=null ? parseInt(obj.hightScore) : '-') + '</td>';
    tr += '<td>' + ((obj.lowScore == null || obj.scoreLine == null) ? '-' : parseInt(obj.lowScore - obj.scoreLine)) + '</td>';
    tr += '<td>' + ((obj.avgScore == null || obj.scoreLine == null) ? '-' : parseInt(obj.avgScore - obj.scoreLine)) + '</td>';
    tr += '<td>' + (obj.remark ? obj.remark : '') + '</td>';
	tr += '</tr>';
	$(id).append(tr);
}
function clean(id) {
	$(id).find(".row_data").remove();
}
function getMajorCityChange(city,index,callback,majorId){
  	$.ajax({
          type: "POST",
          url: "/front/enroll/getEnrollPlanSelectChange",
          data: {'cityName':city}
        }).done(function (data) {
      	  if(data){
      		  var scienceList = data.scienceList;
      		  if(scienceList){
      			  var science = $("#science_"+index);
      			  science.empty();
                  /*science.append("<option value=''>全部</option>");*/
      			  $.each(scienceList,function(i,v){
      				  science.append("<option value='"+v+"'>"+v+"</option>");
      			  });
      		  }
   			  var yearList = data.yearList;
       		  if(yearList && yearList.length > 0){
       			  var year = $("#year_"+index);
       			  yearList.sort(function(a,b){
       				  return b - a;
       			  });
       			  year.empty();
       			  $.each(yearList,function(i,v){
       				    year.append("<option value='"+v+"'>"+v+"</option>");
       			  });
       		  }
      		  var batchList = data.batchList;
      		  if(batchList){
                  var batch = $("#batch_"+index);
                  $("#batch_"+index).val('');
                  batch.find('option').hide();
                  $.each(batchList,function(i,v){
                      batch.find('option[value="'+v+'"]').show();
                  });
                  batch.val(batch.find('option:first').val());
      		  }
      		  var typeList = data.typeList;
      		  if(typeList){
      			  var type = $("#enrollType_"+index);
      			  type.empty();
                  /*type.append("<option value=''>全部</option>");*/
      			  $.each(typeList,function(i,v){
      				  type.append("<option value='"+v+"'>"+v+"</option>");
      			  });
      		  }
      		  
      		 batchChange(index,callback,majorId)
      	  }
        });
  }
  
  function batchChange(index,callback,majorId){
  	if(index == 1){
  		callback();
  		return;
  	}
  	var year="";
  	if(majorId&&majorId.indexOf("lm")>-1){
  		year=$("#year_lm").val();
  		changeMajorSelect(year,callback,majorId)
  	}else if(majorId&&majorId.indexOf("jm")>-1){
  		year=$("#year_jm").val();
  		changeMajorSelect(year,callback,majorId)
  	}else{
  		changeMajorSelect($("#year_lm").val(),getAvgReports,"#major_zlm");
  		changeMajorSelect($("#year_jm").val(),enrollPlanItem.init,"#major_jm");
  	}
  	
  }
  function changeMajorSelect(year,callback,majorId){
	  $.ajax({
          type: "POST",
          url: "/front/enroll/getEnrollPlanSelectChange",
          data: {cityName:$("#cityName_2").val(),science:$("#science_2").val(),
        	  enrollType:$("#enrollType_2").val(),batch:$("#batch_2").val(),
        	  year:year}
        }).done(function (data) {
        	 var majorName = $(majorId);
  			  majorName.empty();
  			  majorName.append("<option value=''>请选择</option>");
	      	  if(data){
		       		  var majorList = data.majorList;
		       		  if(!isMajorPass && majorList){
		       			var preVal = "";
		       			if(majorId&&majorId.indexOf("#")>-1){
		       				 preVal = $.trim($(majorId).val());	
		       			}
		       			 
		       			  $.each(majorList,function(i,v){
		       				  if(v == preVal ){
		       					  majorName.append("<option value='"+v+"' selected>"+v+"</option>");
		       				  }else if(majorId&& majorId.indexOf("lm")>-1 && i==0){
		       					majorName.append("<option value='"+v+"' selected>"+v+"</option>");
		       				  }else{
		       					 majorName.append("<option value='"+v+"'>"+v+"</option>"); 
		       				  }
		       			  });
		       		  }
	      	  }
      	callback();
        });  
  }
  function yearChange(params,index,callback,majorId){
	  batchChange(index,callback,majorId);
	  	/*$.ajax({
	          type: "POST",
	          url: "/front/enroll/getEnrollPlanSelectChange",
	          data: params
	        }).done(function (data) {
	      	  if(data){
	      		  var scienceList = data.scienceList;
	      		  if(scienceList){
	      			  var science = $("#science_"+index);
	      			  science.empty();
	                  science.append("<option value=''>全部</option>");
	      			  $.each(scienceList,function(i,v){
	      				  science.append("<option value='"+v+"'>"+v+"</option>");
	      			  });
	      		  }
	      		  var batchList = data.batchList;
	      		  if(batchList){
	                  var batch = $("#batch_"+index);
	                  $("#batch_"+index).val('');
	                  batch.find('option').hide();
	                  batch.find('option[value=""]').show();
	                  $.each(batchList,function(i,v){
	                      batch.find('option[value="'+v+'"]').show();
	                  });
	                  batch.val(batch.find('option:first').val());
	      		  }
	      		  var typeList = data.typeList;
	      		  if(typeList){
	      			  var type = $("#enrollType_"+index);
	      			  type.empty();
	                  type.append("<option value=''>全部</option>");
	      			  $.each(typeList,function(i,v){
	      				  type.append("<option value='"+v+"'>"+v+"</option>");
	      			  });
	      		  }
	      		batchChange(index,callback);
	      	  }
	      	  
	        });*/
	  }
	  
	  function scienceChange(params,index,callback,majorId){
	  	$.ajax({
	          type: "POST",
	          url: "/front/enroll/getEnrollPlanSelectChange",
	          data: params
	        }).done(function (data) {
	      	  if(data){
	      		  var batchList = data.batchList;
	      		  if(batchList){
	                  var batch = $("#batch_"+index);
	                  $("#batch_"+index).val('');
	                  batch.find('option').hide();
	                  batch.find('option[value=""]').show();
	                  $.each(batchList,function(i,v){
	                      batch.find('option[value="'+v+'"]').show();
	                  });
	                  batch.val(batch.find('option:first').val());
	      		  }
//	      		  var typeList = data.typeList;
//	      		  if(typeList){
//	      			  var type = $("#enrollType_"+index);
//	      			  type.empty();
//	                  type.append("<option value=''>全部</option>");
//	      			  $.each(typeList,function(i,v){
//	      				  type.append("<option value='"+v+"'>"+v+"</option>");
//	      			  });
//	      		  }
	      		  batchChange(index,callback,majorId);
	      	  }
	        });
	  } 
	  function getAvgReports2() {
		  var cityName=$("#cityName_2").val(),batch=$("#batch_2").val(),type=$("#enrollType_2").val(),scienceClass=$("#science_2").val(),majorName=$("#majorName_lm").val(),year=$("#year_ls").val();
	        clean("#schoolParamList");
	        var param = $.trim($("#form2").find("select[name='cityName']").val());
	        if(param == null || param == '') {
	            return false;
	        }
	       /* param = $.trim($("#form2").find("select[name='science_2']").val());
	        if(param == null || param == '') {
	            return false;
	        }*/

	        // if (!schoolLineChart) {
	        schoolLineChart = echarts.init($('#schoolLineChart')[0]);
	        window.onresize = schoolLineChart.resize;
	        //}
	        var params={};
	        params['year']=year;
	    	params['cityName']=cityName;
	    	params['batch']=batch;
	    	params['type']=type;
	    	params['scienceClass']=scienceClass;
	    	params['majorName']=majorName;
	        // 过渡---------------------
	        schoolLineChart.showLoading({
	            text : '正在努力的读取数据中...', // loading话术
	            effect : 'whirling'
	        });
	        $.post('/front/enroll/findSchoolEnrollList', params, function(data) {
	            var _years = new Array();
	            var _avgScore = new Array();
	            var _minScore = new Array();

	            if (data && data.length > 0) {
	                $(data).each(function() {
	                    addMajorRow2("#schoolParamList", this);
	                  
	                    if(this.score != null) {
	                        if(this.avgScore != null) {
	                        	  _years.push(this.year);
	                            _avgScore.push((this.avgScore-this.score).toFixed(0));
	                        }
	                        var min = this.lowScore ? this.lowScore : this.minScore;
	                        if(min != null) {
	                            _minScore.push((min-this.score).toFixed(0));
	                        }
	                    }
	                });
	                if (_years) {
	                    // 加载图标
	                    loadChart2(schoolLineChart, _years.reverse(), _avgScore.reverse(), _minScore.reverse(), '学校录取平均分分差走势图');
	                }
	            } else {
	                // 过渡---------------------
	                schoolLineChart.showLoading({
	                    text : '无数据', // loading话术
	                    effect : 'bubble'
	                });
	            }

	        });
	    }
	    function loadChart2(myChart, _cats, _avgScore, _minScore, title) {
	        var _this = this;
	        myChart.hideLoading();
	        var ser = [];
	        var leg = {};
	        ser[0] = {
	            name : '最低分分差',
	            type : 'line',
	            data : _avgScore,
	            itemStyle : {
	                normal : {
	                    label : {
	                        show : true,
	                        position : 'top',
	                        formatter : '{c}分'
	                    }
	                }
	            }/* ,
				 textRotation : 90 */
	        };
	        ser[1] = {
	            name : '平均分分差',
	            type : 'line',
	            data : _minScore,
	            itemStyle : {
	                normal : {
	                    label : {
	                        show : true,
	                        position : 'top',
	                        formatter : '{c}分'
	                    }
	                }
	            }/* ,
				 textRotation : 90 */
	        };
	        leg = {data:['最低分分差', '平均分分差']};

	        var option = {
	            title : {
	                subtext : '学校录取平均分分差走势图'
	            },
	            legend : leg,
	            tooltip : {
	                trigger : 'axis'
	            },
	            toolbox : {
	                show : true,
	                feature : {
						/*                     restore : {
						 show : true
						 },
						 saveAsImage : {
						 show : true
						 }
						 */                }
	            },
	            calculable : false,
	            xAxis : [ {
	                type : 'category',
	                boundaryGap : false,
	                data : _cats
	            } ],
	            yAxis : [ {
	                type : 'value',
	                position : 'top',
	                axisLabel : {
	                    formatter : '{value}'
	                }
	            } ],
	            series : ser
	        };

	        // 为echarts对象加载数据
	        myChart.setOption(option);
	    }

	    function addMajorRow2(id, obj) {
	        var tr = '<tr class="row_data">';
	        tr += '<td>' + obj.year + '</td>';
//	        tr += '<td>' + obj.scienceClass + '</td>';
	        tr += '<td>' + obj.type + '</td>';
	        tr += '<td>' + obj.batch + '</td>';
	        tr += '<td>' + (obj.score?obj.score : '-') + '</td>';
//	        tr += '<td>' + (obj.enrollPlan && parseInt(obj.enrollPlan) != 0 ?obj.enrollPlan : '-') + '</td>';
//	        tr += '<td>' + (obj.enrollNum?obj.enrollNum : '-') + '</td>';
	        var min = obj.lowScore ? obj.lowScore : obj.minScore;
	        tr += '<td>' + (min?parseInt(min) : '-') + '</td>';
	        tr += '<td>' + (obj.avgScore?parseInt(obj.avgScore) : '-') + '</td>';
	        tr += '<td>' + parseInt(obj.hightScore) + '</td>';
	        tr += '<td>' + (min != null && obj.score != null ? (parseInt(min - obj.score)) : '-') + '</td>';
	        tr += '<td>' + (obj.avgScore != null && obj.score != null ? (parseInt(obj.avgScore - obj.score)) : '-')  + '</td>';
	        tr += '</tr>';
	        $(id).append(tr);
	    }