<template>
    <div id="barrier-realtime" class="tab-content" v-cloak>
        <div role="tabpanel">
            <div class="row p-bot-25">
                <div class="col col-lg-9 col-12 lg-down-m-bot-10 filter-control-wrapper">
                    <v-filter :data="filterBarrierName" multiple caption="Barrier name" :text-field-name="'name'"
                            :id="'barrier-name'" @clear-click="clearFilter" @apply-click="applyFilter($event)">
                    </v-filter>
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
                            <span v-else-if="col.name=='travel_direction'">
                                <i class="fa fa-long-arrow-up"
                                :style="{transform: 'rotateZ(' + props.row.travel_direction + 'deg)'}"></i>
                            </span>
                            <span v-else-if="col.name=='best_confidence'">
                                {{ props.row[col.name] | round() }}%
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
import Detail from './modal/detail';
export default {
    name: 'barrier-realtime',
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
            responsiveCols: [
                { name: 'created_at', label: 'Datetime', sortable: 'custom', width: 150, minScreen: 0 },
                { name: 'thumbnail_url', label: 'License plate image', sortable: 'custom', width: 160, minScreen: 0 },
                { name: 'image_url', label: 'Vehicle image', sortable: 'custom', width: 150, minScreen: 0 },
                { name: 'best_plate_number', label: 'Detected plate', sortable: 'custom', width: 150, minScreen: 870 },
                { name: 'best_confidence', label: 'Confidence', sortable: 'custom', width: 100, minScreen: 870 },
                { name: 'matched_category', label: 'Matched category', sortable: 'custom', width: 150, minScreen: 992 },
                { name: 'status', label: 'Action', sortable: 'custom', width: 80, minScreen: 1200 },
                { name: 'vehicle_make_model', label: 'Make & Model', sortable: 'custom', width: 120, minScreen: 1380 },
                { name: 'vehicle_body_type', label: 'Body type', sortable: 'custom', width: 120, minScreen: 1550 },
                { name: 'vehicle_color', label: 'Color', sortable: 'custom', width: 80, minScreen: 1550 },
                { name: 'region_name', label: 'Province', sortable: 'custom', width: 80, minScreen: 1750 },
                { name: 'travel_direction', label: 'Direction', sortable: 'custom', width: 80, minScreen: 1750 },
                { name: 'device_name', label: 'Camera', sortable: 'custom', width: 80, minScreen: 1900 },
                { name: 'barrier', label: 'Barrier name', sortable: 'custom', width: 120, minScreen: 1900 },
            ],
            screenWidth: 0,
            filterBarrierName: [],
            isWarning: false
        };
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
    },
    created() {
        this.setupStream();
    },
    mounted () {
        const self = this;
        self.getBarrierData();
        self.getFilterData();
        self.resizeHandle();
        this.$nextTick(function () {
            window.addEventListener('resize', this.resizeHandle);
        });
    },
    methods: {
        resizeHandle () {
            this.screenWidth = $(window).width();
        },
        showDetectionModal (barrier) {
            const _modal = this.$refs.plateModal;
            _modal.barrier = barrier;
            _modal.isOpen = true;
        },
        renderHeader (h, e) {
            const _name = e.column.label;
            return h('span', {class: 'col-label'}, _name)
        },
        clearFilter (fieldName) {
            //alert('TODO: clear functions '+ fieldName);
        },
        applyFilter (evt) {
            const self = this;
            self.getBarrierData();
        },
        async getBarrierData () {
            const self = this;
            try {
                self.isLoading = true;
                const _params = self.getSelectedFilterData();
                const response = await BarrierService.getBarrierLogs(_params);
                const data = response.data.data;
                self.barrier.data = data.data;
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
                const response = await BarrierService.getBarriers();
                const data = response.data.data;
                self.filterBarrierName = data;
            } catch(err) {
                if (!self.isWarning) {
                    toastr["warning"]("Action unsuccessfully. Please try again!");
                    self.isWarning = true;
                }
            }
        },
        getSelectedFilterData () {
            var self = this;
            var _barrierName = [];
            var _name = self.filterBarrierName.filter(x => (x.selected));
            if (!_.isEmpty(_name)) {
                _name.map(x => _barrierName.push(x.name));
            }
            return {
                barrier_name: _barrierName,
                page: 1,
                size: 10,
            };
        },
        setupStream() {
            const self = this;
            let es = new EventSource(BarrierService.streamBarrierPath());

            es.addEventListener('message', event => {
                let data = JSON.parse(event.data);
                self.barrier.data.unshift(data);
                if (self.barrier.data.length > 10) {
                    self.barrier.data.pop();
                }
            }, false);

            es.addEventListener('error', event => {
                if (event.readyState == EventSource.CLOSED) {
                    console.log('Event was closed');
                    console.log(EventSource);
                }
            }, false);
        }
    },
};
</script>