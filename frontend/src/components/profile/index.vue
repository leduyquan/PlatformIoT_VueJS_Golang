<template>
    <div id="profileApp" v-cloak>
        <div class="container project-page people">
            <!-- Nav tabs -->
            <div class="responsive-nav  m-bot-15">
                <ul class="nav nav-tabs nav-main f-upper" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" data-toggle="tab" href="#tab-profile" role="tab">{{$t('common.profile')}}</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#tab-configurations" role="tab">{{$t('common.configurations')}}</a>
                    </li>
                </ul>
            </div>
            <div class="tab-content">
                <div id="tab-profile" class="tab-pane active" role="tabpanel">
                    <div v-if="!isEditPassword">
                        <h4 class="m-bot-30">{{$t('common.edit_profile')}}</h4>
                        <div class="row">
                            <div class="col col-xl-2 col-lg-4 col-sm-6 col-12 text-center">
                                <img class="rounded-circle col-w-80p avatar" :src="filterImageUrl(user.avatar_url)">
                                <div class="m-top-10 m-bot-30">
                                    <label class="c-pointer f-upper">
                                        {{$t('common.edit_photo')}} <input accept=".png, .jpg, .jpeg, .bmp" type="file" style="display: none;" @change="selectFloorBackground">
                                    </label>
                                </div>
                                <div><a href="#password" class="f-upper" @click="isEditPassword=true">{{$t('common.change_password')}}</a></div>
                            </div>
                            <div class="col col-sm-6 col-12">
                                <div class="form-group">
                                    <label for="username">{{$t('common.username')}}</label>
                                    <input type="text" readonly class="form-control" id="username" v-model="user.email" :placeholder="$t('common.username')">
                                </div>
                                <div class="form-group m-bot-50">
                                    <label for="firstname">{{$t('common.name')}}</label>
                                    <input type="text" class="form-control" id="firstname" v-model="user.name" :placeholder="$t('common.name')">
                                </div>
                                <div class="form-group text-center">
                                    <span><a href="#" class="btn btn-primary" @click="saveProfile">{{$t('common.save')}}</a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="isEditPassword">
                        <h4 class="m-bot-30">{{$t('common.edit_password')}}</h4>
                        <div class="row">
                            <div class="col col-xl-6 col-lg-8 col-sm-10 col-12">
                                <div class="form-group">
                                    <label for="current-password">{{$t('common.current_password')}}</label>
                                    <input type="password" class="form-control" id="current-password" v-model="user.current_password" :placeholder="$t('common.current_password')">
                                </div>
                                <div class="form-group">
                                    <label for="new-password">{{$t('common.new_password')}}</label>
                                    <input type="password" class="form-control" id="new-password" v-model="user.password" :placeholder="$t('common.new_password')">
                                </div>
                                <div class="form-group m-bot-50">
                                    <label for="confirm-password">{{$t('common.reconfirm_password')}}</label>
                                    <input type="password" class="form-control" id="confirm-password" v-model="user.password_confirmation" :placeholder="$t('common.reconfirm_password')">
                                </div>
                                <div class="form-group text-center f-upper">
                                    <span><a href="#" class="btn btn-secondary" @click="isEditPassword=false">{{$t('common.cancel')}}</a></span>
                                    <span><a href="#" class="btn btn-primary m-left-5" @click="updatePassword">{{$t('common.save')}}</a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="tab-configurations" class="tab-pane" role="tabpanel">
                    <div class="row">
                        <div class="col col-xl-6 col-lg-8 col-sm-10 col-12">
                            <div class="configuration">
                                <div class="form-group m-bot-30">
                                    <label for="language">{{$t('common.language')}}</label>
                                    <el-select class="form-control" id="language" v-model="user.language" :placeholder="$t('common.choose_site_language')">
                                        <el-option v-for="item in languages"
                                                   :key="item.code"
                                                   :label="item.name"
                                                   :value="item.code">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="form-group m-bot-30">
                                    <label for="timezone">{{$t('common.time_zone')}}</label>
                                    <el-select class="form-control" id="timezone" v-model="user.timezone">
                                        <el-option v-for="item in timezones"
                                                   :key="item"
                                                   :label="item"
                                                   :value="item">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="form-group m-bot-30">
                                    <label for="timezone">{{$t('common.license_edition')}}</label>
                                    <div class="flex-box align-items-center">
                                        <svg fill="#fff" width="30" height="30">
                                            <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="assetUrl('img/icons.svg#overview')"></use>
                                        </svg>
                                        <span class="m-left-10">{{$t('common.location')}}</span>
                                    </div>
                                </div>
                                <div class="form-group text-center">
                                    <span><a href="#" class="btn btn-primary" @click="saveProfile">{{$t('common.save')}}</a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import AppConstant from '../../helpers/constants/app.js';
import ProfileService from '../../services/profile.service';
export default {
    data() {
        return {
            user: {
                language: 'en',
                timezone: '',
                first_name:'John',
                avatar_url: 'assets/img/avatar.png',
                image: '',
                current_password: '',
                password: '',
                password_confirmation: '',
            },
            languages: [],
            timezones: [],
            isEditPassword:false,
        };
    },
    mounted() {
        this.timezones = AppConstant.Timezone;
        this.languages = AppConstant.Language;
        this.getProfileDetail();
    },
    methods: {
        filterImageUrl: function (imageUrl) {
            return imageUrl;
        },
        selectFloorBackground: function (evt) {
            var self = this;
            if (evt.target.files && evt.target.files[0]) {
                var reader = new FileReader();
                var type = evt.target.files[0].type;
                if( type == "image/jpeg" || type == "image/png" || type == "image/gif" || type == "image/svg+xml" ){
                    reader.onload = function (e) {
                        self.user.avatar_url = e.target.result;
                        self.user.image = evt.target.files[0];
                    };
                    reader.readAsDataURL(evt.target.files[0]);
                } else {
                    alert('Please select an image file!')
                }
            }
        },
        async getProfileDetail() {
            const self = this;
            const response = await ProfileService.getProfileDetail();
            const { data } = response.data;
            this.user = Object.assign(this.user, data);
        },
        async saveProfile(){
            const self = this;
            try {
                const form = new FormData();
                $.each(self.user, function(key, value) {
                    if(value == undefined) value = '';
                    form.append(key, value);
                });
                const response = await ProfileService.updateProfile(form);
                const { data } = response;
                if (data.msg === 'ok') {
                    toastr["success"]("Update user profile successfully!");
                    // $('.rounded-circle').attr('src', self.baseUrl(data.data.avatar_url));
                } else {
                    toastr["warning"]("Action unsuccessfully. Please try again!");
                }
            }
            catch(err) {
                 toastr["warning"]("Action unsuccessfully. Please try again!");
            }
        },
        async updatePassword(){
            const self = this;
            try {
                const body = _.pick(self.user, ['current_password', 'password', 'password_confirmation']);
                const form = new FormData();
                $.each(body, function(key, value) {
                    if(value == undefined) value = '';
                    form.append(key, value);
                });
                const response = await ProfileService.changePassword(form);
                const { data } = response;
                if (data.msg === 'ok') {
                    toastr["success"]("Update password successfully!");
                    this.isEditPassword = false;
                } else {
                    toastr["warning"]("Action unsuccessfully. Please try again!");
                }
            }
            catch(err) {
                toastr["warning"]("Action unsuccessfully. Please try again!");
            }
        },
    },
};
</script>
