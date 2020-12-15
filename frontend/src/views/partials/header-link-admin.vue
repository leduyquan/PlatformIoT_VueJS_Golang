<template>
    <div id="vue-app-tab" class="container project-page">
        <div class="flex-box">
            <div class="responsive-nav m-bot-15">
                <ul class="nav nav-tabs nav-main f-upper" role="tablist">
					<li v-for="(module, index) in modules" :key="index" class="nav-item" role="presentation">
                        <router-link class="nav-link" :to="module.link">{{module.name}}</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'HeaderLink',
    props: ['modules'],
    data() {
        return {
        };
    },
};
</script>
<style>
    .router-link-exact-active {
        color: #4e6de2 !important;
        background-color: transparent;
        border-color: transparent transparent #4e6de2 transparent !important;
    }
</style>