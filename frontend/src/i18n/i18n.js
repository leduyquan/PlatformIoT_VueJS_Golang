import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

window.i18n = new VueI18n({
    locale: document.querySelector('html').getAttribute('lang'),
    fallbackLocale: 'en',
    messages: {
        en: {
            common: require('./base/en.json'),
            vehicle: require('./vehicle/en.json'),
            configuration: require('./configuration/en.json'),
            barrier: require('./barrier/en.json'),
            setting: require('./setting/en.json'),
            alpr: require('./alpr/en.json'),
        },
        th: {
            common: require('./base/th.json'),
            vehicle: require('./vehicle/th.json'),
            configuration: require('./configuration/th.json'),
            barrier: require('./barrier/th.json'),
            setting: require('./setting/th.json'),
            alpr: require('./alpr/th.json'),
        },
    },
});