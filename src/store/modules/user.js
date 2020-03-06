export default{
	state:{
		user:{
			
		},
		token:false
	},
	getters:{
		
	},
	mutations:{
		
		initUser(state){
			let user = window.sessionStorage.getItem('user')
			if(user) {
				state.user = JSON.parse(user)
				state.token = state.user.token
			}
		},
		
		
		login(state,user){
			// 
			state.user = user
			state.token = user.token
			// 保存到本地存储
			window.sessionStorage.setItem('user',JSON.stringify(state.user))
			window.sessionStorage.setItem('token',state.token)
		},
		
		// 退出登录
		logout(state){
			// 清除状态
			state.user = {}
			state.token = false
			// 清除本地存储
			window.sessionStorage.clear()
		}
		
		
	},
	actions:{
		
	}
}