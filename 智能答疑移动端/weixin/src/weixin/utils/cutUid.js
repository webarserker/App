import urlParse2 from './urlParse2.js'

export default function cutUid() {
    var spreadToken = sessionStorage.getItem('spreadToken');
    var url0 = window.location.href.split('#')[0];
    var newUrl= url0 + (spreadToken ? '&spreadToken=' + spreadToken : '');
    return newUrl.replace('/build/index.html','/weixin/index')
}