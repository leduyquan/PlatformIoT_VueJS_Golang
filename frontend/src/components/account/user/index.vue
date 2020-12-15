<template>
	<div id="user" class="project-page" v-cloak>
        <div class="container">
            <div class="tab-content">
                <div id="tab-profiles" class="tab-pane active" role="tabpanel">
                    <div class="tab-header m-0">
                        <div class="fs-18 d-md-none m-bot-15">{{$t('common.users')}}</div>
                        <div class="right-content m-top-5">
                            <el-input class="search-box blue-style" v-model='searchKey' :placeholder="$t('common.search')"><i slot="suffix" class="el-input__icon el-icon-search"></i></el-input>
							<button class="btn btn-primary m-left-10" @click="openCreateModal">{{$t('common.add_user')}}</button>
                        </div>
                    </div>
                    <div class="tab-control-container">
                        <div class="left-box">
                            <strong>{{$t('common.show')}}</strong>
                            <el-select v-model="pageSize" placeholder="Select" @change="handleSizeChange" class="max-w-70">
                                <el-option
                                        v-for="item in pageSizes"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                            <strong>{{$t('common.entries')}}</strong>
                        </div>

                        <div class="right-box">
                            <v-pagination :total="filterData.length" :page-size="pageSize" :current-page="currentPage"></v-pagination>
                            <el-pagination
                                    @current-change="handleCurrentChange"
                                    :current-page.sync="currentPage"
                                    :page-sizes="pageSizes"
                                    :page-size="pageSize"
                                    layout="prev, next"
                                    :total="filterData.length">
                            </el-pagination>
                        </div>
                    </div>
                    <el-table :fit="true" :class="{'collapsed':collapseCols.length > 0}"
                              :data='currentTableData' class="group-list-table spacing-table responsive-table" style="width:100%"
                              @sort-change='handleSort' v-bind='innerTableProps'>
                        <el-table-column type="expand" :width="(collapseCols.length > 0) ? 30:10">
                            <template slot-scope="props">
                                <p v-for="col in collapseCols" :key="col.name">
                                    <span v-if="col.name=='id' || col.name=='email'">
                                        <strong>{{col.label}}</strong>: {{props.row[col.name]}}
                                    </span>
                                     <span v-else-if="col.name=='role_ids'">
                                        <strong>{{col.label}}</strong>:
                                        <template v-for="role in roleData">
                                            <span v-if="props.row[col.name][0] === role.id" :key="role.id">{{ role.name }}</span>
                                        </template>
                                    </span>
                                    <span v-else-if="col.name=='created_at'">
                                        <strong>{{col.label}}</strong>: {{ props.row.created_at | formatDate('YYYY-MM-DD hh:mm:ss') }}
                                    </span>
                                    <span v-else-if="col.name=='updated_at'">
                                        <strong>{{col.label}}</strong>: {{ props.row.updated_at | formatDate('YYYY-MM-DD hh:mm:ss') }}
                                    </span>
                                    <span v-else><strong>{{col.label}}</strong>: {{props.row[col.name] | startCase}}</span>
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column v-for="(col,index) in expandCols" :key="col.name" :prop="col.name" :label="col.label"
                                 :width="(index == (expandCols.length - 1))?'':col.width"
                                 :render-header="renderHeader">
                            <template slot-scope="props">
                                <span v-if="col.name=='id' || col.name=='email'">
                                    {{props.row[col.name]}}
                                </span>
                                <span v-else-if="col.name=='created_at'">
                                    {{props.row[col.name] | formatDate('YYYY-MM-DD hh:mm:ss')}}
                                </span>
                                <span v-else-if="col.name=='updated_at'">
                                    {{props.row[col.name] | formatDate('YYYY-MM-DD hh:mm:ss')}}
                                </span>
                                <span v-else-if="col.name=='role_ids'">
                                    <template v-for="role in roleData">
                                        <span v-if="props.row[col.name][0] === role.id" :key="role.id">{{ role.name }}</span>
                                    </template>
                                </span>
                                <span v-else>
                                    {{props.row[col.name] | startCase}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column class-name="text-right action-col last-col">
                            <template scope="props">
                                <!-- <a :href="baseUrl('admin/users/'+ props.row.id)"
                                   class="btn w-auto btn-outline-primary btn-white-blue f-upper">{{$t('common.show')}}</a> -->
                                <button class="btn w-auto btn-outline-primary btn-white-blue f-upper"
                                     @click="openDetailModal(props.row)">{{$t('common.show')}}</button>
                                <button class="btn btn-outline-primary btn-white-blue w-auto f-upper"
                                        @click="openUpdateModal(props.row)">{{$t('common.edit')}}</button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
         <AddEdit :is-open="addModalVisible"
            :model="modelTemplate"
            :role-data="roleData"
            @reset-list="getUserData"
            @on-close="addModalVisible = false">
        </AddEdit>
    </div>
</template>
<script>
import UserService from '../../../services/user.service.js';
import RoleService from '../../../services/role.service.js';
import AddEdit from './modal/add-edit';
export default {
    components: {
        AddEdit
    },
	data() {
        return {
            addModalVisible: false,
			searchKey: '',
			innerSearchKey: '',
			sortData: {},
			pageSizes: [5, 10, 25, 50],
			pageSize: 10,
			currentPage: 1,
			screenWidth: 0,
			responsiveCols: [
                { name: 'id', label: i18n.t('common.id'), sortable: 'custom', width: 220, minScreen: 520 },
				{ name: 'name', label: i18n.t('common.name'), sortable: 'custom', width: 120, minScreen: 0 },
				{ name: 'email', label: i18n.t('common.email'), sortable: 'custom', width: 150, minScreen: 1030 },
				{ name: 'role_ids', label: i18n.t('common.group'), sortable: 'custom', width: 150, minScreen: 1200 },
				{ name: 'created_at', label: i18n.t('common.created_date'), sortable: 'custom', width: 150, minScreen: 1350 },
				{ name: 'updated_at', label: i18n.t('common.updated_date'), sortable: 'custom', width: 150, minScreen: 1550 },
				{ name: 'status', label: i18n.t('common.status'), sortable: 'custom', width: 100, minScreen: 1590 },
            ],
            modelTemplate: {
                id:'',
                name:'',
                email:'',
                role_ids:[],
                role:''
            },
            userData: [],
            roleData: [],
            isLoading: false,
            isWarning: false
		}
	},
	mounted: function () {
        var self = this;
        self.getUserData();
        self.getRoleData();
        self.resizeHandle();
        this.$nextTick(function () {
            window.addEventListener('resize', this.resizeHandle);
        });
    },
    watch: {
        searchKey() {
            this.updateInnerSearchKey()
        }
    },
    computed: {
        expandCols(){
            const self = this;
            return this.responsiveCols.filter(x => x.minScreen <= self.screenWidth);
        },
        collapseCols() {
            const self = this;
            return this.responsiveCols.filter(x => x.minScreen > self.screenWidth);
        },
        filterData: function () {
            var self = this;
            if (!this.innerSearchKey)
                return self.userData.slice()
            else
                return self.userData.filter(function (row) {
                    var found = false;
                    if (row != null && (typeof row == "object")) {
                        if(self.innerSearchKey){
                            Object.keys(row).map(function (propName, index) {
                                var propValue = row[propName];
                                if (propValue != null && (typeof propValue == "object")) {
                                    Object.keys(propValue).map(function (childPropName, index) {
                                        var propChildValue = propValue[childPropName];
                                        if (propChildValue) {
                                            propChildValue = propChildValue.toString().toLowerCase().trim();
                                            if (propChildValue.includes(self.innerSearchKey)) {
                                                found = true;
                                            }
                                        }
                                    });
                                }
                                else {
                                    if (propValue) {
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
                    if (found) return row;
                })
        },
        sortedData: function () {
            let sortedData = this.filterData.slice();
            if (this.sortData.order) {
                let order = this.sortData.order
                let prop = this.sortData.prop
                let isDescending = order === 'descending'
                sortedData.sort(function (a, b) {
                    var dataA = a[prop] === null ? '' : a[prop];
                    var dataB = b[prop] === null ? '' : b[prop];
                    if(prop == "date") {
                        dataA = new Date(a[prop].date)/1000;
                        dataB = new Date(b[prop].date)/1000;
                    }
                    if (isNaN(dataA) || isNaN(dataB)) {
                        return dataA.toLowerCase().localeCompare(dataB.toLowerCase(), 'en', {'sensitivity': 'base'});
                    } else {
                        if (dataA > dataB) {
                            return 1
                        } else if (dataA < dataB) {
                            return -1
                        } else {
                            return 0
                        }
                    }
                });
                if (isDescending) {
                    sortedData.reverse()
                }
            }
            return sortedData
        },
        currentTableData: function () {
            let from = this.pageSize * (this.currentPage - 1)
            let to = from + this.pageSize
            return this.sortedData.slice(from, to);
        },
        innerTableProps() {
            return Object.assign({
                fit: true
            })
        }
    },
    methods: {
        resizeHandle () {
            this.screenWidth = $(window).width();
        },
        renderHeader (h, e) {
            const _name = e.column.label;
            return h('span', {class: 'col-label'}, _name)
        },
        handleSort:function(obj) {
            this.sortData = obj;
            this.innerTableProps.defaultSort = {
                prop: obj.prop,
                order: obj.order
            }
        },
        handleSizeChange(currentSize) {
            //this.pageSize = currentSize;
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
        },
        updateInnerSearchKey (){
            this.innerSearchKey = this.searchKey.toLowerCase().trim();
        },
        openCreateModal(){
            this.addModalVisible = true;
            this.modelTemplate = {
                id:'',
                name:'',
                email:'',
                role_ids:[],
                role: ''
            };
        },
        openUpdateModal(dataRow) {
            const self = this;
            self.addModalVisible = true;
            dataRow.role = _.isEmpty(dataRow.role_ids) ? '' : dataRow.role_ids[0];
            dataRow.disabled = false;
            self.modelTemplate = dataRow;
        },
        openDetailModal(dataRow) {
            const self = this;
            self.addModalVisible = true;
            dataRow.role = _.isEmpty(dataRow.role_ids) ? '' : dataRow.role_ids[0];
            dataRow.disabled = true;
            self.modelTemplate = dataRow;
        },
        async getUserData () {
            const self = this;
            try {
                self.isLoading = true;
                const response = await UserService.getUsers();
                const { data } = response.data;
                self.userData = data;
            } catch(err) {
                if (!self.isWarning) {
                    toastr["warning"]("Action unsuccessfully. Please try again!");
                    self.isWarning = true;
                }
            } finally {
                self.isLoading = false;
            }
        },
        async getRoleData () {
            const self = this;
            try {
                self.isLoading = true;
                const response = await RoleService.getRoles();
                const { data } = response.data;
                self.roleData = data;
            } catch(err) {
                if (!self.isWarning) {
                    toastr["warning"]("Action unsuccessfully. Please try again!");
                    self.isWarning = true;
                }
            } finally {
                self.isLoading = false;
            }
        },
	}
}
</script>