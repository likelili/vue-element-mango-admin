<template>
	<div>
		<div class="d-flex align-items-center">
			
			<slot name="left"></slot>
			<!-- 左边 -->
			<!--
			<el-button type="success" size="mini">发布商品</el-button>
			<el-button type="danger" size="mini">批量删除</el-button>
			-->
			<!-- 右边 -->
			<div class="ml-auto">
				
				<slot name="right">
					<el-input v-model="keyword" size="mini" style="width: 200px;" 
					:placeholder="placeholder"></el-input>
					<el-button type="info" size="mini" style="margin-left: 10px;"
					@click="$emit('search',keyword)">搜索</el-button>
					<el-button size="mini" @click.stop="superSearchModel = true">高级搜索</el-button>
				</slot>
				
			</div>
		</div>
		<!---->
		<el-card class="box-card bg-light my-3" v-show="superSearchModel">
			<div slot="header" class="clearfix" style="margin: -10px;">
				<span>高级搜索</span>
				<el-button style="float: right; padding: 3px 0" type="text" 
				@click.stop="closeSuperSearchModel">收起</el-button>
			</div>
			<!--搜索表单-->
			<slot name="searchForm">
				
			</slot>
		</el-card>
	</div>
</template>
<script>
	export default {
		props:{
			placeholder:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				//简单搜索关键词
				keyword:'',
				superSearchModel:false
			}
		},
		methods:{
			closeSuperSearchModel(){
				this.superSearchModel = false
			}
		}
		
	}
</script>
