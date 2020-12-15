<template>
	<div class="project-page" id="configurationFormApp" v-cloak>
        <div id="configuration" class="container">
            <div class="tab-content">
                <div class="fs-18 d-md-none m-bot-15">{{$t('common.modules_list')}}</div>
                <div class="tab-pane active" role="tabpanel">
                    <div class="tab-content">
                        <form id="configurationForm" action="#" class="el-form" method="POST">
                            <!-- <input type="hidden" value="{{csrf_token()}}" name="csrf_token"> -->
                            <div class="form-group">
                                <div class="custom-el-table spacing-table responsive-table">
                                    <div class="group-list-table el-table__body" style="width:100%">
                                        <el-tree
                                            ref="moduleTree"
                                            :data="form.modules"
                                            node-key="_id"
                                            class="blue-style tbody"
                                            @check-change="onCheckModule"
                                            @node-drop="onDrop"
                                            draggable
                                            :indent="40"
                                            :render-content="renderRow"
                                            :show-checkbox="true"
                                            :default-checked-keys="form.defaultSelected"
                                            :allow-drop="allowDrop"
                                            :allow-drag="allowDrag">
                                        </el-tree>
                                    </div>
                                </div>
                            </div>
                            <div class="buttons text-center m-top-40">
                                <el-button type="primary" class="btn btn-primary" :loading="isStoring" @click="save">{{$t('common.save')}}</el-button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
	data() {
		return {
            isStoring: false,
            form: {
                modules: [],
                errors: {},
                defaultSelected: [],
            }
		}
	},
    mounted: function () {
        var self = this;
        // var dataset = this.$refs.data.dataset;
        // self.form.modules = JSON.parse(dataset.modules);
        // this.form.defaultSelected = this.getDefaultChecked(this.form.modules);
    },
    methods: {
        save:function () {
            var self = this;
            self.isStoring = true;
            var orgmd = self.getModule(self.form.modules);
            self.$http.post(this.baseUrl('admin/modules'), orgmd['children']).then(function (res) {
                var response = res.data;
                if (response.status) {
                    toastr["success"]("Change module successfully!");
                } else {
                    toastr["warning"]("Action unsuccessfully. Please try again!");
                }
            }, function (res) {
                if(res.status === 422) {
                    toastr["warning"](res.body.message);
                    self.form.errors = res.body.errors;
                } else {
                    console.log("Submit failed!");
                }
            }).finally(function() { self.isStoring = false; });
        },
        getModule: function (modules) {
            let res      = [];
            let isActive = false;
            let order    = 0;
            for (let i in modules) {
                modules[i].order = order++;
                isActive         = modules[i].selected;
                if (modules[i].children && modules[i].children.length > 0) {
                    let c    = this.getModule(modules[i].children);
                    res      = [...res, ...c['children']];
                    for (let child in modules[i].children) {
                        isActive = isActive || modules[i].children[child].selected;
                    }
                }
                modules[i].status   = isActive ? 'Active' : 'Inactive';
                res.push( this.generatePostItem(modules[i]) );
            }

            return {
                children: res,
                isActive: isActive
            };
        },
        generatePostItem: function (module) {
            let res = ( ({_id, name, order, status}) => ({ _id, name, order, status }) )(module);
                return res;
        },
        getDefaultChecked: function (modules) {
            let res = [];
            for (let i in modules) {
                if (modules[i].children && modules[i].children.length > 0) {
                    res = [...res, ...this.getDefaultChecked(modules[i].children)];
                } else {
                    if (modules[i].selected) {
                        res.push(modules[i]._id);
                    }
                }
            }
            return res;
        },
        renderRow: function (h, { node, data, store }) {
            let label = i18n.t('configuration.' + data.name);
            if (data.children && data.children.length > 0) {
                label += ' (' + data.children.length + ')';
            }

            return h('div', {
                props: {type: 'success'},
                domProps: {
                    innerHTML: `
                        <div class="content-module">
                            <div class="cell">
                                <div class="group">
                                    ${label}
                                </div>
                            </div>
                            <div class="cell type-description d-flex">
                                <div class="cell flex-col-40 d-flex">
                                    <span class="module-description">
                                        ${data.type}
                                    </span>
                                </div>
                                <span class="module-description">
                                    ${data.description}
                                </span>
                            </div>
                        </div>`,
                    id: "node-id-" + data._id,
                    style: 'width: 100%;'
                }
            });
        },
        onDrop: function (draggingNode, dropNode, dropType, ev) {
            this.checkByDefault(draggingNode.data);
        },
        checkByDefault: function (module) {
            this.$refs.moduleTree.setChecked(module, module.selected);
            if (module.children && module.children.length > 0) {
                for (let i in module.children) {
                    this.checkByDefault(module.children[i]);
                }
            }
        },
        allowDrop: function (draggingNode, dropNode, type) {
            return draggingNode.parent.data._id === dropNode.parent.data._id && type !== 'inner';
        },
        allowDrag: function (draggingNode) {
            return true;
        },
        onCheckModule: function (node, isCheck) {
            node.status = isCheck ? 'Active' : 'Inactive';
            node.selected = isCheck;
        },
    }
}
</script>