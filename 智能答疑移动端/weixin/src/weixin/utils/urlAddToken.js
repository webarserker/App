import urlParse2 from './urlParse2.js'

export default function urlAddToken(href) {

    var spreadToken=sessionStorage.getItem('spreadToken');

    if(href.indexOf('spreadToken=')==-1){
        if(spreadToken){
            var url1=href.split('#')[1];
            if(url1.indexOf('?')==-1){
                return href+'?spreadToken='+spreadToken;
            }else{
                return href+'&spreadToken='+spreadToken;
            }
        }else{
            return href;
        }

    }else{
        var params=urlParse2();
        var currentToken=params.spreadToken;
        var newUrl=href.replace(currentToken,spreadToken)
        return newUrl;
    }
}