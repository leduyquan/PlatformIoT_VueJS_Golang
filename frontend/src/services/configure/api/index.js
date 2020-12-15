import axios from 'axios';
import AppConstant from '../../../helpers/constants/app';
import TokenStorage from '../../../helpers/token-storage';
import { router } from '../../../helpers';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Return any error which is not due to authentication back to the calling service
        if (error.response.status !== 401) {
            return Promise.resolve(error);
        }

        // Logout user if token refresh didn't work or user is disabled
        if ( error.config.url == `${AppConstant}/token/refresh` || error.response.message == 'Account is disabled.') {
            TokenStorage.clear();
            router.push('/login');
            return Promise.reject(error);
        }

        if (isRefreshing) {
            try {
                // Will have resolve when processQueue is executed
                const token = await new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });  // Push requests come later
                });
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
                return axios(originalRequest);
            } catch (err) {
                return Promise.reject(err);
            }
        }

        isRefreshing = true;
        // Try request again with new token
        try {
            const token = await TokenStorage.getNewToken();
            processQueue(null, token); // processQueue is executed
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axios(originalRequest);
        } catch (err) {
            processQueue(err, null);
        } finally {
            isRefreshing = false;
        }
    }
);

class ApiService {
    constructor() {
        this.service = axios;
    }

    async get(path, query) {
        try {
            const response = await this.service.get(path, Object.assign({ params: query }, TokenStorage.getAuthHeader()));
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async post(path, body) {
        try {
            const response = await this.service.post(path, body, TokenStorage.getAuthHeader());
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async put(path, body) {
        try {
            const response = await this.service.put(path, body, TokenStorage.getAuthHeader());
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async delete(path, body) {
        try {
            const response = await this.service.delete(path, body, TokenStorage.getAuthHeader());
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

//To create a instance
export default new ApiService();