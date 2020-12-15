
window._ = window.Lodash = require('lodash');
window.Popper = require('popper.js').default;

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

try {
    window.$ = window.jQuery = require('jquery');

    require('bootstrap');
} catch (e) {}

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = require('axios');

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
/**
 * Vue is a modern JavaScript library for building interactive web interfaces
 * using reactive data binding and reusable components. Vue's API is clean
 * and simple, leaving you to focus on building your next great project.
 */
import Vue from 'vue'

window.toastr = require('toastr');
require('vue-resource');
require('leaflet');
require('mapbox.js');
require('leaflet-draw');

window.moment = require('moment-timezone');

require('vue-masonry-css');
window.vSelect = require('vue-select');
window.VCarousel = require('vue-carousel');
window.InputTag = require('vue-input-tag');
window.Lang = require('element-ui/lib/locale/lang/en');
window.Locale = require('element-ui/lib/locale');
window.Locale.use(window.Lang.default);
window.moment.locale(document.querySelector('html').getAttribute('lang'));

window.ElementUI = require('element-ui');
Vue.use(ElementUI);
window.VueGridLayout = require('vue-grid-layout');

/**
 * Next we will register the CSRF Token as a common header with Axios so that
 * all outgoing HTTP requests automatically have it attached. This is just
 * a simple convenience so we don't have to attach every token manually.
 */

const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found!');
}

// Views Dashboard Compoments
Vue.component('v-sidebar-dashboard', require('./views/partials/sidebar.vue').default);
Vue.component('v-sidebar-admin', require('./views/partials/sidebar-admin.vue').default);
Vue.component('v-header-link', require('./views/partials/header-link.vue').default);
Vue.component('v-header-link-admin', require('./views/partials/header-link-admin.vue').default);

// Common Components
Vue.component('v-pagination', require('./components/base/pagination.vue').default);
Vue.component('modal-delete', require('./components/base/modal-delete.vue').default);
Vue.component('v-filter', require('./components/base/filter.vue').default);

Vue.component('v-select', vSelect.VueSelect);
Vue.component('carousel', VCarousel.Carousel);
Vue.component('slide', VCarousel.Slide);
Vue.component('input-tag', InputTag.default);

// passport components
Vue.component('passport-clients', require('./components/passport/Clients.vue'));
Vue.component('passport-authorized-clients', require('./components/passport/AuthorizedClients.vue'));
Vue.component('passport-personal-access-tokens', require('./components/passport/PersonalAccessTokens.vue'));

// base module
Vue.component('gauge-meter', require('./components/base/gauge-meter.vue'));
Vue.component('toggle-button', require('./components/base/button.vue'));

Vue.component('v-filter-range', require('./components/base/filter-range.vue'));

Vue.component('v-grid-title', require('./components/base/grid-title.vue'));

// filters
Vue.filter('formatDate', require('./filters/formatDate.js'));
Vue.filter('round', require('./filters/round.js'));
Vue.filter('startCase', value => _.startCase(value));
Vue.filter('lowerCase', value => _.lowerCase(value));
Vue.filter('traverse', (obj, keyPath) =>
    keyPath.split('.').reduce((cur, key) => cur[key], obj)
);
