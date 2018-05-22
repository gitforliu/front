import Vue from 'vue'
import Index from './Index.vue'

import router from './router/router.js';
import Axios from 'axios'
import store from './vuex/store.js'

Vue.prototype.http = Axios;
//公共组件
import Header from './components/header/Header.vue'
import Footer from './components/footer/footer.vue'
//公共变量\方法
// Vue.prototype.USERINFO = false;
// Vue.prototype.storage = {
// 	set(key,vue){
// 		localStorage.setItem(key,JSON.stringify(vue))
// 	},
// 	get(key){
// 		return localStorage.getItem(key)
// 	},
// 	remove(key){
// 		localStorage.removeItem(key)
// 	}
// }

Vue.component("v-head",Header);
Vue.component("v-foot",Footer);

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(Index)
})
