import axios from 'axios'
import {state} from '../vuex/state.js'


/*保存用户访问记录的模块开发*/
export default function count(userProvince, userCity, sCode, pageUrl, infoId, majorId, viewSourceUrl) {
    return new Promise((resolve, reject) => {

        // axios.get(state.host + state.baseUrl + '/user/addUserViewLog' + '?userId='+(sessionStorage.uid?sessionStorage.uid:'')+'&userProvince=' + userProvince + '&userCity=' + userCity
        //     + '&sCode=' + sCode  + '&infoId=' + (infoId == null ? '' : infoId) + '&majorId=' + (majorId == null ? '' : majorId) + '&viewSourceUrl=' + (viewSourceUrl == null ? '' : encodeURIComponent(viewSourceUrl))+ '&pageUrl=' + encodeURIComponent(pageUrl))
        //     .then(function (res) {
        //         resolve(res)
        //     }).catch(function (err) {
        //     reject(err)
        // })

        axios.get(state.host + state.baseUrl + '/user/addUserViewLog' + '?userId='+(sessionStorage.uid?sessionStorage.uid:'')+'&userProvince=' + userProvince + '&userCity=' + userCity
            + '&sCode=' + sCode  + '&infoId=' + (infoId == null ? '' : infoId) + '&majorId=' + (majorId == null ? '' : majorId) + '&viewSourceUrl=' + encodeURIComponent(sessionStorage.getItem('viewSourceUrl'))+ '&pageUrl=' + encodeURIComponent(pageUrl))
            .then(function (res) {
                resolve(res)
            }).catch(function (err) {
            reject(err)
        })

    })
}