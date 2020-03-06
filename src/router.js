import Vue from "vue"
import Router from "vue-router"

import routes from "./common/config/router.js"
Vue.use(Router)

let router = new Router({
	routes
})


//全局前置守卫
router.beforeEach((to,from,next) => {
	//console.log(from)
	let token = window.sessionStorage.getItem('token')
	if(token){
		// 防止重复登录
		if(to.path === '/login') {
			Vue.prototype.$message.error('请勿重复登入')
			return next({name:from.name ? from.name : 'index'})
		}
		next();
	} 
	else 
	{
		// 跳过登录页验证
		if(to.path === '/login') {
			return next()
		}
		// 未登录
		Vue.prototype.$message.error('请先登入')
		next({path:'/login'})
	}
	
})

export default router
