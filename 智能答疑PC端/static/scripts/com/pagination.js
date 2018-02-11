/**
 * 系统分页模块
 */
paginationSys = {
		
		pageStyle : {
			firstClass : 'first',				//首页链接样式
			lastClass : 'last',					//末页链接样式
			prevClass : 'prev',					//上一页链接样式
			nextClass : 'next',					//下一页链接样式
			currentClass : 'current',			//当前页链接样式
			nocurrentClass : 'no_current',		//非当前页链接样式
			firstAndLastLink : true				//是否显示首页末页链接
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
		turnPage : function(dest , pageCount , pageNo , cb , pageBar , preNum , allNum){
			if(!preNum)
				//preNum = 4;
				preNum = 2;
			if(!allNum)
				//allNum = 8;
				allNum = 4;

			if(pageCount <= pageNo){
				if(pageCount == 0 || pageNo < 0){
					dest.html('<div>暂无数据</div>');
				}else{
					cb(pageNo - 1);
				}
				return false;
			}
			var page = '';
			var pageNo = pageNo;
			dest.html('');
		    if(pageCount > 1){
		        if(pageNo > 0){
		        	if(paginationSys.pageStyle.firstAndLastLink){
		        		page += '<a href="javascript:void(0);" class="'+paginationSys.pageStyle.firstClass+'"><<首页</a>';
		        	}
		            page += '<a href="javascript:void(0);" class="'+paginationSys.pageStyle.prevClass+'">&lt;上一页</a>';
		        }
		        var _sidx = (pageNo - preNum >= 0 ? (pageNo - preNum) : 0);
		        var _eidx = ((_sidx + allNum) < pageCount ? (_sidx + allNum) : (pageCount-1));
		        if((_eidx - _sidx) < allNum ){
		        	_sidx = _eidx - allNum;
		        	if(_sidx < 0){
		        		_sidx = 0;
		        	}
		        }
		        for(var i= _sidx; i <= _eidx; i++){
		            if(i == pageNo){ 
		                page += '<a href="javascript:void(0);" class="'+paginationSys.pageStyle.currentClass+'" pageIndex="'+(i+1)+'">'+(i+1)+'</a>';
		            }else{
		                page += '<a href="javascript:void(0);" class="'+paginationSys.pageStyle.nocurrentClass+'" pageIndex="'+(i+1)+'">'+(i+1)+'</a>';
		            }
		        }
		        if(pageNo < (pageCount-1)){
		            page += '<a href="javascript:void(0);" class="'+paginationSys.pageStyle.nextClass+'">下一页&gt;</a>';
		            if(paginationSys.pageStyle.firstAndLastLink){
		        		page += '<a href="javascript:void(0);" class="'+paginationSys.pageStyle.lastClass+'">末页>></a>';
		        	}    
		        }
		        if(pageBar){
		        	page+='共'+pageCount+'页　到第 <input type="text"  class="pageBarText" /> 页  <input type="button" value="跳转" class="btnGo" id="paginationGo" />';
		        }
		    }
		    dest.html(page);
		    if(page){
		    	paginationSys.bindBtn(dest , pageNo , cb , pageCount);
		    }
		},
		
		bindBtn : function(dest , pageNo , cb , pageCount){
			
			dest.find('.first').click(function(){
				cb(0);
			});
			
			dest.find('.prev').click(function(){
				cb(pageNo - 1);
			});
			
			dest.find('.next').click(function(){
				cb(pageNo + 1);
			});
			
			dest.find('.last').click(function(){
				cb(pageCount - 1);
			});
			
			dest.find('.no_current').click(function(e){
				var _cell = $(e.target);
				var value = parseInt(_cell.attr("pageIndex"));
				cb(value - 1);
			});
			
			/**
			 * 判断输入框中是否有值　：
			 * １　：　合法的数字，判断是否为>1 , < pageCount , 如果满足不处理　，　否则默认１
			 * ２  :   非合法数据，直接赋值''
			 * 
			 * 判断当前的键盘时间，如果为回车，调用查询回调动作。
			 */
			dest.find('.pageBarText').keyup(function(e){
				var keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode; 
				var _val = $(this).val();
				if(keyCode == 13 && _val != "" && !isNaN(_val)){
					cb(_val - 1);
				}else{
					$(this).val(_val.replace(/\D/g,''));//移除非数字
					if(_val==0 || _val<=0){
						$(this).val('');
					}else if(_val>pageCount){
						$(this).val(pageCount);
					}else if(_val<=pageCount && _val>0){
					}else{
						$(this).val('');
					}
					
				}
					
			});
		 dest.find('#paginationGo').click(function(){
			 	var _val = dest.find('.pageBarText').val();
				if(_val != "" && !isNaN(_val)){
					cb(_val - 1);
				}
		 });
		}
};