<template>
	<div>
		<div class="container">
			<div class="row">
				<div class="col-12 col-lg-4 col-md-6 col-sm-8 m-auto mt-5"
				style="height: 500px;">
					<div class="card mt-5">
						<div class="card-header bg-white">
							<h3 class="text-center text-secondary mb-0">{{$conf.logo}}</h3>
						</div>
						<div class="card-body">
							<el-form ref="form" :model="form" :rules="rules">
								<el-form-item prop="username">
									<el-input v-model="form.username"
									size="medium" placeholder="请输入登录名"></el-input>
								</el-form-item>
								<el-form-item prop="password">
									<el-input v-model="form.password" 
									size="medium" placeholder="请输入密码" type="password"></el-input>
								</el-form-item>
								<el-form-item>
									<el-button type="primary" size="medium" class="w-100"
									@click="submit" 
									:loading="loading"> 
									{{loading? '登录中' : '立即登录'}}
									</el-button>
								</el-form-item>
							</el-form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				loading:false,
				form:{
					username:'',
					password:''
				},
				rules:{
					username:[
						{
							required:true,message:'请输入登录名',trigger:'blur'
						}
					],
					password:[
						{
							required:true,message:'请输入密码',trigger:'blur'
						}
					]
				}
			}
		},
		methods:{
			submit() {
				this.$refs.form.validate((e)=>{
					if(!e) return;
					this.loading = true
					this.axios.post('/admin/user/admin/login',this.form).then(res=>{
						if (res.data && res.data.data) {
							this.$store.commit('login',res.data.data)
							this.loading = false
							this.$router.push({name:'index'})
						}
					}).catch(err=>{
						//console.log(err.response.data)
						this.loading = false
					})
				})
			}
		}
	}
</script>

<style>
</style>
