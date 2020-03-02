import Vue from "vue"
import Vuex from "vuex"

import category from "./modules/category.js"
import goodsCreate from "./modules/goods-create.js"
Vue.use(Vuex)

export default new Vuex.Store({
	modules:{
		category,
		goodsCreate
	}
})