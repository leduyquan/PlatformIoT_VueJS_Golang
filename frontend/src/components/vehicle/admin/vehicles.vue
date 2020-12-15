<template>
    <div class="project-page" id="vehicleList" v-cloak>
        <div class="container">
            <div class="tab-content">
                <div class="row">
                    <div class="col col-12 flex-box justify-content-end p-top-5">
						<el-input class="search-box blue-style" v-model='searchKey' :placeholder="$t('common.search')"
									@keyup.enter.native="updateInnerSearchKey">
							<i slot="suffix" class="el-input__icon el-icon-search three-dots-menu"
								@click="updateInnerSearchKey"></i>'
						</el-input>
						<a class="btn btn-primary flex-col-w-130 m-left-10"
							@click="onSyncServer">{{$t('vehicle.sync_from_server') }}</a>
					</div>
                </div>
                <div class="row flex-box justify-content-end">
                    <span v-if="!!syncTime" class="m-right-15 m-top-20 m-bot-5">{{$t('vehicle.last_sync_at') }} {{syncTime}}</span>
                    <span v-else class="m-right-15 m-top-20 m-bot-5">Not sync yet!</span>
                </div>
                <div class="tab-control-container">
                    <div class="left-box">
                        <span class="page-size">
                            <strong>{{$t('vehicle.show') }}</strong>
                            <el-select v-model="pageSize" class="max-w-70" placeholder="Select"
                                       @change="handleSizeChange">
                                <el-option
                                        v-for="item in pageSizes"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                            <strong>{{$t('vehicle.entries') }}</strong>
                        </span>
                    </div>
                    <div class="right-box">
                        <v-pagination :total="vehicles.total" :page-size="pageSize" :current-page="currentPage"></v-pagination>
                        <el-pagination :disabled="isLoading" @current-change="handleCurrentChange"
                                       :current-page.sync="currentPage" :page-sizes="pageSizes" :page-size="pageSize"
                                       layout="prev, next" :total="vehicles.total">
                        </el-pagination>
                    </div>
                </div>
                <el-table ref="vehicleList" :fit="true"
                          :data='vehicles.data' class="vehicle-list-table spacing-table responsive-table" :class="{'collapsed':collapseCols.length > 0}"
                          v-loading="isLoading" 
                          :element-loading-text="$t('common.loading') + '...'" 
                          element-loading-spinner="el-icon-loading" 
                          element-loading-background="rgba(0, 0, 0, 0.8)" 
                          style="width:100%"
                          @sort-change='handleSort' @selection-change="handleSelectionChange">
                    <el-table-column type="expand" width="30">
                        <template slot-scope="props">
                            <p v-for="col in collapseCols" :key="col.name"><strong>{{col.label}}</strong>: {{props.row[col.name]}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column v-for="(col,index) in expandCols" :key="index" :prop="col.name" :label="col.label" :sortable="col.sortable" :width="col.width">
                        <template scope="props">
                            <span>{{props.row[col.name]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column class-name="last-col">
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
import VehicleService from '../../../services/vehicle.service';
export default {
    data() {
		return {
            isLoading: false,
            screenWidth:0,
            searchKey: '',
            innerSearchKey: '',
            sortData: {},
            responsiveCols: [
                {name: 'id', label: i18n.t('vehicle.id'), sortable: 'custom', width: 220, minScreen: 0},
                {name: 'plate_number', label: i18n.t('vehicle.license_plate'), sortable: 'custom', width: 120, minScreen: 0},
                {name: 'make', label: i18n.t('vehicle.make'), sortable: 'custom', width: 80, minScreen: 600},
                {name: 'model', label: i18n.t('vehicle.model'), sortable: 'custom', width: 80, minScreen: 1110},
                {name: 'body_type', label: i18n.t('vehicle.body'), sortable: 'custom', width: 80, minScreen: 1100},
                {name: 'region', label: i18n.t('vehicle.province'), sortable: 'custom', width: 100, minScreen: 1170},
                {name: 'country_code', label: i18n.t('vehicle.country'), sortable: 'custom', width: 120, minScreen: 1300},
                {name: 'color', label: i18n.t('vehicle.color'), sortable: 'custom', width: 80, minScreen: 1400},
                {name: 'category', label: i18n.t('vehicle.category'), sortable: 'custom', width: 100, minScreen: 1400},
            ],
            pageSizes: [10, 25, 50, 100],
            pageSize: 10,
            currentPage: 1,
            vehicles: {
                current_page:0,
                data:[],
                total:0
            },
            categories: [],
            syncTime: '',
            isWarning: false
		}
    },
    mounted: function () {
        this.getCategories();
        this.fetchData();
        this.resizeHandle();
        this.$nextTick(function() {
            window.addEventListener('resize', this.resizeHandle);
        });
    },
    computed: {
        expandCols:function(){
            var self = this;
            return this.responsiveCols.filter(x=>x.minScreen <= self.screenWidth)
        },
        collapseCols:function(){
            var self = this;
            return this.responsiveCols.filter(x=>x.minScreen > self.screenWidth)
        },
        innerTableProps() {
            return Object.assign({
                fit: true
            })
        }
    },
    methods: {
        resizeHandle: function () {
            this.screenWidth = $(window).width();
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
            this.fetchData();
        },
        handleSizeChange() {
            this.currentPage = 1;
            this.fetchData();
        },
        handleSelectionChange:function(selectedRow){
            this.selectAction='',
            this.selectedRow = selectedRow
        },
        updateInnerSearchKey() {
            this.currentPage = 1;
            this.fetchData();
        },
        handleSort(obj) {
            this.sortData = obj
            this.innerTableProps.defaultSort = {
                prop: obj.prop,
                order: obj.order
            }
        },
        async getCategories() {
            const self = this;
            try {
                self.isLoading = true;
                const response = await VehicleService.getCategories();
                const result = response.data
                if (result.success && result.data) {
                    self.categories = result.data;
                } else {
                    toastr["warning"](result.msg);
                }
            } catch(err) {
                if (!self.isWarning) {
                    toastr["warning"]("Action unsuccessfully. Please try again!");
                    self.isWarning = true;
                }
            }finally {
                self.isLoading = false;
            }
        },
        async onSyncServer() {
            const self = this;
            try {
                self.isLoading = true;
                const response = await VehicleService.syncVehicles();
                const result = response.data
                if (result.success) {
                    self.fetchData();
                    toastr["success"](result.msg);
                } else {
                    toastr["warning"](result.msg);
                }
            } catch(err) {
                toastr["warning"]("Action unsuccessfully. Please try again!");
            }finally{
                self.isLoading = false;
            }
        },
        async fetchData() {
            const self = this;
            const params = {
                page: self.currentPage,
                size: self.pageSize,
                searchKey: self.searchKey
            };
            try {
                self.isLoading = true;
                const response = await VehicleService.getAdminVehicles();
                const result = response.data;

                self.vehicles.data = self.parseCategory(result.data);
                self.vehicles.current_page = self.currentPage;
                self.vehicles.total = result.data ? result.data.length : 0;

                self.syncTime = result.data.length > 0 ? self.localTimeConversion(result.data[0].updated_at, userTimezone, 'DD MMM YYYY LT') : self.syncTime;
            } catch (err) {
                if (!self.isWarning) {
                    toastr["warning"]("Action unsuccessfully. Please try again!");
                    self.isWarning = true;
                }
            }finally{
                self.isLoading = false;
            }
        },
        parseCategory(data){
            const self = this;
            return data.map(x => {
                const category = self.categories.find(y => y.id === x.category);
                return {
                    ...x,
                    category: !!category ? category.name : ''
                }
            })
        }
    }
}
</script>