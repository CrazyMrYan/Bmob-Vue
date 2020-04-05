import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import routes from './routes.js'
Vue.use(VueRouter);
Vue.config.productionTip = false
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// use
Vue.use(mavonEditor)
const router = new VueRouter({
  routes,
  mode: "hash"
});

Vue.directive('rainbow', {
  bind(el, binding, vnode) {
    el.style.color = '#' + Math.random().toString(16).slice(2, 8);
  }
})


new Vue({
  render: h => h(App),
  router
}).$mount('#app')
