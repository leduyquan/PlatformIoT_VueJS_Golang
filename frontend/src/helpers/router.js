import Vue from 'vue';
import VueRouter from 'vue-router';
import TokenStorage from './token-storage';
import LoginPage from '../views/pages/login.vue';

//Dashboard
import Dashboard from '../views/pages/dashboard.vue';
import BarrierRealtime from '../components/barrier/dashboard/realtime.vue';
import BarrierLogs from '../components/barrier/dashboard/logs.vue';

import VehicleRealtime from '../components/vehicle/dashboard/realtime.vue';
import VehicleDetected from '../components/vehicle/dashboard/detected.vue';

//Admin
import Admin from '../views/pages/admin.vue';
import Barrier from '../components/barrier/admin/index.vue';
import Vehicle from '../components/vehicle/admin/vehicles.vue';
import VehicleCategories from '../components/vehicle/admin/categories.vue';
import VehicleMatchingRules from '../components/vehicle/admin/matching-rules.vue';
import Users from '../components/account/user/index.vue';
import Roles from '../components/account/role/index.vue';
import AddEditRoles from '../components/account/role/add-edit.vue';
import AgentSetting from '../components/system/settings/agent/index.vue';
import CameraSetting from '../components/system/settings/camera/index.vue';
import Service from '../components/system/services/index.vue';
import Audit from '../components/system/audits/index.vue';
import Module from '../components/configuration/module/index.vue';
import Profile from '../components/profile/index.vue';

//Crowdsense
import Crowdsense from '../views/pages/crowdsense/crowdsense.vue';
//Alpr
import Alpr from '../views/pages/alpr/index.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '*',
        redirect: '/',
    },
    {
        path: '/',
        redirect: '/barriers',
    },
    {
        path: '/login',
        component: LoginPage,
    },
    //Dashboard
    {
        name: 'dashboard',
        path: '/barriers',
        redirect: '/barriers/realtime',
        component: Dashboard,
        children: [
            { path: '/barriers/realtime', component: BarrierRealtime },
            { path: '/barriers/logs', component: BarrierLogs },
        ],
    },
    {
        name: 'vehicle',
        path: '/vehicles',
        redirect: '/vehicles/detected',
        component: Dashboard,
        children: [
            { path: '/vehicles/detected', component: VehicleDetected },
            { path: '/vehicles/realtime', component: VehicleRealtime },
        ],
    },
    //Admin
    {
        name: 'admin',
        path: '/admin',
        redirect: '/admin/vehicles',
        component: Admin,
        children: [
            //Dashboard setup
            { path: '/admin/vehicles', component: Vehicle },
            { path: '/admin/vehicles/categories', component: VehicleCategories },
            { path: '/admin/vehicles/matching-rules', component: VehicleMatchingRules },
            { path: '/admin/barriers', component: Barrier },

            //User accounts
            { path: '/admin/users', component: Users },
            { path: '/admin/roles', component: Roles },
            { path: '/admin/roles/:id', component: AddEditRoles },
            { path: '/admin/roles/:id/edit', component: AddEditRoles },

            //System
            { path: '/admin/settings', redirect: '/admin/settings/agent' },
            { path: '/admin/settings/agent', component: AgentSetting },
            { path: '/admin/settings/cameras', component: CameraSetting },

            { path: '/admin/services', component: Service },
            { path: '/admin/audits', component: Audit },
            { path: '/admin/modules', component: Module },

            //User
            { path: '/profile', component: Profile },
        ],
    },
    //Crowdsense
    {
        name: 'crowdsense',
        path: '/crowdsense',
        component: Crowdsense,
    },
    {
        name: 'alpr',
        path: '/alpr',
        component: Alpr,
    },
];

export const router = new VueRouter({
    routes,
    mode: 'history',
});

router.beforeEach((to, from, next) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/alpr', '/crowdsense', '/login'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = TokenStorage.isAuthenticated();
  
    if (authRequired && !loggedIn) {
        return next('/login');
    }
    next();
});
