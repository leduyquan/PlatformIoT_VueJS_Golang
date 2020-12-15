<template>
    <div class="main-login">
        <div class="login-page">
            <div class="text-center flex-box align-items-center justify-content-center m-bot-50">
                    <img :src="baseUrl('/assets/img/logos/dashboard.svg')" alt="logo" height="20"/>
            </div>
            <form @submit.prevent="handleSubmit">
                    <div class="form-group row m-bot-30">
                        <div class="col col-12">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="fa fa-user"></i></span>
                                </div>
                                <input id="email" type="email" placeholder="Username" class="form-control" name="email" v-model="email" required autofocus>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row m-bot-15">
                        <div class="col col-12">
                            <div class="input-group" >
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="fa fa-lock"></i></span>
                                </div>
                                <input id="password" placeholder="password" type="password" class="form-control" name="password" v-model="password" required autocomplete="on">
                            </div>
                        </div>
                    </div>
                    <div class="row invisible">
                        <div class="col col-12 m-bot-20 red-color">Please check your username/password.</div>
                    </div>
                    <div class="form-group row">
                        <div class="col col-12 m-bot-40">
                            <button type="submit" class="btn btn-primary w-100">
                                SIGN IN
                            </button>
                        </div>
                        <!-- <div class="col col-12 text-center">
                            <a class="color-white" href="{{ route('password.request') }}">
                                {{ __('Forgot Password?') }}
                            </a>
                        </div> -->
                    </div>
            </form>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
    data () {
        return {
            email: '',
            password: '',
            submitted: false,
        }
    },
    computed: {
        ...mapState('account', ['status'])
    },
    created () {
        // reset login status
        this.logout();
    },
    methods: {
        ...mapActions('account', ['login', 'logout']),
        handleSubmit (e) {
            this.submitted = true;
            const { email, password } = this;
            if (email && password) {
                this.login({ email, password });
            }
        }
    }
};
</script>