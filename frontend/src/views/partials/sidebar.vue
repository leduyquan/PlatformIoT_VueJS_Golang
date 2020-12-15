<template>
    <div id="vue-menu-sidebar" class="nav-sidebar" v-cloak>
        <div id="slideMenuApp" class="nav-sidebar-inner">
            <ul class="sidebar-top-level-items">
                <li class="home" role="presentation" :key="index" v-for="(module, index) in modules">
                    <router-link class="shortcuts-project" :to="baseUrl(module.link)" :data-module="module.slug" :title="$t('common.title_' + module.name)">
                        <div class="nav-icon-container">
                            <svg>
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="assetUrl('/img/icons.svg#' + module.name)"></use>
                            </svg>
                        </div>
                        <span class="nav-item-name">{{$t('common.' + module.name)}}</span>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    export default {
        name: "SidebarMenu",
        data() {
            return {
                modules: [],
                subModules: [],
            };
        },
        mounted: function() {
            let self = this;
            const allModules = [
                {
                    "_id": "5e7199b59a49c8d6e87e89f1",
                    "name": "barrier",
                    "type": "admin",
                    "created_at": "2020-03-19 08:33:39",
                    "default": false,
                    "description": "Barrier Management Module",
                    "icon_url": null,
                    "order": 8,
                    "parent_id": "5e7199849a49c8d6e87e8220",
                    "parent_slug": "dashboard",
                    "slug": "barriers",
                    "status": "Active",
                    "updated_at": "2020-03-19 08:35:26",
                    "children": [
                    {
                        "_id": "5e7199b59a49c8d6e87e89f5",
                        "name": "barrier-realtime",
                        "type": "dashboard",
                        "created_at": "2020-03-19 08:33:39",
                        "default": false,
                        "description": "Barrier Realtime",
                        "icon_url": null,
                        "order": 0,
                        "parent_id": "5e7199b59a49c8d6e87e89f1",
                        "parent_slug": "barriers",
                        "slug": "realtime",
                        "status": "Active",
                        "updated_at": "2020-03-19 08:35:26"
                    },
                    {
                        "_id": "5e7199b59a49c8d6e87e89f7",
                        "name": "barrier-logs",
                        "type": "dashboard",
                        "created_at": "2020-03-19 08:33:39",
                        "default": false,
                        "description": "Barrier Logs",
                        "icon_url": null,
                        "order": 1,
                        "parent_id": "5e7199b59a49c8d6e87e89f1",
                        "parent_slug": "barriers",
                        "slug": "logs",
                        "status": "Active",
                        "updated_at": "2020-03-19 08:35:26"
                    }
                    ],
                    "link": "barriers/realtime"
                },
                {
                    "_id": "5e7199b59a49c8d6e87e89f2",
                    "name": "vehicle",
                    "type": "admin",
                    "created_at": "2020-03-19 08:33:39",
                    "default": false,
                    "description": "Vehicle Management Module",
                    "icon_url": null,
                    "order": 9,
                    "parent_id": "5e7199849a49c8d6e87e8222",
                    "parent_slug": "dashboard",
                    "slug": "vehicles",
                    "status": "Active",
                    "updated_at": "2020-03-19 08:35:26",
                    "children": [
                    {
                        "_id": "5e7199b59a49c8d6e87e89f6",
                        "name": "vehicle-realtime",
                        "type": "dashboard",
                        "created_at": "2020-03-19 08:33:39",
                        "default": false,
                        "description": "Vehicle Realtime",
                        "icon_url": null,
                        "order": 0,
                        "parent_id": "5e7199b59a49c8d6e87e89f2",
                        "parent_slug": "vehicles",
                        "slug": "realtime",
                        "status": "Active",
                        "updated_at": "2020-03-19 08:35:26"
                    },
                    {
                        "_id": "5e7199b59a49c8d6e87e89f8",
                        "name": "vehicle-detected",
                        "type": "dashboard",
                        "created_at": "2020-03-19 08:33:39",
                        "default": false,
                        "description": "Vehicle Detected",
                        "icon_url": null,
                        "order": 1,
                        "parent_id": "5e7199b59a49c8d6e87e89f2",
                        "parent_slug": "vehicles",
                        "slug": "detected",
                        "status": "Active",
                        "updated_at": "2020-03-19 08:35:26"
                    }
                    ],
                    "link": "vehicles/realtime"
                },
            ]

            self.modules = allModules;
            self.addChildrenSlug();
        },
        methods: {
            addChildrenSlug: function(){
                let self = this;
                _.forEach(self.modules, function (module, idx) {
                    let childrenSlug = [];
                    _.forEach(module.children, function (sub, idx) {
                        if (module.slug === sub.parent_slug) {
                            childrenSlug.push(sub);
                        }
                    });
                    module.link = _.isEmpty(childrenSlug) ? module.slug : module.slug + '/' + childrenSlug[0].slug;
                })
            }
        }
    };
</script>