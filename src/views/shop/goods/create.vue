<template>
	<div>
		<router-link :to="{name:'shop_goods_list'}" style="position: absolute;top: 12px;left: 200px;">
			<el-button size="mini">回到商品列表</el-button>
		</router-link>
		
		<div style="margin: -20px;margin-top: -1rem;" class="px-3 goods_create">
			<el-tabs v-model="tabIndex" @tab-click="handleClick">
				<el-tab-pane label="基础设置">
					<el-form label-width="80px">
						<el-form-item label="商品名称">
							<el-input v-model="form.title" maxlength="60" show-word-limit placeholder="请输入商品名称,不能超过60个字符" class="w-50"
							></el-input>
						</el-form-item>
						<el-form-item label="商品类型">
							<el-select v-model="form.category" clearable placeholder="">
								<el-option v-for="(item,index) in categories" :key="index" 
								:label="item.name" :value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
						
						<el-form-item label="商品描述">
							<el-input class="w-50"
								type="textarea" autosize placeholder="请输入内容"
								v-model="form.desc">
							</el-input>
						</el-form-item>
						<el-form-item label="商品价格">
							<el-input-number v-model="form.price" :precision="2" :step="0.1" :min="0">
							</el-input-number>
						</el-form-item>
						<el-form-item label="排序指数">
							<el-input-number v-model="form.order" :min="0"></el-input-number>
						</el-form-item>
						
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="媒体设置">
					<el-collapse v-model="activeNames">
						<el-collapse-item title="上传商品封面(1张)" name="1">
							<div class="d-flex flex-wrap">
								<div style="width: 100px;height: 100px;cursor: pointer;
								margin-top: 10px;margin-right: 10px;position: relative;"
								class="border" v-if="form.cover">
									<img :src="form.cover" v-if="form.cover"
									style="width: 100%;height: 100%;"
									@click.stop="chooseOneImage"/>
									
									<i class="el-icon-delete bg-dark text-white p-2"
									style="position: absolute;top: 0px;right: 0px;background-color: rgba(0,0,0,0.4);"
									@click.stop="deleteOneImage"></i>
								</div>
								<div style="width: 100px;height: 100px;cursor: pointer;margin-top: 10px;margin-right: 10px;" 
								class="border d-flex align-items-center justify-content-center"
								@click.stop="chooseOneImage">
									<i class="el-icon-plus text-muted" style="font-size: 30px;"></i>
								</div>
							</div>
						</el-collapse-item>
						<el-collapse-item title="上传商品详情页轮播图图片(多张)" name="2">
							<div class="d-flex flex-wrap">
								<div style="width: 100px;height: 100px;cursor: pointer;
								margin-top: 10px;margin-right: 10px;position: relative;"
								class="border"
								v-for="(item,index) in form.banners" :key="index">
									<img :src="item.src" v-if="item.src"
									style="width: 100%;height: 100%;"
									@click.stop="changeImages(index)"/>
									<i class="el-icon-delete bg-dark text-white p-2"
									style="position: absolute;top: 0px;right: 0px;background-color: rgba(0,0,0,0.4);"
									@click="deleteImages(index)"></i>
								</div>
								<div style="width: 100px;height: 100px;cursor: pointer;margin-top: 10px;margin-right: 10px;" 
								class="border d-flex align-items-center justify-content-center"
								@click.stop="chooseImages(-1)">
									<i class="el-icon-plus text-muted" style="font-size: 30px;"></i>
								</div>
							</div>
						</el-collapse-item>
					</el-collapse>
				</el-tab-pane>
				<el-tab-pane label="商品详情">
					<tinymce v-model="form.content"></tinymce>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
	import {mapState,mapMutations} from "vuex"
	import tinymce from '@/components/common/tinymce.vue';
	export default {
		inject:['app'],
		components:{
			tinymce
		},
		data() {
			return {
				tabIndex:0,
				//categories:[]
				activeNames: ['1','2'],
				maxChoosedNum:1
			}
		},
		created() {
			this.maxChoosedNum = this.$conf.maxChoosedNum
		},
		computed:{
			...mapState({
				categories:state=>state.category.categories,
				form:state=>state.goodsCreate.form
			})
		},
		methods:{
			...mapMutations([
				'changeModelState'
			]),
			// 用来加载数据
			handleClick(tab){
				console.log(tab.index)
			},
			//选择和更换封面
			chooseOneImage(){
				this.app.showImageModel(1,(res)=>{
					this.changeModelState('cover',res[0].item.src)
					this.form.cover = res[0].item.src
				})
			},
			deleteOneImage(){
				this.form.cover = ''
			},
			//更新大图
			changeImages(index){
				this.app.showImageModel(1,(res)=>{
					let banners = this.form.banners
					banners[index] = {
						id:res[0].item.id,
						src:res[0].item.src
					}
					this.changeModelState('banners',banners)
					
					this.form.banners[index] = {
						id:res[0].item.id,
						src:res[0].item.src
					}}
				)
			},
			//选择大图
			chooseImages(){
				let bannersLength = this.form.banners.length
				let num = this.maxChoosedNum -  bannersLength
				
				if(num<1){
					this.$message({
							showClose: true,
							message: '商品大图已经选满',
							type: 'warning'
						});
					return
				}
				this.app.showImageModel(num,(res)=>{
					
					for (let i = 0; i < res.length; i++) {
						this.form.banners.push({
							id:res[i].item.id,
							src:res[i].item.src
						})
					}
				})
			},
			deleteImages(index){
				this.form.banners.splice(index,1)
			}
		}
	}
</script>

<style>
	.goods_create .el-form-item{
		margin-bottom: 10px;
	}
	.el-collapse-item__header{
		background-color: #e9eef3 !important
	}
	.el-collapse-item__content{
		padding-left: 10px;
		padding-bottom: 10px;
	}
</style>
