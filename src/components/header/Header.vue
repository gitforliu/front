<template>
	<div class="header">
		<div class="inner">
			<a href="#" class="logo"><img src="../../components/header/img/logo.jpg" alt="1234TV财经直播"></a>
			<ul class="nav">
				<li><router-link to="/">首页</router-link></li>
				<li><router-link to="/v1/roomlist">直播间</router-link></li>
				<li><router-link to="/v1/team">团队</router-link></li>
				<li><router-link to="/v1/helpus">帮助中心</router-link></li>
				<li><router-link to="/v1/contactus">联系我们</router-link></li>
			</ul>
			<div class="loginbox">
				<div class="index_app">
					<div class="name"><i></i>APP下载</div>
					<div class="down">
						<em></em>
						<h4>扫码手机客户端下载</h4>
						<div class="img"><img src="../../components/header/img/logo.jpg" alt="APP下载二维码" width="120" height="120" /></div>
						<div class="yqm">邀请码 :1234TV</div>
					</div>
				</div>
				<div class="user" v-if="!login_status">
					<a href="javascript:;" id="loginBox" @click="open_login()">登录</a> <span class="hidden_it">|</span> <a href="javascript:;" id="registerBox" @click="open_register()">注册</a>
				</div>
				<div class="user" v-else>
					<a href="javascript:;">{{userinfo.username}}</a> <span class="hidden_it">|</span> <a href="javascript:;" @click="loginout()">退出</a>
				</div>
			</div>
		</div>
		<v-login v-if="!winopenbox" :showtype="showtype"></v-login>
	</div>
</template>

<script type="text/javascript">
	import Login from '../../components/login/login_register.vue'

	export default {
		data(){
			return {
				login_status:false,
				userinfo:'',
				winopenbox:true,
				showtype:true // true代表登录 false 代表注册
			}
		},
		components:{
			"v-login":Login
		},
		methods:{
			open_login(){
				this.winopenbox = false;
				this.showtype = true
			},
			open_register(){
				this.winopenbox = false;
				this.showtype = false
			},
			loginout(){
				console.log(1);
				this.$store.commit('delValue');
				this.$router.go(0)
			}
		},
		mounted(){
			this.login_status = jQuery.isEmptyObject(this.$store.state.TV_USERINFO) ? false : true ;
			this.userinfo = this.$store.state.TV_USERINFO;
			console.log(this.userinfo.username);
		}
	}
</script>

<style type="text/css">
	.header { position: fixed; width: 100%; height: 62px; box-shadow: 0px 1px 5px rgba(0,0,0,.3); background: #fff; z-index: 100; }
	.header .inner { width: 1200px; height: 60px; margin: 0 auto; }
	.header .logo { float: left; margin: 5px 20px 0 0; }
	.header .nav, .header .nav li { float: left; }
	.header .nav li { padding: 0 10px; line-height: 60px; font-size: 16px; }
	.header .loginbox { float: right; }
	.header .index_app { cursor: pointer; position: relative; float: left; }
	.header .index_app .name { padding-left: 30px; line-height: 60px; font-size: 16px; background: url(../../components/header/img/head_icon_qrcode.gif) no-repeat left center;}
	.header .index_app .down { display: none; position: absolute; top: 62px; left: -40px; padding: 10px; width: 176px; background: #fff; box-shadow: 0 0 5px #e2e3e4; border-top: 2px solid #148be4; text-align: center; }
	.header .index_app .down em { position: absolute; width: 15px; height: 10px; right: 92.5px; top: -10px; z-index: 2;  background: url(../../components/header/img/room_sanj.png); background-size: contain; } 
	.header .index_app .down h4 { line-height: 24px; font-size: 15px; }
	.header .index_app .down .img { border-top: 1px solid #eee; padding: 10px 10px 0; width: 120px; height: 120px; margin: 10px auto; }
	.header .index_app .down .yqm{ font-size: 14px;color: #333; width: 176px;background: #f4f4f4; padding: 6px 0;border-radius: 15px;  overflow:hidden;}
	.header .index_app:hover .down{  display: block; }
	.header .loginbox .user { float: left; font-size: 14px; line-height: 62px; margin-left: 30px; }
	.hidden_it { margin: 0 5px; }
</style>


