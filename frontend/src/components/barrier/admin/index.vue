<template>
    <div class="project-page" id="barrierSetupAgent" v-cloak>
        <div class="container">
            <div class="tab-content">
                <div class="row">
                    <div class="col col-sm-8 col-12 flex-box justify-content-end ml-auto">
                        <el-input v-model="searchKey" class="search-box" :placeholder="$t('barrier.search')" @keyup.enter.native="handleSearchChange"><i
                                    slot="suffix" class="el-input__icon el-icon-search three-dots-menu" @click="handleSearchChange"></i></el-input>
                        <a class="btn btn-primary m-left-10" @click="openCreateModal">{{$t('barrier.add_barrier')}}</a>
                    </div>
                </div>
                <div class="row flex-box justify-content-end">
                    <a class="m-right-15 m-top-20 m-bot-20">{{$t('vehicle.last_sync_at') }} {{syncTime}}</a>
                </div>
                <div class="table-wrapper">
                    <el-table ref="barrierSetupAgent" :fit="true" :data="barrier.data"
                              class="group-list-table spacing-table responsive-table"
                              :class="{'collapsed':collapseCols.length > 0}"
                              style="width:100%"
                              v-loading="isLoading"
                              :element-loading-text="$t('common.loading') + '...'"
                              element-loading-spinner="el-icon-loading"
                              element-loading-background="rgba(0, 0, 0, 0.8)">
                        <el-table-column type="expand" :width="(collapseCols.length > 0) ? 30:10">
                            <template slot-scope="props">
                                <p v-for="col in collapseCols" :key="col.name">
                                    <span v-if="col.name=='active'"><strong>{{col.label}}</strong>: {{ activeTitle(props.row.active) }}</span>
                                    <span v-else><strong>{{col.label}}</strong>: {{props.row[col.name]}}</span>
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column v-for="(col,index) in expandCols" :key="col.name" :prop="col.name" :label="col.label"
                                 :width="(index == (expandCols.length - 1))?'':col.width"
                                 :render-header="renderHeader">
                            <template slot-scope="props">
                                <span v-if="col.name=='active'">
                                    <div :class="activeTitle(props.row.active)">
                                        <i class="fa fa-circle m-right-5"></i>
                                        <span>{{ activeTitle(props.row.active) }}</span>
                                    </div>
                                </span>
                                <span v-else>{{props.row[col.name]}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column class-name="text-center action-col last-col">
                            <template scope="props">
                                <div class="flex-box align-items-center">
                                    <button class="btn btn-outline-primary btn-white-blue w-auto f-upper"
                                            @click="openUpdateModal(props.row)">{{$t('barrier.edit')}}
                                    </button>
                                    <button class="btn btn-outline-primary btn-white-blue f-upper w-auto"
                                            @click="openDeleteModal(props.row)">{{$t('barrier.delete') }}
                                    </button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <AddEdit :is-open="addModalVisible"
            :model="modelTemplate"
            :barrier="barrier.data"
            :is-warning="isWarning"
            @fetch-data="fetchData"
            @on-close="addModalVisible = false">
        </AddEdit>
        <modal-delete :is-open="promptModalVisible"
            :title="promptModalTitle"
            :message="promptModalMessage"
            @on-confirm="onDelete"
            @on-close="promptModalVisible = false">
        </modal-delete>
    </div>
</template>
<script>
import BarrierService from '../../../services/barrier.service';
import AddEdit from './modal/add-edit.vue';
export default {
    components: {
        AddEdit
    },
    data() {
        return {
            isLoading: false,
            addModalVisible: false,
            promptModalVisible: false,
            promptModalTitle: '',
            promptModalMessage: '',
            screenWidth: 0,
            searchKey: '',
            barrier: {
                current_page: 0,
                data: [],
                total: 0
            },
            responsiveCols: [
                { name: 'id', label: 'ID', sortable: 'custom', width: 220, minScreen: 575 },
                { name: 'name', label: 'Barrier name', sortable: 'custom', width: 130, minScreen: 0 },
                { name: 'camera_name', label: 'Camera name', sortable: 'custom', width: 180, minScreen: 1100 },
                { name: 'active', label: 'Status', sortable: 'custom', width: 150, minScreen: 1230 },
            ],
            modelTemplate: {
                id:'',
                barrier_name: "",
                alpr_agent: 0,
                camera_name: "",
                controller_host: "",
                controller_port: "",
                open_barrier_url: "",
                open_barrier_vehicle: []
            },
            selectRow: null,
            syncTime: '',
            isWarning: false
        }
    },
    computed: {
        expandCols(){
            const self = this;
            return this.responsiveCols.filter(x => x.minScreen <= self.screenWidth);
        },
        collapseCols () {
            const self = this;
            return this.responsiveCols.filter(x => x.minScreen > self.screenWidth);
        },
    },
    mounted() {
        var self = this;
        this.$nextTick(function () {
            window.addEventListener('resize', this.resizeHandle);
        })
        this.resizeHandle();
        self.fetchData();
    },
    methods: {
        resizeHandle() {
            this.screenWidth = $(window).width();
        },
        renderHeader (h, e) {
            const _name = e.column.label;
            return h('span', {class: 'col-label'}, _name)
        },
        activeTitle(active) {
            switch (active) {
                case true:
                    return 'Active';
                default:
                    return 'Inactive';
            }
        },
        openCreateModal(){
            this.addModalVisible = true;
            this.modelTemplate = {
                active: '',
                agent_id: '',
                agent_name: '',
                camera_id: '',
                camera_name: '',
                host: '',
                name: '',
                port: '',
                rules: [],
                url: '',
                id: '',
            };
        },
        openUpdateModal(dataRow) {
            var self = this;
            this.addModalVisible = true;
            self.modelTemplate = dataRow;
        },
        openDeleteModal (row) {
            this.promptModalTitle = "DELETE BARRIER";
            this.promptModalMessage = "ARE YOU SURE YOU WANT TO DELETE THIS BARRIER?";
            this.promptModalVisible = true;
            this.selectRow = row;
        },
        async fetchData() {
            const self = this;
            try {
                self.isLoading = true;
                const sorting = Object.assign(
                    { prop: 'created_at', order: 'descending' },
                    _.pick(self.sortData, ['prop', 'order'])
                );
                const params = {
                    page: self.currentPage,
                    size: self.pageSize,
                    filter: {searchKey: self.searchKey},
                    sort: sorting,
                }
                const response = await BarrierService.getBarriers();
                const result = response.data;
                self.barrier.data = result.data;
                self.barrier.total = result.data ? result.data.length : 0;

                self.syncTime = result.data.length > 0 ? self.localTimeConversion(result.data[0].updated_at, userTimezone, 'DD MMM YYYY LT') : self.syncTime;
            } catch(err){
                if (!self.isWarning) {
                    toastr["warning"]("Action unsuccessfully. Please try again!");
                    self.isWarning = true;
                }
            }finally{
                self.isLoading = false;
            }
        },
        async onDelete() {
            const self = this;
            try {
                const response = await BarrierService.deleteBarrier(self.selectRow.id);
                const result = response.data;
                if (result.success) {
                    this.promptModalVisible = false;
                    toastr["success"]('Delete successfully');
                    self.fetchData();
                } else {
                    toastr["warning"]('Delete unsuccessfully. Please try again!');
                }
            } catch(err) {
                toastr["warning"]("Action unsuccessfully. Please try again!");
            }
        },
        handleSearchChange() {
            this.fetchData();
        },
    }
}
</script>