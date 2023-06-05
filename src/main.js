import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import DefaultLayout from './layout/DefaultLayout.vue';
import AdminLayout from './layout/AdminLayout.vue';

const app = createApp(App)
app.use(router)
app.mount('#app')
app.component('default-layout', DefaultLayout)
app.component('admin-layout', AdminLayout)


