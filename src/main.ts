import { createApp } from 'vue';
import { createPinia } from 'pinia';
import '@/assets/main.less';
import App from '@/App.vue';
import router from '@/router';
// plugins
import modalPlugin from '@/plugins/modal';
// Toast
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(modalPlugin);
app.use(Toast);
app.mount('#app');
