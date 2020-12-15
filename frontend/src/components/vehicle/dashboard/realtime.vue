<template>
    <div id="vehicle-realtime" class="tab-content">
        <div class="table-wrapper">
            <div class="row flex-grow-1">
                <div class="col">
                    <el-table ref="realTimeVehicleTab" :fit="true" :data='vehicles'
                            class="alert-list-table spacing-table responsive-table"
                            :class="{'collapsed':collapseCols.length > 0}" style="width:100%"
                            v-loading="isLoading"
                            :element-loading-text="$t('common.loading') + '...'"
                            element-loading-spinner="el-icon-loading"
                            element-loading-background="rgba(0, 0, 0, 0.8)"
                            @sort-change='handleSort' v-bind='innerTableProps' :row-class-name="tableRowClassName">
                        <el-table-column type="expand" :width="(collapseCols.length > 0) ? 30:10">
                            <template slot-scope="props">
                                <p v-for="(col,index) in collapseCols" :key="index">
                                    <span v-if="col.name=='camera_id'"><strong>{{col.label}}</strong>:&nbsp;&nbsp;
                                        <template>#{{props.row[col.name]}}</template>
                                    </span>
                                    <span v-else-if="col.name=='vehicle_type'"><strong>{{col.label}}</strong>:&nbsp;&nbsp;
                                        <template>{{props.row[col.name] | startCase}}</template>
                                    </span>
                                    <span v-else-if="col.name=='region'"><strong>{{col.label}}</strong>:&nbsp;&nbsp;
                                        <template>{{$t('alpr.' + props.row[col.name])}}</template>
                                    </span>
                                    <span v-else-if="col.name=='travel_direction'">
                                        <strong>{{col.label}}</strong>:&nbsp;&nbsp;
                                        <i class="fa fa-long-arrow-up"
                                        :style="{transform: 'rotateZ(' + props.row.travel_direction + 'deg)'}">
                                        </i>
                                    </span>
                                    <span v-else><strong>{{col.label}}</strong>:&nbsp;&nbsp;{{props.row[col.name] | formatDate}}</span>
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column v-for="(col,index) in expandCols" :key="index" :prop="col.name" :label="col.label"
                                        :sortable="col.sortable"
                                        :width="(index == (expandCols.length - 1))?'':col.width"
                                        :class-name="(index == (expandCols.length - 1))?'last-col':''"
                                        :render-header="renderHeader">
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
                                <span v-if="col.name=='camera_id'">
                                    <template>#{{props.row[col.name]}}</template>
                                </span>
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
            </div>
        </div>
        <Detail ref="plateModal"></Detail>
    </div>
</template>
<script>
import VehicleService from '../../../services/vehicle.service';
import Detail from './modal/detail';
import _ from 'lodash'
export default {
    name: 'vehicle-realtime',
    components: {
        Detail
    },
    data() {
        return {
            latestVehicle:null,
            isLoading: false,
            cameras: [],
            vehicles: [],
            allAlerts: [],
            blacklistAlerts: [],
            whitelistAlerts: [],
            sortData: {},
            responsiveCols: [
                { name: 'plate', label: i18n.t('vehicle.license_plate'), sortable: 'custom', width: 120, minScreen: 0, },
                { name: 'plate_image', label: i18n.t('vehicle.image'), sortable: 'custom', width: 120, minScreen: 0, },
                { name: 'plate_score', label: 'Score', sortable: 'custom', width: 120, minScreen: 0, },
                { name: 'vehicle_type', label: i18n.t('vehicle.body_type'), sortable: 'custom', width: 220, minScreen: 700, },
                { name: 'region', label: i18n.t('vehicle.region_name'), sortable: 'custom', width: 120, minScreen: 870, },
                { name: 'timestamp', label: i18n.t('vehicle.date_and_time'), sortable: 'custom', width: 150, minScreen: 1155, },
                // { name: 'camera_id', label: i18n.t('vehicle.camera'), sortable: 'custom', width: 80, minScreen: 1550, },
            ],
            screenWidth: 0,
            switchFromWidth: 1200,
            selectedCCTVIndex: '',
            cctvList: [],
            pipeline: null,
            webRtcPeer: null,
        }
    },
    computed: {
        expandCols () {
            var self = this;
            return this.responsiveCols.filter(x => x.minScreen <= self.screenWidth);
        },
        collapseCols () {
            var self = this;
            return this.responsiveCols.filter(x => x.minScreen > self.screenWidth);
        },
        innerTableProps() {
            return Object.assign({
                fit: true
            })
        }
    },
    updated () {
        var self = this;
        this.$nextTick(() => {
            setTimeout(function(){
                if(self.latestVehicle){
                    $(`.row-${self.latestVehicle._id}`).addClass('flash animated');
                }
            },100)
        })
    },
    mounted () {
        var self = this;
        self.getRealtime();
        this.$nextTick(() => {
            window.addEventListener('resize', this.resizeHandle);
            self.resizeHandle();
        });
        // if ("WebSocket" in window) {
        //     self.streamAlert();
        //     self.streamImage();
        // }
    },
    methods: {
        async getRealtime(){
            const self = this;
            try {
                self.isLoading = true;
                const response = await VehicleService.getVehicles();
                const { data } = response.data;
                self.vehicles = data.data
            } catch (error) {
                console.log(error)
            } finally {
                self.isLoading = false;
            }
        },
        async handleUpdateStatus (vehicleAlert) {
            var self = this;
            if (vehicleAlert && vehicleAlert.status) {
                switch (vehicleAlert.status.toUpperCase()) {
                    case 'RESOLVED':
                        vehicleAlert.status = 'pending';
                        break;
                    default:
                        vehicleAlert.status = 'resolved';
                        break;
                }
                var data = {'status': vehicleAlert.status};
                try {
                    const res = await VehicleService.updateVehicleAlert(vehicleAlert._id, data);
                    var response = res.data;
                    if (response.status) {
                        toastr["success"]("Update successfully!");
                    } else {
                        toastr["warning"]("Action unsuccessfully. Please try again!");
                    }
                } catch (error) {
                    if (error.status === 422) {
                        toastr["warning"](error.body.message);
                        self.form.errors = error.body.errors;
                    } else {
                        console.log("Submit failed!");
                    }
                }
            }
        },
        getButtonLabel (vehicleAlert) {
            if (vehicleAlert && vehicleAlert.status) {
                switch (vehicleAlert.status.toUpperCase()) {
                    case 'RESOLVED':
                        return 'Reopen Alert';
                    default:
                        return 'MARK AS RESOLVED'
                }
            }
            return 'MARK AS RESOLVED'
        },
        resizeHandle () {
            this.screenWidth = $(window).width();
        },
        updateInnerSearchKey: _.debounce(function () {
            this.innerSearchKey = this.searchKey.toLowerCase().trim();
        }, 200),
        handleSort (obj) {
            this.sortData = obj;
            this.innerTableProps.defaultSort = {
                prop: obj.prop,
                order: obj.order
            }
        },
        showDetectionModal (vehicle) {
            var _modal = this.$refs.plateModal;
            _modal.vehicle = vehicle;
            _modal.isOpen = true;
        },
        renderHeader (h, e) {
            var _name = e.column.label;
            return h('span', {class: 'col-label'}, _name)
        },
        gotInternalDevice (row) {
            var _device = this.cameras.find(x => parseInt(x.openalpr_id) === parseInt(row['external_id']));
            if (_device) {
                return true;
            }
            return false;
        },
        streamAlert () {
            let self = this;
            let uri = 'https:' == window.location.protocol ?
                `wss://${window.location.host}/${socket.path}` :
                `ws://${socket.host}/${socket.path}`;
            const ws = new WebSocket(uri);
            ws.onopen = event => {
                let msg = {
                    alias: 'openalpr',
                    resource: 'alert',
                    domain: domain,
                };
                ws.send(JSON.stringify(msg))
                console.log('Vehicle alert stream connected!');
            };
            ws.onmessage = function (event) {
                let data = JSON.parse(event.data);
                data.image_url = null;
                data.thumbnail_url = null;
                let id = data.openalpr_event_id;
                let first = _.first(self.vehicles);
                if (first && first._id != id && data.body !== 'motorcycle') {
                    self.latestVehicle = {
                        _id: id,
                        external_id: data.external_id,
                        device_name: data.device_name,
                        best_plate_number: data.license_plate,
                        vehicle_make: data.make,
                        vehicle_make_model: data.model,
                        vehicle_body_type: data.body,
                        vehicle_color: data.color,
                        travel_direction: data.direction,
                        best_confidence: data.confidence,
                        image_url: data.image_url,
                        thumbnail_url: data.thumbnail_url,
                        vehicle_crop_jpeg: data.vehicle_crop_jpeg,
                        plate_crop_jpeg: data.plate_crop_jpeg,
                        created_at: data.created_at,
                        updated_at: data.updated_at,
                    };
                    self.vehicles.unshift(self.latestVehicle);
                    self.vehicles.pop();
                }
                self.allAlerts.unshift(data);
                self.allAlerts.pop();
                let alerts;
                switch (data.alert_rule_icon) {
                    case 'blacklist':
                        alerts = self.blacklistAlerts;
                        break;
                    case 'whitelist':
                        alerts = self.whitelistAlerts;
                        break;
                }
                if (alerts) {
                    alerts.unshift(data);
                    alerts.pop();
                }
            };
            ws.onclose = () => console.log("Vehicle alert stream closed!");
        },
        streamImage () {
            var self = this;
            let uri = 'https:' == window.location.protocol ?
                `wss://${window.location.host}/${socket.path}` :
                `ws://${socket.host}/${socket.path}`;
            const ws = new WebSocket(uri);
            ws.onopen = event => {
                let msg = {
                    alias: 'openalpr',
                    resource: 'image',
                    domain: domain,
                };
                ws.send(JSON.stringify(msg))
                console.log('Vehicle image socket connected!');
            };
            ws.onmessage = function (event) {
                let data = JSON.parse(event.data);
                var indexVehicle = self.vehicles.findIndex(x => x._id === data._id);
                var indexAllAlerts = self.allAlerts.findIndex(x => x.openalpr_event_id === data._id);
                var indexBlacklistAlerts = self.blacklistAlerts.findIndex(x => x.openalpr_event_id === data._id);
                var indexWhitelistAlerts = self.whitelistAlerts.findIndex(x => x.openalpr_event_id === data._id)
                self.util(indexVehicle, self.vehicles, data);
                self.util(indexAllAlerts, self.allAlerts, data);
                self.util(indexBlacklistAlerts, self.blacklistAlerts, data);
                self.util(indexWhitelistAlerts, self.whitelistAlerts, data);
            }
            ws.onclose = () => console.log("Vehicle image socket closed!");
        },
        util (index, object, data) {
            if (index >= 0) {
                object[index].image_url = data.image_url;
                object[index].thumbnail_url = data.thumbnail_url;
            }
        },
        tableRowClassName({row, rowIndex}) {
            return `row-${row._id}`;
        },
        displayCamera(row) {
            var _device = this.cameras.find(x => parseInt(x.openalpr_id) === parseInt(row['external_id']));
            if (_device) {
                return _device.name;
            }
            return row['device_name'];
        },
    },
    filters: {
        convertOID: function (obi) {
            if (typeof obi === 'object') {
                return parseInt(obi.$oid.substring(0, 8), 16);
            }
            return parseInt(obi.substring(0, 8), 16);
        },
    }
}
</script>
