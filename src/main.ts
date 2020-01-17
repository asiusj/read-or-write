import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/buefy';
var dateFilter = require('date-format');

Vue.config.productionTip = false;

Vue.filter('dateFormat', (date: string) => {
    if (date) {
        let d = new Date(date);
        d = dateFilter.asString('hh:mm - dd MM yyyy', d);
        return d;
    }
});

Vue.filter('descriptionLength', (text: string) => {
    return text.substr(0, 150) + '...';
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
