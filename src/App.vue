<template>
	<div id="app">
		<router-view></router-view>
		
		<image-dialog ref="imageDialog" :maxChoosedNum="maxChoosedNum"></image-dialog>
	</div>
</template>

<script>
import imageDialog from '@/components/image/image-dialog.vue';
export default {
	name: 'app',
	components: {
		imageDialog
	},
	provide(){
		return {
			app:this
		}
	},
	data(){
		return {
			maxChoosedNum:0
		}
	},
	methods:{
		showImageModel(maxChoosedNum,callback){
			this.maxChoosedNum = maxChoosedNum
			this.$refs.imageDialog.showImageModel(callback)
		}
	}
}
</script>

<style>
	::-webkit-scrollbar-track
	{
		background: rgba(0,0,0,.1);
		border-radius: 0;
	}
	
	::-webkit-scrollbar
	{
		-webkit-appearance: none;
		width: 10px;
		height: 10px;
	}
	
	::-webkit-scrollbar-thumb
	{
		cursor: pointer;
		border-radius: 5px;
		background: rgba(0,0,0,.25);
		transition: color .2s ease;
	}
</style>
