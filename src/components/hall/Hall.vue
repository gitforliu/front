<template>
	<div class="page">
		<v-head></v-head>
		<div class="hall">
			<div class="inner">
				 <h3><span>热门推荐</span></h3>
				 <div class="halllist">
				 	<ul class="fix" v-if="len">
				 		<li v-for="(item,index) in list" v-if="index <=19">
				 			<a href="#" target="_blank">
				 				<i class="password_bg"></i>
				 				<div class="pic">
				 					<div class="onlive" v-if="item.starttime">直播中</div>
				 					<div class="offlive" v-else>休息中</div>
				 					<img class="lazy" :alt="item.room_name"  width="100%" height="85" :src="item.icon" />
				 				</div>
				 				<div class="des">
				 					<span class="num overhien">{{item.room_user}}</span>
				 					<span class="name overhien">
				 					<b class="v m" title="实名认证" v-if="item.room_qualification==1">实名</b>
				 					<b class="v" title="机构认证" v-if="item.room_qualification==2">认证</b>
				 					{{item.room_name}}
				 					</span>
				 				</div>
				 			</a>
				 		</li>
				 	</ul>
				 </div>

				<div class="slideTxtBox ad_home">
				    <div class="hd">
				    	<ul>
				    		<li></li><li></li><li></li>
				    	</ul>
				    </div>
				    <div class="bd">
				        <ul>
				            <li><img src="../../components/hall/img/jingdingcaijing.gif" /></li>
	    					<li><img src="../../components/hall/img/jinshiyouyuan.gif" /></li>
	    					<li><img src="../../components/hall/img/shenqingzhibo.jpg" /></li>
				        </ul>
				    </div>
				    <a class="prev" href="javascript:void(0)"></a><a class="next" href="javascript:void(0)"></a>
				</div>

				 <h3><a href="#">更多</a><span>直播间</span></h3>
				<div class="halllist">
				 	<ul class="fix" v-if="len">
				 		<li v-for="(item,index) in list" v-if="index <=19">
				 			<a href="#" target="_blank">
				 				<i class="password_bg"></i>
				 				<div class="pic">
				 					<div class="onlive" v-if="item.starttime">直播中</div>
				 					<div class="offlive" v-else>休息中</div>
				 					<img class="lazy" :alt="item.room_name"  width="100%" height="85" :src="item.icon" />
				 				</div>
				 				<div class="des">
				 					<span class="num overhien">{{item.room_user}}</span>
				 					<span class="name overhien">
				 					<b class="v m" title="实名认证" v-if="item.room_qualification==1">实名</b>
				 					<b class="v" title="机构认证" v-if="item.room_qualification==2">认证</b>
				 					{{item.room_name}}
				 					</span>
				 				</div>
				 			</a>
				 		</li>
				 	</ul>
				</div>

				<div class="slideTxtBox ad_home2">
				    <div class="hd">
				    	<ul>
				    		<li></li><li></li><li></li>
				    	</ul>
				    </div>
				    <div class="bd">
				        <ul>
				            <li><img src="../../components/hall/img/jingdingcaijing.gif" /></li>
	    					<li><img src="../../components/hall/img/jinshiyouyuan.gif" /></li>
	    					<li><img src="../../components/hall/img/shenqingzhibo.jpg" /></li>
				        </ul>
				    </div>
				    <a class="prev" href="javascript:void(0)"></a><a class="next" href="javascript:void(0)"></a>
				</div>
			</div>
		</div>
		<v-foot></v-foot>
		
	</div>
</template>

<script type="text/javascript">
	import SuperSlide from '../../assets/js/jquery.SuperSlide.2.1.1.js'

	export default {
		data(){
			return {
				list:[],
				len:0
			}
		},
		methods:{
			getData(){
				var api="http://www.1234tv.com/v1/api/hall?eng_name=1234tv";
				this.http.get(api)
				  .then((response)=> {
				    console.log(response);
				    if(response.data.error == 1){
				    	layui.layer.msg(response.data.message,{icon:5})
				    }else{
					    this.list = response.data.data.rooms_list;
					    this.len = this.list.length;
					    this.$store.commit({
			    			type:'setToken',
			    			val:response.data.csrf_token
			    		})
				    }
				  })
				  .catch((error)=>{
				  	 layui.layer.msg(error,{icon:5})
				  });
			}
		},
		mounted(){
			this.getData();
		},
		updated:function(){
			this.$nextTick(function () {
			  jQuery(".ad_home, .ad_home2").slide({mainCell:".bd ul",effect:"left",autoPlay:true});
			})
		}
	}
	
</script>

<style type="text/css">
	.overhien {overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
	.hall { padding-top: 80px; }
	.hall .inner { width: 1200px; margin: 0 auto; }
	.hall h3 { font-size: 16px; border-bottom: 1px solid #ddd; margin-bottom: 10px; }
	.hall h3 a { float: right; font-size: 12px; color: #148be4; }
	.hall h3 span { display: inline-block; padding: 0 5px 5px; margin-bottom: -1px; border-bottom: 2px solid #148be4; }
	.halllist li { float:left; width: 220px; margin: 8px; border:1px solid #E4F0FE;}
	.halllist li a:hover { text-decoration: none; color: #66717c }
	.halllist li .pic { width: 220px; height: 85px; position: relative;}
	.halllist li .des { height: 36px; line-height: 36px; padding: 0 5px;-webkit-text-stroke: 0.24px }
	.halllist li .des .num { float: right; max-width: 45px; padding-left: 20px; background: url(../../components/hall/img/people_icon.png) no-repeat left center;}
	.halllist li .des .name { float: left; width: 145px; }
    li .des .v { float:left; width: 36px; height: 18px; line-height: 18px; margin:8px 6px 0 0; text-align: center; font-weight: normal; border:1px solid #148BE4; color: #148BE4;-webkit-text-stroke: 0.24px; }
	li .des .v.m { color: #FF7900; border:1px solid #FF7900; }
	.halllist li .onlive, .halllist li .offlive { position: absolute; top: 0; left: 0; width: 44px; color: white; z-index: 1; line-height: 22px; background: #F42409; text-align: center; }
    .halllist li .offlive { background:#aaa }
    .slideTxtBox{ width:1180px; height: 80px; margin: 20px 10px 30px; position: relative; overflow:hidden;}
	.slideTxtBox .bd ul{position: relative; height: 100%; }
	.slideTxtBox .bd li{ vertical-align: middle;  }
	.slideTxtBox .prev, .slideTxtBox .next { position: absolute; width: 25px; height: 49px; top: 15px; z-index: 1; }
	.slideTxtBox .prev { left: 0; background: url(../../components/hall/img/ad_left.png) no-repeat; }
	.slideTxtBox .next { right: 0; background: url(../../components/hall/img/ad_right.png) no-repeat; }
</style>