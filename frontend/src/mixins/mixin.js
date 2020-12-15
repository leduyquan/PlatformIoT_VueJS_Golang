import Vue from 'vue';
window.AssetUrl = '/';
window.userTimezone  = 'Asia/Singapore';
window.localeCode = 'zh';
Vue.mixin({
    i18n,
    methods: {
        assetUrl: function(link) {
            link = (link || '').replace(/^\//, '');
            return window.AssetUrl + 'assets/' + link;
        },
        baseUrl: function(link) {
            link = (link || '').replace(/^\//, '');
            return window.AssetUrl + link;
        },
        localTimeConversion: function(utcTime, timezone = userTimezone, format = `${moment.HTML5_FMT.DATE} ${moment.HTML5_FMT.TIME_SECONDS}`) {
            return moment.utc(utcTime).tz(timezone).format(format);
        },
        utcTimeConvertion: function(localTime, timezone = userTimezone, format = `${moment.HTML5_FMT.DATE} ${moment.HTML5_FMT.TIME_SECONDS}`) {
            return moment.tz(moment(localTime).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS), timezone).utc().format(format);
        },
    },
});