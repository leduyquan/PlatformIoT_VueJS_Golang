<template>
    <div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog v3-style trigger-day-modal max-900">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="fs-16">{{ id ? 'Update Camera ' + ordinal : 'Add Camera' }}</div>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="mb-4">
                        <label>Camera ID</label>
                        <input type="text" class="blue-style form-control" placeholder="Domain" v-model="form.camera.id"
                            :class="{ 'is-invalid': submitted && !form.camera.id }">
                        <div v-show="submitted && !form.camera.id" class="invalid-feedback">This field is required</div>
                    </div>
                    <div class="mb-4">
                        <label>URL Feed</label>
                        <input type="text" class="blue-style form-control" :class="{ 'is-invalid': submitted && !form.camera.url }" placeholder="URL feed" v-model="form.camera.url">
                        <div v-show="submitted && !form.camera.url" class="invalid-feedback">This field is required</div>
                    </div>
                    <div class="mb-4">
                        <label>Camera Direction</label>
                        <el-select v-model="form.camera.direction" clearable class="form-control" placeholder="Select camera direction"
                            :class="{ 'is-invalid': submitted && !form.camera.direction }">
                            <el-option v-for="direction in cameraDirection" :key="direction.id" :value="direction.id" :label="direction.name"></el-option>
                        </el-select>
                        <div v-show="submitted && !form.camera.direction" class="invalid-feedback">This field is required</div>
                    </div>
                    <div class="mb-4">
                        <label>Video Display Size</label>
                        <el-select v-model="form.output.display_width" clearable class="form-control" placeholder="Select video display size"
                            :class="{ 'is-invalid': submitted && !form.output.display_width }">
                            <el-option v-for="size in displaySize" :key="size.id" :value="size.id" :label="size.name"></el-option>
                        </el-select>
                        <div v-show="submitted && !form.output.display_width" class="invalid-feedback">This field is required</div>
                    </div>
                    <div class="mb-4 d-flex flex-column">
                        <label>Display ROI</label>
                        <div class="checkbox">
                            <el-radio v-model="form.output.is_display_roi" label="True">Yes</el-radio>
                            <el-radio v-model="form.output.is_display_roi" label="False">No</el-radio>
                        </div>
                    </div>
                    <div class="mb-4 d-flex flex-column">
                        <label>Minimum Distance</label>
                        <div class="checkbox">
                            <el-radio v-model="form.app.min_distance" label="1">1m</el-radio>
                            <el-radio v-model="form.app.min_distance" label="2">2m</el-radio>
                        </div>
                    </div>
                    <div class="mb-4">
                        <label>Interval Time</label>
                        <input type="number" class="blue-style form-control" placeholder="Interval time" v-model="form.app.dwell_time"
                            :class="{ 'is-invalid': submitted && !form.app.dwell_time }">
                        <div v-show="submitted && !form.app.dwell_time" class="invalid-feedback">This field is required</div>
                    </div>
                     <div class="mb-4">
                        <label>Domain</label>
                        <input type="text" class="blue-style form-control" placeholder="Domain" v-model="brokerDomain"
                            :class="{ 'is-invalid': submitted && !brokerDomain }">
                        <div v-show="submitted && !brokerDomain" class="invalid-feedback">This field is required</div>
                    </div>
                </div>
                <div class="modal-footer padding-30">
                    <div class="flex-col-100 p-left-15 p-right-15">
                        <div class="row">
                            <div class="col col-12 text-center">
                                <button class="btn btn-default" data-dismiss="modal">{{$t('common.cancel')}}</button>
                                <el-button type="primary" :loading="isStoring" class="btn btn-primary m-left-10" @click="onSave">{{$t('common.save')}}</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import CrowdsenseService from '../../../services/crowdsense.service';
export default {
    props: ['id', 'isOpen', 'ordinal', 'getCamera'],
    data() {
        return {
            isStoring: false,
            form: {
                app: { min_distance: "", dwell_time: "" },
                camera: { id: "", direction: "", url: "" },
                output: { display_width: "", is_display_roi: "" },
                broker: { msg_header: "", },
            },
            brokerDomain: '',
            cameraDirection: [
                { id: 'in', name: 'IN' },
                { id: 'out', name: 'OUT' },
                { id: 'common', name: 'COMMON' },
            ],
            displaySize: [
                { id: '640', name: '640x360' },
                { id: '860', name: '860x480' },
                { id: '1280', name: '1280x720' },
            ],
            submitted: false
        };
    },
    mounted() {
        const self = this;
        self.initForm();
        $(document).ready(() => {
            $(self.$el).on('hide.bs.modal', () => {
                self.$emit('on-close');
            });
        });
    },
    watch: {
        isOpen() {
            if (this.isOpen) {
                this.onOpen();
            } else {
                this.onClose();
            }
        },
    },
    methods: {
        onOpen() {
            const self = this;
            $(self.$el).modal('show');
            if (self.id) {
                self._fetchCamera(self.id);
            }
        },
        onClose() {
            $(this.$el).modal('hide');
            this.submitted = false;
            this.form = {
                app: { min_distance: "1", dwell_time: "" },
                camera: { id: "", direction: "", url: "" },
                output: { display_width: "", is_display_roi: "False" },
                broker: { msg_header: "", }
            }
            this.brokerDomain = ''
        },
        onSave() {
            if (this.id) {
                this._updateCamera(this.id);
            } else {
                this._createCamera();
            }
        },
        async _fetchCamera(id) {
            const self = this;
            try {
                const response = await CrowdsenseService.getCameraSDMDetail(this.id);
                self.form = response.data.data;
                self.brokerDomain = self.getDomain(self.form.broker.msg_header);
            } catch (error) {
                console.log(error);
            }
        },
        async _createCamera () {
            const self = this;
            try {
                self.isStoring = self.submitted = true;
                if (self.isValidate()) {
                    self.form.broker.msg_header = self.setDomain();
                    const response = await CrowdsenseService.createCameraSDM(self.form);
                    self._onSuccess();
                };
            } catch (error) {
                self._onFailure();
            } finally {
                self.isStoring = false;
            }
        },
        async _updateCamera(id) {
            const self = this;
            try {
                self.isStoring = self.submitted = true;
                if (self.isValidate()) {
                    self.form.broker.msg_header = self.setDomain();
                    await CrowdsenseService.updateCameraSDM(id, self.form);
                    self.getCamera();
                    self._onSuccess();
                }
            } catch (error) {
                self._onFailure();
            } finally {
                self.isStoring = false;
            }
        },
        _onSuccess() {
            toastr["success"]("Successfully!");
            this.onClose();
        },
        _onFailure() {
            toastr["warning"]("Action unsuccessfully. Please try again!");
        },
        isValidate() {
            const { form } = this;
            return !!(form.camera.url && form.camera.direction && form.output.display_width && form.output.is_display_roi && form.app.min_distance && form.app.dwell_time);
        },
        getDomain(msgHeader) {
            return msgHeader.split(' ')[1].split('_')[1] || '';
        },
        setDomain() {
            return `sdm buildos_${this.brokerDomain} violation`;
        },
        initForm() {
            this.form = {
                app: {
                    min_distance: "1",
                    dwell_time: ""
                },
                camera: {
                    id: "",
                    direction: "",
                    url: ""
                },
                detection: {
                    use_gpu: "true",
                    network: "mobilenet",
                    min_conf: "0.5",
                    nms_thresh: "0.5",
                    frame_max_width: "500",
                    latest_frame: "true"
                },
                tracking: {
                    is_tracking: "True",
                    max_disappeared: "20",
                    max_distance: "120",
                    skip_frames: "20"
                },
                output: {
                    display_width: "",
                    is_display_roi: "False"
                },
                broker: {
                    name: "nats",
                    address: "localhost:4222",
                    topic: "brazn.topic.sdm",
                    msg_header: "sdm buildos_staging violation"
                },
                log: {
                    log_level: "info"
                }
            }
        }
    },
}
</script>
<style lang="scss">
    .checkbox {
        .el-radio__inner {
            background-color: #132739 !important;
            opacity: 0.5;
        }
        .el-radio__label {
            color: #ffffff;
            font-size: 12px;
        }
    }
    .blue-style input {
        background-color: transparent;
        color: #fff;
        border: solid 1px #4e6de2;
    }
    .is-invalid input {
        border-color: #dc3545;
    }
</style>