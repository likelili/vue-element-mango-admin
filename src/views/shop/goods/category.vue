<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
		<button-search class="pt-3" :showSearch="false">
			<template #left>
				<el-button size="mini" type="success" @click="openModel(false)">添加类型</el-button>
				<el-button size="mini" type="danger" @click="deleteAll()">批量删除</el-button>
			</template>
			<template #right><div></div></template>
		</button-search>

		<el-table border class="mt-3" :data="tableData" style="width: 100%"
		@selection-change="handleSelectionChange">
			<el-table-column type="selection" width="45" align="center"></el-table-column>
			<el-table-column label="类型名称" prop="name"></el-table-column>
			<el-table-column align="center" prop="sort" label="排序"></el-table-column>
			<el-table-column label="商品数" prop="num"></el-table-column>
			<el-table-column prop="status" align="center" label="状态">
				<template slot-scope="scope">
					<el-button :type="scope.row.status ? 'success' : 'danger'" size="mini" @click="changeStatus(scope.row)" plain>
						{{scope.row.status}}
					</el-button>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="150">
				<template slot-scope="scope">
					<el-button-group>
						<el-button type="primary" size="mini" plain @click="openModel(scope.row)">修改</el-button>
						<el-button type="danger" size="mini" plain @click="deleteItem(scope.row)">删除</el-button>
					</el-button-group>
				</template>
			</el-table-column>
		</el-table>
		
		<el-footer class="border-top d-flex align-items-center px-0 position-fixed bg-white"
		style="bottom: 0;left: 200px;right: 0;z-index: 100;">
			<div class="block px-2">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="page.current"
					:page-sizes="page.sizes"
					:page-size="page.limit"
					:total="page.total"
					layout="total, sizes, prev, pager, next, jumper">
				</el-pagination>
			</div>
		</el-footer>
		
		<!-- 新增/修改模态框 -->
		<el-dialog width="50%" :title="isedit? '修改分类':'添加分类'" 
		:visible.sync="createModel" top="5vh">
			<!-- 表单内容 -->
			<el-form :rules="rules" ref="form" :model="form" label-width="80px">
				<el-form-item label="分类名称" prop="name">
					<el-input v-model="form.name" 
					placeholder="分类名称" size="mini" style="width: 40%;">
					</el-input>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number size="mini" v-model="form.sort" :min="0"></el-input-number>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.status" size="mini">
						<el-radio :label="1" v border>启用</el-radio>
						<el-radio :label="0" border>禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="createModel = false">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import {mapMutations} from 'vuex'
import buttonSearch from '@/components/common/button-search.vue';
import common from '@/common/mixins/common.js';
export default {
	inject: ['layout', 'app'],
	mixins: [common],
	components: {
		buttonSearch
	},
	data() {
		return {
			preUrl:"product/category",
			isedit:true,
			createModel: false,
			editIndex: -1,
			rules: {
				name: [
					{
						required: true,
						message: '名称不能为空',
					}
				]
			},
			form:{
				id:0,
				name:'',
				sort:0,
				status:1
			},
			tableData:[]
		};
	},
	computed: {
		
	},
	methods: {
		...mapMutations([
			'updateCategories'
		]),
		getListUrl(){
			return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.limit}&order=asc`
		},
		//处理列表结果
		getListResult(data){
			//console.log(JSON.stringify(data.list))
			this.tableData = data.list.map(item=>{
				return {
					id:item.id,
					name:item.name,
					num:item.num,
					status:item.status,
					sort:item.sort
				}
			})
			
			let item =  this.tableData.filter(v=>{
				return v.status === 1
			})
			console.log(JSON.stringify(item))
			this.updateCategories(item)
			
		},
		// 打开模态框
		openModel(row = false) {
			// 增加
			if (!row) {
				this.isedit = false
				this.form = {
					name:'',
					sort:0,
					status:1
				}
			} else {
				this.isedit = true
				this.form = {
					id:row.id,
					name:row.name,
					sort:row.sort,
					status:row.status
				}
			}
			this.createModel = true;
		},
		// 添加类型
		submit() {
			this.$refs.form.validate(res=>{
				if(res) {
					let id = 0
					if(this.isedit){
						id = this.form.id
					}
					this.addOrEdit(this.form,id)
					this.createModel = false
				}
			})
			
		}
		
	}
}
</script>

<style></style>
