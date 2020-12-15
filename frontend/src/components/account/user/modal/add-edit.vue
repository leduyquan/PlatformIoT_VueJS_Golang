<template>
    <div class="modal fade" role="dialog">
        <div class="modal-dialog v3-style max-600">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="title-wrapper">
                        <h4 v-if="form.id" class="modal-title">{{$t('common.edit_user')}}</h4>
                        <h4 v-else class="modal-title">{{$t('common.user')}}</h4>
                    </div>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <el-form :model="form" :rules="rules" ref="formUser">
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-12">
                                <div class="float-right pb-3">
                                    <a class="btn btn-primary" @click="onInvite" v-if="!!form.id">{{$t('common.send_an_invitation_email')}}</a>
                                </div>
                                <label class="pt-3">{{$t('common.name')}}:</label>
                                <el-form-item prop="name">
                                    <el-input class="custom-input" :placeholder="$t('common.enter_a_name')" v-model="form.name"></el-input>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <label>{{$t('common.email')}}:</label>
                                <el-form-item prop="email">
                                    <el-input class="custom-input" :placeholder="$t('common.enter_an_email')" v-model="form.email"></el-input>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <label>{{$t('common.role')}}:</label>
                                <el-form-item prop="role">
                                    <el-select class="custom-input" v-model="form.role" :placeholder="$t('common.select_role')">
                                        <el-option
                                            v-for="item in roleData"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer justify-content-center p-bot-20">
                        <button type="button" class="btn btn-secondary" @click="onClose">{{$t('common.cancel')}}</button>
                        <el-button type="primary" class="btn btn-primary" :loading="isStoring" :class="{'d-none': !!form.id}" @click="onCreate('formUser')">{{$t('common.save') }}</el-button>
                        <el-button type="primary" class="btn btn-primary" :loading="isStoring" :class="{'d-none': !form.id || !!form.disabled}" @click="onUpdate('formUser')">{{$t('common.update') }}</el-button>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import UserService from '../../../../services/user.service';
import Constants from '../../../../helpers/constants/messages';
export default {
    props: ['isOpen','model', 'roleData'],
    data: function() {
        return {
            isStoring: false,
            form: {
                id:'',
                name:'',
                email:'',
                role_ids:[],
                role: ''
            },
            rules: {
                name: [
                    { required: true, message: 'This field is required!', trigger: 'blur' },
                ],
                email: [
                    { required: true, message: 'This field is required!', trigger: 'change' },
                    { type: 'email', message: 'Please input correct email address!', trigger: ['blur', 'change'] }
                ],
                role: [
                    { required: true, message: 'This field is required!', trigger: 'change' }
                ],
            },
        };
    },
    mounted() {
        const self = this;
        $(self.$el).on('hidden.bs.modal', function() {
            self.$emit('on-close', self.form);
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
    methods: {
        onOpen() {
            var self = this;
            if(self.model){
                self.form = {...self.model};
            }
            $(this.$el).modal('show');
        },
        onClose(){
            $(this.$el).modal('hide');
        },
        async onCreate(formName) {
            var self = this;
            self.isStoring = true;
            try {
                let validate = false;
                self.$refs[formName].validate((valid) => { validate = valid });
                if(!validate) return;

                const body = _.omit(self.form, 'id', 'role');
                body.role_ids = [self.form.role];
                const response = await UserService.createUser(body);
                const { data } = response;
                if (data.msg === 'ok') {
                    toastr[Constants.statusMessage.success](Constants.infoMessage.createSuccessfully);
                    self.onClose();
                    self.$emit('reset-list');
                } else {
                    toastr[Constants.statusMessage.warning](Constants.infoMessage.actionUnsuccessfully);
                }
            } catch (error) {
                 toastr["warning"](error);
            } finally {
                self.isStoring = false;
            }
        },
        async onUpdate(formName) {
            var self = this;
            self.isStoring = true;
            try {
                let validate = false;
                self.$refs[formName].validate((valid) => { validate = valid });
                if(!validate) return;

                const body = _.omit(self.form, 'id', 'role', 'disabled');
                body.role_ids = [self.form.role];
                const response = await UserService.updateUser(body, self.form.id);
                const { data } = response;
                if (data.msg === 'ok') {
                    toastr[Constants.statusMessage.success](Constants.infoMessage.updateSuccessfully);
                    self.onClose();
                    self.$emit('reset-list');
                } else {
                    toastr[Constants.statusMessage.warning](Constants.infoMessage.actionUnsuccessfully);
                }
            } catch (error) {
                 toastr[Constants.statusMessage.warning](error);
            } finally {
                self.isStoring = false;
            }
        },
        onInvite() {
            var self = this;
            self.$http.post(this.baseUrl('admin/users/invite/' + self.form.user._id)).then(function (res) {
                var response = res.data;
                if (response.status) {
                    toastr["success"]("Send invitation email to user's email successfully!");
                } else {
                    toastr["warning"]("Action unsuccessfully. Please try again!");
                }
            }, function (res) {
                console.log("Submit failed!");
            });
        },
    }
}
</script>
<style lang="scss">
    .custom-input {
        width: 100%;
        input {
            background-color: #132739;
            border-color: #313d4f;
            height: 2.8rem !important;
            color: #a7abaf;
        }
    }
</style>