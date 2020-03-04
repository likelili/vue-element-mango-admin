export default{
	state:{
		categories:[
			{
				id:'1',
				name:'1',
				isedit:false,
				order:2,
				status:true
			},
			{
				id:'2',
				name:'2',
				isedit:false,
				order:2,
				status:1
			},
			{
				id:'3',
				name:'3',
				isedit:false,
				order:2,
				status:1
			},
		],
		form:{
			name:'2',
			isedit:false,
			order:2,
			status:1
		}
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
		},
		changeCategory(state,{key,item}){
			
			for (let i = 0; i < state.categories.length; i++) {
				if(state.categories[i].id === item.id){
					state.categories[i][key] = item[key]
				}
			}
		}
	},
	actions:{
		
	}
}