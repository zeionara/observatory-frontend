import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Equal from 'equal-vue'
import 'equal-vue/dist/equal.css'
import { VueCookieNext } from 'vue-cookie-next'

createApp(App).use(Equal).use(VueCookieNext).use(store).use(router).mount('#app')
