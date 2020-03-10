<template>
	<div>
		<el-dialog title="选择图片" :visible.sync="imageModel" width="80%" top="5vh">
			<el-container style="position: relative; height: 70vh;margin: -30px -20px;">
				<!--头部-->
				<el-header class="d-flex align-items-center">
					<div class="d-flex mr-auto">
						<el-select v-model="searchForm.order" placeholder="选择图片排序方式" size="mini" style="width: 150px;" class="mr-2">
							<el-option label="按更新时间升序" value="asc"></el-option>
							<el-option label="按更新时间降序" value="desc"></el-option>
						</el-select>
						<el-input v-model="searchForm.keyword" size="mini" style="width: 150px;" class="mr-2" placeholder="输入相册名称"></el-input>
						<el-button type="primary" size="mini" @click="getImageList">搜索</el-button>
					</div>
				</el-header>
				<el-container>
					<!--侧边-->
					<el-aside width="200px" style="position: absolute;top: 60px;left: 0;bottom: 60px;"
					class="border-right" v-loading="asideLoading">
						<ul class="list-group list-group-flush">
							<li v-for="(item,index) in albums" :key="index"
							class="list-group-item list-group-item-action d-flex align-items-center"
							@click.stop="albumSwitch(index)"
							:class="{'active albumActive':albumIndex === index}"
							style="cursor: pointer;">
								<span>{{item.name}}</span>
								<el-button size="mini" class="ml-auto">
									{{item.num}}
								</el-button>
							</li>
						</ul>
					</el-aside>
					<el-container>
						<el-main style="position: absolute;top: 60px;left: 200px;bottom: 60px;right: 0;"
						v-loading="mainLoading">
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
											<div class="w-100 text-white position-absolute px-1" style="background: rgba(0,0,0,0.5);margin-top:-20px;">
												<span class="small">{{item.name}}</span>
											</div>
										</div>	
									</el-card>	
								</el-col>
							</el-row>
						</el-main>
					</el-container>
				</el-container>
				<el-footer class="d-flex border-top align-items-center px-0 border">
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
			<div slot="footer" class="dialog-footer">
				<el-button @click="hideImageModel">取消</el-button>
				<el-button type="primary" @click="confirm">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		props:{
			maxChoosedNum:{
				type:Number,
				default:1
			}
		},
		data() {
			return {
				imageModel:false,
				callback:false,
				searchForm:{
					order:"asc",
					keyword:""
				},
				
				albumIndex:0,
				albums:[],
				imageList:[],
				
				choosedList:[],
				currentPage:1,
				
				albumPage:1,
				albumSize:10,
				albumsPages:1,
				
				pageSize:5,
				pageSizes:[5,10,15,20],
				totalImages:0,
				
				asideLoading:false,
				mainLoading:false
			}
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
			}
		},
		methods:{
			showImageModel(callback){
				
				this.callback = callback
				this.__init()
				this.imageModel = true
			},
			hideImageModel(){
				this.imageModel = false
				this.callback = false
				this.cancelAllChoosed()
			},
			// 切换相册分类
			albumSwitch(index){
				console.log(index)
				this.albumIndex = index
				this.choosedList = []
				this.getImageList()
			},
			confirm(){
				if(this.choosedList.length === 0){
					this.$message({
							showClose: true,
							message: '你未选中图片',
							type: 'warning'
					});
					return
				}
				if (typeof this.callback === 'function'){
					this.callback(this.choosedList)
				}
				this.cancelAllChoosed()
				this.hideImageModel()
			},
			cancelAllChoosed(){
				this.imageList.forEach(img=>{
						
					let i = this.choosedList.findIndex(item=>{
						return item.item.id === img.id
					})
					if(i > -1) {
						img.isChoosed = false
						img.choosedOrder  = 0
						this.choosedList.splice(i,1)
					}
				})
			},
			__init() {
				this.asideLoading = true
				// 获取相册列表
				this.axios.get('/admin/admin/imageclass/'+this.albumPage+'?albumSize='+this.albumSize,{
					token:true
				}).then(res=>{
					this.albums = res.data.data.list
					this.albumsPages = res.data.data.totalPages
					this.asideLoading = false
					this.getImageList()
				}).catch(err=>{
					this.asideLoading = false
				})
			},
			getImageList(){
				this.mainLoading = true
				this.axios.get(this.getImageListUrl,{
					token:true
				}).then(res=>{
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
					this.mainLoading = false
				}).catch(err=>{
					this.mainLoading = false
				})
			},
			chooseImage(item,index){
				
				if(!item.isChoosed){
					
					if(this.choosedList.length >= this.maxChoosedNum){
						this.$message({
								showClose: true,
								message: '你只可以选择'+this.maxChoosedNum+'张图片',
								type: 'warning'
							});
						return
					}
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
		}
	}
</script>

<style>
	.albumActive{
		color: #67C23A!important;
		background-color: #F0F9EB!important;
		border-color: #C2E7B0!important;
	}
</style>
