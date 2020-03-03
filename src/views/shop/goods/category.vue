<template>
	<div>
		<el-button style="" size="mini" type="success" class="mb-3" @click="addItem">添加</el-button>
		<el-table
			:data="categories"
			style="width: 50%">
			<el-table-column label="分类名" width="400">
				<template slot-scope="scope">
					<el-input v-if="scope.row.isedit" v-model="scope.row.name"></el-input>
					<div slot="reference" class="name-wrapper">
						<el-tag v-if="!scope.row.isedit" size="medium">{{scope.row.name}}</el-tag>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button
					size="mini" v-if="scope.row.isedit"
					@click="finishEdit(scope.$index,scope.row)">完成</el-button>
					<el-button
					size="mini" v-else
					@click="handleEdit(scope.$index,scope.row)">编辑</el-button>
					<el-button
					size="mini"
					type="danger"
					@click="handleDelete(scope.$index,scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				name:''
			}
		},
		computed:{
			...mapState({
				categories:state=>state.category.categories
			})
		},
		methods:{
			...mapMutations([
				'deleteCategory',
				'addCategory'
			]),
			addItem(){
				let item = {
					id:'11',
					name:this.name
				}
				this.addCategory(item)
			},
			handleEdit(index, row) {
				row.isedit = true
			},
			handleDelete(index, row) {
				this.deleteCategory(row)
			},
			finishEdit(index, row){
				row.isedit = false
			}
		}
	}
</script>

<style>
	.el-card__body{
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 10px;
	}
	.el-card__header{
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
