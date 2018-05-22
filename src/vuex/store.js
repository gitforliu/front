import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

var state = {
	count:1,
	TV_USERINFO:JSON.parse(localStorage.getItem('TV_USERINFO')) || {},
	csrf_token:''
}

var mutations = {
	add(){
		state.count++;
	},
	setValue(state,payload){
		localStorage.setItem('TV_USERINFO', JSON.stringify(payload.val));
		state.TV_USERINFO = payload.val
	},
	setToken(state,payload){
		state.csrf_token = payload.val
	},
	delValue(state){
		localStorage.removeItem('TV_USERINFO');
		state.TV_USERINFO = {}
	}
}
/**/
var getters = {
	show:(state)=>{
		//console.log(state.count)
	}
}
var store = new Vuex.Store({
	state,
	getters,
	mutations:mutations
})

export default store