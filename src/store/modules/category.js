export default{
	state:{
		categories:[
			/*
			{
				id:item.id,
				name:item.name,
				num:item.num,
				status:item.status,
				sort:item.sort
			}
			*/
		]
	},
	getters:{
		
	},
	mutations:{
		updateCategories(state,item){
			state.categories = item
		},
		
		addCategory(state,item){
			state.categories.push(item)
		},
		deleteCategory(state,item){
			state.categories = state.categories.filter(v=>{
				return item.id !== v.id
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