<template>
    <div class="page-with-sidebar">
        <div class="fixed-top p-right-30 bg-blue-dark">
            <div class="flex-box">
                <div class="left-top-header flex-box align-items-center">
                    <a class="toggle-sidebar-button js-toggle-sidebar menu_toggle" title="Toggle menu" href="javascript:void(0)">
                        <i class="fa fa-bars fs-17"></i>
                    </a>
                </div>
                <div class="right-top-header flex-col">
                    <nav class="navbar navbar-expand-md justify-content-between">
                        <div class="flex-box align-items-center p-left-30 d-none d-sm-block justify-content-start" style="width: 100px;">
                            <div id="vue-title-item" v-cloak><slot name="title"></slot>{{ title }}</div>
                        </div>
                        <div class="flex-box align-items-center">
                            <a class="navbar-brand white-color" href="/"><img :src="assetUrl('img/logos/dashboard.svg')" alt="logo" height="15">
                            </a>
                        </div>
                        <div class="view-header">
                            <div class="flex-box align-items-center justify-content-end" id="alert-menu" v-cloak>
                                <ul class="navbar-nav flex-row">
                                    <li class="nav-item dropdown" >
                                        <a class="nav-link" id="dropdown_alert" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" @click="openCloseAlertBar()" v-cloak>
                                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="19" viewBox="0 0 512 512" fill="#fff"><path d="M 480.00,480.00l-169.00,0.00 q-8.50,14.50 -23.00,23.25t-32.00,8.75t-32.00-8.75t-23.00-23.25l-169.00,0.00 q-13.50,0.00 -22.75-9.50t-9.25-22.50l0.00-32.00 q 26.50,0.00 45.25-37.50t 18.75-90.50l0.00-64.00 q0.00-71.00 45.75-124.25t 114.25-64.75l0.00-3.00 q0.00-13.50 9.50-22.75t 22.50-9.25t 22.50,9.25t 9.50,22.75l0.00,3.00 q 68.50,11.50 114.25,64.75t 45.75,124.25l0.00,64.00 q0.00,53.00 18.75,90.50 t 45.25,37.50l0.00,32.00 q0.00,13.00 -9.25,22.50t-22.75,9.50z"/></svg>
                                            <span class="number">1</span>
                                        </a>
                                        <div id="dropdownMenu" class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdown_alert" >
                                            <!-- <alert-bar view-alerts="openCloseAlertBar"></alert-bar> -->
                                        </div>
                                    </li>
                                    <li class="nav-item dropdown p-right-10 p-left-5">
                                        <a class="nav-link"  id="dropdown_profile" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <img class="rounded-circle" :src="assetUrl('img/avatar.png')" height="20">
                                            <i class="fa fa-angle-down"></i>
                                        </a>
                                        <div class="dropdown-menu" aria-labelledby="dropdown_profile">
                                            <router-link class="dropdown-item" to="/profile">Setting</router-link>
                                            <a class="dropdown-item" href="/logout" @click="logout">Logout</a>
                                        </div>
                                    </li>
                                </ul>
                                <a class="btn btn btn-outline-primary btn-white-blue fs-11 f-upper d-none d-sm-inline-block" @click="navigateToAdmin">{{$t('common.view_administration')}} <i class="fa fa-external-link" aria-hidden="true"></i></a>
                                <a class="btn btn btn-outline-primary btn-white-blue fs-11 f-upper d-sm-none sm-down-w-auto" @click="navigateToAdmin">{{$t('common.admin')}} <i class="fa fa-external-link" aria-hidden="true"></i></a>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
        <v-sidebar-dashboard></v-sidebar-dashboard>
        <div class="content-wrapper">
            <div class="container-fluid container-limited limit-container-width">
                <div id="vue-title-item-responsive" class="p-left-15 d-sm-none clear m-bot-15" v-cloak>Title here</div>
                <v-header-link v-if="subModules.length > 0" :modules="subModules"></v-header-link>
                <div class="project-page container">
                    <router-view></router-view>
                </div>
            </div>
        </div>
        <div class="red-alert fixed-box" id="latest-alert" v-cloak>
            <div class="flex-box c-pointer" click="#">
                <div class="flex-col-10"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></div>
                <div class="flex-col-90"><span class="fs-10"></span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
export default {
    data() {
        return {
            msg: 'Welcome to Your Vue.js App',
            subModules: [],
            path: "",
            title: 'Barriers'
        };
    },
    mounted() {
        const self = this;
        self.path = window.location.pathname
    },
    watch: {
        path(){
            this.fetchSubModules();
        }
    },
    updated() {
        this.path = window.location.pathname;
    },
    methods: {
        ...mapActions('account', ['logout']),
        navigateToAdmin(){
            this.$router.push({ name: 'admin' })
        },
        fetchSubModules() {
            const linkArr = this.path.split('/');
            if (!linkArr.includes('admin')) {
                const module = linkArr[1];
                this.title = _.upperFirst(module)
                this.subModules = []; //reset
                switch(module){
                    case 'barriers': {
                        this.subModules = [
                            {
                                name: 'Realtime Detection',
                                link: '/barriers/realtime'
                            },
                            {
                                name: 'Barrier Logs',
                                link: '/barriers/logs'
                            }
                        ]
                        return;
                    }
                    case 'vehicles': {
                        this.subModules = [
                            {
                                name: 'Vehicles Realtime',
                                link: '/vehicles/realtime'
                            },
                            {
                                name: 'Vehicles Detected',
                                link: '/vehicles/detected'
                            },
                        ]
                        return;
                    }
                    default: return []
                }
            }
        }
    },
};
</script>

<style lang="scss">
@import "../../assets/scss/app.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
