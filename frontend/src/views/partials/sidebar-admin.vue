<template>
	<div id="sidebar-admin" class="nav-sidebar-admin" v-cloak>
		<div id="slideMenuApp" class="nav-sidebar-inner">
			<ul class="sidebar-top-level-items">
				<li :key="index" v-for="(module, index) in modules" class="home">
					<div class="menu-item fa-submenu">
						<router-link class="shortcuts-project" :to="baseUrl('admin/' + module.slug)"
							:data-module="module.slug" :class="checkSubModules(module.children) ? 'collapse' : ''">
							<div class="nav-icon-container">
								<svg>
									<use xmlns:xlink="http://www.w3.org/1999/xlink"
										:xlink:href="assetUrl('/img/icons.svg#' + module.icon_url)"></use>
								</svg>
							</div>
							<span class="nav-item-name transition-sidebar">{{ module.description  }}</span>
						</router-link>
						<a v-if="checkSubModules(module.children)" class="d-flex fa-submenu__side--display" data-toggle="collapse"
							:href="'#nav-sub-' + module._id" @click="onOpenTab(module._id)">
							<i class="fa fa-caret-down m-right-5 right-direction"></i>
						</a>
					</div>
					<div :id="'nav-sub-' + module._id" class="nav-sidebar-sub collapse width">
						<ul class="sidebar-second-level-items">
							<li :key="index" v-for="(sub, index) in module.children">
								<div class="menu-item-sub">
									<router-link class="shortcuts-project" :to="baseUrl('admin/' + sub.slug)" :data-module="sub.slug" >
										<span class="nav-item-name">{{ sub.slug }}</span>
									</router-link>
								</div>
							</li>
						</ul>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
	export default {
		name: "SidebarMenuAdmin",
		data: function () {
            return {
                oldModule: '',
                modules: [],
                subModules: []
            }
        },
        mounted: function() {
            let self = this;
			//self.modules = allModules;
			self.modules = [
				{
					"_id": "5e992f55d28ae10a7c63abb5",
					"name": "dashboard",
					"parent_slug": null,
					"type": "admin",
					"created_at": "2020-04-17 04:23:49",
					"default": false,
					"description": "Dashboard Setup",
					"icon_url": "dashboard_setup",
					"module_id": null,
					"order": 0,
					"slug": "dashboard",
					"status": "Active",
					"updated_at": "2020-04-17 04:24:47",
					"children": [
					{
						"_id": "5e992f55d28ae10a7c63ac27",
						"name": "vehicle",
						"type": "admin",
						"created_at": "2020-04-17 04:23:49",
						"default": false,
						"description": "Vehicle Management Module",
						"icon_url": null,
						"order": 2,
						"parent_id": "5e992f55d28ae10a7c63abb5",
						"parent_slug": "dashboard",
						"slug": "vehicles",
						"status": "Active",
						"updated_at": "2020-04-17 04:24:47"
					},
					{
						"_id": "5e992f56d28ae10a7c63ac90",
						"name": "barrier",
						"type": "admin",
						"created_at": "2020-04-17 04:23:50",
						"default": false,
						"description": "Barrier Management Module",
						"icon_url": null,
						"order": 3,
						"parent_id": "5e992f55d28ae10a7c63abb5",
						"parent_slug": "dashboard",
						"slug": "barriers",
						"status": "Active",
						"updated_at": "2020-04-17 04:24:47"
					}
					]
				},
				{
					"_id": "5e992f55d28ae10a7c63abb7",
					"name": "account",
					"parent_slug": null,
					"type": "admin",
					"created_at": "2020-04-17 04:23:49",
					"default": false,
					"description": "User Accounts",
					"icon_url": "people",
					"order": 1,
					"parent_id": null,
					"slug": "accounts",
					"status": "Active",
					"updated_at": "2020-04-17 04:24:47",
					"children": [
					{
						"_id": "5e992f55d28ae10a7c63abbe",
						"name": "user",
						"type": "admin",
						"created_at": "2020-04-17 04:23:49",
						"default": false,
						"description": "Account User Module",
						"icon_url": null,
						"order": 0,
						"parent_id": "5e992f55d28ae10a7c63abb7",
						"parent_slug": "account",
						"slug": "users",
						"status": "Active",
						"updated_at": "2020-04-17 04:24:47"
					},
					{
						"_id": "5e992f55d28ae10a7c63abc0",
						"name": "role",
						"type": "admin",
						"created_at": "2020-04-17 04:23:49",
						"default": false,
						"description": "Account Role Module",
						"icon_url": null,
						"order": 1,
						"parent_id": "5e992f55d28ae10a7c63abb7",
						"parent_slug": "account",
						"slug": "roles",
						"status": "Active",
						"updated_at": "2020-04-17 04:24:47"
					}
					]
				},
				{
					"_id": "5e992f55d28ae10a7c63abb9",
					"name": "system",
					"parent_slug": null,
					"type": "admin",
					"created_at": "2020-04-17 04:23:49",
					"default": false,
					"description": "System",
					"icon_url": "system",
					"order": 2,
					"parent_id": null,
					"slug": "systems",
					"status": "Active",
					"updated_at": "2020-04-17 04:24:47",
					"children": [
					{
						"_id": "5e992f55d28ae10a7c63abee",
						"name": "setting",
						"type": "admin",
						"created_at": "2020-04-17 04:23:49",
						"default": false,
						"description": "Setting Module",
						"icon_url": null,
						"order": 0,
						"parent_id": "5e992f55d28ae10a7c63abb9",
						"parent_slug": "system",
						"slug": "settings",
						"status": "Active",
						"updated_at": "2020-04-17 04:24:47"
					},
					{
						"_id": "5e992f55d28ae10a7c63ac08",
						"name": "service",
						"type": "admin",
						"created_at": "2020-04-17 04:23:49",
						"default": false,
						"description": "System Service Module",
						"icon_url": null,
						"order": 1,
						"parent_id": "5e992f55d28ae10a7c63abb9",
						"parent_slug": "system",
						"slug": "services",
						"status": "Active",
						"updated_at": "2020-04-17 04:24:47"
					},
					{
						"_id": "5e992f55d28ae10a7c63ac14",
						"name": "audit",
						"type": "admin",
						"created_at": "2020-04-17 04:23:49",
						"default": false,
						"description": "System Audit Trail Module",
						"icon_url": null,
						"order": 2,
						"parent_id": "5e992f55d28ae10a7c63abb9",
						"parent_slug": "system",
						"slug": "audits",
						"status": "Active",
						"updated_at": "2020-04-17 04:24:47"
					}
					]
				},
				// {
				// 	"_id": "5e992f55d28ae10a7c63abbb",
				// 	"name": "configuration",
				// 	"parent_slug": null,
				// 	"type": "admin",
				// 	"created_at": "2020-04-17 04:23:49",
				// 	"default": false,
				// 	"description": "Configurations",
				// 	"icon_url": "setting",
				// 	"order": 3,
				// 	"parent_id": null,
				// 	"slug": "configurations",
				// 	"status": "Inactive",
				// 	"updated_at": "2020-04-17 04:24:47",
				// 	"children": [
				// 	{
				// 		"_id": "5e992f55d28ae10a7c63ac20",
				// 		"name": "configuration-module",
				// 		"type": "admin",
				// 		"created_at": "2020-04-17 04:23:49",
				// 		"default": false,
				// 		"description": "Modules List",
				// 		"icon_url": null,
				// 		"order": 0,
				// 		"parent_id": "5e992f55d28ae10a7c63abbb",
				// 		"parent_slug": "configuration",
				// 		"slug": "modules",
				// 		"status": "Inactive",
				// 		"updated_at": "2020-04-17 04:24:47"
				// 	},
				// 	]
				// }
			]
		},
        methods: {
            onOpenTab: function(module){
                let self = this;
                let activeModule = '';
                let isTabOpen = false;
                let subItem = document.getElementsByClassName("menu-item-sub");
                let adminContent = document.getElementsByClassName("admin-content-wrapper");
                isTabOpen = adminContent[0].classList.contains('page-with-icon-sidebar');
                Array.prototype.forEach.call(subItem, function(el) {
                    if (el.className.includes('active')) {
                        activeModule = el.parentNode.parentNode.parentNode.id.replace('nav-sub-', '');
                    }
                });

                if (self.oldModule === '' || self.oldModule === module) {
                    if (!_.isEmpty(activeModule) && self.oldModule === '' && activeModule !== module) {
                        const _element = document.getElementById("nav-sub-" + activeModule);
                        _element.classList.remove("show");
                    } else {
                        $('.admin-content-wrapper').toggleClass('page-with-icon-sidebar');
                    }
                } else {
                    if (isTabOpen) {
                        const _element = document.getElementById("nav-sub-" + self.oldModule);
                        _element.classList.remove("show");
                    } else {
                        $('.admin-content-wrapper').toggleClass('page-with-icon-sidebar');
                    }
                }
				self.oldModule = module;
				console.log("s", self.oldModule)
			},
			checkSubModules: function(children) {
                return _.isEmpty(children) ? false : true;
            },
        }
	};
</script>
<style scoped>
	.router-link-active {
		    background-color: none;
	}
</style>