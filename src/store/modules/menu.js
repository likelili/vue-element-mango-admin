export default{
	state:{
		tarBar: {
			active: '0',
			list: []
		}
	},
	getters:{
		
	},
	mutations:{
		/**
				 {
					 "id": 5,
					 "rule_id": 0,
					 "status": 1,
					 "create_time": "2019-08-11 13:36:09",
					 "update_time": "2019-08-11 13:36:09",
					 "name": "首页",
					 "desc": "index",
					 "condition": null,
					 "menu": 1,
					 "order": 21,
					 "icon": null,
					 "method": "GET",
					 "pivot": {
						 "id": 43,
						 "role_id": 3,
						 "rule_id": 5
					 },
					 "child": [
						 {
							 "id": 10,
							 "rule_id": 5,
							 "status": 1,
							 "create_time": "2019-08-11 13:37:02",
							 "update_time": "2019-08-11 13:37:02",
							 "name": "后台首页",
							 "desc": "index",
							 "condition": null,
							 "menu": 1,
							 "order": 20,
							 "icon": "el-icon-s-home",
							 "method": "GET",
							 "pivot": {
								 "id": 46,
								 "role_id": 3,
								 "rule_id": 10
							 },
							 "child": []
						 },
						 {
							 "id": 12,
							 "rule_id": 5,
							 "status": 1,
							 "create_time": "2019-12-28 13:39:36",
							 "update_time": "2019-12-28 13:39:36",
							 "name": "商品列表",
							 "desc": "shop_goods_list",
							 "condition": null,
							 "menu": 1,
							 "order": 20,
							 "icon": "el-icon-s-claim",
							 "method": "GET",
							 "pivot": {
								 "id": 47,
								 "role_id": 3,
								 "rule_id": 12
							 },
							 "child": []
						 }
					 ]
				 } 
				 * **/
				// 创建菜单
		
		createTarBar(state,menus){
			menus.map(item => {
				
				let aside = item.child.map(v=>{
					return {
						icon: 'el-icon-s-home',
						name: '后台首页',
						pathname: 'index'
					}
				})
				return {
					name: item.name,
					asideActive: '0',
					aside: aside
				}
			})
		}
	},
	actions:{
		
	}
}