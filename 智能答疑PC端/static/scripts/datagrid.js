var gridObj;
var dataGrid = {
	getFormatDate:function (date_obj,date_templet) {
			  var year,month,day,hour,minutes,seconds,short_year,full_month,full_day,full_day,full_hour,full_minutes,full_seconds;
			  if(!date_templet)date_templet = "yyyy-mm-dd hh:ii:ss";
			  year = date_obj.getFullYear().toString();
			  short_year = year.substring(2,4);
			  month = (date_obj.getMonth()+1).toString();
			  month.length == 1 ? full_month = "0"+month : full_month = month;
			  day = date_obj.getDate().toString();
			  day.length == 1 ? full_day = "0"+day : full_day = day;
			  hour = date_obj.getHours().toString();
			  hour.length == 1 ? full_hour = "0"+hour : full_hour = hour;
			  minutes = date_obj.getMinutes().toString();
			  minutes.length == 1 ? full_minutes = "0"+minutes : full_minutes = minutes;
			  seconds = date_obj.getSeconds().toString();
			  seconds.length == 1 ? full_seconds = "0"+seconds : full_seconds = seconds;
			  return date_templet.replace("yyyy",year).replace("mm",full_month).replace("dd",full_day).replace("yy",short_year).replace("m",month).replace("d",day).replace("hh",full_hour).replace("ii",full_minutes).replace("ss",full_seconds).replace("h",hour).replace("i",minutes).replace("s",seconds);
			},
	gridInit : function(id,url) {
		$.fn.bsgrid.defaults.stripeRows = false;
		gridObj = $.fn.bsgrid.init(id, {
			url : url,
			autoLoad: false,
			displayPagingToolbarOnlyMultiPages:false,
			displayBlankRows:false,
			pageSizeSelect : false,
			// pageAll: true
//			pagingLittleToolbar:true,
			pageSize : 30,
			complete : function() {$.authenticate("");},
            extend: {
                settings: {
                    supportGridEdit: true, // default false, if support extend grid edit
                    supportGridEditTriggerEvent: '', // default 'rowClick', values: ''(means no need Trigger), 'rowClick', 'rowDoubleClick', 'cellClick', 'cellDoubleClick'
                    gridEditConfigs: {
                        datetime: {// to display datetime format
                            build: function (edit, value, record, rowIndex, colIndex, tdObj, trObj, options) {
                            	var d = new Date();
                            	d.setTime(value);
                                return dataGrid.getFormatDate(d);
                            },
                            val: function (formObj) {
                                return formObj.val();
                            }
                        },
                        date: {// to display date format
                            build: function (edit, value, record, rowIndex, colIndex, tdObj, trObj, options) {
                            	var d = new Date();
                            	d.setTime(value);
                                return dataGrid.getFormatDate(d,"yyyy-mm-dd");
                            },
                            val: function (formObj) {
                                return formObj.val();
                            }
                        },
                        dictName: {// to display dictName
                            build: function (edit, value, record, rowIndex, colIndex, tdObj, trObj, options) {
                            	try {
                            		if (value.length == 0) return value;
                            		var dictmapObjectName = $($("#" + id + ">thead>tr>th").get(colIndex)).attr("dictmap");
                                	//var dictmap = $.parseJSON(dictmapStr);
                            		//var dictmap = eval(dictmapObjectName); 
                                	//var getDictName = dictmap["key"+value];
                                	//return getDictName;
                            		var opt = $("#"+dictmapObjectName).find("option[value='" + value + "']");
                            		if (opt) {
                            			return $(opt).text();
                            		}
                            	}catch (e) {
                            		
                            	}
                                return value;
                            },
                            val: function (formObj) {
                                return formObj.val();
                            }
                        }
                    }
                }
            }
		});
    },
    gridQuery: function(id,url,objArray,complete){
    		if(gridObj == null){
    			dataGrid.gridInit(id,url);
    		}
    		gridObj.options.otherParames = objArray;
		    if (complete) {
				gridObj.options.settings.complete = complete;
			}
    		gridObj.page(1);
    }
}
