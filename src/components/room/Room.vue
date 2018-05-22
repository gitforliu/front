<template>
	<div class="roompage">
		<div class="header">
			1
		</div>
		<div class="roomcontent">
			<div class="inner">
				
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	

	export default {
		data(){
			return {
				teamname:this.$route.params.teamname,
				roomname:this.$route.params.roomname,
				room_info:{},
				userpara:{},
				roompara:{},
			}
		},
		
		methods:{
			
		}
	}
</script>

<style type="text/css">
	.roompage { padding: 0 60px; }
	.roompage .header{ position: fixed; height: 60px; left: 60px; top: 0; right: 60px; color: #fff; background-image:linear-gradient(to right,#142990,#012250);}
</style>