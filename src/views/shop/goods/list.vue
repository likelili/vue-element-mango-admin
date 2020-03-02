<template>
	<div style="margin: -20px;margin-top: -1rem;" class="px-3">
		<el-tabs v-model="tabIndex" @tab-click="handleClick">
			<el-tab-pane v-for="(tab,tabI) in tabbars" :key="tabI" :label="tab.name">
				
				<button-search placeholder="要搜索的商品名称" ref="buttonSearch" @search="searchEvent">
					<template #left>
						<router-link :to="{name:'shop_goods_create'}">
							<el-button type="success" size="mini">创建商品</el-button>
						</router-link>
						<el-button type="danger" size="mini" class="ml-2">批量删除</el-button>
					</template>
					
					<template #searchForm>
						<!--搜索表单-->
						<el-form inline ref="searchForm" :model="searchForm" label-width="80px">
							<el-form-item label="商品名称" class="mb-0">
								<el-input size="mini" v-model="searchForm.name"></el-input>
							</el-form-item>
							<el-form-item label="商品分类" class="mb-0">
								<el-select v-model="searchForm.category" placeholder="请选择商品类型" size="mini"> 
									<el-option label="区域一" value="shanghai"></el-option>
									<el-option label="区域二" value="beijing"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="商品编码" class="mb-0">
								<el-input size="mini" v-model="searchForm.code"></el-input>
							</el-form-item>
							<el-form-item size="mini" class="mb-0 d-flex" style="margin-left: 10px;">
								<el-button type="info" size="mini" @click.stop="searchEvent">搜索</el-button>
								<el-button size="mini" @click.stop="clearSearch">清空筛选条件</el-button>
							</el-form-item>
						</el-form>
					</template>
				</button-search>
				
				<el-table class="mt-3" border :data="tableData[tabI].list" style="width: 100%" 
				@selection-change="handleSelectionChange">
					<el-table-column type="selection" width="45" align="center"></el-table-column>
					<el-table-column prop="title" label="商品" width="291">
						<template slot-scope="scope">
							<div class="media">
								<img class="mr-3" style="height: 60px;height: 60px;"
								:src="scope.row.cover"/>
								<div class="media-body">
									<p class="mt-0 mb-0" style="font-weight: 800;font-size: medium;">{{scope.row.title}}</p>
									<p class="mt-0 mb-0">商品ID：{{scope.row.id}}</p>
									<p class="mt-0 mb-0">时间：{{scope.row.create_time}}</p>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="category" label="商品分类" align="center"></el-table-column>
					<el-table-column prop="sale_count" label="商品销量" align="center"></el-table-column>
					<el-table-column label="商品状态" align="center">
						<template slot-scope="scope">
							<el-button type="success" size="mini" @click="changeStatus(scope.row)">上架</el-button>
						</template>
					</el-table-column>
					<el-table-column prop="pprice" label="价格" align=""></el-table-column>
					<el-table-column prop="order" label="排序" align="center"></el-table-column>
					<el-table-column label="操作" align="center" width="150">
						<template slot-scope="scope">
							<el-button-group>
								<el-button type="primary" size="mini" plain>修改</el-button>
								<el-button type="danger" size="mini" plain @click.stop="deleteGoods(scope.$index)">删除</el-button>
							</el-button-group>
						</template>
					</el-table-column>
				</el-table>
				<el-footer class="d-flex border-top align-items-center px-0 bg-white">
					<div class="block px-2">
						<el-pagination
							:current-page="tableData[tabI].currentPage"
							:page-sizes="[12, 24, 48]"
							:page-size="100"
							layout="total, sizes, prev, pager, next, jumper"
							:total="400">
						</el-pagination>
					</div>
				</el-footer>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import buttonSearch from "@/components/common/button-search.vue"
	export default {
		components:{
			buttonSearch
		},
		data() {
			return {
				tabIndex:0,
				tabbars:[
					{name:"审核中"},
					{name:"出售中"},
					{name:"已下架"},
					{name:"回收站"}
				],
				searchForm:{
					name:'',
					category:'',
					code:''
				},
				tableData: [],
				multipleSelection: []
			}
		},
		created() {
			this.__getData()
		},
		methods:{
			__getData(){
				for (let i = 0; i < this.tabbars.length; i++) {
					this.tableData.push({
						currentPage:1,
						list:[]
					})
					for (let j = 0; j < 50; j++) {
						this.tableData[i].list.push(
							{
								id:j,
								title:"hsdf"+i+j,
								cover:"https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
								create_time:"2019-10-11 12:11:00",
								category:"",
								sale_count:23,
								order:100,
								status:i,
								pprice:1000,
								ischeck:1
							}
						)
					}
				}
				
			},
			handleSelectionChange(val){
				this.multipleSelection = val
			},
			// 用来加载数据
			handleClick(tab){
				console.log(tab.index)
			},
			//清空筛选条件
			clearSearch(){
				this.searchForm = {
					name:'',
					category:'',
					code:''
				}
				this.$refs.buttonSearch[this.tabIndex].closeSuperSearchModel()
			},
			// 搜索时间
			searchEvent(e = false){
				//简单搜索
				if(typeof e === 'string') {
					console.log('低级搜索')
					return
				}
				//高级搜索
				console.log('高级搜索')
			},
			deleteGoods(index){
				this.$confirm('是否删除该商品？', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.tableData[this.tabIndex].list.splice(index,1)
							this.$message({
								type: 'success',
								message: '删除成功!'
							})
						}).catch(() => {
							this.$message({
							type: 'info',
							message: '已取消删除'
							})
						})
				
			},
			changeStatus(item){
				item.status = 1
			}
		}
	}
</script>

<style>
</style>
