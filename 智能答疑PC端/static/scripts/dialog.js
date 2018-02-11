function showDialog(id, url, title, width, height, cancelBtnTxt, onCancel, data, isX, isMax, btnBar) {
    var DG = new J.dialog({
        id: id,
        page: url,
        title: title,
        width: (width || undefined != width) ? width : 400,
        height: (height || undefined != height) ? height : 400,
        cancelBtnTxt: (cancelBtnTxt || cancelBtnTxt != undefined) ? cancelBtnTxt : "关闭",
        onCancel: onCancel,
        iconTitle: false,
        //lockScroll:false,
        //fixed:true,
        cover: true,
        rang: true,
        lock: true,
        args: data,
        maxBtn: (((typeof(isMax) != "undefined") == true && isMax == true) || typeof(isMax) == "undefined") ? true : false,
        xButton: (((typeof(isX) != "undefined") == true && isX == true) || typeof(isX) == "undefined") ? true : false,
        btnBar: (((typeof(btnBar) != "undefined") == true && btnBar == true) || typeof(btnBar) == "undefined") ? true : false
    });
    DG.ShowDialog();
};

function edit(url, title, width, height, btnBar, closeFun, isX, isMax) {
    if (typeof closeFun != "function") closeFun = null;
    showDialog("edit", url, title, width, height, "关闭", closeFun, null, isX, isMax, btnBar);
}