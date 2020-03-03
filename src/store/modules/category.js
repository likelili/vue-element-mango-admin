export default{
	state:{
		categories:[
			{
				id:'1',
				name:'1',
				isedit:false
			},
			{
				id:'2',
				name:'2',
				isedit:false
			},
			{
				id:'3',
				name:'3',
				isedit:false
			},
		]
	},
	getters:{
		
	},
	mutations:{
		
		addCategory(state,item){
			state.categories.push(item)
		},
		deleteCategory(state,item){
			state.categories = state.categories.filter(v=>{
				return item.id !== v.id
				//返回true 保留下来
			})
		}
	},
	actions:{
		
	}
}