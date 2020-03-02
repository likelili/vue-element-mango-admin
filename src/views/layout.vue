<template>
	<div>
		<el-container style="position: absolute;left: 0;top: 0;right: 0;bottom: 0;overflow: hidden;">
			<el-header class="d-flex align-items-center" style="background: #545c64;">
				<a class="h5 text-light mb-0 mr-auto">{{ $conf.logo }}</a>
				<el-menu
					style="height: 100%;"
					:default-active="tarBar.active | numToString"
					class="el-menu-demo"
					mode="horizontal"
					@select="headerSelect"
					background-color="#545c64"
					text-color="#fff"
					active-text-color="#ffd04b"
				>
					<el-menu-item v-for="(item, index) in tarBar.list" :key="index" :index="index | numToString">{{ item.name }}</el-menu-item>
					<el-submenu index="100">
						<template slot="title">
							<el-avatar size="small" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
							ADMIN
						</template>
						<el-menu-item index="100-1">修改</el-menu-item>
						<el-menu-item index="100-2">登出</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-header>
			<el-container style="height: 100%;">
				<!--侧边导航-->
				<el-aside width="200px">
					<el-menu :default-active="getAsideActive | numToString" @select="asideSelect">
						<el-menu-item v-for="(item, index) in getActiveAside" :key="index" :index="index | numToString">
							<i :class="item.icon"></i>
							<span slot="title">{{ item.name }}</span>
						</el-menu-item>
					</el-menu>
				</el-aside>
				<!---->
				<el-main style="padding-bottom: 60px;position: relative;">
					<!--面包屑导航-->
					<div class="border-bottom mb-3 bg-white" style="padding: 20px;margin: -20px;" v-if="bran.length > 0">
						<el-breadcrumb separator-class="el-icon-arrow-right">
							<el-breadcrumb-item v-for="(item, index) in bran" :key="index" :to="{ path: item.path }">{{ item.title }}</el-breadcrumb-item>
						</el-breadcrumb>
					</div>

					<router-view></router-view>
					
					<el-backtop target=".el-main" :bottom="100">
						<div style="height: 100%;width: 100%;background-color: #f2f5f6;
						box-shadow: 0 0 6px rgba(0,0,0, .12);text-align: center;
						line-height: 40px;color: #1989fa;">
						UP
						</div>
					</el-backtop>
					
					<div style="height: 60px;"></div>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import common from '@/common/mixins/common.js';
export default {
	mixins: [common],
	data() {
		return {
			bran: [],
			tarBar: {
				active: 0,
				list: [
					{
						name: '首页',
						asideActive: 0,
						aside: [
							{
								icon: 'el-icon-s-home',
								name: '后台首页',
								pathname: 'index'
							},
							{
								icon: 'el-icon-picture',
								name: '相册管理',
								pathname: 'image'
							}
						]
					},
					{
						name: '商品',
						asideActive: 0,
						aside: [
							{
								icon: '',
								name: '商品列表',
								pathname: 'shop_goods_list'
							},
							{
								icon: '',
								name: '创建商品',
								pathname: 'shop_goods_create'
							}
						]
					},
					{
						name: '订单',
						asideActive: 0,
						aside: [
							{
								icon: '',
								name: '后台首页'
							},
							{
								icon: '',
								name: '商品列表'
							}
						]
					},
					{
						name: '设置',
						asideActive: 0,
						aside: [
							{
								icon: '',
								name: '后台首页'
							},
							{
								icon: '',
								name: '商品列表'
							}
						]
					}
				]
			}
		};
	},
	computed: {
		//得到当前侧边栏激活
		getAsideActive() {
			//asideSelect(key)
			return this.tarBar.list[this.tarBar.active].asideActive;
		},
		getActiveAside() {
			return this.tarBar.list[this.tarBar.active].aside || [];
		}
	},
	methods: {
		setAsideActive(index) {
			this.tarBar.list[this.tarBar.active].asideActive = index;
		},
		headerSelect(key) {
			
			//console.log(key,keyPath)
			if (key === '100-1') {
				return console.log('100-1')
			}
			if (key === '100-2') {
				return console.log('100-2')
			}
			this.tarBar.active = key;
			//默认跳转到激活的那一个
			if (this.getActiveAside.length > 0) {
				this.setAsideActive(0);
				this.$router.push({
					name: this.getActiveAside[this.getAsideActive].pathname
				});
			}
		},
		asideSelect(key) {
			this.tarBar.list[this.tarBar.active].asideActive = key;
			//跳转到指定页面
			this.$router.push({
				name: this.getActiveAside[key].pathname
			});
		},
		//获得面包屑导航
		getRouterBran() {
			let brans = this.$route.matched.filter(v => v.name);
			let arr = [];
			brans.forEach(v => {
				if (v.name === 'index' || v.name === 'layout') return;
				arr.push({
					name: v.name,
					path: v.path,
					title: v.meta.title
				});
			});
			if (arr.length > 0) {
				arr.unshift({
					name: 'index',
					path: '/index',
					title: '后台首页'
				});
			}
			this.bran = arr;
			//console.log(arr)
		},
		__initTarBar() {
			let r = localStorage.getItem('tarActive');
			if (r) {
				r = JSON.parse(r);
				//console.log(r)
				this.tarBar.active = r.top;
				this.setAsideActive(r.left);
				//console.log(r)
			}
			
		}
	},
	created() {
		//this.tarBar = this.$conf.tarBar
		this.getRouterBran();
		//加载激活状态
		this.__initTarBar();
	},
	watch: {
		'$route'() {
			localStorage.setItem(
				'tarActive',
				JSON.stringify({
					top: this.tarBar.active,
					left: this.getAsideActive
				})
				
			);this.getRouterBran();
			
		}
	}
};
</script>

<style>
.el-header {
	background-color: #b3c0d1;
	color: #333;
}
.el-aside {
	background-color: #d3dce6;
	color: #333;
}
.el-main {
	background-color: #e9eef3;
	color: #333;
}
</style>
