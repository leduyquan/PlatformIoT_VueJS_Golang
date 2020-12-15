<template>
    <router-view></router-view>
</template>
<script>
    export default {
        data() {
            return {
                path: this.$route.path,
            };
        },
        mounted() {
            this.$nextTick(function() {
                this.handleSidebarActive();
            });
        },
        updated() {
            if (this.path !== this.$route.path) this.path = this.$route.path;
        },
        watch: {
            path() {
                this.handleSidebarActive();
            },
        },
        methods: {
            handleSidebarActive(){
                const path = this.formatPath(this.$route.path);
				const moduleList = document.getElementsByClassName('shortcuts-project');
				for (let item of moduleList) {
					const parent = item.parentElement;
					if (parent.classList.contains('active')) parent.classList.remove('active');
                    const pathName = this.formatPath(item.pathname);
                    if (pathName === path) {
						parent.classList.add('active');
						if (parent.classList.contains('menu-item-sub')) {
							const closest = parent.closest(".nav-sidebar-sub");
							const sibling = closest.previousElementSibling;
							const adminContent = document.querySelector('.admin-content-wrapper');
							closest.classList.add('show');
							sibling.classList.add('active');
							adminContent.classList.add('page-with-icon-sidebar');
						}
					}
				}
			},
            formatPath(path) {
				const count = path.split('/');
				if (count.includes('admin')) {
					if (count.length > 3) count.pop();
				} else {
					if (count.length > 2) count.pop();
				}
				return count.join('/');
			},
        },
    };
</script>