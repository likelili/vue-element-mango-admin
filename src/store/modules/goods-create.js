export default{
	state:{
		form :{
			title:"",
			category:'',
			desc:'',
			price:0.00,
			order:0,
			cover:'',
			banners:[/*{
				id:'1',
				src:"https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
			},
			{
				id:'2',
				src:"https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
			}*/]
		}
	},
	getters:{
		
	},
	mutations:{
		// 修改state
		changeModelState(state,{key,value}){
			state.form[key] = value
		}
	},
	actions:{
		
	}
}