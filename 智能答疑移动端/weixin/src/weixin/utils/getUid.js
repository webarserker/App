
export default function getUidObj() {
    let url = String(window.location.href).split('#/')[1];
    let obj = {};
    let reg = /[?&][^?&]+=[^?&]+/g;
    let arr = url.match(reg);
    if (arr) {
        arr.forEach((item) => {
            let tempArr = item.substring(1).split('=');
            let key = decodeURIComponent(tempArr[0]);
            let val = decodeURIComponent(tempArr[1]);
            obj[key] = val;
        })
    }
    return obj;
}
