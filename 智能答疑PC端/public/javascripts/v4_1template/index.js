/**
 * Created by liuyang on 2017/7/24.
 */
function urlParse(){
    var url = window.location.search;
    var obj = {};
    var reg = /[?&][^?&]+=[^?&]+/g;
    var arr = url.match(reg);
    if (arr) {
        for(var i=0;i<arr.length;i++){
            var tempArr=arr[i].substring(1).split('=');
            var key = decodeURIComponent(tempArr[0]);
            var val = decodeURIComponent(tempArr[1]);
            obj[key] = val;
        }
    }
    return obj;
}

