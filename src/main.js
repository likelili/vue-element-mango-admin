import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import './plugins/element.js'
import router from "./router.js"
import store from "./store"


import { Message } from 'element-ui'
let loading = null
let requestCount = 0
// 显示loading
function showLoading(){
	if(requestCount === 0){
		loading = Message({
			message: '加载中...',
			duration:0
		});
	}
	requestCount++
}
// 隐藏loading
function hideLoading(){
	if(requestCount > 0){
		requestCount--
	}
	if(loading && requestCount === 0){
		loading.close()
	}
}
axios.interceptors.request.use((config)=>{
	console.log(config)
	let token = window.sessionStorage.getItem('token')
	if(config.token === true){
		config.headers['token'] = token
	}
	// 显示loading
	if(config.loading === true){
		showLoading()
	}
	return config;
}, (error)=> {
	hideLoading()
	return Promise.reject(error);
});

axios.interceptors.response.use((response)=>{
	hideLoading()
	return response;
},(err)=> {
	if(err.response && err.response.data && err.response.data.code){
		Message.error(err.response.data.msg)
	}
	hideLoading()
	return Promise.reject(err);
});


import $conf from "./common/config/config.js"
Vue.prototype.$conf = $conf
Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')
