var env = 'test'
var hostObj = {
	test: {
		host: 'http://wenda.zhinengdayi.com',
		// 图片
		hostImg: 'http://wendatestimg.zhinengdayi.com',
		// 学校logo
		hostSchoolLogo: 'http://testimg.zhinengdayi.com:8081',
		// 跳转招生
		hostZS: 'http://test.rocklee.com.cn/build/index.html',
		hostWx: 'http://test.rocklee.com.cn/weixin/index?from=wenda',
		hostQq: 'http://test2.rocklee.com.cn:8080/front/user/qqLogin?systemId=2',
	},
	prod: {
		host: 'http://wenda.zhinengdayi.com',
		// 图片
		hostImg: 'http://wendatestimg.zhinengdayi.com',
		// 学校logo
		hostSchoolLogo: 'http://testimg.zhinengdayi.com:8081',
		// 跳转招生
		hostZS: 'http://test.rocklee.com.cn/build/index.html',
		hostWx: 'http://test.rocklee.com.cn/weixin/index?from=wenda',
		hostQq: 'http://test2.rocklee.com.cn:8080/front/user/qqLogin?systemId=2',
	}
}[env]
export const state = {
	// 接口
	// host:'http://slwsfs.imwork.net',
	host: hostObj.host,
	// 图片
	hostImg: hostObj.hostImg,
	// 学校logo
	hostSchoolLogo: hostObj.hostSchoolLogo,
	// 跳转招生
	hostZS: hostObj.hostZS,
	hostWx: hostObj.hostWx,
	hostQq: hostObj.hostQq,
	baseUrl:'/weixin/api',
	isLoading:false,
	isLogin:window.localStorage.getItem('isLogin')?window.localStorage.getItem('isLogin'):false,
	//登陆后跳转的路由
	loginNextRouter:'/',
	// 是否有未读消息
	hasNews:false,

	userId:window.localStorage.getItem('userId')?window.localStorage.getItem('userId'):'',
	userName: window.localStorage.getItem('userName'),
	userInfo: window.localStorage.getItem('userinfo')?JSON.parse(window.localStorage.getItem('userinfo')):{isTopicAdmin:0},
	
	defaultPhoto: require('../img/userphoto.png'),
	
	searchHistory:window.localStorage.getItem('searchHistory')?JSON.parse(window.localStorage.getItem('searchHistory')):[],
	
	sCode:'',
	departmentId: '',
	majorId: '',
	subscribeList:[]
}
