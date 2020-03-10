export default {
	filters:{
		numToString(value){
			return value.toString()
		}
	},
	data() {
		return {
			preUrl:"",
			page:{
				current:1,
				sizes:[10,20,30,50],
				limit:10,
				total:0,
			},
			multipleSelection:[]
		}
	},
	created(){
		this.__init()
	},
	computed: {
		ids(){
			return this.multipleSelection.map(v=>{
				return v.id
			})
		}
		
	},
	methods:{
		
		//处理列表结果
		getListResult(data){
			this.tableData = data.list
		},
		getListUrl(){
			return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.limit}`
		},
		__init(){
			if(this.preUrl == '') return
			this.layout.showLoading()
			this.axios.get(this.getListUrl(),{
				token:true
			}).then(res=>{
				this.page.total = res.data.data.totalNums
				this.getListResult(res.data.data)
				this.layout.hideLoading()
			}).catch(err=>{
				this.layout.hideLoading()
			})
			
		},
		handleSelectionChange(val){
			this.multipleSelection = val
		},
		handleSizeChange(val) {
			this.page.limit = val
			this.__init()
		},
		handleCurrentChange(val) {
			this.page.current = val
			this.__init()
		},
		addOrEdit(data,id = 0,){
			this.layout.showLoading()
			let url = id > 0 ? '/admin/'+this.preUrl+'/'+id : '/admin/'+this.preUrl
			this.axios.post(url,data,{
				token:true
			}).then(res=>{
				this.$message.success(res.data.msg)
				this.__init()
				this.layout.hideLoading()
				this.createModel = false
			}).catch(err=>{
				this.layout.hideLoading()
				this.createModel = false
			})
			
		},
		deleteAll(){
			
			if (this.ids.length === 0){
				return this.$message.error("没有选中")
			}
			this.layout.showLoading()
			this.$confirm('是否要删除选中?','提示',{
				confirmButtonText:'删除',
				cancelButtonText:'取消',
				type:'warning'
			}).then(()=>{
				this.layout.showLoading()
				this.axios.post('/admin/'+this.preUrl+'/delete_all',this.ids,{
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
		// 删除属性值
		deleteItem(row) {
			this.layout.showLoading()
			this.axios.delete('/admin/'+this.preUrl+'/'+row.id,{
				token:true
			}).then(res=>{
				this.$message.success(res.data.msg)
				this.__init()
				this.layout.hideLoading()
				this.createModel = false
			}).catch(err=>{
				this.layout.hideLoading()
				this.createModel = false
			})
			
		},
		// 修改状态
		changeStatus(item){
			let status = item.status === 1 ? 0 : 1
			//console.log(status)
			//let msg = status === 1 ? '启用' : '禁用'
			this.layout.showLoading()
			this.axios.post('/admin/'+this.preUrl+'/'+item.id+'/update_status',{
				status:status
			},{
				token:true
			}).then(res=>{
				console.log(status)
				this.__init()
				this.layout.hideLoading()
				
				
			}).catch(err=>{
				this.layout.hideLoading()
			})
		}
	}
}