import AppConstant from './constants/app';

const LOCAL_STORAGE_TOKEN = 'accessToken';
const LOCAL_STORAGE_REFRESH_TOKEN = 'refreshToken';

class TokenStorage {
    isAuthenticated() {
        return this.getToken() !== null;
    }

    getAuthHeader() {
        return {
            headers: { Authorization: 'Bearer ' + this.getToken() },
        };
    }

    getNewToken() {
        return new Promise((resolve, reject) => {
            axios
                .post(`${AppConstant.API_URL}/token/refresh`, { refresh_token: this.getRefreshToken() }, this.getAuthHeader())
                .then((response) => {
                    const data = response.data.data
                    this.storeToken(data.access_token);
                    this.storeRefreshToken(data.refresh_token);
                    resolve(data.access_token);
                })  
                .catch((error) => {
                    reject(error);
                });
        });
    }

    storeToken(token) {
        localStorage.setItem(LOCAL_STORAGE_TOKEN, token);
    }

    storeRefreshToken(refreshToken) {
        localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN, refreshToken);
    }

    clear() {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN);
    }

    getRefreshToken() {
        return localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN);
    }

    getToken() {
        return localStorage.getItem(LOCAL_STORAGE_TOKEN);
    }
}

export default new TokenStorage;