<template>
	<div>
		<el-container style="position: absolute;top: 55px;left: 0;right: 0;bottom: 0;">
			<!--头部-->
			<el-header class="d-flex align-items-center">
				<div class="d-flex mr-auto">
					<el-select v-model="searchForm.order" placeholder="选择图片排序方式" size="mini" style="width: 150px;" class="mr-2">
						<el-option label="按更新时间升序" value="asc"></el-option>
						<el-option label="按更新时间降序" value="desc"></el-option>
					</el-select>
					<el-input v-model="searchForm.keyword" size="mini" style="width: 150px;" class="mr-2" placeholder="输入图片名称"></el-input>
					<el-button type="primary" size="mini" @click="getImageList">搜索</el-button>
				</div>
				<el-button v-if="choosedList.length !== 0" type="danger" size="mini"
				@click.stop="deleteAllChoosedImages">批量删除</el-button>
				<el-button type="success" size="mini" @click="openAlbumModel(false)">创建相册</el-button>
				<el-button type="warning" size="mini" @click="openUploadModel">上传图片</el-button>
			</el-header>
			<el-container>
				<!--侧边-->
				<el-aside width="200px" style="position: absolute;top: 60px;left: 0;bottom: 60px;"
				class="border-right">
					<ul class="list-group list-group-flush">
						<li v-for="(item,index) in albums" :key="index"
						class="list-group-item list-group-item-action d-flex align-items-center"
						@click.stop="albumSwitch(index)"
						:class="{'active albumActive':albumIndex === index}"
						style="cursor: pointer;">
							<span>{{item.name}}</span>
							<el-dropdown class="ml-auto">
								<el-button size="mini">
									{{item.num}}<i class="el-icon-arrow-down el-icon--right"></i>
								</el-button>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item @click.stop.native="openAlbumModel({item,index})">修改</el-dropdown-item>
									<el-dropdown-item @click.stop.native="albumDelete(item)">删除</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</li>
					</ul>
				</el-aside>
				<el-container>
					<el-main style="position: absolute;top: 60px;left: 200px;bottom: 60px;right: 0;">
						<el-row :gutter="10">
							<el-col :span="24" :lg="4" :md="6" :sm="8"
							v-for="(item,index) in imageList" :key="index">
								<el-card class="box-card mb-3 position-relative" 
										:body-style="{'padding':'0'}"
										style="cursor: pointer;" shadow="hover">
									<div class="border" :class="item.isChoosed?'border-danger':''">
										<span class="badge badge-danger"
										style="position: absolute;right: 0;top: 0;z-index: 100;" v-if="item.isChoosed">
										{{item.choosedOrder}}
										</span>
										<img :src="item.src" class="w-100" style="height: 100px"
										@click="chooseImage(item,index)"/>
										<div class="w-100 text-white position-absolute px-1" style="background: rgba(0,0,0,0.5);margin-top:-30px;">
											<span class="small">{{item.name}}</span>
										</div>
										<div class="p-2 text-center">
											<el-button-group>
												<el-button size="mini" class="p-2" icon="el-icon-view" @click.stop="previewImage(item.src)"></el-button>
												<el-button size="mini" class="p-2" icon="el-icon-edit" @click.stop="editImage(item,index)"></el-button>
												<el-button size="mini" class="p-2" icon="el-icon-delete" @click.stop="deleteImage(item)"></el-button>
											</el-button-group>
										</div>	
									</div>	
								</el-card>	
							</el-col>
						</el-row>
					</el-main>
				</el-container>
			</el-container>
			<el-footer class="d-flex border-top align-items-center px-0">
				<div style="width: 200px; flex-shrink: 0;" class="h-100 d-flex align-items-center justify-content-center border-right">
					<el-button-group>
						<el-button size="mini" :disabled="albumPage === 1"
						@click="changeAlbumPage('pre')">上一页</el-button>
						<el-button size="mini" :disabled="albumPage === albumsPages"
						@click="changeAlbumPage('next')">下一页</el-button>
					</el-button-group>
				</div>
				<div class="block px-2">
					<el-pagination
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page="currentPage"
						:page-sizes="pageSizes"
						:page-size="pageSize"
						layout="total, sizes, prev, pager, next, jumper"
						:total="totalImages">
					</el-pagination>
				</div>
			</el-footer>
		</el-container>
		
		<!-- 修改|创建相册 -->
		<el-dialog :title="isEditAlbum ? '编辑相册':'新建相册'" :visible.sync="albumModel">
			<el-form ref="form" :model="albumForm" label-width="80px">
				<el-form-item label="相册名称">
					<el-input v-model="albumForm.name" size="medium" placeholder=""></el-input>
				</el-form-item>
				<el-form-item label="相册排序">
					<el-input-number v-model="albumForm.sort" size="medium"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="albumModel = false">取消</el-button>
				<el-button type="primary" @click="confirmAlbumModel">确定</el-button>
			</div>
		</el-dialog>
		
		<el-dialog title="上传图片" :visible.sync="uploadModel" class="text-center" @close="__init">
			<el-upload
				class="upload-demo"
				drag
				action="/admin/admin/image/upload"
				multiple
				:headers="{token:$store.state.user.token}"
				:data="{id:imageClassId}"
				name="img"
				:on-success="uploadImageSuccess">
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
			</el-upload>
			<div slot="footer" class="dialog-footer">
				<el-button @click="uploadModel = false">取 消</el-button>
				<el-button type="primary" @click="uploadModel = false">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 图片预览 -->
		<el-dialog :visible.sync="pictureModel" width="60vw" top="5vh">
			<div style="margin: -60px -20px -30px -20px;">
				<img :src="previewImageSrc" class="w-100"/>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		inject:['layout'],
		data() {
			return {
				searchForm:{
					order:"asc",
					keyword:""
				},
				// 当前选中的相册
				albumIndex:0,
				albums:[],
				//相册默认在第一页
				albumPage:1,
				albumSize:10,
				albumsPages:1,
				// 修改|创建相册
				albumModel:false,
				albumForm:{
					name:"",
					sort:50
				},
				// false为新建 true 为编辑
				isEditAlbum:false,
				uploadModel:false,
				previewImgList:[],
				pictureModel:false,
				previewImageSrc:'',
				imageList:[],
				choosedList:[],
				// 分类设置
				currentPage:1,
				pageSize:5,
				pageSizes:[5,10,15,20],
				totalImages:0
			}
		},
		created(){
			this.__init()
		},
		computed:{
			
			imageClassId(){
				let item = this.albums[this.albumIndex]
				if(item){
					return item.id
				}
				return 0
			},
			getImageListUrl(){
				let other = ''
				if(this.searchForm.keyword != '') {
					other = `&keyword=${this.searchForm.keyword}`
				}
				return `/admin/admin/imageclass/${this.imageClassId}/image/${this.currentPage}
				?limit=${this.pageSize}&order=${this.searchForm.order}${other}`
			},
			isHaveNextAlbumPage(){
				if(this.albumPage<this.albumsPages){
					return true
				}
				return false
			}
		},
		methods:{
			getImageList(){
				this.layout.loading = true
				// 获取选中相册下的第一页图片列表
				this.axios.get(this.getImageListUrl,{
					token:true
				}).then(res=>{
					//console.log(res.data.data)
					let result = res.data.data
					this.imageList = result.list.map(item=>{
						return {
							id:item.id,
							name:item.name,
							src:item.url,
							imageClassId:item.imageClassId,
							isChoosed:false,
							choosedOrder:0
						}
					})
					this.totalImages = result.totalNums
					this.layout.loading = false
				}).catch(err=>{
					//console.log(err.response.data)
					this.layout.loading = false
				})
			},
			__init() {
				this.layout.loading = true
				// 获取相册列表
				this.axios.get('/admin/admin/imageclass/'+this.albumPage+'?albumSize='+this.albumSize,{
					token:true
				}).then(res=>{
					console.log(res.data.list)
					this.albums = res.data.data.list
					this.albumsPages = res.data.data.totalPages
					this.getImageList()
				}).catch(err=>{
					this.layout.loading = false
				})
			},
			// 切换相册分类
			albumSwitch(index){
				this.albumIndex = index
				this.choosedList = []
				this.getImageList()
			},
			
			openAlbumModel(object){
				if(object) {
					let {item,index} = object
					this.albumIndex = index
					
					this.albumForm.name = item.name
					this.albumForm.sort = item.sort
					
					this.isEditAlbum = true
					return this.albumModel = true
				}
				
				this.isEditAlbum = false
				return this.albumModel = true
			},
			//点击确定修改/新建相册
			confirmAlbumModel(){
				this.albumModel = false
				if(this.isEditAlbum){
					this.albumChange()
					return this.albumModel = false
				}	
				this.albumAdd()
				return this.albumModel = false
			},
			// 新建图片分类前后端交互
			albumAdd(){
				this.layout.showLoading()
				this.axios.post('/admin/admin/imageclass',this.albumForm,{
					token:true
				}).then(res=>{
					this.$message.success(res.data.msg)
					this.layout.hideLoading()
					this.__init()
				}).catch(err=>{
					this.$message.error(err.response.data.msg)
					this.layout.hideLoading()
				})
			},
			// 编辑图片分类前后端交互
			albumChange(){
				let item = this.albums[this.albumIndex]
				this.layout.showLoading()
				this.axios.post('/admin/admin/imageclass/'+item.id,this.albumForm,{
					token:true
				}).then(res=>{
					this.$message.success(res.data.msg)
					this.layout.hideLoading()
					this.__init()
				}).catch(err=>{
					this.$message.error(err.response.data.msg)
					this.layout.hideLoading()
				})
				
			},
			albumDelete(item){
				this.$confirm('是否删除该相册？', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.layout.showLoading()
							this.axios.delete('/admin/admin/imageclass/'+item.id,{
								token:true
							}).then(res=>{
								this.$message.success(res.data.msg)
								this.layout.hideLoading()
								this.__init()
							}).catch(err=>{
								this.$message.error(err.response.data.msg)
								this.layout.hideLoading()
							})
						})	
			},
			
			
			openUploadModel(){
				this.uploadModel = true
			},
			previewImage(src){
				this.previewImageSrc = src
				this.pictureModel = true
			},
			editImage(item,index){
				this.$prompt('请输入新名称', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							inputValue:item.name,
							inputValidator(value){
								if(value === '') return '图片名称不能为空'
							}
						}).then(({ value }) => {
							this.layout.showLoading()
							this.axios.post('/admin/admin/image/'+item.id,{
								name:value
							},{
								token:true
							}).then(res=>{
								this.$message.success(res.data.msg)
								this.layout.hideLoading()
								this.getImageList()
							}).catch(err=>{
								this.$message.error(err.response.data.msg)
								this.layout.hideLoading()
							})
						}) 
			},
			deleteImage(item){
				this.$confirm('是否删除此图片', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.layout.showLoading()
							this.axios.delete('/admin/admin/image/'+item.id+'?classid='+item.imageClassId,{
								token:true
							}).then(res=>{
								this.$message.success(res.data.msg)
								this.__init()
								this.layout.hideLoading()
							}).catch(err=>{
								this.$message.error(err.response.data.msg)
								this.layout.hideLoading()
							})
						})
			},
			chooseImage(item,index){
				if(!item.isChoosed){
					this.choosedList.push({item:item,index:index})
					item.choosedOrder = this.choosedList.length
					item.isChoosed = true
					return;
				}
				let i = this.choosedList.findIndex(v=>v.item.id === item.id)
				if(i === -1) return;
				let length = this.choosedList.length
				if(i+1<length){
					for (var j = i; j < length; j++) {
						let no = this.imageList.findIndex(v=>v.id === this.choosedList[j].item.id)
						if(no > -1) {
							this.imageList[no].choosedOrder--
						}
					}
				}
				this.choosedList.splice(i,1)
				item.isChoosed = false
				item.choosedOrder = 0
			},
			deleteAllChoosedImages(){
				this.layout.showLoading()
				let ids = this.choosedList.map(v=>v.item.id)
				this.axios.post('/admin/admin/image/delete_all'+'?imageClassId='+this.imageClassId,{
					ids: ids
				},{
					token:true
				}).then(res=>{
					this.__init()
					this.layout.hideLoading()
					this.$message.success(res.data.msg)
					this.choosedList = []
				}).catch(err=>{
					this.$message.error(res.response.data.msg)
					this.layout.hideLoading()
				})
				/*
				let list = this.imageList.filter(image=>{
					return !this.choosedList.some(c=>{
						return c.item.id === image.id
					})
				})
				*/
			},
			handleSizeChange(val) {
				this.pageSize = val
				this.getImageList()
			},
			handleCurrentChange(val) {
				this.currentPage = val
				this.getImageList()
			},
			changeAlbumPage(val){
				if(val === 'pre'){
					this.albumPage--
				}else{
					this.albumPage++
				}
				this.__init()
			},
			uploadImageSuccess(response,file,fileList){
				console.log(response,file,fileList)
			}
		}
	}
</script>

<style>
.albumActive{
	color: #67C23A!important;
	background-color: #F0F9EB!important;
	border-color: #C2E7B0!important;
}
.el-header .el-footer{
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
