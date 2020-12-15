<template>
    <div class="modal fade" role="dialog">
        <div class="modal-dialog v3-style max-600">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="title-wrapper">
                        <h4 v-if="form.id" class="modal-title">{{$t('barrier.edit_barrier')}}</h4>
                        <h4 v-else class="modal-title">{{$t('barrier.create_barrier')}}</h4>
                    </div>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group row">
                        <div class="col-6">
                            <label>{{$t('barrier.barrier_name')}}:</label>
                            <div>
                                <input type="text"
                                    :class="{ 'is-invalid': submitted && !form.name }"
                                    class="form-control" v-model="form.name"/>
                                <div v-show="submitted && !form.name" class="invalid-feedback">This field is required</div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-6">
                            <label>{{$t('barrier.active')}}:</label>
                            <div>
                                <el-radio-group size="mini" v-model="form.active">
                                    <el-radio :value="true" :label="true">Active</el-radio>
                                    <el-radio :value="false" :label="false">Inactive</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-6">
                            <label>{{$t('barrier.alpr_agent')}}:</label>
                            <div>
                                <input type="text" disabled class="form-control" v-model="alprAgent.name"/>
                            </div>
                        </div>
                        <div class="col-6">
                            <label>{{$t('barrier.camera_name')}}:</label>
                            <div>
                                <el-select class="w-100 form-control" v-model="form.camera_id"
                                    :class="{ 'is-invalid': submitted && !form.camera_id }"
                                    :placeholder="$t('barrier.select')">
                                    <el-option
                                    v-for="item in availableCameras"
                                    :key="item.id"
                                    :label="`#${item.id} - ${item.name || ''}`"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                                <div v-show="submitted && !form.camera_id" class="invalid-feedback">This field is required</div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-6">
                            <label>{{$t('barrier.controller_host')}}:</label>
                            <div>
                                <input type="text"
                                    :class="{ 'is-invalid': submitted && !form.host }"
                                    class="form-control" v-model="form.host"/>
                                <div v-show="submitted && !form.host" class="invalid-feedback">This field is required</div>
                            </div>
                        </div>
                        <div class="col-6">
                            <label>{{$t('barrier.controller_port')}}:</label>
                            <div>
                                <input type="text" class="form-control"
                                    :class="{ 'is-invalid': submitted && !form.port }"
                                    v-model="form.port"/>
                                <div v-show="submitted && !form.port" class="invalid-feedback">This field is required</div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-12">
                            <label>{{$t('barrier.open_barrier_url')}}:</label>
                            <div>
                                <input type="text" class="form-control"
                                    :class="{ 'is-invalid': submitted && !form.url }"
                                    v-model="form.url"/>
                                <div v-show="submitted && !form.url" class="invalid-feedback">This field is required</div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row overflow-auto" style="max-height: 150px">
                        <div class="col-10">
                            <label>{{$t('barrier.open_barrier_vehicle_list')}}:</label>
                            <div class="time-item flex-box align-items-center m-bot-15" v-for="(value, index) in form.rules" :key="index">
                                <el-select class="flex-col-w-200 form-control" v-model="value.category_id" :placeholder="$t('barrier.select')" @change="onSelectBarrierRules">
                                    <el-option
                                    v-for="item in caterogies"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                                <div class="d-flex input-group with-remove-button ">
                                    <el-select class="flex-col-w-200 form-control pl-3" v-model="value.rule_id" :placeholder="$t('barrier.select')" @change="onSelectBarrierRules">
                                        <el-option
                                        v-for="item in matchingRules"
                                        :key="item.id"
                                        :label="item.rule_name"
                                        :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <div class="input-group-text" v-if="index < (form.rules.length-1)"><i class="fa fa-minus-circle" @click="onRemoveBarrierRules(index)"></i></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer justify-content-center p-bot-20">
                    <button type="button" class="btn btn-default" @click="onClose">{{$t('barrier.cancel')}}</button>
                    <button type="button" class="m-left-10 btn btn-primary" :class="{'d-none': !!form.id}" @click="onCreate">{{$t('common.save')}}</button>
                    <button type="button" class="m-left-10 btn btn-primary" :class="{'d-none': !form.id}" @click="onUpdate">{{$t('common.update')}}</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import SystemSettingsService from '../../../../services/system-settings.service.js';
import VehicleService from '../../../../services/vehicle.service.js';
import BarrierService from '../../../../services/barrier.service';
export default {
    props: ['isOpen','model', 'barrier', "isWarning"],
    data: function() {
        return {
            form:{
                id:'',
                name:'',
                active: false,
                agent_id: '',
                agent_name: '',
                camera_id:'',
                camera_name:'',
                host:'',
                port:'',
                url:'',
                rules: [
                    {
                        category_id: '',
                        rule_id: ''
                    }
                ]
            },
            alprAgent: [],
            cameras: [],
            caterogies: [],
            matchingRules: [],
            usedCameras: [],
            formErrors: {},
            submitted: false
        };
    },
    mounted: function() {
        var self = this;
        $(self.$el).on('hidden.bs.modal', function() {
            self.$emit('on-close', self.form);
        });
        self.$nextTick(function() {
            self.fetchCameraByAgent();
            self.fetchCategories();
            self.fetchRules();
        });
    },
    watch: {
        isOpen() {
            if(this.isOpen) {
                this.onOpen();
            } else {
                this.onClose();
            }
        }
    },
    computed: {
        availableCameras: function () {
            const cameras = this.cameras.map(x => ({
                ...x,
                camera_id: x.id
            }))
            const cameraEdit = cameras.find(x => x.id === this.form.camera_id);
            const result = _.differenceBy(cameras, this.barrier, 'camera_id');
            if (!_.isEmpty(cameraEdit)) result.push(cameraEdit);
            return result;
        },
    },
    methods: {
        async fetchCameraByAgent() {
            const self = this;
            try {
                self.isLoading = true;
                self.cameras = [];
                const response = await SystemSettingsService.getAgentSettings();
                const result = response.data.data;
                if (!_.isEmpty(result.cameras)) {
                    self.alprAgent = result;
                    self.form.agent_id = result.id;
                    self.cameras = result.cameras;
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
        async fetchCategories() {
            const self = this;
            try {
                self.isLoading = true;
                const response = await VehicleService.getCategories();
                const result = response.data
                if (result.success && result.data) {
                    self.caterogies = result.data;
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
        async fetchRules() {
            const self = this;
            try {
                self.isLoading = true;
                const response = await VehicleService.getMatchingRules();
                const result = response.data
                if (result.success && result.data) {
                    self.matchingRules = result.data;
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
        onOpen() {
            var self = this;
            if(self.model){
                self.model.active = !!self.model.active;
                self.form = {...self.model};
                self.onSelectBarrierRules();
            }
            $(this.$el).modal('show');
        },
        onClose(){
            $(this.$el).modal('hide');
        },
        formatForm() {
            this.submitted = true;
            const hasRules = this.form.rules.filter(item => !!item.category_id && !!item.rule_id);
            const jsonObject = hasRules.map(JSON.stringify);
            const uniqueSet = new Set(jsonObject);
            const uniqueArray = Array.from(uniqueSet).map(JSON.parse)
            let camera = this.cameras.find(item => item.id == this.form.camera_id);
            this.form.camera_name = `#${camera.id} - ${camera.name || ''}`;

            return {
                ...this.form,
                rules: uniqueArray,
                port: +this.form.port
            }
        },
        async onCreate() {
            const self = this;
            try {
                const data = self.formatForm();
                const body = _.omit(data, ['id']);
                const response = await BarrierService.createBarrier(body);
                const result = response.data;
                if (result.success) {
                    toastr["success"]("Action successfully!");
                    self.onClose();
                    this.$emit('fetch-data');
                } else {
                    toastr["warning"]("Action unsuccessfully. Please try again!");
                }
            } catch(err) {
                toastr["warning"]("Action unsuccessfully. Please try again!");
            }
        },
        async onUpdate() {
            const self = this;
            try {
                const data = self.formatForm();
                const body = _.omit(data, ['id']);
                const response = await BarrierService.updateBarrier(data, data.id);
                const result = response.data;
                if (result.success) {
                    toastr["success"]("Action successfully!");
                    self.onClose();
                    this.$emit('fetch-data');
                } else {
                    toastr["warning"]("Action unsuccessfully. Please try again!");
                }
            } catch(err) {
                toastr["warning"]("Action unsuccessfully. Please try again!");
            }
        },
        onSelectBarrierRules(){
            const self = this;
            const enoughFilled = self.form.rules.every(item => !!item.category_id && !!item.rule_id)
            if (enoughFilled) {
                self.form.rules.push({category_id: '',rule_id: ''});
            }
        },
        onRemoveBarrierRules(index){
            const self = this;
            self.form.rules.splice(index, 1);
        },
    }
}
</script>