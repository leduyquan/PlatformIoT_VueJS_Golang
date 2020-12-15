<template>
    <div :class="classes" role="filter" v-click-outside="closeDropdown">
        <button data-toggle="collapse" :data-target="'#filter-'+id" class="btn btn-outline-primary caption" :class="{'active':optionSelectedNumber}" v-text="caption + optionSelectedNumber"></button>
        <div class="filter-drop collapse" :id="'filter-'+id">
            <div class="input-group search-box" v-if="searchable">
                <div class="input-group-prepend">
                    <div class="input-group-text"><i class="fa fa-search" aria-hidden="true"></i></div>
                </div>
                <input type="text" class="form-control" v-model='searchKey' placeholder="Search">
            </div>
            <ul :class="containerClasses" role="group">
                <li v-if="filterData.length==0">No item found</li>
                <filter-item v-for="(child, index) in filterData"
                             :key="index"
                             :data="child"
                             :is-search = "isSearch"
                             :text-field-name="textFieldName"
                             :value-field-name="valueFieldName"
                             :children-field-name="childrenFieldName"
                             :item-events="itemEvents"
                             :height="sizeHeight"
                             :depth="0"
                             :on-item-click="onItemClick"
                             :on-item-toggle="onItemToggle"
                             :klass="index === filterData.length-1?'filter-last':''">
                    <template slot-scope="_">
                        <slot :vm="_.vm" :model="_.model">
                            <label class="control control--checkbox">
                                <div class="control__indicator"></div>
                                {{ _.model[textFieldName] }}
                                <span class="selected-count blue-color" v-if="_.model.selectedCount">
                                     &nbsp;({{ _.model.selectedCount }})
                                </span>
                            </label>
                        </slot>
                    </template>
                </filter-item>
            </ul>
            <div class="filter-action flex-box justify-content-between p-top-10">
                <a class="blue-color c-pointer" href="javascript:void(0)" @click="onClear">Clear</a>
                <a class="blue-color c-pointer" href="javascript:void(0)" @click="onApply">Apply</a>
            </div>
        </div>
    </div>
</template>
<script>
    import filterItem from './filter-item.vue'

    let ITEM_ID = 0
    let ITEM_HEIGHT_SMALL = 18
    let ITEM_HEIGHT_DEFAULT = 24
    let ITEM_HEIGHT_LARGE = 32

    export default {
        name: 'VFilter',
        props: {
            id:{type:String},
            caption:{type:String, default:'Caption'},
            data: {type: Array},
            size: {type: String, validator: value => ['large', 'small'].indexOf(value) > -1},
            textFieldName: {type: String, default: 'text'},
            valueFieldName: {type: String, default: 'value'},
            childrenFieldName: {type: String, default: 'children'},
            itemEvents: {
                type: Object, default: function () {
                    return {}
                }
            },
            searchable:{type:Boolean,default:false},
            async: {type: Function},
            loadingText: {type: String, default: 'Loading...'},
            klass: String
        },
        data() {
            return {
                opened:false,
                currentDepth:0,
                searchKey: '',
                innerSearchKey: '',
                optionSelectedNumber:''
            }
        },
        computed: {
            filterData: function () {
                var self = this;
                var _filterItems = [];
                if (!self.innerSearchKey){
                    self.forceData(self.data);
                    _filterItems = self.data.slice()
                }
                else
                    _filterItems = self.data.filter(function (row) {
                        var found = false;
                        if (row != null && (typeof row == "object")) {
                            if(self.innerSearchKey){
                                Object.keys(row).map(function (propName, index) {
                                    var propValue = row[propName];
                                    if(propName==self.childrenFieldName){
                                        row[propName].map(function(child){
                                            var foundChild = false;
                                            Object.keys(child).map(function (propChild, index) {
                                                var propValueChild = child[propChild];
                                                if (propValueChild && propChild == self.textFieldName) {
                                                    propValueChild = propValueChild.toString().toLowerCase().trim();
                                                    if (propValueChild.includes(self.innerSearchKey)) {
                                                        foundChild = true;
                                                        found = true;
                                                    }
                                                }
                                            })
                                            if(foundChild){
                                                child.show = true;
                                            }else{
                                                child.show = false;
                                            }
                                        })
                                    }
                                    else {
                                        if (propValue && propName == self.textFieldName) {
                                            propValue = propValue.toString().toLowerCase().trim();
                                            if (propValue.includes(self.innerSearchKey)) {
                                                found = true;
                                            }
                                        }
                                    }
                                });
                            }else{
                                found = true;
                            }
                        }
                        if(found){
                            row.show = true;
                        }else{
                            row.show = false;
                        }
                        if (found) return row;
                    })
                if(_filterItems.length == 0) self.currentDepth = 0;
                return _filterItems;
            },
            isSearch:function(){
                return !(!this.innerSearchKey);
            },
            classes() {
                return [
                    'opened-depth-'+this.currentDepth,
                    {'filter-box': true},
                    {'filter-default': !this.size},
                    {'filter-child-opened': this.opened},
                    {[`filter-default-${this.size}`]: !!this.size}
                ]
            },
            containerClasses() {
                return [
                    {'filter-container-ul': true},
                    {'filter-children': true},
                    {[this.klass]: !!this.klass}
                ]
            },
            sizeHeight() {
                switch (this.size) {
                    case 'large':
                        return ITEM_HEIGHT_LARGE
                    case 'small':
                        return ITEM_HEIGHT_SMALL
                    default:
                        return ITEM_HEIGHT_DEFAULT
                }
            }
        },
        watch: {
            searchKey() {
                this.updateInnerSearchKey()
            }

        },
        methods: {
            initializeData(items) {
                if (items && items.length > 0) {
                    for (let i in items) {
                        var dataItem = this.initializeDataItem(items[i])
                        items[i] = dataItem
                        this.initializeData(items[i][this.childrenFieldName])
                    }
                }
            },
            initializeDataItem(item) {
                function Model(item, textFieldName, valueFieldName, childrenFieldName, collapse) {
                    this.id = item.id || ITEM_ID++
                    this[textFieldName] = item[textFieldName] || ''
                    this[valueFieldName] = item[valueFieldName] || ''
                    this.icon = item.icon || ''
                    this.opened = item.opened || collapse
                    this.selected = item.selected || false
                    this.disabled = item.disabled || false
                    this.indeterminate = item.indeterminate || false
                    this.selectedCount = 0
                    this[childrenFieldName] = item[childrenFieldName] || []
                }

                let node = Object.assign(new Model(item, this.textFieldName, this.valueFieldName, this.childrenFieldName, this.collapse), item)
                let self = this
                node.addBefore = function (data, selectedNode) {
                    let newItem = self.initializeDataItem(data)
                    let index = selectedNode.parentItem.findIndex(t => t.id === node.id)
                    selectedNode.parentItem.splice(index, 0, newItem)
                }
                node.addAfter = function (data, selectedNode) {
                    let newItem = self.initializeDataItem(data)
                    let index = selectedNode.parentItem.findIndex(t => t.id === node.id) + 1
                    selectedNode.parentItem.splice(index, 0, newItem)
                }
                node.addChild = function (data) {
                    let newItem = self.initializeDataItem(data)
                    node.opened = true
                    node[self.childrenFieldName].push(newItem)
                }
                node.openChildren = function () {
                    node.opened = true
                    self.handleRecursionNodeChildren(node, node => {
                        node.opened = true
                    })
                }
                node.closeChildren = function () {
                    node.opened = false
                    self.handleRecursionNodeChildren(node, node => {
                        node.opened = false
                    })
                }
                return node
            },
            handleRecursionNodeChilds(node, func) {
                if (func(node) !== false) {
                    if (node.$children && node.$children.length > 0) {
                        for (let childNode of node.$children) {
                            if (!childNode.disabled) {
                                this.handleRecursionNodeChilds(childNode, func)
                            }
                        }
                    }
                }
            },
            handleRecursionNodeChildren(node, func) {
                if (func(node) !== false) {
                    if (node[this.childrenFieldName] && node[this.childrenFieldName].length > 0) {
                        for (let childNode of node[this.childrenFieldName]) {
                            this.handleRecursionNodeChildren(childNode, func)
                        }
                    }
                }
            },
            onItemClick(oriNode, oriItem, e) {
                var self = this;
                this.handleBatchSelectItems(oriNode, oriItem);
                this.$emit('item-click', oriNode, oriItem, e);
                setTimeout(function(){
                    var _optionSelected = self.data.filter(x=> (x.selected || x.indeterminate));
                    self.optionSelectedNumber = _optionSelected.length?' - '+_optionSelected.length:'';
                },500)
            },
            handleBatchSelectItems(oriNode, oriItem) {
                this.handleRecursionNodeChilds(oriNode, node => {
                    if (node.model.disabled) return
                    node.model.selected = oriNode.model.selected
                })
            },
            forceData:function(data){
                var that = this;
                that.optionSelectedNumber = '';
                that.searchKey = '';
                that.currentDepth = 0;
                data.map(function(item){
                    item.selected =  false;
                    item.selectedCount =  0;
                    item.indeterminate = false;
                    item.show = true;

                    if(item[that.childrenFieldName] && item[that.childrenFieldName].length){
                        that.forceData(item[that.childrenFieldName]);
                    }
                })
            },
            onClear(e) {
                this.searchKey = '';
                this.currentDepth = 0;
                this.forceData(this.data);
                this.$emit('clear-click',this,e);
            },
            onApply(e) {
                this.closeDropdown();
                this.$emit('apply-click',this,e);
            },
            onItemToggle(oriNode, oriItem, e, depthStep) {
                var self = this;
                ///this.opened = oriNode.model.opened;
                if(depthStep<0){
                    this.currentDepth--;
                }else{
                    this.currentDepth++;
                }
                this.$emit('item-toggle', oriNode, oriItem, e);
            },
            updateInnerSearchKey: Lodash.debounce(function () {
                this.innerSearchKey = this.searchKey.toLowerCase().trim();
            }, 200),
            closeDropdown:function(){
                $('#filter-'+this.id).collapse('hide');
            }
        },
        directives: {
            'click-outside': {
                bind: function(el, binding, vNode) {
                    if (typeof binding.value !== 'function') {
                        const compName = vNode.context.name
                        let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`
                        if (compName) { warn += `Found in component '${compName}'` };

                        console.log(warn)
                    }
                    // Define Handler and cache it on the element
                    const bubble = binding.modifiers.bubble
                    const handler = (e) => {
                        if (bubble || (!el.contains(e.target) && el !== e.target)) {
                            binding.value(e)
                        }
                    }
                    el.__vueClickOutside__ = handler

                    // add Event Listeners
                    document.addEventListener('click', handler)
                },
                unbind: function(el, binding) {
                    // Remove Event Listeners
                    document.removeEventListener('click', el.__vueClickOutside__)
                    el.__vueClickOutside__ = null

                }
            }
            },
        created() {
            this.initializeData(this.data);
        },
        mounted() {
        },
        components: {
            filterItem
        }
    }
</script>