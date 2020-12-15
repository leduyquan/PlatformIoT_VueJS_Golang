import AppConstant from '../helpers/constants/app';
import TokenStorage from '../helpers/token-storage';

class AccountService {
    login(email, password) {
        return new Promise((resolve, reject) => {
            axios
                .post(`${AppConstant.API_URL}/login`, { email, password })
                .then((response) => {
                    const data = response.data.data;
                    TokenStorage.storeToken(data.access_token);
                    TokenStorage.storeRefreshToken(data.refresh_token);
                    resolve(response);
                })
                .catch((err) => {
                    this.logout();
                    location.reload(true);
                    reject(err);
                });
        });
    }

    logout() {
        TokenStorage.clear();
    }
}

export default new AccountService();
