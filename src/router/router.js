import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);


//1.创建组件
import Hall from '../components/hall/Hall.vue';
import Roomlist from '../components/roomlist/Roomlist.vue';
import Family from '../components/family/family.vue';
import contactus from '../components/common/contactus.vue';
import helpus from '../components/common/helpus.vue';
import Team from '../components/team/team.vue';
import Room from '../components/room/Room.vue';
import User_Base from '../components/usercenter/base.vue';


const routes = [
    { path: '', component: Hall },
    { path: '/index.html', component: Hall },
    { path: '/v1/team', component: Family },
    { path: '/v1/roomlist', component: Roomlist },
    { path: '/v1/contactus', component: contactus },
    { path: '/v1/helpus', component: helpus },
    { path: '/v1/usercenter', component: User_Base,meta: {requireAuth: false} },
    { path: '/:teamname', component: Team },
    { path: '/:teamname/:roomname', component: Room },
   
    // { path: '/news', component: News, name: 'news' },
    // { path: '/user', component: User },
    // { path: '*', redirect: '/index.html' }   /*默认跳转路由*/
]

const router = new VueRouter({
    mode: 'history',  
    routes 
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(r => r.meta.requireAuth)) {
        // if (store.state.token) {
        //     next();
        // }
        // else {
        //     next({
        //         path: '/login',
        //         query: {redirect: to.fullPath}
        //     })
        // }
        next({
            path: '/'
        })
    }
    else {
        //this.USERINFO = JSON.parse(this.storage.get('1234tv_user_info'));
        next();
    }
})

export default router;
