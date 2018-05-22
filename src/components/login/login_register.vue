<template>
	<div class="winopenbox">
		<div class="bg"></div>
		<div class="cont">
			 <div id="loginPop" class="loginPop" v-if="innershowtype">
			 	<div class="title"><em @click="closed_winopenbox()"></em><span></span>用户登录</div>
			 	<div class="box">
			 		<div class="login_box">
				 		<ul>
				 			<li>
				 				<input type="text" placeholder="用户名" v-model="login_username" autocomplete="off">
				 			</li>
				 			<li class="showPswli">
				 				<input type="password" placeholder="密码" v-model="login_password" autocomplete="off">
				 			</li>
				 			<li>
				 				<a href="javascript:;" @click="login()" class="abtn">立即登录</a>
				 				<a href="javascript:;" @click="changeType()" class="abtn rebtn">立即注册</a>
				 			</li>
				 		</ul>
				 		<div class="otherLogin">
				 			<h5>第三方登录</h5>
				 			<a href="#" class="weixin"></a> <a href="#" class="qq"></a>
				 		</div>
				 	</div>
			 	</div>
			 </div>

			 <div id="registerPop" class="registerPop" v-else>
			 	<div class="title"><em @click="closed_winopenbox()"></em><span></span>用户注册</div>
			 	<div class="box">
			 		<div class="login_box">
				 		<ul>
				 			<li>
				 				<input type="text" placeholder="用户名"  autocomplete="off">
				 			</li>
				 			<li class="showPswli">
				 				<input type="password" placeholder="密码"  autocomplete="off">
				 			</li>
				 			<li class="showPswli">
				 				<!-- <input type="text" name="hidepsd" class="passwordInput hidepsd" style="display:none"> -->
				 				<input type="password" class="passwordInput showpsd" placeholder="确认密码" id="regconfirm_password" autocomplete="off">
				 				<span class="eyes"></span>
				 			</li>
				 			<li>
				 				<input type="text" placeholder="验证码" name="yanzhengma" id="yanzhengma" autocomplete="off">
				 			</li>
				 			<li>
				 				<a href="javascript:;" @click="register()" class="abtn">立即注册</a>
				 				<a href="javascript:;" @click="changeType()" class="abtn rebtn">立即登录</a>
				 			</li>
				 		</ul>
				 		<div class="otherLogin">
				 			<h5>第三方登录</h5>
				 			<a href="#" class="weixin"></a> <a href="#" class="qq"></a>
				 		</div>
				 	</div>
			 	</div>
			 </div>
		</div>
	</div>
</template>

<script type="text/javascript">
	//import qs from 'qs'
	export default {
		props:['showtype'],
		data(){
			return {
               innershowtype:this.showtype, //切换登录注册状态值
               login_username:'',
               login_password:'',
               login_act:'user'
            }
		},
		// computed:mapState({

		// }),
		methods:{
			closed_winopenbox(){
				this.$parent.winopenbox = true;
			},
			changeType(){
				this.innershowtype = !this.innershowtype
			},
			login(){
		       var params = {};
		       params.act = this.login_act;
		       params.username = this.login_username;
		       params.password = this.login_password;

		       this.http.get('http://www.1234tv.com/v1/login.html',{params:params})
				  .then((response)=> {
				    var data = response.data;
				    var _this = this;
				    if(data.error == 0){
				    	layer.msg(data.message,{icon:6},function(){
				    		_this.$store.commit({
				    			type:'setValue',
				    			val:data.user_info
				    		})
				    		_this.$router.go(0)
				    	})
				    }else{
				    	layui.layer.msg(data.message,{icon:5})
				    }
				  })
				  .catch((error)=>{
				  	 layui.layer.msg(error,{icon:5})
			      });
			}
		},
		mounted(){
			
		}
	}
</script>

<style type="text/css">
	.winopenbox { position: fixed; left: 0; top: 0; right: 0; bottom: 0; }
	.winopenbox .bg { position: absolute; width: 100%; height: 100%; left: 0; top: 0; background: rgba(0,0,0,.3) }
	.winopenbox .cont{ position: fixed; width: 670px; left: 50%; top: 50%; margin:-217px 0 0 -335px; background: #fff; z-index: 100; }
	.winopenbox input { border:1px solid #ddd; }
	.winopenbox .title { height: 28px; line-height: 28px; margin: 30px 0 15px 30px; font-size: 20px; color: #999 }
	.winopenbox .title em { float: right; width: 20px; height: 20px; margin: -20px 10px 0 0; background:url(../../components/login/img/closed2.png) no-repeat; cursor: pointer; }
	.winopenbox .title span { float: left; width: 3px; height: 20px; background: #35a0f1; margin: 5px 8px 0 0; }
	.winopenbox .box { padding: 0 20px 15px 30px; }
	.winopenbox li { position: relative; margin-bottom: 15px; }
	.winopenbox li input { width: 246px; height: 40px; line-height: 40px; padding: 0 10px 0 45px; border:1px solid #c5c5c5; border-radius: 3px; outline: none; background: #fff url(../../components/login/img/loginicon.png) no-repeat 0 2px; }
	.winopenbox li.showPswli input { background-position: 0 -43px; }
	.winopenbox li .abtn { width: 138px; padding: 0; border:1px solid #35a0f1; text-align: center; border-radius: 3px;}
	.winopenbox li .rebtn { margin-left: 20px; background: #fff; color: #666; }
	.winopenbox li .abtn:hover { text-decoration: none; color: #fff; }
	.winopenbox li .rebtn:hover { color: #666; }
	.winopenbox .login_box { position: relative; padding-right: 291px;  background: url(../../components/login/img/dengl.png) no-repeat 356px 5px;}
	.winopenbox .registerPop .login_box { background:url(../../components/login/img/loginbg2.jpg) no-repeat right 28px;}
	.winopenbox .otherLogin { position: absolute; left: 350px; top: 10px; width: 275px; font-size: 14px; }
	.winopenbox .otherLogin h5 { margin-bottom: 10px; }
	.winopenbox .otherLogin a { display: inline-block; width: 40px; height: 34px; margin: 6px 15px 0px; }
	.winopenbox .otherLogin .weixin { margin-left: 80px; background: url(../../components/login/img/new_loginweixing.png) no-repeat; background-size: contain; }
	.winopenbox .otherLogin .qq { background: url(../../components/login/img/new_loginqq.png) no-repeat; background-size: contain; }
</style>