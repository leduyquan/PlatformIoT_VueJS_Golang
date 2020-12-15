require('./bootstrap');
require('./i18n/i18n');
require('./utils/custom');
require('./mixins/mixin');

import Vue from 'vue';
import App from './views/app.vue';
// TODO: remove service worker for now
//import './registerServiceWorker';
import { router } from './helpers';
import { store } from './store';

Vue.config.productionTip = false;

const app = new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
