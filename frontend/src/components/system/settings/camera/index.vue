<template>
	<div class="project-page" id="cameraSettings" v-cloak>
        <div class="container">
            <div class="tab-content">
                <div class="form-group d-flex align-items-center m-top-10">
                    <input type="text" class="form-control flex-col-w-300" v-model="path">
                    <a class="btn btn-primary m-left-10" @click="onFetchCamera">Fetch Cameras</a>
                </div>
                <div class="m-top-20">
                    <el-table :data="cameraDatas" class="group-list-table spacing-table" style="width:100%">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                              <span>Detection mask image: @{{ props.row.detection_mask_image }}</span>
                            </template>
                          </el-table-column>
                        <el-table-column prop="id" label="Camera ID" class-name="first-col pl-5">
                        </el-table-column>
                        <el-table-column prop="stream" label="Stream">
                        </el-table-column>
                        <el-table-column prop="gstreamer_format" label="GStreamer format">
                        </el-table-column>
                        <el-table-column prop="name" label="Agent name"
                                         class-name="header-center last-col action-col">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import SystemSettingsService from '../../../../services/system-settings.service.js';
export default {
	data() {
        return {
            path: '',
            cameraDatas: [],
            isWarning: false
        }
    },
    mounted() {
        this.fetchAgent();
        this.fetchPath();
    },
    methods: {
        async fetchPath() {
            try {
                const response = await SystemSettingsService.getCameraPath();
                const data = response.data.data;
                this.path = data;
            } catch (err) {
                if (!self.isWarning) {
                    toastr["warning"]("Action unsuccessfully. Please try again!");
                    self.isWarning = true;
                }
            }
        },
        async fetchAgent() {
            try {
                const response = await SystemSettingsService.getCameraSettings();
                const data = response.data.data;
                this.cameraDatas = data;
            } catch (err) {
                if (!self.isWarning) {
                    toastr["warning"]("Action unsuccessfully. Please try again!");
                    self.isWarning = true;
                }
            }
        },
        async onFetchCamera() {
            const self = this;
            try {
                const body = {
                    camera_dir: self.path
                }
                const response = await SystemSettingsService.fetchCameraSettings(body);
                const data = response.data.data;
                this.cameraDatas = data;
            } catch (err) {
            }
        }
    }	
}
</script>