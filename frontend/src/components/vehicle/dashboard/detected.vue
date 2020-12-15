<template>
    <div id="vehicle-detected" class="tab-content">
        <div class="row m-bot-10">
            <div class="col col-lg-9 col-12 lg-down-m-bot-10 filter-control-wrapper">
                <v-filter
                    :klass="'filter-has-children'"
                    :data="filterMakeModel"
                    multiple
                    :caption="$t('vehicle.make_and_model')"
                    :text-field-name="'name'"
                    :id="'filter-make'"
                    :searchable="true"
                    @clear-click="clearFilter"
                    @apply-click="applyFilter($event, 'make')"
                >
                </v-filter>
                <v-filter
                    :data="filterBodyType"
                    multiple
                    :caption="$t('vehicle.body_type')"
                    :text-field-name="'name'"
                    :id="'filter-body-type'"
                    @clear-click="clearFilter"
                    @apply-click="applyFilter($event, 'make')"
                >
                </v-filter>
                <v-filter
                    :data="filterColor"
                    multiple
                    :caption="$t('vehicle.colour')"
                    :text-field-name="'name'"
                    :id="'filter-colour'"
                    @clear-click="clearFilter"
                    @apply-click="applyFilter($event, 'make')"
                >
                </v-filter>
                <v-filter
                    :klass="'filter-has-children'"
                    :data="filterRegion"
                    multiple
                    :caption="$t('vehicle.province')"
                    :id="'filter-province'"
                    :searchable="true"
                    @clear-click="clearFilter"
                    @apply-click="applyFilter($event, 'make')"
                ></v-filter>
                <div class="filter-box">
                    <button
                        class="btn btn-outline-primary caption"
                        v-text="filterDateButton"
                        :class="{ active: filterDateButton != $t('common.time_range') }"
                        @click="openFilterDatePicker"
                    ></button>
                    <el-date-picker
                        ref="filterDateControl"
                        class="filter-date-picker"
                        v-model="filterDate"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="Start date"
                        @change="applyFilter($event, 'time')"
                        end-placeholder="End date"
                        timezone="UTC"
                    >
                    </el-date-picker>
                </div>
                <v-filter
                    :data="filterCCTV"
                    multiple
                    :caption="'Camera'"
                    :id="'filter-cctv'"
                    :searchable="true"
                    @clear-click="clearFilter"
                    @apply-click="applyFilter($event, 'cctv')"
                ></v-filter>
            </div>
            <div
                class="col col-lg-3 col-12 text-right lg-down-text-left flex-box align-items-center"
            >
                <el-input
                    class="search-box blue-style"
                    v-model="searchKey"
                    :placeholder="$t('common.search')"
                    ><i slot="suffix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-button
                    type="primary"
                    class="btn btn-outline-primary blue-style m-left-5"
                    icon="el-icon-download"
                    style="min-width: auto; color: #FFFFFF;"
                    @click="openPrintablePage"
                ></el-button>
            </div>
        </div>
        <div class="tab-control-container">
            <div class="left-box">
                <strong>{{ $t('common.show') }}</strong>
                <el-select
                    v-model="pageSize"
                    placeholder="Select"
                    :disabled="isLoading"
                    @change="handleSizeChange"
                    class="max-w-70"
                >
                    <el-option
                        v-for="item in pageSizes"
                        :key="item"
                        :label="item"
                        :value="item"
                    >
                    </el-option>
                </el-select>
                <strong>{{ $t('common.entries') }}</strong>
            </div>
            <div class="right-box">
                <v-pagination
                    :total="vehicles.total"
                    :page-size="pageSize"
                    :current-page="currentPage"
                ></v-pagination>
                <el-pagination
                    :disabled="isLoading"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-sizes="pageSizes"
                    :page-size="parseInt(pageSize)"
                    layout="prev, next"
                    :total="vehicles.total"
                >
                </el-pagination>
            </div>
        </div>
        <div class="table-wrapper">
            <el-table
                :fit="true"
                :data="vehicles.data"
                class="alert-list-table spacing-table responsive-table"
                :class="{ collapsed: collapseCols.length > 0 }"
                v-loading="isLoading"
                :element-loading-text="$t('common.loading') + '...'"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                style="width:100%"
                @sort-change="handleSort"
                v-bind="innerTableProps"
            >
                <el-table-column type="expand" :width="collapseCols.length > 0 ? 30 : 10">
                    <template slot-scope="props">
                        <p v-for="(col, index) in collapseCols" :key="index">
                            <span v-if="col.name=='camera_id'"><strong>{{col.label}}</strong>:&nbsp;&nbsp;
                                <template>#{{props.row[col.name]}}</template>
                            </span>
                            <span v-else-if="col.name=='vehicle_type'"><strong>{{col.label}}</strong>:&nbsp;&nbsp;
                                <template>{{props.row[col.name] | startCase}}</template>
                            </span>
                            <span v-else-if="col.name=='region'"><strong>{{col.label}}</strong>:&nbsp;&nbsp;
                                <template>{{$t('alpr.' + props.row[col.name])}}</template>
                            </span>
                            <!-- <span v-else-if="col.name=='travel_direction'">
                                <strong>{{col.label}}</strong>:&nbsp;&nbsp;
                                <i class="fa fa-long-arrow-up"
                                :style="{transform: 'rotateZ(' + props.row.travel_direction + 'deg)'}">
                                </i>
                            </span> -->
                            <span v-else><strong>{{col.label}}</strong>:&nbsp;&nbsp;{{props.row[col.name] | formatDate}}</span>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column
                    v-for="(col, index) in expandCols"
                    :key="index"
                    :prop="col.name"
                    :label="col.label"
                    :class-name="index == expandCols.length - 1 ? 'last-col' : ''"
                    :sortable="col.sortable"
                    :width="index == expandCols.length - 1 ? '' : col.width"
                    :render-header="renderHeader"
                >
                    <template slot-scope="props">
                        <span v-if="col.name=='_id'">
                            {{props.row[col.name] | convertOID}}
                        </span>
                        <span v-if="col.name=='plate'" class="font-weight-bold fs-14">
                            {{props.row[col.name]}}
                        </span>
                        <span v-if="col.name=='vehicle_type'">
                            {{props.row[col.name] | startCase}}
                        </span>
                        <span v-if="col.name=='region'">
                                {{$t('alpr.' + props.row[col.name])}}
                        </span>
                        <!-- <span v-if="col.name=='camera_id'">
                            <template>#{{props.row[col.name]}}</template>
                        </span> -->
                            <span v-if="col.name=='timestamp'">
                            {{props.row[col.name] | formatDate}}
                        </span>
                         <span v-if="col.name=='plate_score'">
                            {{ props.row[col.name] === 1 ? 100: (props.row[col.name] * 100).toFixed(2) }}%
                        </span>
                        <span v-if="col.name=='plate_image'">
                            <img :src="'data:image/png;base64, ' + props.row[col.name]"
                                alt="not found" class="img-fluid image-border"
                                style="min-width:75px; min-height:45px"
                                    @click="showDetectionModal(props.row)"
                                />
                        </span>
                        <span v-else-if="col.name=='travel_direction'">
                            <i class="fa fa-long-arrow-up"
                            :style="{transform: 'rotateZ(' + props.row.travel_direction + 'deg)'}"></i>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Detail ref="plateModal"></Detail>
    </div>
</template>
<script>
import VehicleService from '../../../services/vehicle.service';
import Detail from './modal/detail';
import _ from 'lodash'
export default {
    name: 'vehicle-detected',
    components: {
        Detail
    },
    data() {
        return {
            isLoading: false,
            isStoring: false,
            editFieldModalVisible: false,
            promptModalVisible: false,
            promptModalTitle: '',
            promptModalMessage: '',
            cameras: [],
            vehicles: {
                data: [],
                total: 0,
            },
            idFrom: '',
            idTo: '',
            vehicleData: null,
            searchKey: '',
            innerSearchKey: '',
            sortData: {},
            pageSizes: [10, 20, 50, 100, 500],
            pageSize: 10,
            currentPage: 1,
            selectedLocationIndex: '',
            responsiveCols: [
                { name: 'plate', label: i18n.t('vehicle.license_plate'), sortable: 'custom', width: 120, minScreen: 0, },
                { name: 'plate_image', label: i18n.t('vehicle.image'), sortable: 'custom', width: 120, minScreen: 0, },
                { name: 'plate_score', label: 'Score', sortable: 'custom', width: 120, minScreen: 0, },
                { name: 'vehicle_type', label: i18n.t('vehicle.body_type'), sortable: 'custom', width: 220, minScreen: 700, },
                { name: 'region', label: i18n.t('vehicle.region_name'), sortable: 'custom', width: 120, minScreen: 870, },
                { name: 'timestamp', label: i18n.t('vehicle.date_and_time'), sortable: 'custom', width: 150, minScreen: 1155, },
            ],
            screenWidth: 0,
            switchFromWidth: 1200,
            filterDate: null,
            makeModel: [],
            filterBodyType: [],
            filterColor: [],
            region: [],
        }
    },
    computed: {
        filterMakeModel() {
            const self = this;
            const _list = [];
            self.makeModel.map((x) => {
                if (_.isEmpty(x.models)) {
                    _list.push({ ...x, opened: false, children: [] });
                } else {
                    const _makeModel = { ...x, opened: false, children: [] };
                    x.models.map((y) =>
                        _makeModel.children.push({ ...y, opened: false })
                    );
                    _list.push(_makeModel);
                }
            });
            return _list;
        },
        filterRegion() {
            const self = this;
            const _list = [];
            self.region.map((x) => {
                if (_.isEmpty(x.regions)) {
                    _list.push({ ...x, opened: false, children: [] });
                } else {
                    const _region = { ...x, opened: false, children: [] };
                    x.regions.map((y) => _region.children.push({ ...y, opened: false }));
                    _list.push(_region);
                }
            });
            return _list;
        },
        filterCCTV() {
            var self = this;
            var _list = [];
            self.cameras.map(function(d) {
                _list.push({ text: d.name, value: d.openalpr_id, selected: false });
            });
            return _list;
        },
        filterDateButton() {
            if (this.filterDate && this.filterDate.length) {
                return moment(this.filterDate[0]).format('L LT') + ' - ' + moment(this.filterDate[1]).format('L LT');
            } else {
                return i18n.t('common.time_range');
            }
        },
        expandCols() {
            var self = this;
            return this.responsiveCols.filter((x) => x.minScreen <= self.screenWidth);
        },
        collapseCols() {
            var self = this;
            return this.responsiveCols.filter((x) => x.minScreen > self.screenWidth);
        },
        innerTableProps() {
            return Object.assign({
                fit: true,
            });
        },
    },
    watch: {
        searchKey() {
            this.updateInnerSearchKey();
        },
    },
    mounted() {
        var self = this;
        self.getVehilces()
        this.$nextTick(() => {
            window.addEventListener('resize', this.resizeHandle);
            self.resizeHandle();
        });

        // if ('WebSocket' in window) {
        //     self.streamImage();
        // }
    },
    methods: {
        async getVehilces(){
            const self = this;
            try {
                self.isLoading = true;
                const response = await VehicleService.getVehicles();
                const { data } = response.data;
                self.vehicles.data = data.data
                self.vehicles.total = data.pagination.total
                self.currentPage = data.pagination.page;
            } catch (error) {
                console.log(error)
            } finally {
                self.isLoading = false;
            }
        },
        getThumbnailImage(vehicle, time) {
            var self = this;
            $.get(self.assetUrl(vehicle.thumbnail_url), function(imgData) {
                vehicle.loadingThumbnail = false;
            })
                .done(function() {
                    console.log('second success');
                })
                .fail(function() {
                    console.log('error');
                    if (time < 4) {
                        setTimeout(function() {
                            vehicleDetectedApp.getThumbnailImage(vehicle, time++);
                        }, 500);
                    } else {
                        vehicle.thumbnail_url = 'no_image';
                    }
                })
                .always(function() {
                    console.log('finished');
                });
        },
        resizeHandle() {
            this.screenWidth = $(window).width();
        },
        updateInnerSearchKey: _.debounce(function() {
            this.innerSearchKey = this.searchKey.toLowerCase().trim();
            this.currentPage = 1;
            this.getVehicleData();
        }, 200),
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
            this.getVehicleData();
        },
        handleSizeChange() {
            this.currentPage = 1;
            this.getVehicleData();
        },
        handleSort(obj) {
            this.sortData = obj;
            this.vehicles.data = [];
            this.getVehicleData();
            this.innerTableProps.defaultSort = {
                prop: obj.prop,
                order: obj.order,
            };
        },
        showDetectionModal(vehicle) {
            var _modal = this.$refs.plateModal;
            _modal.vehicle = vehicle;
            _modal.isOpen = true;
        },
        renderHeader(h, e) {
            var _name = e.column.label;
            return h('span', { class: 'col-label' }, _name);
        },
        clearFilter(fieldName) {
            //alert('TODO: clear functions '+ fieldName);
        },
        applyFilter(evt, fieldName) {
            var self = this;
            self.currentPage = 1;
            var _params = self.getSelectedFilterData();
            if (evt == null && fieldName == 'time') {
                self.getVehicleData();
                this.clearFilter(fieldName);
            } else {
                self.getVehicleData();
            }
        },
        async getVehicleData() {
            var self = this;
            if (self.isLoading) return;
            var _params = self.getSelectedFilterData();
            var _sorting = {
                column: self.sortData.prop || '_id',
                order: self.sortData.order || 'descending',
            };
            self.isLoading = true;
            const params = {
                page: self.currentPage,
                size: self.pageSize,
                // filter: JSON.stringify(_params),
                // sort: JSON.stringify(_sorting),
            }
            const response = await VehicleService.getVehicles(params);
            const { data } = response.data;
            self.vehicles.data = data.data
            self.vehicles.total = data.pagination.total
            self.currentPage = data.pagination.page;

            let ids = self.vehicles.data.map((v) => {
                return v._id;
            });
            ids = ids.sort(function(i1, i2) {
                return i1 > i2;
            });
            if (ids.length) {
                self.idFrom = ids[ids.length - 1];
                self.idTo = ids[0];
            }
            self.isLoading = false;
        },
        openFilterDatePicker() {
            this.$refs.filterDateControl.pickerVisible = true;
        },
        gotInternalDevice(row) {
            var _device = this.cameras.find(
                (x) => parseInt(x.openalpr_id) === parseInt(row['external_id'])
            );
            if (_device) {
                return true;
            }
            return false;
        },
        getSelectedFilterData() {
            var self = this;
            var _vehicle_make = [];
            var _vehicle_make_model = [];
            var _vehicle_color = [];
            var _vehicle_body = [];
            var _vehicle_country = [];
            var _vehicle_region = [];
            var _vehicle_device = [];
            var _make = self.filterMakeModel.filter((x) => x.selected || x.indeterminate);
            var _color = self.filterColor.filter((x) => x.selected);
            var _body = self.filterBodyType.filter((x) => x.selected);
            var _country = self.filterRegion.filter((x) => x.selected || x.indeterminate);
            var _cameras = self.filterCCTV.filter((x) => x.selected);
            if (!_.isEmpty(_make)) {
                _make.map(function(vm) {
                    if (vm.indeterminate) {
                        const _models = vm.children.filter((x) => x.selected);
                        _models.map((x) => _vehicle_make_model.push(x.value));
                    } else {
                        _vehicle_make.push(vm.value);
                    }
                });
            }
            if (_color && _color.length) {
                _color.map(function(vc) {
                    _vehicle_color.push(vc.value);
                });
            }
            if (_body && _body.length) {
                _body.map(function(vb) {
                    _vehicle_body.push(vb.value);
                });
            }
            if (!_.isEmpty(_country)) {
                _country.map(function(c) {
                    if (c.indeterminate) {
                        const _regions = c.children.filter((x) => x.selected);
                        _regions.map((x) => _vehicle_region.push(x.value));
                    } else {
                        _vehicle_country.push(c.value);
                    }
                });
            }
            if (_cameras && _cameras.length) {
                _cameras.map(function(dv) {
                    _vehicle_device.push(dv.value);
                });
            }
            return {
                make_model: { make: _vehicle_make, model: _vehicle_make_model },
                body: _vehicle_body,
                color: _vehicle_color,
                country_region: { country: _vehicle_country, region: _vehicle_region },
                date: self.filterDate ? [self.filterDate[0], self.filterDate[1]] : [],
                device: _vehicle_device,
                keyword: self.searchKey,
            };
        },
        streamImage() {
            var self = this;
            let uri = 'https:' == window.location.protocol
                    ? `wss://${window.location.host}/${socket.path}`
                    : `ws://${socket.host}/${socket.path}`;
            const ws = new WebSocket(uri);
            ws.onopen = (event) => {
                let msg = {
                    alias: 'openalpr',
                    resource: 'image',
                    domain: domain,
                };
                ws.send(JSON.stringify(msg));
                console.log('Vehicle image stream connected!');
            };
            ws.onmessage = function(event) {
                let data = JSON.parse(event.data);
                var index = self.vehicles.findIndex((x) => x._id === data._id);
                if (index >= 0) {
                    self.vehicles[index].image_url = data.image_url;
                    self.vehicles[index].thumbnail_url = data.thumbnail_url;
                }
            };
            ws.onclose = () => console.log('Vehicle image stream closed!');
        },
        openPrintablePage() {
            var self = this;
            var _params = self.getSelectedFilterData();
            _params.idFrom = self.idFrom;
            _params.idTo = self.idTo;
            var _sorting = {
                column: self.sortData.prop || '_id',
                order: self.sortData.order || 'descending',
            };
            window.location = self.baseUrl(
                `/vehicles/detected/export/excel?filter=${JSON.stringify(
                    _params
                )}&sort=${JSON.stringify(_sorting)}&size=${self.pageSize}`
            );
        },
        displayCamera(row) {
            var _device = this.cameras.find(
                (x) => parseInt(x.openalpr_id) === parseInt(row['external_id'])
            );
            if (_device) {
                return _device.name;
            }
            return row['device_name'];
        },
    },
    filters: {
        convertOID(obi) {
            if (typeof obi === 'object') {
                return parseInt(obi.$oid.substring(0, 8), 16);
            }
            return parseInt(obi.substring(0, 8), 16);
        },
    },
};
</script>
