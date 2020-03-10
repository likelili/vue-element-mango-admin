<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
		<button-search class="pt-3" placeholder="手机号/邮箱/会员昵称" @search="searchEvent">
			<!-- 左边 -->
			<template #left>
				<el-button size="mini" type="success" @click="openModel(false)">添加用户</el-button>
			</template>
			<template #searchForm>
				<el-form inline ref="form" :model="search" label-width="80px">
					<el-form-item label="搜索内容" class="mb-0"><el-input v-model="search.keyword" placeholder="手机号/邮箱/会员昵称" size="mini"></el-input></el-form-item>
					<el-form-item label="会员等级" class="mb-0">
						<el-select v-model="search.userLevelId" size="mini" placeholder="请选择会员等级">
							<el-option v-for="(item, index) in userLevels" :key="index" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item class="mb-0">
						<el-button type="info" size="mini" @click="searchEvent">搜索</el-button>
						<el-button size="mini" @click="clearSearch">清空筛选条件</el-button>
					</el-form-item>
				</el-form>
			</template>
		</button-search>

		<el-table border class="mt-3" :data="tableData" style="width: 100%">
			<el-table-column width="280" label="用户">
				<template slot-scope="scope">
					<div class="media">
						<img class="mr-3 rounded-circle" :src="scope.row.avatar" style="width: 40px;height: 40px;" />
						<div class="media-body">
							<h6 class="mt-0 d-flex align-items-center">
								{{ scope.row.username }}
							</h6>
							用户ID：{{ scope.row.id }}
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column align="center" label="用户等级">
				<template slot-scope="scope">
					{{ scope.row.userLevel.name }}
				</template>
			</el-table-column>
			<el-table-column align="center" width="250" label="登录注册">
				<template slot-scope="scope">
					<div>注册时间 : {{ scope.row.createTime }}</div>
					<div>最后登录 : {{ scope.row.lastLoginTime }}</div>
				</template>
			</el-table-column>
			<el-table-column prop="status" align="center" label="状态">
				<template slot-scope="scope">
					<el-button :type="scope.row.status ? 'success' : 'danger'" size="mini" @click="changeStatus(scope.row)" plain>
						{{ scope.row.status ? '启用' : '禁用' }}
					</el-button>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="150">
				<template slot-scope="scope">
					<el-button type="text" size="mini" @click="openModel(scope.row)">修改</el-button>
					<el-button type="text" size="mini" @click="deleteItem(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div style="height: 60px;"></div>
		<el-footer class="border-top d-flex align-items-center px-0 position-fixed bg-white" style="bottom: 0;left: 200px;right: 0;z-index: 100;">
			<div style="flex: 1;" class="px-2">
				<el-pagination
					:current-page="page.current"
					:page-sizes="page.sizes"
					:page-size="page.limit"
					layout="total, sizes, prev, pager, next, jumper"
					:total="page.total"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
				></el-pagination>
			</div>
		</el-footer>
		<!-- 新增/修改模态框 -->
		<el-dialog :title="isedit ? '编辑用户':'添加用户'" :visible.sync="createModel" top="5vh">
			<!-- 表单内容 -->
			<el-form ref="form" :model="form" label-width="80px">
				<el-form-item label="用户名" prop="username"><el-input v-model="form.username" placeholder="用户名" size="mini" style="width: 25%;"></el-input></el-form-item>
				<el-form-item label="密码" prop="password"><el-input v-model="form.password" placeholder="密码" size="mini" style="width: 25%;"></el-input></el-form-item>
				<el-form-item label="昵称" prop="nickname"><el-input v-model="form.nickname" placeholder="昵称" size="mini" style="width: 25%;"></el-input></el-form-item>
				<el-form-item label="头像">
					<div>
						<span v-if="!form.avatar" class="btn btn-light border mr-2" @click="chooseImage"><i class="el-icon-plus"></i></span>
						<img v-else :src="form.avatar" class="rounded" style="width: 45px;height: 45px;cursor: pointer;" @click="chooseImage" />
					</div>
				</el-form-item>
				<el-form-item label="用户等级">
					<el-select v-model="form.userLevelId" placeholder="请选择用户等级" size="mini">
						<el-option v-for="(item, index) in userLevels" :key="index" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="手机" prop="phone"><el-input v-model="form.phone" placeholder="手机" size="mini" style="width: 25%;"></el-input></el-form-item>
				<el-form-item label="邮箱" prop="email"><el-input v-model="form.email" placeholder="邮箱" size="mini" style="width: 25%;"></el-input></el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.status" size="mini">
						<el-radio :label="1" border>启用</el-radio>
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
//import {mapState} from 'vuex'
import buttonSearch from '@/components/common/button-search.vue';
import common from '@/common/mixins/common.js';
export default {
	inject: ['app', 'layout'],
	mixins: [common],
	components: {
		buttonSearch
	},
	data() {
		return {
			preUrl: 'user/user',
			isedit: false,
			tableData: [],

			createModel: false,
			editIndex: -1,
			search: {
				keyword: '',
				userLevelId: ''
			},

			form: {
				id:'',
				username: '',
				password: '',
				nickname: '',
				avatar: '',
				userLevelId: '',
				phone: '',
				email: '',
				status: 1
			},

			userLevels: ['1','2','2']
		};
	},
	created(){
		this.userLevels = this.axios
	},
	methods: {
		
		// 获取请求列表分页url
		getListUrl() {
			//return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&keyword=${this.search.keyword}&user_level_id=${this.search.user_level_id}`;
			
			return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.limit}&keyword=${this.search.keyword}&userLevelId=${this.search.userLevelId}`;
		},
		getListResult(e) {
			this.tableData = e.list;
			this.userLevels = e.userLevels
		},

		// 打开模态框
		openModel(e = false) {
			// 增加
			if (!e) {
				this.isedit = false
				this.form = {
					id:'',
					username: '',
					password: '',
					nickname: '',
					avatar: '',
					userLevelId:'',
					phone: '',
					email: '',
					status: 1
				};
				this.editIndex = -1;
			} else {
				this.isedit = true
				this.form = {
					id:e.id,
					username: e.username,
					password: '',
					nickname: e.nickname,
					avatar: e.avatar,
					userLevelId: e.userLevel.id,
					phone: e.phone,
					email: e.email,
					status: e.status
				};
				this.editIndex = e.$index;
				
			}
			// 打开dialog
			this.createModel = true;
		},
		// 添加规格
		submit() {
			let id = 0;
			if (this.isedit) {
				id = this.form.id
				console.log(id)
			}
			this.addOrEdit(this.form, id);
			// 关闭模态框
			this.createModel = false;
		},
		// 清空筛选条件
		clearSearch() {
			this.search = {
				keyword: '',
				userLevelId: ''
			};
		},
		// 搜索事件
		searchEvent(e = false) {
			// 简单搜索
			if (typeof e === 'string') {
				this.search.keyword = e;
				this.__init()
				return;
			}
			// 高级搜索
			console.log(this.search.userLevelId)
			this.__init();
		},
		// 选择头像
		chooseImage() {
			this.app.showImageModel(1,(res) => {
				this.form.avatar = res[0].item.src;
			});
		}
		
	}
};
</script>

<style></style>
