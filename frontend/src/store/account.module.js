import AccountService  from '../services/account.service';
import { router } from '../helpers';

const state = {
    token: localStorage.getItem('accessToken') || '',
    status: ''
}

const mutations = {
    loginRequest(state) {
        state.status = 'loading';
    },
    loginSuccess(state, token) {
        state.status = 'success';
        state.token = token;
    },
    loginFailure(state) {
        state.status = 'error';
    },
    logout(state) {
        state.status = '';
        state.token = null;
    },
};

const actions = {
    login({ commit }, { email, password }) {
        commit('loginRequest');
        AccountService.login(email, password)
            .then(
                payload => {
                    commit('loginSuccess', payload.data.token);
                    router.push('/');
                },
                error => {
                    commit('loginFailure', error);
                }
            );
    },
    logout({ commit }) {
        AccountService.logout();
        commit('logout');
    },
};

const getters = {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
};

export const account = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};