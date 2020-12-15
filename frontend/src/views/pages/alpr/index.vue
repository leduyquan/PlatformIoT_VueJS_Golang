<template>
<div class="page-with-sidebar" style="padding-left: 0px">
        <div class="fixed-top bg-blue-dark">
            <div class="flex-box">
                <div class="right-top-header flex-col">
                    <nav class="navbar navbar-expand-md justify-content-center" style="padding: 16px 0;">
                        <a class="navbar-brand white-color" href="/"><img :src="assetUrl('img/logos/crowdsense.svg')" alt="logo" height="15"></a>
                    </nav>
                </div>
            </div>
        </div>
        <div class="content-wrapper">
            <div class="container-fluid container-limited limit-container-width">
                <div class="container-wraper mt-5">
                    <div class="row tab-content ">
                        <div class="col col-lg-8 col-md-6 col-12">
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
                                    <v-pagination :total="pagination.total" :page-size="pageSize" :current-page="currentPage"></v-pagination>
                                    <el-pagination :disabled="isLoading" @current-change="handleCurrentChange"
                                                :current-page.sync="currentPage" :page-sizes="pageSizes" :page-size="parseInt(pageSize)"
                                                layout="prev, next" :total="pagination.total">
                                    </el-pagination>
                                </div>
                            </div>
                            <el-table ref="realTimeVehicleTab" :fit="true" :data='alpr'
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
                                            <span v-else-if="col.name=='vehicle'"><strong>{{col.label}}</strong>:&nbsp;&nbsp;
                                                <template>{{props.row[col.name].type | startCase}}</template>
                                            </span>
                                            <span v-else-if="col.name=='region'"><strong>{{col.label}}</strong>:&nbsp;&nbsp;
                                                <template>{{$t('alpr.' + props.row[col.name].code)}}</template>
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
                                        <span v-if="col.name=='vehicle'">
                                            {{props.row[col.name].type | startCase}}
                                        </span>
                                        <span v-if="col.name=='region'">
                                             {{$t('alpr.' + props.row[col.name].code)}}
                                        </span>
                                        <span v-if="col.name=='camera_id'">
                                            <template>#{{props.row[col.name]}}</template>
                                        </span>
                                         <span v-if="col.name=='timestamp'">
                                            {{props.row[col.name] | formatDate}}
                                        </span>
                                        <span v-if="col.name=='crop_image'">
                                            <img :src="baseUrl(props.row[col.name])"
                                                :alt="props.row.crop_image" class="img-fluid image-border"
                                                style="min-width:75px; min-height:45px"
                                                 @click="showDetectionModal(props.row)"
                                                />
                                        </span>
                                         <span v-if="col.name=='filename'">
                                            <img :src="baseUrl(props.row[col.name])"
                                                :alt="props.row.crop_image" class="img-fluid image-border"
                                                style="min-width:75px; min-height:45px"
                                                 @click="showDetectionModal(props.row)"
                                                />
                                        </span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="col col-lg-4 col-md-6 col-12">
                            <div class="overflow-auto" style="max-height: 600px">
                                <div class="mb-4" v-for="(item,index) in camera" :key="index">
                                    <img style="border-radius: 4px" width="100%" :id="'myImage-' + item" src="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Detail ref="plateModal"></Detail>
    </div>
</template>
<script>
import AlprService from '../../../services/alpr.service';
import Detail from './detail-modal';
export default {
    components: {
        Detail
    },
    data() {
		return {
            lastModel: null,
			latestVehicle:null,
        	isLoading: false,
            alpr: [],
            camera: [],
        	sortData: {},
        	responsiveCols: [
        	    { name: 'plate', label: 'License Plate', sortable: 'custom', width: 130, minScreen: 0 },
        	    { name: 'crop_image', label: 'License plate image', sortable: 'custom', width: 160, minScreen: 0 },
        	    { name: 'filename', label: 'Vehicle image', sortable: 'custom', width: 160, minScreen: 0 },
        	    { name: 'region', label: 'Region', sortable: 'custom', width: 140, minScreen: 1000 },
        	    { name: 'vehicle', label: 'Body Type', sortable: 'custom', width: 140, minScreen: 1160 },
        	    { name: 'camera_id', label: 'Camera', sortable: 'custom', width: 130, minScreen: 1360 },
                { name: 'timestamp', label: 'Date & Time', sortable: 'custom', width: 150, minScreen: 1600 },
        	],
            screenWidth: 0,
            pagination: {
                total: 4,
                totalPage: 1,
            },
            pageSizes: [10, 20, 50, 100, 500],
            pageSize: 10,
            currentPage: 1,
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
                if(self.lastModel){
                    $(`.row-${self.lastModel.plate}`).addClass('flash animated');
                }
            },100)
        })
    },
    mounted () {
        var self = this;
        self.getRealtime();
        self.getCamera();
        this.$nextTick(() => {
            window.addEventListener('resize', this.resizeHandle);
            self.resizeHandle();
        });
        self.streamLP();
    },
    methods: {
		async getRealtime(){
            const self = this;
            try {
                self.isLoading = true;
                const _params = {
                    page: self.currentPage,
                    size: self.pageSize,
                };
                const response = await AlprService.getLP(_params);
                self.alpr = response.data.data.data;
                self.pagination = response.data.data.pagination;
            } catch (error) {
                console.log(error)
            } finally {
                self.isLoading = false;
            }
        },
        async getCamera() {
            let self = this;
            const response = await AlprService.getCameraList();
            _.each(response.data.data, (x, key) => {
                if (x.url) {
                    self.camera.push(key) 
                };
            });

            self.camera.map((x) => {
                self.streamCamera(x);
            });
        },
        async streamCamera(id) {
            const self = this;
                const event = new EventSource(AlprService.streamCameraPath(id));
                event.addEventListener("message", function(e) {
                    $(document).ready(function() {
                        setTimeout(function() {
                            var myImageElement = document.getElementById('myImage-' + id);
                            var base64 = e.data.slice(1, -1);
                            myImageElement.src ="data:image/jpeg;base64, " + base64;
                        }, 500);
                    });
                })
        },
        streamLP() {
            const self = this;
            const event = new EventSource(AlprService.streamLPPath());
            event.addEventListener("message", function(e) {
                var json = JSON.parse(decodeURIComponent(escape(atob(e.data.slice(1, -1)))));
                self.alpr.unshift(json);
                if (self.alpr.length > self.pageSize) self.alpr.pop();
                self.lastModel = json;
            })
        },
        resizeHandle () {
            this.screenWidth = $(window).width();
        },
        handleSort (obj) {
            this.sortData = obj;
            this.innerTableProps.defaultSort = {
                prop: obj.prop,
                order: obj.order
            }
        },
        renderHeader (h, e) {
            var _name = e.column.label;
            return h('span', {class: 'col-label'}, _name)
        },
        tableRowClassName({row, rowIndex}) {
            return `row-${row.plate}`;
        },
        handleSearchChange() {
            this.currentPage = 1;
            this.getRealtime();
        },
        handleCurrentChange (currentPage) {
            this.currentPage = currentPage;
            this.getRealtime();
        },
        showDetectionModal (alpr) {
            const _modal = this.$refs.plateModal;
            _modal.alpr = alpr;
            _modal.isOpen = true;
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