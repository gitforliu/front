<template>
	<div class="fotter">
		<div class="inner fix">
			 <div class="fl">
			 	  <div class="link">
			 	  	  <router-link target='_blank' to="/">关于我们</router-link>
			 	  	  <router-link target='_blank' to="/">最新公告</router-link>
			 	  	  <router-link target='_blank' to="/">最新活动</router-link>
			 	  	  <router-link target='_blank' to="/">用户协议</router-link>
			 	  	  <router-link target='_blank' to="/">联系我们</router-link>
			 	  	  <router-link target='_blank' to="/">投诉建议</router-link>
			 	  </div>
			 	  <div class="kefu">
			 	  	 <span>申请直播：<a :href="linkstr+live_qq[Math.floor(Math.random()*live_qq.length)]+linkstr2">联系QQ</a></span>
			 	  	 <span>客服支持：<a :href="linkstr+live_qq[Math.floor(Math.random()*kefu_qq.length)]+linkstr2">联系QQ</a></span>
			 	  	 <span>渠道推广：<a :href="linkstr+live_qq[Math.floor(Math.random()*qudao_qq.length)]+linkstr2">联系QQ</a></span>
			 	  </div>
			 	  <ul class="info">
			 	  	 <li>咨询热线:13810663702 13810663762</li>
			 	  	 <li class="even">渠道合作:18217603097</li>
			 	  	 <li>公司地址:江苏省南京市建邺区嘉陵江东街18号</li>
			 	  	 <li class="even">投诉建议:<a href="mailto:support@1234tv.com">support@1234tv.com</a></li>
			 	  	 <li>上海公司:上海市浦东新区商城路618号3楼、4楼</li>
			 	  </ul>
			 </div>

			 <div class="fr">
			 	  <div class="company_show">
			 	  	  <h4>手机扫码看视频</h4>
			 	  	  <img src="../../components/footer/img/app_qrcode.png" />
			 	  	  <p>1234TV企业版APP</p>
			 	  </div>
			 	  <div class="company_show">
			 	  	  <h4>微信扫一扫关注</h4>
			 	  	  <img src="../../components/footer/img/weixin_code.png" />
			 	  	  <p>1234TV财经学堂</p>
			 	  </div>
			 </div>

			 <div class="copy">COPYRIGHT 2017 南京云播视讯科技有限责任公司 ALL RIGHTS RESERVED | <a href="http://www.miitbeian.gov.cn/" target="_blank">苏ICP备14043037号</a> | <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32010502010136" target="_blank"><i class="beian"></i>苏公网安备 32010502010136号</a></div>

			 <p class="safe">
			 	<a style="margin-right:20px;" href="http://www.cn-ecusc.org.cn/cert/aqkx/site/?site=1234tv.com&stp=" target="_blank">
			 		<img src="../../components/footer/img/aqkx_83x30.png" />
			 	</a> 
			 	<a href="https://v.pinpaibao.com.cn/cert/site/?site=www.1234tv.com&at=business" target="_blank">
			 		<img src="../../components/footer/img/hy_83x30.png" />
			 	</a>
			 </p>
		</div>
	</div>
</template>

<script type="text/javascript">
	export default {
		data(){
			return {
				linkstr:'tencent://message/?uin=',
				linkstr2:'&Site=申请直播&Menu=yes',
				live_qq:['3002204368','3002217808','3002218388'],
				kefu_qq:['3002220676','3002280355','3002283800','3002216612','3002278936','3002220423'],
				qudao_qq:['3002267241','3002273410','3002283654']
			}
		}
	}
</script>

<style type="text/css">
	.fotter { min-width: 1200px; padding: 30px 0 10px; font-size: 14px; border-top: 1px solid #e4e4e4; background:#f3f3f3; }
	.fotter .fl { padding-right: 40px; width: 760px; border-right: 1px solid #ddd; }
	.fotter .inner { width: 1200px; margin: 0 auto; color: #333; }
	.fotter .link { font-size: 16px; }
	.fotter .link a { color: #333; display: inline-block; height: 24px; line-height: 24px; border-left: 2px solid #222; padding-left: 20px; margin-right: 20px; }
	.fotter .link a:first-child { border-left: 0 none; padding-left: 0; }
	.fotter .kefu { margin: 25px 0 15px; line-height: 32px; }
	.fotter .kefu span { margin-right: 30px; }
	.fotter .kefu a { display: inline-block; height: 30px; line-height: 30px; padding: 0 10px 0 35px; margin-left: 5px; color: #222; border:1px solid #35a0f1; border-radius: 3px; background: url(../../assets/img/qq.png) no-repeat 7px 4px; }
	.fotter .info li { float: left; line-height: 36px; width: 420px;  }
	.fotter .info li.even { width: 300px; }
	.fotter .info li a { color: #333; }
	.fotter .company_show { float: left; width: 120px; margin-right: 30px; }
	.fotter .company_show h4 { font-size:16px; color: #222; margin-bottom: 7px;  }
	.fotter .company_show img { width: 120px; height: 120px; }
	.fotter .company_show  p { color: #666; margin-top: 2px; }
	.fotter .copy { clear: both; text-align: center; padding: 20px 0 20px; }
	.fotter .copy a { color:#333; margin: 0 2px; }
	.fotter .copy .beian { display: inline-block; width: 20px; height: 20px; margin-right: 5px; vertical-align: middle; background: url(../../components/footer/img/beian.png) no-repeat; }
	.fotter .safe { text-align: center; }
</style>
