<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
		<button-search ref="buttonSearch" class="pt-3" placeholder="要搜索的商品名称" @search="searchEvent">
			<!-- 左边 -->
			<template #left>
				<el-button size="mini" type="danger" @click="deleteAll()">批量删除</el-button>
			</template>

			<template #searchForm>
				<!--搜索表单-->
				<el-form inline ref="searchForm" :model="searchForm" label-width="80px">
					<el-form-item label="评价用户" class="mb-0"><el-input size="mini" v-model="searchForm.username"></el-input></el-form-item>
					<el-form-item label="商品分类" class="mb-0">
						<el-select v-model="searchForm.type" placeholder="请选择商品类型" size="mini">
							<el-option label="区域一" value="shanghai"></el-option>
							<el-option label="区域二" value="beijing"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="发布时间" class="mb-0">
						<el-date-picker
							size="small"
							v-model="searchForm.time"
							type="datetimerange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
						></el-date-picker>
					</el-form-item>
					<el-form-item size="mini" class="mb-0 d-flex" style="margin-left: 10px;">
						<el-button type="info" size="mini" @click.stop="searchEvent">搜索</el-button>
						<el-button size="mini" @click.stop="clearSearch">清空筛选条件</el-button>
					</el-form-item>
				</el-form>
			</template>
		</button-search>

		<!--评论列表-->
		<el-table border class="mt-3" :data="tableData" style="width: 100%">
			<el-table-column type="selection" width="45" align="center"></el-table-column>
			<el-table-column type="expand">
				<template slot-scope="scope">
					<!-- bootstrap -->
					<div class="media">
						<img class="mr-3" :src="scope.row.user.avatar" alt="" 
						style="height: 70px;width: 70px;border-radius: 100%;" />
						<div class="media-body">
							<h6 class="mt-0 d-flex">
								{{ scope.row.user.username }}
								<small>{{ scope.row.review_time }}</small>
								<el-button v-if="!scope.row.extra && !textareaEdit" class="ml-auto" type="info" size="mini" @click="textareaEdit = true">回复</el-button>
							</h6>
							{{ scope.row.review.data }}
							<div class="py-2"><img v-for="(item, index) in scope.row.review.image" :key="index" :src="item" 
							style="max-width: 100px;max-height: 100px;" /></div>

							<div v-if="textareaEdit">
								<el-input type="textarea" :rows="2" placeholder="请输入评价内容" v-model="textarea"></el-input>
								<div class="py-2">
									<el-button class="ml-auto mr-2" type="success" size="mini" @click="review(scope.row.id)">回复</el-button>
									<el-button class="ml-auto" type="info" size="mini" @click="closeTextarea">取消</el-button>
								</div>
							</div>

							<div v-if="scope.row.extra">
								<div class="media mt-3 bg-light p-2 rounded" v-for="(item, index) in scope.row.extra" :key="index">
									<div class="media-body">
										<h6 class="mt-0 d-flex">
											客服
											<el-button v-if="!textareaEdit" class="ml-auto" type="info" size="mini" @click="openTextarea(item.data)">修改</el-button>
										</h6>
										{{ item.data }}
									</div>
								</div>
							</div>
						</div>
					</div>
				</template>
			</el-table-column>

			<el-table-column label="ID" width="70" align="center" prop="id"></el-table-column>
			<el-table-column label="商品" width="380">
				<template slot-scope="scope">
					<div class="media">
						<img class="mr-3" style="width: 60px;height: 60px;" :src="scope.row.goods_item.cover" />
						<div class="media-body">
							<p class="mt-0">{{ scope.row.goods_item.title }}</p>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column width="250" label="评价信息">
				<template slot-scope="scope">
					<div class="d-flex flex-column">
						<p>用户名：{{ scope.row.user.username }}</p>
						<p>
							评分：
							<el-rate v-model="scope.row.rating" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate>
						</p>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="review_time" align="center" label="评价时间"></el-table-column>
			<el-table-column align="center" label="是否显示" width="150">
				<template slot-scope="scope">
					<el-button :type="scope.row.status ? 'success' : 'danger'" size="mini" @click="changeStatus(scope.row)" plain>
						{{ scope.row.status ? '启用' : '禁用' }}
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div style="height: 60px;"></div>
	</div>
</template>
<script>
import buttonSearch from '@/components/common/button-search.vue';
import common from '@/common/mixins/common.js';
export default {
	inject: ['layout'],
	mixins: [common],
	components: {
		buttonSearch
	},
	data() {
		return {
			preUrl: 'skus',
			tableData: [
				{
					id:'123',
					goods_item:{
						title:'',
						cover:''
					},
					user:{
						username:'123'
					},
					rating:5,
					create_time:'123444',
					status:1,
					extra:{
						
					},
					review:{
						
					}
				}
			],
			form: {
				name: '',
				order: 50,
				status: 1,
				type: 0,
				default: ''
			},
			rules: {
				name: [
					{
						required: true,
						message: '规格名称不能为空',
						trigger: 'blur'
					}
				],
				default: [
					{
						required: true,
						message: '规格值不能为空',
						trigger: 'blur'
					}
				]
			},
			searchForm: {
				username: '',
				type: '',
				time: ''
			}
		};
	},
	methods: {
		clearSearch() {},
		searchEvent() {
			console.log(e);
		},
		getListResult(e) {
			this.tableData = e.list;
		},
		// 打开模态框
		openModel(e = false) {
			// 增加
			if (!e) {
				// 初始化表单
				this.form = {
					name: '',
					order: 50,
					status: 1,
					type: 0,
					default: ''
				};
				this.editIndex = -1;
			} else {
				// 修改
				this.form = {
					name: e.row.name,
					order: e.row.order,
					status: e.row.status,
					type: e.row.type,
					default: e.row.default.replace(/,/g, '\n')
				};
				this.editIndex = e.$index;
			}
			// 打开dialog
			this.createModel = true;
		},
		// 添加规格
		submit() {
			this.$refs.form.validate(res => {
				if (res) {
					this.form.default = this.form.default.replace(/\n/g, ',');
					let id = 0;
					if (this.editIndex !== -1) {
						id = this.tableData[this.editIndex].id;
					}
					this.addOrEdit(this.form, id);
					// 关闭模态框
					this.createModel = false;
				}
			});
		}
	}
};
</script>

<style></style>
