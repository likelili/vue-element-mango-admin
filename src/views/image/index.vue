<template>
	<div>
		<el-container style="position: absolute;top: 55px;left: 0;right: 0;bottom: 0;">
			<!--头部-->
			<el-header class="d-flex align-items-center">
				<div class="d-flex mr-auto">
					<el-select v-model="searchForm.order" placeholder="选择图片排序方式" size="mini" style="width: 150px;" class="mr-2">
						<el-option label="区域一" value="shanghai"></el-option>
						<el-option label="区域二" value="beijing"></el-option>
					</el-select>
					<el-input v-model="searchForm.keyword" size="mini" style="width: 150px;" class="mr-2" placeholder="输入相册名称"></el-input>
					<el-button type="primary" size="mini">搜索</el-button>
				</div>
				<el-button v-if="choosedList.length !== 0" type="danger" size="mini"
				@click.stop="deleteAllChoosedImages()">批量删除</el-button>
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
									<el-dropdown-item @click.stop.native="albumDelete(index)">删除</el-dropdown-item>
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
										<el-image
											style="width: 100%; height: 100px"
											:src="item.src"
											fit="cover" lazy 
											@click="chooseImage(item,index)">
										</el-image>
										<div class="w-100 text-white position-absolute px-1" style="background: rgba(0,0,0,0.5);margin-top:-30px;">
											<span class="small">{{item.name}}</span>
										</div>
										<div class="p-2 text-center">
											<el-button-group>
												<el-button size="mini" class="p-2" icon="el-icon-view" @click.stop="previewImage(item.src)"></el-button>
												<el-button size="mini" class="p-2" icon="el-icon-edit" @click.stop="editImage(item,index)"></el-button>
												<el-button size="mini" class="p-2" icon="el-icon-delete" @click.stop="deleteImage(item,index)"></el-button>
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
						<el-button size="mini">上一页</el-button>
						<el-button size="mini">下一页</el-button>
					</el-button-group>
				</div>
				<div class="block px-2">
					<el-pagination
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page="4"
						:page-sizes="[12, 24, 48]"
						:page-size="100"
						layout="total, sizes, prev, pager, next, jumper"
						:total="400">
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
					<el-input-number v-model="albumForm.order" size="medium"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="albumModel = false">取消</el-button>
				<el-button type="primary" @click="confirmAlbumModel">确定</el-button>
			</div>
		</el-dialog>
		
		<el-dialog title="上传图片" :visible.sync="uploadModel" class="text-center">
			<el-upload
				class="upload-demo"
				drag
				action="https://jsonplaceholder.typicode.com/posts/"
				multiple>
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
			</el-upload>
			<div slot="footer" class="dialog-footer">
				<el-button @click="uploadModel = false">取 消</el-button>
				<el-button type="primary" @click="uploadModel = false">确 定</el-button>
			</div>
		</el-dialog>
		
		
		<el-dialog :visible.sync="pictureModel" width="60vw" top="5vh">
			<div style="margin: -60px -20px -30px -20px;">
				<img :src="previewImageSrc" class="w-100"/>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				searchForm:{
					order:"",
					keyword:""
				},
				// 当前选中的相册
				albumIndex:0,
				albums:[],
				// 修改|创建相册
				albumModel:false,
				albumForm:{
					id:0,
					name:"",
					order:0
				},
				// false为新建 true 为编辑
				isEditAlbum:false,
				uploadModel:false,
				previewImgList:[],
				pictureModel:false,
				previewImageSrc:'',
				imageList:[],
				choosedList:[]
			}
		},
		created(){
			this.__init()
		},
		methods:{
			__init() {
				for (var i = 0; i < 20; i++) {
					this.albums.push({
						id:33,
						name:"xiangce"+i,
						num:Math.floor(Math.random()*100),
						order:0
					})
				}
				
				for (let i = 0; i < 30; i++) {
					this.imageList.push({
						id:i,
						name:i,
						src:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
						isChoosed:false,
						choosedOrder:0
					})
				}
			},
			albumSwitch(index){
				this.albumIndex = index
			},
			openAlbumModel(object){
				if(object) {
					let {item,index} = object
					this.albumIndex = index
					this.albumForm.id = item.id
					this.albumForm.name = item.name
					this.albumForm.order = item.order
					this.isEditAlbum = true
					return this.albumModel = true
				}
				// 新建
				this.albumForm = {
					id:0,
					name:"",
					num:0,
					order:0
				}
				this.isEditAlbum = false
				return this.albumModel = true
			},
			confirmAlbumModel(){
				this.albumModel = false
				if(this.isEditAlbum){
					// 新建
					this.albums.unshift({
						name:this.albumForm.name,
						num:0,
						order:this.albumForm.order,
						id:0
					})
					return this.albumModel = false
				}
				// 更新
				this.albumChange()
				
			},
			albumChange(){
				this.albums[this.albumIndex].name = this.albumForm.name
				
			},
			albumDelete(index){
				this.$confirm('是否删除该相册？', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.albums.splice(index,1)
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
							this.imageList[index].name = value
							// 后台
							this.$message({
								type: 'success',
								message:value
							});
						}) 
			},
			deleteImage(item,index){
				this.$confirm('是否删除此图片', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.imageList.splice(index,1)
							// 后台
							this.$message({
								type: 'success',
								message: '删除成功'
							});
						})
			},
			chooseImage(item,index){
				/* choosedList
				{
					id:'',url:'',index,
				}
				*/
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
				
				console.log(JSON.stringify(this.choosedList))
			},
			deleteAllChoosedImages(){
				/*	
				let index = this.choosedList.map(v=>v.index)
				for (var i = 0; i < index.length; i++) {
					this.imageList.splice(index[i],1)
				}*/
					
				let list = this.imageList.filter(image=>{
					return !this.choosedList.some(c=>{
						return c.item.id === image.id
					})
				})
				this.imageList = list
				this.choosedList = []
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
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
