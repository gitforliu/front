var store = {
	LOGIN_STATUS:false,
	storage:{
		set(key,vue){
			localStorage.setItem(key,JSON.stringify(vue))
		},
		get(key){
			return localStorage.getItem(key)
		},
		remove(key){
			localStorage.removeItem(key)
		}
	}
}

export default store