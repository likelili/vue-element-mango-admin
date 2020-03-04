<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
		<button-search class="pt-3" :showSearch="false">
			<template #left>
				<el-button size="mini" type="success" @click="openModel(false)">添加类型</el-button>
			</template>
			<template #right><div></div></template>
		</button-search>

		<el-table border class="mt-3" :data="categories" style="width: 100%">
			<el-table-column label="类型名称" prop="name"></el-table-column>
			<el-table-column align="center" prop="order" label="排序"></el-table-column>
			<el-table-column prop="status" align="center" label="状态">
				<template slot-scope="scope">
					<el-button :type="scope.row.status ? 'success' : 'danger'" size="mini" @click="changeStatus(scope.row)" plain>
						{{scope.row.status ? '启用' : '禁用' }}
					</el-button>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="150">
				<template slot-scope="scope">
					<el-button-group>
						<el-button type="primary" size="mini" plain @click="openModel(scope)">修改</el-button>
						<el-button type="danger" size="mini" plain @click="deleteItem(scope.row)">删除</el-button>
					</el-button-group>
				</template>
			</el-table-column>
		</el-table>
		
		<!-- 新增/修改模态框 -->
		<el-dialog width="50%" title="添加分类" :visible.sync="createModel" top="5vh">
			<!-- 表单内容 -->
			<el-form :rules="rules" ref="form" :model="form" label-width="80px">
				<el-form-item label="分类名称" prop="name">
					<el-input v-model="form.name" 
					placeholder="分类名称" size="mini" style="width: 40%;">
					</el-input>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number size="mini" v-model="form.order" :min="0"></el-input-number>
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
import {mapState,mapMutations} from 'vuex'
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
			currentPage: 1,
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
				name:'',
				isedit:false,
				order:0,
				status:1
			}
		};
	},
	computed: {
		...mapState({
			categories:state=>state.category.categories
			
		})
	},
	methods: {
		...mapMutations([
			'addCategory',
			'deleteCategory',
			'changeCategory'
		]),
		// 改变分类状态
		changeStatus(row){
			row.status = !row.status
			this.changeCategory('status',row)
		},
		// 打开模态框
		openModel(e = false) {
			// 增加
			if (!e) {
				this.form = {
					name:'',
					isedit:false,
					order:10,
					status:1
				}
				this.editIndex = -1
			} else {
				this.form = e.row
				this.editIndex = e.$index
			}
			this.createModel = true;
		},
		// 添加类型
		submit() {
			console.log(this.form)
		},
		// 编辑属性
		editItem(row) {
			row.isedit = !row.isedit
			this.changeCategory('isedit',row)
		},
		// 删除属性值
		deleteItem(row) {
			this.deleteCategory(row)
		}
	}
}
</script>

<style></style>
