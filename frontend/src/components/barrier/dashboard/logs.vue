<template>
    <div id="barrier-logs" class="tab-content" v-cloak>
        <div role="tabpanel">
            <div class="row p-bot-25">
                <div class="col col-lg-9 col-12 lg-down-m-bot-10 filter-control-wrapper">
                    <v-filter :data="filterBarrierName" multiple caption="Barrier Name" :text-field-name="'name'"
                            :id="'barrier-name'" @clear-click="clearFilter" @apply-click="applyFilter($event)">
                    </v-filter>
                    <div class="filter-box">
                        <div class="d-flex">
                            <button class="btn btn-outline-primary caption" v-text="filterDateButton"
                                    :class="{'active':filterDateButton != $t('barrier.time_range')}"
                                    @click="openFilterDatePicker"></button>
                            <el-date-picker ref="filterDateControl" class="filter-date-picker" v-model="filterDate"
                                            type="datetimerange" range-separator="-" start-placeholder="Start date"
                                            @change="applyFilter($event,'time')" end-placeholder="End date" timezone="UTC">
                            </el-date-picker>
                        </div>
                    </div>
                    <v-filter :klass="'filter-has-children'" :data="filterMakeModel" multiple :text-field-name="'name'"
                            :caption="$t('vehicle.make_and_model')" :id="'make-model'" @clear-click="clearFilter"
                            @apply-click="applyFilter($event,'make')">
                    </v-filter>
                    <v-filter :data="filterBodyType" multiple :caption="'Body Type'" :text-field-name="'name'"
                            :id="'body-type'" @clear-click="clearFilter" @apply-click="applyFilter($event,'make')">
                    </v-filter>
                    <v-filter :data="filterColor" multiple :caption="'Color'" :text-field-name="'name'" :id="'colour'"
                            @clear-click="clearFilter" @apply-click="applyFilter($event,'make')">
                    </v-filter>
                    <v-filter :data="filterCamera" multiple :caption="'Camera'" :id="'camera'" :text-field-name="'name'" @clear-click="clearFilter"
                            @apply-click="applyFilter($event,'cctv')"></v-filter>
                    <v-filter :klass="'filter-has-children'" :data="filterRegion" multiple :caption="'Province'"
                            :id="'filter-province'" @clear-click="clearFilter" @apply-click="applyFilter($event,'make')">
                    </v-filter>
                </div>
                <div class="col col-lg-3 col-12 text-right lg-down-text-left flex-box align-items-center">
                    <el-input class="search-box blue-style" v-model='searchKey' :placeholder="$t('barrier.search')" @keyup.enter.native="handleSearchChange"><i
                        slot="suffix" class="el-input__icon el-icon-search three-dots-menu" @click="handleSearchChange"></i>
                    </el-input>
                    <el-button type="primary" class="btn btn-outline-primary blue-style m-left-5" icon="el-icon-download"
                            style="min-width: auto; color: #FFFFFF;" @click="openPrintablePage"></el-button>
                </div>
            </div>
            <div class="tab-control-container">
                <div class="left-box">
                    <strong>{{$t('barrier.show')}}</strong>
                    <el-select v-model="pageSize" :placeholder="$t('barrier.select')" :disabled="isLoading"
                            @change="handleSearchChange" class="max-w-70">
                        <el-option v-for="item in pageSizes" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                    <strong>{{$t('barrier.entries')}}</strong>
                </div>
                <div class="right-box">
                    <v-pagination :total="barrier.total" :page-size="pageSize" :current-page="currentPage"></v-pagination>
                    <el-pagination :disabled="isLoading" @current-change="handleCurrentChange"
                                :current-page.sync="currentPage" :page-sizes="pageSizes" :page-size="parseInt(pageSize)"
                                layout="prev, next" :total="barrier.total">
                    </el-pagination>
                </div>
            </div>
            <div class="table-wrapper">
                <el-table :fit="true" :data='barrier.data' class="alert-list-table spacing-table responsive-table"
                        :class="{'collapsed':collapseCols.length > 0}" style="width:100%" v-loading="isLoading"
                        :element-loading-text="$t('common.loading') + '...'" element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.8)">
                    <el-table-column type="expand" :width="(collapseCols.length > 0) ? 30:10">
                        <template slot-scope="props">
                            <p v-for="col in collapseCols" :key="col.name">
                                <span v-if="col.name=='travel_direction'"><strong>{{col.label}}</strong>: <i
                                    class="fa fa-long-arrow-up"
                                    :style="{transform: 'rotateZ(' + props.row.travel_direction + 'deg)'}"></i></span>
                                <span v-else-if="col.name=='best_confidence'">
                                    <strong>{{col.label}}</strong>: {{ props.row[col.name] | round() }}%
                                </span>
                                <span v-else><strong>{{col.label}}</strong>: {{props.row[col.name] | startCase}}</span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column v-for="(col,index) in expandCols" :key="col.name" :prop="col.name" :label="col.label"
                                    :width="(index == (expandCols.length - 1))?'':col.width"
                                    :class-name="(index == (expandCols.length - 1))?'last-col':''"
                                    :render-header="renderHeader">
                        <template slot-scope="props">
                            <span v-if="col.name=='created_at'">
                                {{props.row[col.name] | formatDate}}
                            </span>
                            <span v-else-if="col.name=='thumbnail_url'">
                                <template v-if="props.row[col.name]">
                                    <img :src="assetUrl(props.row[col.name])" class="img-fluid image-border"
                                        style="min-width:75px; min-height:45px" @click="showDetectionModal(props.row)" />
                                </template>
                                <template v-else>
                                    <img :src="'data:image/png;base64, ' + props.row['plate_crop_jpeg']"
                                        class="img-fluid image-border" style="min-width:75px; min-height:45px"
                                        @click="showDetectionModal(props.row)" />
                                </template>
                            </span>
                            <span v-else-if="col.name=='image_url'">
                                <template v-if="props.row[col.name]">
                                    <img :src="assetUrl(props.row[col.name])" class="img-fluid image-border"
                                        style="min-width:75px; min-height:45px" @click="showDetectionModal(props.row)" />
                                </template>
                                <template v-else>
                                    <img :src="'data:image/png;base64, ' + props.row['vehicle_crop_jpeg']"
                                        class="img-fluid image-border" style="min-width:75px; min-height:45px"
                                        @click="showDetectionModal(props.row)" />
                                </template>
                            </span>
                            <span v-else-if="col.name=='best_confidence'">
                                {{props.row[col.name] | round() }}%
                            </span>
                            <span v-else>
                                {{props.row[col.name] | startCase}}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <Detail ref="plateModal"></Detail>
    </div>
</template>
<script>
import BarrierService from '../../../services/barrier.service';
import SystemSettingsService from '../../../services/system-settings.service';
import Detail from './modal/detail';
export default {
    name: 'barrier-logs',
     components: {
        Detail
    },
    data() {
        return {
            isLoading: false,
            barrier: {
                current_page: 0,
                data: [],
                total: 0
            },
            idFrom: '',
            idTo: '',
            searchKey: '',
            pageSizes: [10, 20, 50, 100, 500],
            pageSize: 10,
            currentPage: 1,
            responsiveCols: [
                { name: 'created_at', label: 'Datetime', sortable: 'custom', width: 150, minScreen: 0 },
                { name: 'thumbnail_url', label: 'License plate image', sortable: 'custom', width: 160, minScreen: 0 },
                { name: 'image_url', label: 'Vehicle image', sortable: 'custom', width: 150, minScreen: 0 },
                { name: 'best_plate_number', label: 'Detected plate', sortable: 'custom', width: 150, minScreen: 870 },
                { name: 'best_confidence', label: 'Confidence', sortable: 'custom', width: 100, minScreen: 870},
                { name: 'matched_category', label: 'Matched category', sortable: 'custom', width: 150, minScreen: 992},
                { name: 'status', label: 'Action', sortable: 'custom', width: 80, minScreen: 992},
                { name: 'vehicle_make_model', label: 'Make & Model', sortable: 'custom', width: 120, minScreen: 1370},
                { name: 'vehicle_body_type', label: 'Body type', sortable: 'custom', width: 120, minScreen: 1550},
                { name: 'vehicle_color', label: 'Color', sortable: 'custom', width: 80, minScreen: 1550 },
                { name: 'region_name', label: 'Province', sortable: 'custom', width: 80, minScreen: 1750 },
                { name: 'travel_direction', label: 'Direction', sortable: 'custom', width: 80, minScreen: 1750},
                { name: 'device_name', label: 'Camera', sortable: 'custom', width: 80, minScreen: 1900 },
                { name: 'barrier', label: 'Barrier name', sortable: 'custom', width: 120, minScreen: 1900},
            ],
            screenWidth: 0,
            collection: [],
            makeModel: [],
            region: [],
            filterBarrierName: [],
            filterDate: null,
            filterBodyType: [],
            filterColor: [],
            filterCamera: [],
            isWarning: false
        }
    },
    computed: {
        expandCols() {
            const self = this;
            return this.responsiveCols.filter(x => x.minScreen <= self.screenWidth);
        },
        collapseCols () {
            const self = this;
            return this.responsiveCols.filter(x => x.minScreen > self.screenWidth);
        },
        filterMakeModel() {
            const self = this;
            const _list = [];
            self.makeModel.map(x => {
                if (_.isEmpty(x.models)) {
                    _list.push({...x, opened: false, children: []});
                } else {
                    const _makeModel = {...x, opened: false, children: []}
                    x.models.map(y => _makeModel.children.push({...y, opened: false}));
                    _list.push(_makeModel);
                }
            })
            return _list;
        },
        filterRegion () {
            const self = this;
            const _list = [];
            self.region.map(x => {
                if (_.isEmpty(x.provinces)) {
                    _list.push({...x, text: x.desc, opened: false, children: []});
                } else {
                    const _region = {...x, text: x.desc, opened: false, children: []}
                    x.provinces.map(y => _region.children.push({...y, text: y.name, opened: false}));
                    _list.push(_region);
                }
            })
            return _list;
        },
        filterDateButton () {
            if (this.filterDate && this.filterDate.length) {
                return moment.utc(String(this.filterDate[0])).format('DD/MM/YYYY hh:ssA') + ' - ' + moment.utc(String(this.filterDate[1])).format('DD/MM/YYYY hh:ssA')
            } else {
                return i18n.t('barrier.time_range');
            }
        },
        innerTableProps() {
            return Object.assign({
                fit: true
            })
        }
    },
    mounted () {
        const self = this;
        this.$nextTick(function () {
            window.addEventListener('resize', this.resizeHandle);
        })
        self.resizeHandle();
        self.getBarrierData();
        self.getFilterData();
    },
    methods: {
        resizeHandle () {
            this.screenWidth = $(window).width();
        },
        renderHeader (h, e) {
            const _name = e.column.label;
            return h('span', {class: 'col-label'}, _name)
        },
        async getBarrierData () {
            const self = this;
            try {
                self.isLoading = true;
                const _params = self.getSelectedFilterData();
                const response = await BarrierService.getBarrierLogs(_params);
                const data = response.data.data;
                self.barrier.data = data.data;
                self.barrier.total = data.pagination.total;
                self.currentPage = data.pagination.page;
                let ids = self.barrier.data.map((b) => { return b._id; });
                ids = ids.sort(function (i1, i2) {
                    return i1 > i2;
                });
                if (ids.length) {
                    self.idFrom = ids[ids.length - 1];
                    self.idTo = ids[0];
                }
            } catch(err) {
                if (!self.isWarning) {
                    toastr["warning"]("Action unsuccessfully. Please try again!");
                    self.isWarning = true;
                }
            } finally {
                self.isLoading = false;
            }
        },
        async getFilterData () {
            const self = this;
            try {
                const responseFilter = await BarrierService.getBarrierFilter();
                const responseBarrier = await BarrierService.getBarriers();
                const responseCamera = await SystemSettingsService.getCameraSettings();
                const filter = responseFilter.data.data;
                const barriers = responseBarrier.data.data;
                const cameras = responseCamera.data.data;
                self.makeModel = _.sortBy(filter.makeModel, ['name']).map(x => ({...x, name: _.startCase(x.name)}));
                self.region = filter.countries;
                self.filterBodyType = _.sortBy(filter.bodyType, ['name']).map(x => ({...x, name: _.startCase(x.name)}));
                self.filterColor = filter.colors.map(x => ({...x, name: _.startCase(x.name)}));;
                self.filterBarrierName = barriers
                self.filterCamera = cameras;
            } catch(err) {
                if (!self.isWarning) {
                    toastr["warning"]("Action unsuccessfully. Please try again!");
                    self.isWarning = true;
                }
            }
        },
        getSelectedFilterData () {
            const self = this;
            const _barrierName = [];
            const _vehicleMake = [];
            const _vehicleMakeModel = [];
            const _vehicleColor = [];
            const _vehicleBody = [];
            const _vehicleCountry = [];
            const _vehicleRegion = [];
            const _barrierCamera = [];
            const _name = self.filterBarrierName.filter(x => (x.selected));
            const _color = self.filterColor.filter(x => x.selected);
            const _body = self.filterBodyType.filter(x => x.selected);
            const _make = self.filterMakeModel.filter(x => (x.selected || x.indeterminate));
            const _country = self.filterRegion.filter(x => x.selected || x.indeterminate);
            var _cameras = self.filterCamera.filter(x => x.selected);
            if (!_.isEmpty(_name)) {
                _name.map(x => _barrierName.push(x.name));
            }
            if (!_.isEmpty(_color)) {
                _color.map(x => _vehicleColor.push(x.name));
            }
            if (!_.isEmpty(_body)) {
                _body.map(x => _vehicleBody.push(x.name));
            }
            if (!_.isEmpty(_make)) {
                _make.map(function (vm) {
                    if (vm.indeterminate) {
                        const _models = vm.children.filter(x => x.selected);
                        _models.map(x => _vehicleMakeModel.push(x.value));
                    } else {
                        _vehicleMake.push(vm.value);
                    }
                })
            }
            if (!_.isEmpty(_country)) {
                _country.map(function (c) {
                    if (c.indeterminate) {
                        const _regions = c.children.filter(x => x.selected);
                        _regions.map(x => _vehicleRegion.push(_.toLower(x.region)));
                    } else {
                        _vehicleCountry.push(_.toLower(c.code));
                    }
                })
            }
            if (_cameras && _cameras.length) {
                _cameras.map(function (dv) {
                    _barrierCamera.push(dv.id);
                })
            }
            return {
                barrier_name: _barrierName,
                cameras: _barrierCamera,
                make_model: {make: _vehicleMake, model: _vehicleMakeModel},
                body: _vehicleBody,
                color: _vehicleColor,
                country_region: {country: _vehicleCountry, region: _vehicleRegion},
                date: self.filterDate ? [self.filterDate[0], self.filterDate[1]] : [],
                keyword: self.searchKey,
                page: self.currentPage,
                size: self.pageSize,
            };
        },
        showDetectionModal (barrier) {
            let _modal = this.$refs.plateModal;
            _modal.barrier = barrier;
            _modal.isOpen = true;
        },
        openPrintablePage() {
            const self = this;
            const _params = self.getSelectedFilterData();
            _params.idFrom = self.idFrom;
            _params.idTo = self.idTo;
            var _sorting = {column: '_id', order: 'descending'};
            window.location = self.baseUrl(`/vehicles/detected/export/excel?filter=${JSON.stringify(_params)}&sort=${JSON.stringify(_sorting)}&size=${self.pageSize}`);
        },
        //Handle event for fillter
        clearFilter (fieldName) {
            //alert('TODO: clear functions '+ fieldName);
        },
        applyFilter (evt) {
            const self = this;
            self.getBarrierData();
        },
        openFilterDatePicker () {
            this.$refs.filterDateControl.pickerVisible = true;
        },
        handleSearchChange() {
            this.currentPage = 1;
            this.getBarrierData();
        },
        handleCurrentChange (currentPage) {
            this.currentPage = currentPage;
            this.getBarrierData();
        },
    },
}
</script>