//图片上传预览    IE是用了滤镜。
function previewImage(file,id,divId,pathId)
{
    var MAXWIDTH  = 260;
    var MAXHEIGHT = 180;
    var UGLY_WIDTH = 80;
    var UGLY_HEIGHT = 80;
    var div = document.getElementById(divId);
    if (file.files && file.files[0])
    {
        //document.getElementById(pathId).value=getPath(file);
//        div.innerHTML ='<img id='+id+'>';
        div.innerHTML ='<img id='+id+' width= ' + UGLY_WIDTH + ' height = ' + UGLY_HEIGHT + '>';
        var img = document.getElementById(id);
        img.onload = function(){
            var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
            img.width  =  rect.width;
            img.height =  rect.height;
//                 img.style.marginLeft = rect.left+'px';
//            img.style.marginTop = rect.top+'px';
        }
        var reader = new FileReader();
        reader.onload = function(evt){img.src = evt.target.result;}
        reader.readAsDataURL(file.files[0]);
    }
    else //兼容IE
    {
        var sFilter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
        file.select();
        var src = document.selection.createRange().text;
//        div.innerHTML = '<img id='+id+'>';
        div.innerHTML ='<img id='+id+' width= ' + UGLY_WIDTH + ' height = ' + UGLY_HEIGHT + '>';
        var img = document.getElementById(id);
        img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
        var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
        status =('rect:'+rect.top+','+rect.left+','+rect.width+','+rect.height);
//        div.innerHTML = "<div id=divhead style='width:"+rect.width+"px;height:"+rect.height+"px;margin-top:"+rect.top+"px;"+sFilter+src+"\"'></div>";
        div.innerHTML = "<div id=divhead style='width:"+rect.width+"px;height:"+rect.height+"px;"+sFilter+src+"\"'></div>";
    }
}
function clacImgZoomParam( maxWidth, maxHeight, width, height ){
    var param = {top:0, left:0, width:width, height:height};
    if( width>maxWidth || height>maxHeight )
    {
        rateWidth = width / maxWidth;
        rateHeight = height / maxHeight;

        if( rateWidth > rateHeight )
        {
            param.width =  maxWidth;
            param.height = Math.round(height / rateWidth);
        }else
        {
            param.width = Math.round(width / rateHeight);
            param.height = maxHeight;
        }
    }

    param.left = Math.round((maxWidth - param.width) / 2);
    param.top = Math.round((maxHeight - param.height) / 2);
    return param;
}

function getPath(obj) {
    if (obj) {
        if (window.navigator.userAgent.indexOf("MSIE") >=1) {
            obj.select(); return document.selection.createRange().text;
        }
        else if (window.navigator.userAgent.indexOf("Firefox") >=1) {
            if (obj.files) {
                return obj.files.item(0).getAsDataURL();
            }
            return obj.value;
        }
        return obj.value;
    }

}
