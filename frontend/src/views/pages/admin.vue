<template>
  	<div class="admin-content-wrapper">
        <div class="fixed-top p-right-30 bg-blue-dark">
            <div class="flex-box">
                <div class="left-top-header flex-box align-items-center">
                    <a class="toggle-sidebar-button js-toggle-sidebar menu_toggle" title="Toggle menu"
                       href="javascript:void(0)">
                        <i class="fa fa-bars fs-17"></i>
                    </a>
                </div>

                <div class="right-top-header flex-col">
                    <nav class="navbar navbar-expand-md justify-content-between">
                        <div id="title_item" class="flex-box align-items-center p-left-30 d-none d-md-block" v-cloak>
                            Admin</div>
                        <div class="flex-box align-items-center">
                            <a class="white-color=r d-none d-md-block" href="/admin/vehicles"><img
                                     :src="assetUrl('img/logos/administrator.svg')" alt="logo"
                                     height="16">
                            </a>
                            <a class="white-color=r d-md-none" href="/admin/vehicles"><img
                                :src="assetUrl('img/logos/administrator.svg')" alt="logo"
                                height="11">
                            </a>
                        </div>
						<div class="view-header">
							<div class="flex-box align-items-center justify-content-end" id="alert-menu" v-cloak>
                        		<ul class="navbar-nav flex-row">
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
								<a class="btn btn btn-outline-primary btn-white-blue fs-11 f-upper d-none d-sm-inline-block" @click="navigateToDashboard">{{$t('common.view_platform')}} <i class="fa fa-external-link" aria-hidden="true"></i></a>
                                <a class="btn btn btn-outline-primary btn-white-blue fs-11 f-upper d-sm-none sm-down-w-auto" @click="navigateToDashboard">{{$t('common.platform')}} <i class="fa fa-external-link" aria-hidden="true"></i></a>
                    		</div>
						</div>
					</nav>
                </div>
            </div>
        </div>
        <v-sidebar-admin></v-sidebar-admin>
        <div class="content-wrapper no-sub-menu">
            <div class="container-fluid container-limited limit-container-width">
				<v-header-link-admin v-if="subModules.length > 0" :modules="subModules"></v-header-link-admin>
                <div class="project-page container">
					<router-view></router-view>
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
            subModules: [],
            path: "",
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
		navigateToDashboard(){
			this.$router.push({ name: 'dashboard' })
        },
        fetchSubModules() {
            const linkArr = this.path.split('/');
            if (linkArr.includes('admin')) {
                const module = linkArr[2];
                this.subModules = []; //reset
                switch(module){
                    case 'vehicles': {
                        this.subModules = [
                            { 
                                name: 'Vehicles',
                                link: '/admin/vehicles'
                            },
                            { 
                                name: 'Vehicle Categories',
                                link: '/admin/vehicles/categories'
                            },
                            { 
                                name: 'Matching Rules',
                                link: '/admin/vehicles/matching-rules'
                            }
                        ]
                        return;
                    }
                    case 'settings': {
                        this.subModules = [
                            { 
                                name: 'Agent',
                                link: '/admin/settings/agent'
                            },
                            { 
                                name: 'Cameras',
                                link: '/admin/settings/cameras'
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
