<template>
    <div class="opened-depth-0 filter-box filter-default" v-click-outside="closeDropdown">
        <button
            data-toggle="collapse"
            :data-target="'#filter-' + id"
            class="btn btn-outline-primary caption"
            :class="{ active: rangeValue[0] != 0 || rangeValue[1] != 100 }"
            aria-expanded="true"
        >
            {{ caption }}
            <template v-if="rangeValue[0] != 0 || rangeValue[1] != 100">
                &nbsp;{{ rangeValue[0] + '-' + rangeValue[1] }}
            </template>
        </button>
        <div :id="'filter-' + id" class="filter-drop collapse" style="">
            <el-slider v-model="rangeValue" range show-stops :min="0" :max="100"></el-slider>
            <div class="filter-action flex-box justify-content-between p-top-10">
                <a href="javascript:void(0)" class="blue-color c-pointer" @click="onClear">Clear</a>
                <a href="javascript:void(0)" class="blue-color c-pointer" @click="onApply">Apply</a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'VFilterRange',
    props: {
        id: {
            type: String,
        },
        caption: {
            type: String,
        },
        filterRange: {
            type: Array,
        },
    },
    data() {
        return {
            rangeValue: [],
            rangeMax: 100,
            rangeMin: 0
        };
    },
    mounted() {
        this.rangeValue = this.filterRange;
        this.rangeMin = this.filterRange[0];
        this.rangeMax = this.filterRange[1];
    },
    methods: {
        onClear(e) {
            this.rangeValue = [this.rangeMin, this.rangeMax];
        },
        onApply(e) {
            this.closeDropdown();
            this.$emit('apply-click', this, e);
        },
        closeDropdown: function() {
            $('#filter-' + this.id).collapse('hide');
        },
    },
    directives: {
        'click-outside': {
            bind: function(el, binding, vNode) {
                if (typeof binding.value !== 'function') {
                    const compName = vNode.context.name;
                    let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`;
                    if (compName) {
                        warn += `Found in component '${compName}'`;
                    }
                }
                // Define Handler and cache it on the element
                const bubble = binding.modifiers.bubble;
                const handler = e => {
                    if (bubble || (!el.contains(e.target) && el !== e.target)) {
                        binding.value(e);
                    }
                };
                el.__vueClickOutside__ = handler;

                // add Event Listeners
                document.addEventListener('click', handler);
            },
            unbind: function(el, binding) {
                // Remove Event Listeners
                document.removeEventListener('click', el.__vueClickOutside__);
                el.__vueClickOutside__ = null;
            },
        },
    }
};
</script>
