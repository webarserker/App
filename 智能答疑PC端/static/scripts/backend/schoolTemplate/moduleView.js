$(function(){
	loadPage();
})
//信息加载
function loadPage(){
	var templateId=$("#templateId").val();
	var templateKey=$("#templateKey").val();
	var imgServer=$("#imgServer").val();
	//动态加载模板结构
	$.post("/frontTemplate/findModules",{templateId:templateId,needPage:false},function(res){
		if(res && res.data){
		  var data = res.data;
		  var currow;
		  var prerow;
		  var html='';
		  var n=1;
		  for(var i=0;i<= data.length;i++){
			  var content=''; 
			  if(i < data.length){
				  currow=data[i].row; 
				  if(data[i].moduleType && data[i].moduleType == 8){
					  content='<div class="col_'+currow+'" ><div class="div-box" style="'+ data[i].moduleStyle +';background: url(' + (imgServer+data[i].moduleImg) + ')  center no-repeat;">'
					  +'<strong>' + (data[i].alias?data[i].alias:data[i].name) + '</strong>'
					  +'</div></div>'; 
				  }else{
					  content='<div class="col_'+currow+'"><div class="div-box" style="'+ data[i].moduleStyle +'">'
					  +'<strong>' + (data[i].alias?data[i].alias:data[i].name) +'</strong>'
					  +'<a class="btn btn-primary btn-sm"  onclick="relativeInfo(&quot;'+data[i].id+'&quot;,&quot;'+data[i].name+'&quot;,&quot;'+data[i].keyNum+'&quot;)"  style="float:right;border-radius: 10px;"><i class="ace-icon fa fa-pencil align-top bigger-125"></i>'+(data[i].moduleType ==4 || data[i].moduleType ==5 ||data[i].moduleType ==6 ||data[i].data?'编辑数据':'绑定数据')+'</a>'
					  +'<a class="btn btn-primary btn-sm"  onclick="schoolModuleConfig(&quot;'+data[i].id+'&quot;,&quot;'+data[i].name+'&quot;,&quot;'+data[i].keyNum+'&quot;)"  style="float:right;border-radius: 10px;"><i class="ace-icon fa fa-pencil align-top bigger-125"></i>模块设置</a>'
					  +'</div></div>';   
				  }
			  }else{
				  currow='';
			  }
			  if(currow == prerow){
				  html+=content;  
				  n++;
			  }else{
				  var rep='col_'+prerow;
				  if(i == data.length){
					  html+='</div>'; 
					  var col='col-xs-'+12/n+' col-md-'+12/n;
					  html=html.replace(new RegExp(rep,"gm"),col);
				  }else if(i == 0){
					  html+=('<div class="row show-grid " >'+content );	  
				  }else{
					  html+=('</div><div class="row show-grid " >'+content );	 
					  var col='col-xs-'+12/n+' col-md-'+12/n;
					  html=html.replace(new RegExp(rep,"gm"),col);
				  }
				  n=1;
			  }
			  prerow=currow;
		  }
	
		$(".container-fluid").html(html);
		}
	},"json")
	
}
//信息绑定
var editDialog;
function relativeInfo(id,title,moduleKey){
	var templateKey=$("#templateKey").val();
	parent.window.toPage("/schoolTemplate/manage/toMaintenanceInfo?templateKey="+templateKey+"&moduleKey="+moduleKey,title,moduleKey+id);
	/*editDialog = $.dialog({
	        lock: true,
	        title : title,
	        content : "url:"+"/schoolTemplate/manage/toMaintenanceInfo?templateKey="+templateKey+"&moduleKey="+moduleKey,
	        width:1250,
	        height: 600,
	        drag: true,
	        resize: true,
	        icon: 'alert.gif'
	    });*/

}
function schoolModuleConfig(id,title,moduleKey){
	var templateKey=$("#templateKey").val();
	$.dialog({
        lock: true,
        title : title,
        content : "url:"+"/schoolTemplate/manage/toUpdateSchoolModule?templateKey="+templateKey+"&moduleKey="+moduleKey,
        width:500,
        height: 300,
        drag: true,
        resize: true,
        icon: 'alert.gif'
    });
}