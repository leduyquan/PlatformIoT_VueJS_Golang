<template>
	<div class="project-page" id="roleFormApp" v-cloak>
		<div id="role" class="container">
			<div class="row">
				<div class="col col-xl-10 col-lg-10 col-12 m-auto">
					<div class="tab-header">
						<h1 class="module-title" v-if="form.role.id">
							<template v-if="form.disabled">
								{{$t('common.role')}}
							</template>
							<template v-else>
								{{$t('common.edit_role')}}
							</template>
						</h1>
						<h1 class="module-title" v-else>{{$t('common.add_role')}}</h1>
					</div>
					<div class="tab-content">
						<div class="form-group">
							<div class="fw-medium m-bot-10">{{$t('common.role_name')}}</div>
							<input type="text" class="form-control" :class="{ 'is-invalid': submitted && !form.role.name }"
								:placeholder="$t('common.enter_role_name')"
								v-model="form.role.name">
                            <div v-show="submitted && !form.role.name" class="invalid-feedback">This field is required</div>
						</div>
						<div class="form-group">
							<div class="fw-medium m-bot-10">{{$t('common.role_description')}}</div>
							<input type="text" class="form-control" rows="5" v-model="form.role.description"
								:placeholder="$t('common.enter_role_description')"/>
						</div>
						<div class="form-group">
							<div class="fw-medium m-top-20">{{$t('common.access_control_list')}}</div>
							<div class="el-table spacing-table">
								<table class="group-list-table el-table__body" style="width:100%">
									<thead>
										<tr>
											<th class="first-col col-w-30p">
												<div class="text-center">{{$t('common.access')}}</div>
											</th>
											<th class="col-w-15p">
												<div class="cell justify-content-end" style="white-space: pre">{{$t('common.view')}}&nbsp;&nbsp;&nbsp;
													<el-checkbox v-model="allPermissions[0].selected"
																class="checkbox-head"
																:indeterminate="allPermissions[0].indeterminate"
																@change="onAllModuleToggle(0)" />
												</div>
											</th>
											<th class="col-w-15p">
												<div class="cell justify-content-end" style="white-space: pre">
													{{$t('common.create')}}&nbsp;&nbsp;&nbsp;
													<el-checkbox v-model="allPermissions[1].selected"
																class="checkbox-head"
																:indeterminate="allPermissions[1].indeterminate"
																@change="onAllModuleToggle(1)" />
												</div>
											</th>
											<th class="col-w-15p">
												<div class="cell justify-content-end" style="white-space: pre">
													{{$t('common.update')}}&nbsp;&nbsp;&nbsp;
													<el-checkbox v-model="allPermissions[2].selected"
																class="checkbox-head"
																:indeterminate="allPermissions[2].indeterminate"
																@change="onAllModuleToggle(2)" />
												</div>
											</th>
											<th class="col-w-15p">
												<div class="cell justify-content-end" style="white-space: pre">
													{{$t('common.delete')}}&nbsp;&nbsp;&nbsp;
													<el-checkbox v-model="allPermissions[3].selected"
																class="checkbox-head"
																:indeterminate="allPermissions[3].indeterminate"
																@change="onAllModuleToggle(3)" />
												</div>
											</th>
											<th class="last-col"></th>
										</tr>
									</thead>
									<tbody>
										<template v-for="group in form.modules">
											<tr class="name-row text-uppercase" :key="group.name">
												<td>
													<div class="cell">{{ group.name }}</div>
												</td>
												<td class="text-right" v-for="(permission, index) in group.permissions" :key="index">
													<div class="cell">
														<el-checkbox v-model="permission.selected"
																	:disabled="form.isShowOnly"
																	:indeterminate="permission.indeterminate"
																	@change="onToggle(group,index)" />
													</div>
												</td>
												<td>&nbsp;</td>
											</tr>
											<template v-for="module in group.children">
												<template v-if="group.children.length">
													<tr v-if="module.permissions && module.permissions.length > 0" :key="module.name"
														class="text-info text-uppercase">
														<td>
															<div class="p-left-30">{{$t('common.module-' + module.name)}}
															</div>
														</td>
														<td class="text-right"
															v-for="(permission, index) in module.permissions" :key="index">
															<div class="cell">
																<el-checkbox v-model="permission.selected"
																			:disabled="form.isShowOnly"
																			:indeterminate="permission.indeterminate"
																			@change="onToggle(module,index)" />
															</div>
														</td>
														<td>&nbsp;</td>
													</tr>
													<template v-if="module.children.length">
														<tr v-for="sub in module.children" :key="sub.name" class="color-gray text-uppercase">
															<template v-if="sub.permissions && sub.permissions.length > 0">
																<td>
																	<div class="p-left-50">{{$t('common.module-' + sub.name)}}
																	</div>
																</td>
																<td class="text-right"
																	v-for="(permission, i) in sub.permissions" :key="i">
																	<div class="cell">
																		<el-checkbox v-model="permission.selected"
																					:disabled="form.isShowOnly"
																					@change="onToggle(sub,i)" />
																	</div>
																</td>
																<td>&nbsp;</td>
															</template>
														</tr>
													</template>
												</template>
											</template>
										</template>
									</tbody>
								</table>
							</div>
						</div>
						<div class="buttons text-center m-top-40">
							<router-link class="btn btn-secondary" :to="baseUrl('admin/roles')">{{$t('common.cancel')}}</router-link>
							<el-button type="primary" class="btn btn-primary" :loading="isStoring" :class="{'d-none': id !== 'create'}"
									@click="onCreate">{{$t('common.save')}}</el-button>
							<el-button type="primary" class="btn btn-primary" :loading="isStoring" :class="{'d-none': id === 'create' || form.disabled}"
									@click="onUpdate">{{$t('common.update')}}</el-button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import RoleService from '../../../services/role.service';
import Constants from '../../../helpers/constants/messages.js';
export default {
	 data() {
		 return {
			 	id: this.$route.params.id,
                isStoring: false,
                form: {
                    role: {},
                    modules: [],
					disabled: false
                },
                allPermissions: [
                    { selected: false, indeterminate: false }, //view
                    { selected: false, indeterminate: false }, //create
                    { selected: false, indeterminate: false }, //update
                    { selected: false, indeterminate: false } //delete
                ],
                submitted: false
			}
	 },
    mounted () {
		const self = this;
		self.setDisabled();
        if (self.id === 'create') {
            self.getModules();
        } else {
            self.getRoleDetail(self.id); //get detail
        }
    },
    methods: {
		setDisabled(){
			const path = this.$route.path;
			if (path.includes('create') || path.includes('edit')) {
				this.form.disabled = false
			} else {
				this.form.disabled = true;
			}
        },
        formatModules(modules, permissions) {
            const self = this;
            const _permissions = _.groupBy(permissions, 'module_id');
            const _permissionDefault = [
                { selected: false, indeterminate: false }, //view
                { selected: false, indeterminate: false }, //create
                { selected: false, indeterminate: false }, //update
                { selected: false, indeterminate: false } //delete
            ]

            const setPermissions = (module) => {
                return module.map(item => {
                    item.permissions = _permissions[item._id] || _.cloneDeep(_permissionDefault);
                    if (!_.isEmpty(item.children)) {
                        setPermissions(item.children)
                    }
                    return item;
                })
            }

            const allModules = setPermissions(modules);
            const setParentPermissions = (module) => {
                return module.map(item => {
                    if (_.isEmpty(item.children)) {
                        console.log('item',item)
                        for (let index in item.permissions) {
                            self._updateParents(allModules, item, index);
                        }
                    } else {
                        setParentPermissions(item.children)
                    }
                    return item;
                })
            }

            self.form.modules = setParentPermissions(allModules)
            self.allPermissions.map((value, index) => self.setAccessToggle(value, index));
        },
        async getModules() {
            const self = this;
			try {
                const response = await RoleService.getModules();
                const { data } = response.data;
                self.formatModules(data.module, data.permission);
            } catch (error) {
                 toastr["warning"](error);
            }
		},
		async getRoleDetail(id) {
            const self = this;
			try {
                const response = await RoleService.getRoleDetail(id);
                const { data } = response.data;
                self.form.role = data.role;
                self.formatModules(data.module, data.permission);
            } catch (error) {
                 toastr["warning"](error);
            }
		},
        async onCreate() {
            const self = this;
			self.isStoring = true;
			try {
                self.submitted = true;
                const body = self.form.role;
                if (!body.name) return;
                body.status = 'Active';
                body.permission_ids = self._updateData();
                const response = await RoleService.createRole(body);
                const { data } = response;
                if (data.msg === 'ok') {
                    toastr[Constants.statusMessage.success](Constants.infoMessage.createSuccessfully);
					this.$router.push('/admin/roles')
                } else {
                    toastr[Constants.statusMessage.warning](Constants.infoMessage.actionUnsuccessfully);
                }
            } catch (error) {
                 toastr["warning"](error);
            } finally {
                self.isStoring = false;
            }
        },
        async onUpdate() {
            const self = this;
            self.isStoring = true;
			try {
                self.submitted = true;
                const body = _.omit(self.form.role, 'id');
                if (!body.name) return;
                body.permission_ids = self._updateData();
                const response = await RoleService.updateRole(body, self.form.role.id);
                const { data } = response;
                if (data.msg === 'ok') {
                    toastr[Constants.statusMessage.success](Constants.infoMessage.updateSuccessfully);
                    this.$router.push('/admin/roles')
                } else {
                    toastr[Constants.statusMessage.warning](Constants.infoMessage.actionUnsuccessfully);
                }
            } catch (error) {
                 toastr[Constants.statusMessage.warning](error);
            } finally {
                self.isStoring = false;
            }
        },
        _updateData(modules) {
            const self = this;
            if (!modules) {
                modules = self.form.modules;
            }
            var permissions = [];
            $.each(modules, function(i, module) {
                if (module.children && module.children.length > 0) {
                    permissions = permissions.concat(self._updateData(module.children));
                } else {
                    $.each(module.permissions, function(idx, permission) {
                        if(permission.selected) {
                            permission.id && permissions.push(permission.id);
                        }
                    })
                }
            })
            return permissions;
        },
        setAccessToggle(permission, index) {
            const modules = this.form.modules;
            permission.selected = modules.every(x => x.permissions[index].selected);
            permission.indeterminate = !permission.selected && modules.some(x => x.permissions[index].selected);
        },
        onAllModuleToggle: function(index) {
            const modules = this.form.modules;
            const selected = this.allPermissions[index].selected;
            //Set indeterminate is false when click toggle
            this.allPermissions[index].indeterminate = false;
            const _updateChildren = (item, index) => {
                const children = item.children;
                if (_.isEmpty(children)) return;
                children.map(x => {
                    x.permissions[index].selected = selected;
                    x.permissions[index].indeterminate = false;
                    _updateChildren(x, index);
                });
			}

            _updateChildren({children: modules}, index);
        },
        onToggle( item, index ) {
            this._updateChildren( item, index );
            this._updateParents( this.form.modules, item, index );
            //Set indeterminate is false when click toggle
            item.permissions[index].indeterminate = false
            //Handle access toggle
            this.setAccessToggle(this.allPermissions[index], index);
        },
        _updateChildren (item, index){
            const children = item.children;
            if (_.isEmpty(children)) return
            children.map(x => {
                x.permissions[index].selected = item.permissions[index].selected;
                x.permissions[index].indeterminate = false;
                this._updateChildren(x, index);
            });
        },
        _updateParents( modules, item, index ) {
            const parent = this._getParentNode(modules, item.parent_id);
            if (_.isEmpty(parent)) return
            const itemOther = parent.children;
            const itemPermission = parent.permissions[index];
            const atLeast1Selected = itemOther.some(x => x.permissions[index].selected);
            itemPermission.selected = itemOther.every(x => x.permissions[index].selected);
            itemPermission.indeterminate = !itemPermission.selected && atLeast1Selected;
            this._updateParents( modules, parent, index);
        },
        _getParentNode (root, id) {
            const self = this;
            let node;
            root.some(function (n) {
                if (n._id === id) {
                    return node = n;
                }
                if (n.children) {
                    return node = self._getParentNode(n.children, id);
                }
            });
            return node || null;
		},
	}
}
</script>
<style>
    .checkbox-head .el-checkbox__input .el-checkbox__inner {
        border-color: white !important;
    }
</style>