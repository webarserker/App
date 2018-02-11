var dateParamsUtil = {
    initDatePicker : function(ele, now, callback, format){
        // ele.val(+"至"+now);
        if(format == null || format == undefined){
            format = 'YYYYMMDD';
        }
        ele.val(moment().subtract(6, 'days').format(format) + '至' + moment().format(format));
        ele.daterangepicker({
            "ranges": {
                "今天": [now, now],
                "昨天": [dateUtils.dateAdd('d', -1, now), dateUtils.dateAdd('d', -1, now)],
                "最近一周": [dateUtils.dateAdd('d', -6, now), now],
                "最近一个月": [dateUtils.dateAdd('m', -1, now), now],
                "最近三个月": [dateUtils.dateAdd('m', -3, now), now]
            },
            "locale": {
                "format": format,
                "separator": "至",
                "applyLabel": "确定",
                "cancelLabel": "取消",
                "fromLabel": "从",
                "toLabel": "至",
                "customRangeLabel": "自定义",
                "weekLabel": "周",
                "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
                "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                "firstDay": 1
            },
            "startDate": moment().subtract(6, 'days'),
            "endDate": moment(),
            "maxDate": moment(),
            "opens": "right"
        }, function (start, end, label) {
            //console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
        }).on('apply.daterangepicker', function () {
            dateParamsUtil.fillDate(ele, format);
            if(callback) {
                callback();
            }
        });
        dateParamsUtil.fillDate(ele, format);
    },

    fillDate : function(ele, format){
        var dateRange = $.trim($(ele).val());
        if (dateRange != '') {
            if(format == 'YYYYMMDD'){
                $(ele).parent().find(".startDateHid").val(dateRange.substring(0, 8));
                $(ele).parent().find(".endDateHid").val(dateRange.substring(9, 17));
            }else if(format == 'YYYY-MM-DD'){
                $(ele).parent().find(".startDateHid").val(dateRange.substring(0, 10));
                $(ele).parent().find(".endDateHid").val(dateRange.substring(11, 21));
            }
        }
    },
}